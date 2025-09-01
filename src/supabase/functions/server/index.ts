import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/middleware'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

type Variables = {
  supabase: ReturnType<typeof createClient>
}

const app = new Hono<{ Variables: Variables }>()

// CORS and logging
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*']
}))
app.use('*', logger(console.log))

// Initialize Supabase client middleware
app.use('*', async (c, next) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
  c.set('supabase', supabase)
  await next()
})

// Health check
app.get('/make-server-81d654e2/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Auth routes
app.post('/make-server-81d654e2/auth/signup', async (c) => {
  try {
    const { email, password, name, phone, address } = await c.req.json()
    const supabase = c.get('supabase')
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone, address },
      email_confirm: true
    })

    if (error) {
      console.log(`Signup error: ${error.message}`)
      return c.json({ error: error.message }, 400)
    }

    // Store user profile
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      phone,
      address,
      created_at: new Date().toISOString()
    })

    return c.json({ user: data.user })
  } catch (error) {
    console.log(`Signup error: ${error}`)
    return c.json({ error: 'Signup failed' }, 500)
  }
})

// Menu routes
app.get('/make-server-81d654e2/menu', async (c) => {
  try {
    const menu = [
      {
        id: 1,
        name: "Classic CRNMN",
        description: "Fresh corn kernels with mayo, cotija cheese, chili powder, and lime",
        price: 8.99,
        category: "classic",
        tags: ["Popular", "Vegetarian"],
        prep_time: 8,
        available: true
      },
      {
        id: 2,
        name: "Spicy Fire",
        description: "Corn with spicy mayo, jalapeños, hot sauce, and cilantro",
        price: 9.99,
        category: "spicy",
        tags: ["Spicy", "Signature"],
        prep_time: 10,
        available: true
      },
      {
        id: 3,
        name: "Truffle Elite",
        description: "Premium corn with truffle mayo, parmesan, and microgreens",
        price: 14.99,
        category: "premium",
        tags: ["Premium", "Chef's Choice"],
        prep_time: 12,
        available: true
      },
      {
        id: 4,
        name: "Vegan Delight",
        description: "Corn with vegan mayo, nutritional yeast, and herbs",
        price: 9.49,
        category: "vegan",
        tags: ["Vegan", "Healthy"],
        prep_time: 8,
        available: true
      }
    ]

    return c.json({ menu })
  } catch (error) {
    console.log(`Menu fetch error: ${error}`)
    return c.json({ error: 'Failed to fetch menu' }, 500)
  }
})

// Calculate delivery estimate based on distance
function calculateDeliveryEstimate(distance: number): { time: number, fee: number } {
  const baseTime = 15 // minutes
  const baseFee = 2.99
  
  if (distance <= 2) {
    return { time: baseTime, fee: baseFee }
  } else if (distance <= 5) {
    return { time: baseTime + 5, fee: baseFee + 1.5 }
  } else if (distance <= 10) {
    return { time: baseTime + 10, fee: baseFee + 3.0 }
  } else {
    return { time: -1, fee: -1 } // Out of delivery range
  }
}

// Geolocation and delivery estimate
app.post('/make-server-81d654e2/delivery-estimate', async (c) => {
  try {
    const { lat, lng } = await c.req.json()
    
    // Mock restaurant location (NYC)
    const restaurantLat = 40.7128
    const restaurantLng = -74.0060
    
    // Calculate distance using Haversine formula (simplified)
    const R = 3959 // Earth's radius in miles
    const dLat = (lat - restaurantLat) * Math.PI / 180
    const dLng = (lng - restaurantLng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(restaurantLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c_calc = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c_calc
    
    const estimate = calculateDeliveryEstimate(distance)
    
    if (estimate.time === -1) {
      return c.json({ 
        error: 'Out of delivery range',
        max_distance: 10 
      }, 400)
    }
    
    return c.json({
      distance: Math.round(distance * 10) / 10,
      delivery_time: estimate.time,
      delivery_fee: estimate.fee,
      in_range: true
    })
  } catch (error) {
    console.log(`Delivery estimate error: ${error}`)
    return c.json({ error: 'Failed to calculate delivery estimate' }, 500)
  }
})

// Create order
app.post('/make-server-81d654e2/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const supabase = c.get('supabase')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { items, delivery_address, payment_method, delivery_estimate } = await c.req.json()
    
    // Calculate totals
    let subtotal = 0
    for (const item of items) {
      subtotal += item.price * item.quantity
    }
    
    const deliveryFee = delivery_estimate?.delivery_fee || 2.99
    const tax = subtotal * 0.08875 // NYC tax rate
    const total = subtotal + deliveryFee + tax
    
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const order = {
      id: orderId,
      user_id: user.id,
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      delivery_fee: deliveryFee,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      delivery_address,
      payment_method,
      delivery_estimate,
      status: 'confirmed',
      estimated_delivery: new Date(Date.now() + (delivery_estimate?.delivery_time || 25) * 60000).toISOString(),
      created_at: new Date().toISOString()
    }
    
    await kv.set(`order:${orderId}`, order)
    await kv.set(`user_order:${user.id}:${orderId}`, { order_id: orderId, created_at: order.created_at })
    
    // Simulate order status progression
    setTimeout(async () => {
      order.status = 'preparing'
      await kv.set(`order:${orderId}`, order)
    }, 2000)
    
    setTimeout(async () => {
      order.status = 'ready'
      await kv.set(`order:${orderId}`, order)
    }, 300000) // 5 minutes
    
    setTimeout(async () => {
      order.status = 'out_for_delivery'
      await kv.set(`order:${orderId}`, order)
    }, 600000) // 10 minutes
    
    setTimeout(async () => {
      order.status = 'delivered'
      await kv.set(`order:${orderId}`, order)
    }, (delivery_estimate?.delivery_time || 25) * 60000)
    
    return c.json({ order })
  } catch (error) {
    console.log(`Order creation error: ${error}`)
    return c.json({ error: 'Failed to create order' }, 500)
  }
})

// Get order by ID
app.get('/make-server-81d654e2/orders/:orderId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const supabase = c.get('supabase')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const orderId = c.req.param('orderId')
    const order = await kv.get(`order:${orderId}`)
    
    if (!order || order.user_id !== user.id) {
      return c.json({ error: 'Order not found' }, 404)
    }
    
    return c.json({ order })
  } catch (error) {
    console.log(`Order fetch error: ${error}`)
    return c.json({ error: 'Failed to fetch order' }, 500)
  }
})

// Get user orders
app.get('/make-server-81d654e2/user/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const supabase = c.get('supabase')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userOrders = await kv.getByPrefix(`user_order:${user.id}:`)
    const orders = []
    
    for (const userOrder of userOrders) {
      const order = await kv.get(`order:${userOrder.order_id}`)
      if (order) {
        orders.push(order)
      }
    }
    
    // Sort by created_at descending
    orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    return c.json({ orders })
  } catch (error) {
    console.log(`User orders fetch error: ${error}`)
    return c.json({ error: 'Failed to fetch user orders' }, 500)
  }
})

// Process payment (mock)
app.post('/make-server-81d654e2/payments/process', async (c) => {
  try {
    const { amount, payment_method, order_id } = await c.req.json()
    
    // Mock payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock successful payment
    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return c.json({
      payment_id: paymentId,
      status: 'succeeded',
      amount,
      payment_method,
      order_id,
      processed_at: new Date().toISOString()
    })
  } catch (error) {
    console.log(`Payment processing error: ${error}`)
    return c.json({ error: 'Payment failed' }, 500)
  }
})

Deno.serve(app.fetch)