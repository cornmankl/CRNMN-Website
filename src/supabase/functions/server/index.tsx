import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// User signup
app.post('/make-server-81d654e2/signup', async (c) => {
  try {
    const { email, password, name, phone, address } = await c.req.json()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone, address },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })

    if (error) {
      console.log(`Signup error: ${error.message}`)
      return c.json({ error: error.message }, 400)
    }

    // Store additional user data
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
    console.log(`Signup server error: ${error}`)
    return c.json({ error: 'Internal server error during signup' }, 500)
  }
})

// Get user profile
app.get('/make-server-81d654e2/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const profile = await kv.get(`user:${user.id}`)
    return c.json({ profile })
  } catch (error) {
    console.log(`Profile fetch error: ${error}`)
    return c.json({ error: 'Error fetching profile' }, 500)
  }
})

// Create order
app.post('/make-server-81d654e2/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { items, total, deliveryAddress, paymentMethod } = await c.req.json()
    
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const order = {
      id: orderId,
      userId: user.id,
      items,
      total,
      deliveryAddress,
      paymentMethod,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 25 * 60 * 1000).toISOString(), // 25 minutes
      trackingSteps: [
        { status: 'confirmed', timestamp: new Date().toISOString(), message: 'Order confirmed' }
      ]
    }

    await kv.set(`order:${orderId}`, order)
    
    // Add to user's order history
    const userOrders = await kv.get(`user_orders:${user.id}`) || []
    userOrders.unshift(orderId)
    await kv.set(`user_orders:${user.id}`, userOrders)

    // Simulate order progression
    setTimeout(async () => {
      const currentOrder = await kv.get(`order:${orderId}`)
      if (currentOrder) {
        currentOrder.status = 'preparing'
        currentOrder.trackingSteps.push({
          status: 'preparing',
          timestamp: new Date().toISOString(),
          message: 'Chef is preparing your order'
        })
        await kv.set(`order:${orderId}`, currentOrder)
      }
    }, 2000)

    setTimeout(async () => {
      const currentOrder = await kv.get(`order:${orderId}`)
      if (currentOrder) {
        currentOrder.status = 'on_the_way'
        currentOrder.trackingSteps.push({
          status: 'on_the_way',
          timestamp: new Date().toISOString(),
          message: 'Delivery rider is on the way'
        })
        await kv.set(`order:${orderId}`, currentOrder)
      }
    }, 8000)

    return c.json({ order })
  } catch (error) {
    console.log(`Order creation error: ${error}`)
    return c.json({ error: 'Error creating order' }, 500)
  }
})

// Get order details
app.get('/make-server-81d654e2/orders/:orderId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const orderId = c.req.param('orderId')
    const order = await kv.get(`order:${orderId}`)
    
    if (!order || order.userId !== user.id) {
      return c.json({ error: 'Order not found' }, 404)
    }

    return c.json({ order })
  } catch (error) {
    console.log(`Order fetch error: ${error}`)
    return c.json({ error: 'Error fetching order' }, 500)
  }
})

// Get user order history
app.get('/make-server-81d654e2/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const orderIds = await kv.get(`user_orders:${user.id}`) || []
    const orders = await Promise.all(
      orderIds.slice(0, 10).map(async (orderId: string) => await kv.get(`order:${orderId}`))
    )

    return c.json({ orders: orders.filter(Boolean) })
  } catch (error) {
    console.log(`Order history fetch error: ${error}`)
    return c.json({ error: 'Error fetching order history' }, 500)
  }
})

// Calculate delivery estimate based on location
app.post('/make-server-81d654e2/delivery-estimate', async (c) => {
  try {
    const { latitude, longitude, address } = await c.req.json()
    
    // Mock delivery estimate calculation
    // In real app, you'd use actual distance calculation and traffic data
    const baseDeliveryTime = 20 // minutes
    const distance = Math.random() * 5 + 1 // Random distance 1-6 km
    const deliveryTime = Math.round(baseDeliveryTime + (distance * 2))
    const deliveryFee = distance < 3 ? 2.99 : 4.99
    
    return c.json({
      estimatedTime: deliveryTime,
      deliveryFee,
      distance: distance.toFixed(1),
      canDeliver: distance <= 10
    })
  } catch (error) {
    console.log(`Delivery estimate error: ${error}`)
    return c.json({ error: 'Error calculating delivery estimate' }, 500)
  }
})

// Process payment (mock implementation)
app.post('/make-server-81d654e2/process-payment', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { amount, paymentMethod, cardDetails } = await c.req.json()
    
    // Mock payment processing
    // In real app, integrate with Stripe, PayPal, etc.
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing time
    
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const payment = {
      id: paymentId,
      userId: user.id,
      amount,
      paymentMethod,
      status: 'completed',
      processedAt: new Date().toISOString()
    }
    
    await kv.set(`payment:${paymentId}`, payment)
    
    return c.json({ 
      success: true, 
      paymentId,
      message: 'Payment processed successfully' 
    })
  } catch (error) {
    console.log(`Payment processing error: ${error}`)
    return c.json({ error: 'Payment processing failed' }, 500)
  }
})

Deno.serve(app.fetch)