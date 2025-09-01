# 🚀 THEFMSMKT Advanced Features - Comprehensive Development Roadmap

## 📋 Implementation Strategy

All features are designed for **immediate development** with priority-based implementation. Each feature includes:
- ✅ Technical specifications
- 🛠️ Implementation details
- 📝 Code examples
- 🗄️ Database requirements
- 🔗 Integration points
- 🧪 Testing guidelines

---

## 🎯 PHASE 1: CORE ENHANCEMENT FEATURES

### 🔐 **Advanced Authentication System**

#### **Social Login Integration**
**Priority: CRITICAL** | **Complexity: Medium**

```typescript
// /components/Auth/SocialAuth.tsx
import { createClient } from '@supabase/supabase-js'

interface SocialAuthProps {
  provider: 'google' | 'facebook' | 'apple' | 'github'
  onSuccess: (user: any) => void
  onError: (error: string) => void
}

export function SocialAuth({ provider, onSuccess, onError }: SocialAuthProps) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSocialLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (error) throw error
      onSuccess(data.user)
    } catch (error) {
      onError(error.message)
    }
  }

  return (
    <button 
      className="btn-secondary w-full flex items-center justify-center gap-3 py-3"
      onClick={handleSocialLogin}
    >
      <SocialIcon provider={provider} />
      Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </button>
  )
}
```

**Database Schema Extensions:**
```sql
-- User profiles with social login data
ALTER TABLE profiles ADD COLUMN social_providers JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN email_verified BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN phone_verified BOOLEAN DEFAULT false;
```

**Implementation Checklist:**
- [ ] Setup OAuth apps for Google, Facebook, Apple
- [ ] Configure Supabase Auth providers
- [ ] Create social login components
- [ ] Handle profile data merging
- [ ] Implement profile picture sync
- [ ] Add email/phone verification flow

#### **Two-Factor Authentication (2FA)**
**Priority: HIGH** | **Complexity: High**

```typescript
// /components/Auth/TwoFactorAuth.tsx
import { useState } from 'react'
import { authenticator } from 'otplib'

interface TwoFactorSetupProps {
  user: User
  onComplete: (secret: string) => void
}

export function TwoFactorSetup({ user, onComplete }: TwoFactorSetupProps) {
  const [qrCode, setQrCode] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [secret] = useState(() => authenticator.generateSecret())

  useEffect(() => {
    const otpauth = authenticator.keyuri(
      user.email, 
      'THEFMSMKT CORNMAN', 
      secret
    )
    
    // Generate QR code
    generateQRCode(otpauth).then(setQrCode)
  }, [user.email, secret])

  const verifyToken = async () => {
    const isValid = authenticator.verify({
      token: verificationCode,
      secret: secret
    })

    if (isValid) {
      // Store encrypted secret in database
      await supabase
        .from('user_2fa')
        .insert({
          user_id: user.id,
          secret_encrypted: encryptSecret(secret),
          backup_codes: generateBackupCodes(),
          enabled: true
        })
      
      onComplete(secret)
    }
  }

  return (
    <div className="card p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 neon-text">Setup Two-Factor Authentication</h3>
      
      <div className="space-y-4">
        <div className="text-center">
          <img src={qrCode} alt="2FA QR Code" className="mx-auto mb-4" />
          <p className="text-sm text-neutral-400">
            Scan this QR code with your authenticator app
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Enter verification code
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3"
            placeholder="000000"
            maxLength={6}
          />
        </div>

        <button 
          className="btn-primary w-full"
          onClick={verifyToken}
          disabled={verificationCode.length !== 6}
        >
          Verify and Enable 2FA
        </button>
      </div>
    </div>
  )
}
```

**Database Schema:**
```sql
CREATE TABLE user_2fa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  secret_encrypted TEXT NOT NULL,
  backup_codes TEXT[] NOT NULL,
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used TIMESTAMPTZ
);

CREATE INDEX idx_user_2fa_user_id ON user_2fa(user_id);
```

#### **Enhanced Session Management**
**Priority: MEDIUM** | **Complexity: Medium**

```typescript
// /hooks/useAdvancedAuth.tsx
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

interface SessionData {
  user: User | null
  session: Session | null
  devices: AuthDevice[]
  isLoading: boolean
}

export function useAdvancedAuth() {
  const [sessionData, setSessionData] = useState<SessionData>({
    user: null,
    session: null,
    devices: [],
    isLoading: true
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Track device information
  const trackDevice = async (session: Session) => {
    const deviceInfo = {
      user_agent: navigator.userAgent,
      ip_address: await fetchIPAddress(),
      device_type: getDeviceType(),
      browser: getBrowserInfo(),
      location: await getGeolocation(),
      session_id: session.access_token
    }

    await supabase
      .from('user_sessions')
      .insert({
        user_id: session.user.id,
        device_info: deviceInfo,
        last_active: new Date().toISOString(),
        is_active: true
      })
  }

  // Monitor for suspicious activity
  const checkSuspiciousActivity = async (user: User) => {
    const recentSessions = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', user.id)
      .gte('last_active', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    // Detect multiple locations, unusual devices, etc.
    const suspiciousPatterns = analyzeSessions(recentSessions.data)
    
    if (suspiciousPatterns.length > 0) {
      // Send security alert
      await sendSecurityAlert(user, suspiciousPatterns)
    }
  }

  return {
    ...sessionData,
    signOut: async () => {
      await supabase.auth.signOut()
      await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('session_id', sessionData.session?.access_token)
    },
    signOutAllDevices: async () => {
      // Implement global sign out
    }
  }
}
```

### 💳 **Advanced Payment System**

#### **Multiple Payment Methods Integration**
**Priority: CRITICAL** | **Complexity: High**

```typescript
// /components/Payment/PaymentMethods.tsx
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentMethod {
  id: string
  type: 'card' | 'apple_pay' | 'google_pay' | 'grabpay' | 'fpx'
  last4?: string
  brand?: string
  isDefault: boolean
}

export function PaymentMethodSelector({ 
  methods, 
  selectedMethod, 
  onMethodSelect,
  onAddMethod 
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Payment Methods</h3>
      
      {methods.map((method) => (
        <div 
          key={method.id}
          className={`card p-4 cursor-pointer transition-colors ${
            selectedMethod?.id === method.id 
              ? 'border-neon-green bg-neutral-800' 
              : 'hover:bg-neutral-800'
          }`}
          onClick={() => onMethodSelect(method)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PaymentIcon type={method.type} />
              <div>
                <p className="font-semibold">
                  {method.type === 'card' 
                    ? `•••• •••• •••• ${method.last4}` 
                    : method.type.replace('_', ' ').toUpperCase()
                  }
                </p>
                {method.brand && (
                  <p className="text-sm text-neutral-400">{method.brand}</p>
                )}
              </div>
            </div>
            
            {method.isDefault && (
              <span className="text-xs px-2 py-1 rounded-full neon-bg text-black">
                Default
              </span>
            )}
          </div>
        </div>
      ))}

      <button 
        className="btn-secondary w-full flex items-center justify-center gap-2"
        onClick={onAddMethod}
      >
        <span className="material-icons">add</span>
        Add Payment Method
      </button>
    </div>
  )
}

// Malaysia-specific payment methods
export function MalaysianPaymentMethods() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <PaymentOption 
        icon="💳" 
        label="FPX Online Banking" 
        description="Direct bank transfer"
      />
      <PaymentOption 
        icon="🟢" 
        label="GrabPay" 
        description="E-wallet payment"
      />
      <PaymentOption 
        icon="💙" 
        label="Touch 'n Go eWallet" 
        description="Digital wallet"
      />
      <PaymentOption 
        icon="🔵" 
        label="Boost" 
        description="Mobile payment"
      />
    </div>
  )
}
```

**Backend Payment Processing:**
```typescript
// /supabase/functions/server/payments.ts
import Stripe from 'stripe'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16'
})

export async function createPaymentIntent(amount: number, currency: string = 'myr') {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        integration_check: 'accept_a_payment',
      }
    })

    return {
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    }
  } catch (error) {
    throw new Error(`Payment intent creation failed: ${error.message}`)
  }
}

export async function handleWebhook(request: Request) {
  const signature = request.headers.get('stripe-signature')
  const body = await request.text()

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object)
        break
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    return new Response('Webhook error', { status: 400 })
  }
}
```

#### **Dynamic Pricing Engine**
**Priority: HIGH** | **Complexity: High**

```typescript
// /utils/pricing/dynamicPricing.ts
interface PricingFactors {
  basePrice: number
  demandMultiplier: number
  timeOfDay: number
  weatherCondition: string
  inventory: number
  userTier: string
  location: string
}

export class DynamicPricingEngine {
  private static instance: DynamicPricingEngine
  private pricingRules: PricingRule[]

  static getInstance(): DynamicPricingEngine {
    if (!DynamicPricingEngine.instance) {
      DynamicPricingEngine.instance = new DynamicPricingEngine()
    }
    return DynamicPricingEngine.instance
  }

  calculatePrice(itemId: string, factors: PricingFactors): number {
    let finalPrice = factors.basePrice

    // Time-based pricing
    const timeMultiplier = this.getTimeMultiplier(factors.timeOfDay)
    finalPrice *= timeMultiplier

    // Demand-based pricing
    if (factors.demandMultiplier > 1.5) {
      finalPrice *= Math.min(factors.demandMultiplier, 2.0) // Cap at 100% increase
    }

    // Weather impact (rain = higher delivery demand)
    if (factors.weatherCondition === 'rain') {
      finalPrice *= 1.15
    }

    // Inventory scarcity pricing
    if (factors.inventory < 10) {
      finalPrice *= 1.1
    }

    // User tier discounts
    const tierDiscount = this.getTierDiscount(factors.userTier)
    finalPrice *= (1 - tierDiscount)

    // Location-based pricing
    const locationMultiplier = this.getLocationMultiplier(factors.location)
    finalPrice *= locationMultiplier

    return Math.round(finalPrice * 100) / 100 // Round to 2 decimal places
  }

  private getTimeMultiplier(hour: number): number {
    // Peak hours: 12-2pm, 6-8pm
    if ((hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 20)) {
      return 1.2
    }
    // Off-peak hours: 10-11am, 3-5pm
    if ((hour >= 10 && hour <= 11) || (hour >= 15 && hour <= 17)) {
      return 0.9
    }
    return 1.0
  }

  private getTierDiscount(tier: string): number {
    const discounts = {
      'bronze': 0,
      'silver': 0.05,
      'gold': 0.10,
      'platinum': 0.15
    }
    return discounts[tier] || 0
  }

  private getLocationMultiplier(location: string): number {
    const locationMultipliers = {
      'klcc': 1.2,        // Premium area
      'mont-kiara': 1.15,  // Upscale area
      'pj': 1.0,          // Standard
      'subang': 0.95      // Competitive area
    }
    return locationMultipliers[location] || 1.0
  }
}

// Usage in components
export function useDynamicPricing(itemId: string, basePrice: number) {
  const [currentPrice, setCurrentPrice] = useState(basePrice)
  const pricingEngine = DynamicPricingEngine.getInstance()

  useEffect(() => {
    const updatePrice = async () => {
      const factors = await gatherPricingFactors(itemId)
      const newPrice = pricingEngine.calculatePrice(itemId, {
        basePrice,
        ...factors
      })
      setCurrentPrice(newPrice)
    }

    updatePrice()
    const interval = setInterval(updatePrice, 5 * 60 * 1000) // Update every 5 minutes

    return () => clearInterval(interval)
  }, [itemId, basePrice])

  return currentPrice
}
```

### 📍 **Real-time Delivery Tracking**

#### **GPS Tracking System**
**Priority: CRITICAL** | **Complexity: Very High**

```typescript
// /components/Tracking/LiveDeliveryMap.tsx
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'

interface DeliveryLocation {
  lat: number
  lng: number
  timestamp: string
  speed?: number
  heading?: number
}

interface DeliveryTrackingProps {
  orderId: string
  customerLocation: [number, number]
  restaurantLocation: [number, number]
}

export function LiveDeliveryMap({ 
  orderId, 
  customerLocation, 
  restaurantLocation 
}: DeliveryTrackingProps) {
  const [driverLocation, setDriverLocation] = useState<DeliveryLocation | null>(null)
  const [route, setRoute] = useState<[number, number][]>([])
  const [estimatedArrival, setEstimatedArrival] = useState<string>('')

  useEffect(() => {
    // Subscribe to real-time driver location updates
    const subscription = supabase
      .channel(`delivery_${orderId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'delivery_tracking',
        filter: `order_id=eq.${orderId}`
      }, (payload) => {
        const location = payload.new as DeliveryLocation
        setDriverLocation(location)
        
        // Update route and ETA
        updateRouteAndETA(location, customerLocation)
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [orderId])

  const updateRouteAndETA = async (
    driverLoc: DeliveryLocation, 
    customerLoc: [number, number]
  ) => {
    try {
      // Use routing service (OpenRouteService, MapBox, etc.)
      const routeResponse = await fetch('/api/routing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: [driverLoc.lat, driverLoc.lng],
          end: customerLoc,
          profile: 'driving-car'
        })
      })

      const routeData = await routeResponse.json()
      setRoute(routeData.coordinates)
      
      // Calculate ETA based on current traffic
      const eta = calculateETA(routeData.duration, routeData.distance)
      setEstimatedArrival(eta)
      
    } catch (error) {
      console.error('Route calculation failed:', error)
    }
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div className="h-64 md:h-96 relative">
        <MapContainer
          center={driverLocation ? [driverLocation.lat, driverLocation.lng] : restaurantLocation}
          zoom={15}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          {/* Restaurant Marker */}
          <Marker position={restaurantLocation}>
            <Popup>
              <div className="text-center">
                <span className="material-icons text-neon-green">restaurant</span>
                <p className="font-semibold">CORNMAN Kitchen</p>
              </div>
            </Popup>
          </Marker>

          {/* Customer Marker */}
          <Marker position={customerLocation}>
            <Popup>
              <div className="text-center">
                <span className="material-icons text-blue-500">home</span>
                <p className="font-semibold">Your Location</p>
              </div>
            </Popup>
          </Marker>

          {/* Driver Marker */}
          {driverLocation && (
            <Marker 
              position={[driverLocation.lat, driverLocation.lng]}
              icon={createDriverIcon(driverLocation.heading)}
            >
              <Popup>
                <div className="text-center">
                  <span className="material-icons text-neon-green">delivery_dining</span>
                  <p className="font-semibold">Your Driver</p>
                  <p className="text-sm">ETA: {estimatedArrival}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Route Path */}
          {route.length > 0 && (
            <Polyline 
              positions={route} 
              pathOptions={{ 
                color: '#39FF14', 
                weight: 4,
                opacity: 0.8 
              }} 
            />
          )}
        </MapContainer>

        {/* Overlay Info */}
        <div className="absolute top-4 right-4 bg-neutral-900/90 rounded-lg p-3 backdrop-blur">
          <div className="space-y-2 text-sm">
            {estimatedArrival && (
              <div className="flex items-center gap-2">
                <span className="material-icons text-neon-green text-sm">schedule</span>
                <span>ETA: {estimatedArrival}</span>
              </div>
            )}
            {driverLocation?.speed && (
              <div className="flex items-center gap-2">
                <span className="material-icons text-blue-400 text-sm">speed</span>
                <span>{Math.round(driverLocation.speed)} km/h</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Status */}
      <div className="p-4">
        <DeliveryStatusTimeline orderId={orderId} />
      </div>
    </div>
  )
}

// Driver location tracking (for driver app)
export function useDriverLocationTracking(orderId: string) {
  const [isTracking, setIsTracking] = useState(false)

  const startTracking = () => {
    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported')
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date().toISOString(),
          speed: position.coords.speed,
          heading: position.coords.heading
        }

        // Update database with current location
        await supabase
          .from('delivery_tracking')
          .update({ 
            current_location: location,
            last_updated: location.timestamp 
          })
          .eq('order_id', orderId)

      },
      (error) => {
        console.error('Location tracking error:', error)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000
      }
    )

    setIsTracking(true)
    return () => {
      navigator.geolocation.clearWatch(watchId)
      setIsTracking(false)
    }
  }

  return { isTracking, startTracking }
}
```

**Database Schema for Tracking:**
```sql
CREATE TABLE delivery_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES profiles(id),
  current_location JSONB NOT NULL,
  route_points JSONB[] DEFAULT '{}',
  estimated_arrival TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  status delivery_status DEFAULT 'assigned',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE delivery_status AS ENUM (
  'assigned',
  'pickup_ready',
  'picked_up', 
  'in_transit',
  'arrived',
  'delivered',
  'failed'
);

CREATE INDEX idx_delivery_tracking_order_id ON delivery_tracking(order_id);
CREATE INDEX idx_delivery_tracking_driver_id ON delivery_tracking(driver_id);
```

---

## 🚀 PHASE 2: INTELLIGENCE & PERSONALIZATION

### 🤖 **AI-Powered Recommendation Engine**

#### **Machine Learning Food Recommendations**
**Priority: HIGH** | **Complexity: Very High**

```typescript
// /utils/ai/recommendationEngine.ts
interface UserPreferences {
  spiceLevel: number // 1-5
  dietaryRestrictions: string[]
  favoriteCategories: string[]
  priceRange: [number, number]
  orderHistory: OrderItem[]
  timePreferences: { [key: string]: string[] } // breakfast, lunch, dinner
}

interface RecommendationContext {
  timeOfDay: number
  weather: string
  location: string
  groupSize: number
  budget: number
  occasion: 'casual' | 'celebration' | 'office' | 'family'
}

export class FoodRecommendationEngine {
  private userProfiles: Map<string, UserPreferences> = new Map()
  private itemSimilarities: Map<string, Map<string, number>> = new Map()
  private trendingItems: Set<string> = new Set()

  async generateRecommendations(
    userId: string, 
    context: RecommendationContext,
    limit: number = 10
  ): Promise<RecommendationResult[]> {
    const userPrefs = await this.getUserPreferences(userId)
    const recommendations: RecommendationResult[] = []

    // 1. Collaborative Filtering
    const collaborativeRecs = await this.getCollaborativeRecommendations(userId, userPrefs)
    recommendations.push(...collaborativeRecs.slice(0, 4))

    // 2. Content-Based Filtering
    const contentRecs = await this.getContentBasedRecommendations(userPrefs, context)
    recommendations.push(...contentRecs.slice(0, 3))

    // 3. Trending Items
    const trendingRecs = await this.getTrendingRecommendations(context)
    recommendations.push(...trendingRecs.slice(0, 2))

    // 4. Contextual Recommendations
    const contextualRecs = await this.getContextualRecommendations(context)
    recommendations.push(...contextualRecs.slice(0, 1))

    // Score and rank all recommendations
    const scoredRecs = await this.scoreRecommendations(recommendations, userPrefs, context)
    
    return scoredRecs
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((rec, index) => ({
        ...rec,
        rank: index + 1,
        reason: this.generateReasonText(rec, userPrefs, context)
      }))
  }

  private async getCollaborativeRecommendations(
    userId: string, 
    userPrefs: UserPreferences
  ): Promise<RecommendationResult[]> {
    // Find users with similar preferences
    const similarUsers = await this.findSimilarUsers(userId, userPrefs)
    
    // Get items liked by similar users but not ordered by current user
    const recommendations: RecommendationResult[] = []
    const userOrderedItems = new Set(userPrefs.orderHistory.map(item => item.id))

    for (const similarUser of similarUsers) {
      const theirOrders = await this.getUserOrderHistory(similarUser.id)
      
      for (const order of theirOrders) {
        if (!userOrderedItems.has(order.itemId) && order.rating >= 4) {
          recommendations.push({
            itemId: order.itemId,
            score: similarUser.similarity * (order.rating / 5),
            type: 'collaborative',
            confidence: similarUser.similarity
          })
        }
      }
    }

    return recommendations
  }

  private async getContentBasedRecommendations(
    userPrefs: UserPreferences,
    context: RecommendationContext
  ): Promise<RecommendationResult[]> {
    const allItems = await this.getAllMenuItems()
    const recommendations: RecommendationResult[] = []

    for (const item of allItems) {
      let score = 0

      // Spice level matching
      const spiceDiff = Math.abs(item.spiceLevel - userPrefs.spiceLevel)
      score += (5 - spiceDiff) / 5 * 0.3

      // Category preference
      if (userPrefs.favoriteCategories.includes(item.category)) {
        score += 0.4
      }

      // Price range matching
      if (item.price >= userPrefs.priceRange[0] && item.price <= userPrefs.priceRange[1]) {
        score += 0.2
      }

      // Dietary restrictions
      const meetsRestrictions = userPrefs.dietaryRestrictions.every(
        restriction => item.dietaryInfo.includes(restriction)
      )
      if (!meetsRestrictions) continue

      // Time-based preferences
      const currentMeal = this.getMealTimeFromHour(context.timeOfDay)
      if (userPrefs.timePreferences[currentMeal]?.includes(item.category)) {
        score += 0.1
      }

      if (score > 0.5) {
        recommendations.push({
          itemId: item.id,
          score,
          type: 'content',
          confidence: score
        })
      }
    }

    return recommendations
  }

  private async scoreRecommendations(
    recommendations: RecommendationResult[],
    userPrefs: UserPreferences,
    context: RecommendationContext
  ): Promise<RecommendationResult[]> {
    return recommendations.map(rec => {
      let adjustedScore = rec.score

      // Weather boost
      if (context.weather === 'rain' && rec.category === 'hot_drinks') {
        adjustedScore *= 1.2
      }

      // Time of day boost
      if (context.timeOfDay >= 18 && rec.category === 'dinner_specials') {
        adjustedScore *= 1.15
      }

      // Group size consideration
      if (context.groupSize > 1 && rec.isShareable) {
        adjustedScore *= 1.1
      }

      return {
        ...rec,
        score: adjustedScore
      }
    })
  }

  generateReasonText(
    rec: RecommendationResult, 
    userPrefs: UserPreferences, 
    context: RecommendationContext
  ): string {
    const reasons = []

    if (rec.type === 'collaborative') {
      reasons.push('People with similar tastes loved this')
    }

    if (userPrefs.favoriteCategories.includes(rec.category)) {
      reasons.push(`Perfect for ${rec.category} lovers`)
    }

    if (context.weather === 'rain' && rec.category === 'hot_drinks') {
      reasons.push('Great for rainy weather')
    }

    if (rec.trendingScore > 0.8) {
      reasons.push('Trending now')
    }

    return reasons.join(' • ') || 'Recommended for you'
  }
}

// Usage in components
export function usePersonalizedRecommendations(userId: string) {
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true)
      
      const context: RecommendationContext = {
        timeOfDay: new Date().getHours(),
        weather: await getCurrentWeather(),
        location: await getCurrentLocation(),
        groupSize: 1,
        budget: 50,
        occasion: 'casual'
      }

      const engine = new FoodRecommendationEngine()
      const recs = await engine.generateRecommendations(userId, context)
      
      setRecommendations(recs)
      setIsLoading(false)
    }

    if (userId) {
      loadRecommendations()
    }
  }, [userId])

  return { recommendations, isLoading }
}
```

#### **Smart Search with Natural Language Processing**
**Priority: MEDIUM** | **Complexity: High**

```typescript
// /components/Search/SmartSearch.tsx
import { useState, useCallback, useMemo } from 'react'
import { debounce } from 'lodash'

interface SearchSuggestion {
  type: 'item' | 'category' | 'ingredient' | 'dietary' | 'mood'
  text: string
  icon: string
  action: () => void
}

export function SmartSearch({ onResults }: { onResults: (items: MenuItem[]) => void }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Natural language processing for search queries
  const processNaturalLanguage = useCallback(async (query: string) => {
    const processed = await fetch('/api/search/nlp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    }).then(res => res.json())

    return {
      intent: processed.intent, // 'order', 'browse', 'find', 'recommend'
      entities: processed.entities, // extracted food items, modifiers, etc.
      sentiment: processed.sentiment, // positive, negative, neutral
      confidence: processed.confidence
    }
  }, [])

  // Smart search function
  const performSmartSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      onResults([])
      return
    }

    setIsSearching(true)

    try {
      // Process natural language
      const nlp = await processNaturalLanguage(searchQuery)
      
      // Build search criteria based on NLP results
      const searchCriteria = {
        query: searchQuery,
        intent: nlp.intent,
        entities: nlp.entities,
        filters: extractFilters(searchQuery), // spicy, vegetarian, under RM10, etc.
        mood: extractMood(searchQuery), // comfort food, healthy, celebration
        preferences: await getUserPreferences()
      }

      // Perform multi-dimensional search
      const results = await multiDimensionalSearch(searchCriteria)
      
      onResults(results)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }, [onResults, processNaturalLanguage])

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce(performSmartSearch, 300),
    [performSmartSearch]
  )

  // Generate smart suggestions
  const generateSuggestions = useCallback(async (partialQuery: string) => {
    if (partialQuery.length < 2) {
      setSuggestions([])
      return
    }

    const suggestions: SearchSuggestion[] = []

    // Auto-complete items
    const matchingItems = await searchMenuItems(partialQuery)
    matchingItems.slice(0, 3).forEach(item => {
      suggestions.push({
        type: 'item',
        text: item.name,
        icon: '🌽',
        action: () => onResults([item])
      })
    })

    // Category suggestions
    const categories = await searchCategories(partialQuery)
    categories.slice(0, 2).forEach(category => {
      suggestions.push({
        type: 'category',
        text: `All ${category.name}`,
        icon: '📂',
        action: () => searchByCategory(category.id)
      })
    })

    // Smart suggestions based on query patterns
    if (partialQuery.toLowerCase().includes('spicy')) {
      suggestions.push({
        type: 'dietary',
        text: 'Show all spicy items',
        icon: '🌶️',
        action: () => searchBySpiceLevel(3, 5)
      })
    }

    if (partialQuery.toLowerCase().includes('healthy')) {
      suggestions.push({
        type: 'dietary',
        text: 'Healthy options',
        icon: '🥗',
        action: () => searchByDietary(['low-calorie', 'high-protein'])
      })
    }

    // Mood-based suggestions
    if (['comfort', 'cozy', 'warm'].some(word => partialQuery.toLowerCase().includes(word))) {
      suggestions.push({
        type: 'mood',
        text: 'Comfort food',
        icon: '🤗',
        action: () => searchByMood('comfort')
      })
    }

    setSuggestions(suggestions)
  }, [onResults])

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            debouncedSearch(e.target.value)
            generateSuggestions(e.target.value)
          }}
          className="w-full bg-neutral-800 border border-neutral-700 rounded-2xl pl-12 pr-4 py-4 text-lg focus:ring-neon-green focus:border-neon-green"
          placeholder="Search for corn dishes, ingredients, or just describe what you want..."
        />
        
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 material-icons text-neutral-400">
          {isSearching ? 'hourglass_empty' : 'search'}
        </span>

        {query && (
          <button
            onClick={() => {
              setQuery('')
              onResults([])
              setSuggestions([])
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
          >
            <span className="material-icons">close</span>
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg z-50 max-h-96 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={suggestion.action}
              className="w-full text-left px-4 py-3 hover:bg-neutral-800 flex items-center gap-3 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
            >
              <span className="text-xl">{suggestion.icon}</span>
              <div>
                <p className="font-medium">{suggestion.text}</p>
                <p className="text-xs text-neutral-400 capitalize">{suggestion.type}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Search Filters */}
      <SearchFilters onFiltersChange={handleFiltersChange} />
    </div>
  )
}

// Advanced search with filters
function SearchFilters({ onFiltersChange }: { onFiltersChange: (filters: SearchFilters) => void }) {
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({
    priceRange: [0, 100],
    spiceLevel: [1, 5],
    dietary: [],
    category: '',
    availability: 'all',
    rating: 0
  })

  return (
    <div className="mt-4 p-4 bg-neutral-900 rounded-xl">
      <div className="flex flex-wrap gap-4">
        {/* Price Range */}
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-semibold mb-2">Price Range</label>
          <PriceRangeSlider 
            value={activeFilters.priceRange}
            onChange={(range) => {
              const newFilters = { ...activeFilters, priceRange: range }
              setActiveFilters(newFilters)
              onFiltersChange(newFilters)
            }}
          />
        </div>

        {/* Dietary Preferences */}
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-semibold mb-2">Dietary</label>
          <div className="flex flex-wrap gap-2">
            {['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Low-Calorie'].map(diet => (
              <button
                key={diet}
                onClick={() => toggleDietaryFilter(diet)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  activeFilters.dietary.includes(diet)
                    ? 'bg-neon-green text-black border-neon-green'
                    : 'border-neutral-600 hover:border-neutral-500'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        {/* Spice Level */}
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-semibold mb-2">Spice Level</label>
          <SpiceLevelSelector 
            value={activeFilters.spiceLevel}
            onChange={(level) => {
              const newFilters = { ...activeFilters, spiceLevel: level }
              setActiveFilters(newFilters)
              onFiltersChange(newFilters)
            }}
          />
        </div>
      </div>
    </div>
  )
}
```

### 🏆 **Advanced Loyalty & Gamification System**

#### **Tiered Membership with Dynamic Benefits**
**Priority: HIGH** | **Complexity: Medium**

```typescript
// /components/Loyalty/LoyaltyProgram.tsx
interface LoyaltyTier {
  id: string
  name: string
  minPoints: number
  color: string
  benefits: LoyaltyBenefit[]
  badge: string
}

interface LoyaltyBenefit {
  type: 'discount' | 'free_delivery' | 'early_access' | 'exclusive_items' | 'points_multiplier'
  value: number | string
  description: string
  icon: string
}

const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: 'bronze',
    name: 'Corn Explorer',
    minPoints: 0,
    color: '#CD7F32',
    badge: '🌽',
    benefits: [
      { 
        type: 'points_multiplier', 
        value: 1, 
        description: 'Earn 1 point per RM spent',
        icon: 'stars' 
      },
      { 
        type: 'discount', 
        value: 0, 
        description: 'Birthday month 10% off',
        icon: 'cake' 
      }
    ]
  },
  {
    id: 'silver',
    name: 'Corn Enthusiast',
    minPoints: 500,
    color: '#C0C0C0',
    badge: '🥈',
    benefits: [
      { 
        type: 'points_multiplier', 
        value: 1.25, 
        description: 'Earn 1.25x points per purchase',
        icon: 'stars' 
      },
      { 
        type: 'discount', 
        value: 5, 
        description: '5% off all orders',
        icon: 'percent' 
      },
      { 
        type: 'free_delivery', 
        value: 2, 
        description: '2 free deliveries per month',
        icon: 'delivery_dining' 
      }
    ]
  },
  {
    id: 'gold',
    name: 'Corn Connoisseur',
    minPoints: 1500,
    color: '#FFD700',
    badge: '🥇',
    benefits: [
      { 
        type: 'points_multiplier', 
        value: 1.5, 
        description: 'Earn 1.5x points per purchase',
        icon: 'stars' 
      },
      { 
        type: 'discount', 
        value: 10, 
        description: '10% off all orders',
        icon: 'percent' 
      },
      { 
        type: 'free_delivery', 
        value: 'unlimited', 
        description: 'Free delivery on all orders',
        icon: 'delivery_dining' 
      },
      { 
        type: 'early_access', 
        value: '24h', 
        description: '24h early access to new items',
        icon: 'schedule' 
      }
    ]
  },
  {
    id: 'platinum',
    name: 'Corn Master',
    minPoints: 5000,
    color: '#E5E4E2',
    badge: '💎',
    benefits: [
      { 
        type: 'points_multiplier', 
        value: 2, 
        description: 'Earn 2x points per purchase',
        icon: 'stars' 
      },
      { 
        type: 'discount', 
        value: 15, 
        description: '15% off all orders',
        icon: 'percent' 
      },
      { 
        type: 'free_delivery', 
        value: 'unlimited', 
        description: 'Free priority delivery',
        icon: 'delivery_dining' 
      },
      { 
        type: 'exclusive_items', 
        value: 'all', 
        description: 'Access to exclusive menu items',
        icon: 'star' 
      },
      { 
        type: 'early_access', 
        value: '48h', 
        description: '48h early access to everything',
        icon: 'schedule' 
      }
    ]
  }
]

export function LoyaltyDashboard({ user }: { user: User }) {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])

  const currentTier = LOYALTY_TIERS.find(tier => 
    loyaltyData && loyaltyData.points >= tier.minPoints
  ) || LOYALTY_TIERS[0]

  const nextTier = LOYALTY_TIERS.find(tier => 
    loyaltyData && loyaltyData.points < tier.minPoints
  )

  const progressToNextTier = nextTier 
    ? ((loyaltyData?.points || 0) - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)
    : 1

  return (
    <div className="space-y-6">
      {/* Current Tier Status */}
      <div className="card p-6 bg-gradient-to-r from-neutral-900 to-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{currentTier.name}</h2>
            <p className="text-neutral-400">
              {loyaltyData?.points || 0} points
              {nextTier && ` • ${nextTier.minPoints - (loyaltyData?.points || 0)} to ${nextTier.name}`}
            </p>
          </div>
          <div className="text-4xl">{currentTier.badge}</div>
        </div>

        {/* Progress to Next Tier */}
        {nextTier && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>{currentTier.name}</span>
              <span>{nextTier.name}</span>
            </div>
            <div className="w-full bg-neutral-700 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-neon-green to-green-400 transition-all duration-500"
                style={{ width: `${progressToNextTier * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Current Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentTier.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-neutral-800 rounded-lg">
              <span className="material-icons text-neon-green">{benefit.icon}</span>
              <div>
                <p className="font-semibold text-sm">{benefit.description}</p>
                <p className="text-xs text-neutral-400">
                  {benefit.type === 'discount' ? `${benefit.value}% off` :
                   benefit.type === 'points_multiplier' ? `${benefit.value}x points` :
                   benefit.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Challenges */}
      <div className="card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="material-icons text-neon-green">emoji_events</span>
          Weekly Challenges
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </div>

      {/* Points History & Achievements */}
      <div className="grid md:grid-cols-2 gap-6">
        <PointsHistory userId={user.id} />
        <AchievementsList achievements={achievements} />
      </div>
    </div>
  )
}

// Challenge System
interface Challenge {
  id: string
  title: string
  description: string
  type: 'order_count' | 'spend_amount' | 'try_new' | 'streak' | 'social'
  target: number
  current: number
  reward: number
  deadline: string
  difficulty: 'easy' | 'medium' | 'hard'
  icon: string
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const progress = (challenge.current / challenge.target) * 100
  const isCompleted = challenge.current >= challenge.target

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      isCompleted 
        ? 'bg-neon-green/10 border-neon-green' 
        : 'bg-neutral-800 border-neutral-700'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold">{challenge.title}</h4>
          <p className="text-sm text-neutral-400">{challenge.description}</p>
        </div>
        <span className="material-icons text-2xl text-neon-green">{challenge.icon}</span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>{challenge.current} / {challenge.target}</span>
          <span className="neon-text font-semibold">+{challenge.reward} points</span>
        </div>
        <div className="w-full bg-neutral-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-neon-green' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center text-xs">
        <span className={`px-2 py-1 rounded-full ${
          challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
          challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {challenge.difficulty}
        </span>
        <span className="text-neutral-400">
          Ends {new Date(challenge.deadline).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}

// Dynamic Challenge Generation
export class ChallengeGenerator {
  static generateWeeklyChallenges(user: User, orderHistory: Order[]): Challenge[] {
    const challenges: Challenge[] = []
    const now = new Date()
    const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    // Order frequency challenge
    const avgWeeklyOrders = this.getAverageWeeklyOrders(orderHistory)
    challenges.push({
      id: 'weekly_orders',
      title: 'Order Streak',
      description: `Place ${Math.ceil(avgWeeklyOrders * 1.2)} orders this week`,
      type: 'order_count',
      target: Math.ceil(avgWeeklyOrders * 1.2),
      current: 0,
      reward: 50,
      deadline: weekEnd.toISOString(),
      difficulty: 'medium',
      icon: 'local_dining'
    })

    // Try new items challenge
    const untriedItems = this.getUntriedItems(user, orderHistory)
    if (untriedItems.length > 0) {
      challenges.push({
        id: 'try_new',
        title: 'Corn Explorer',
        description: 'Try 2 new menu items',
        type: 'try_new',
        target: 2,
        current: 0,
        reward: 75,
        deadline: weekEnd.toISOString(),
        difficulty: 'easy',
        icon: 'explore'
      })
    }

    // Spending challenge
    const avgWeeklySpend = this.getAverageWeeklySpend(orderHistory)
    challenges.push({
      id: 'spend_target',
      title: 'Corn Investment',
      description: `Spend RM ${Math.ceil(avgWeeklySpend * 0.8)} this week`,
      type: 'spend_amount',
      target: Math.ceil(avgWeeklySpend * 0.8),
      current: 0,
      reward: 100,
      deadline: weekEnd.toISOString(),
      difficulty: avgWeeklySpend > 50 ? 'hard' : 'medium',
      icon: 'payments'
    })

    // Social challenge
    challenges.push({
      id: 'social_share',
      title: 'Corn Influencer',
      description: 'Share 3 food photos on social media',
      type: 'social',
      target: 3,
      current: 0,
      reward: 30,
      deadline: weekEnd.toISOString(),
      difficulty: 'easy',
      icon: 'share'
    })

    return challenges
  }
}
```

---

## 🎯 PHASE 3: ADVANCED OPERATIONS & ANALYTICS

### 📊 **Real-time Analytics Dashboard**

#### **Business Intelligence System**
**Priority: HIGH** | **Complexity: Very High**

```typescript
// /components/Analytics/DashboardOverview.tsx
interface AnalyticsData {
  revenue: RevenueMetrics
  orders: OrderMetrics
  customers: CustomerMetrics
  inventory: InventoryMetrics
  delivery: DeliveryMetrics
  trends: TrendData[]
}

interface RevenueMetrics {
  today: number
  yesterday: number
  thisWeek: number
  lastWeek: number
  thisMonth: number
  lastMonth: number
  growthRate: number
  projectedDaily: number
}

export function BusinessAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState<'1d' | '7d' | '30d' | '90d'>('7d')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true)
      try {
        const data = await fetch(`/api/analytics/dashboard?range=${timeRange}`)
          .then(res => res.json())
        setAnalyticsData(data)
      } catch (error) {
        console.error('Failed to load analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAnalytics()
    
    // Real-time updates every 30 seconds
    const interval = setInterval(loadAnalytics, 30000)
    return () => clearInterval(interval)
  }, [timeRange])

  if (isLoading || !analyticsData) {
    return <AnalyticsLoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Revenue Today"
          value={`RM ${analyticsData.revenue.today.toFixed(2)}`}
          change={calculatePercentageChange(
            analyticsData.revenue.today, 
            analyticsData.revenue.yesterday
          )}
          icon="payments"
          trend="up"
        />
        
        <MetricCard
          title="Orders Today"
          value={analyticsData.orders.today.toString()}
          change={calculatePercentageChange(
            analyticsData.orders.today, 
            analyticsData.orders.yesterday
          )}
          icon="receipt"
          trend="up"
        />
        
        <MetricCard
          title="Active Customers"
          value={analyticsData.customers.active.toString()}
          change={analyticsData.customers.growthRate}
          icon="people"
          trend="up"
        />
        
        <MetricCard
          title="Avg Delivery Time"
          value={`${analyticsData.delivery.averageTime} min`}
          change={calculatePercentageChange(
            analyticsData.delivery.averageTime,
            analyticsData.delivery.previousAverageTime
          )}
          icon="delivery_dining"
          trend="down" // Lower is better for delivery time
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={analyticsData.revenue} timeRange={timeRange} />
        <OrderVolumeChart data={analyticsData.orders} timeRange={timeRange} />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PopularItemsChart data={analyticsData.inventory.popular} />
        <CustomerSegmentChart data={analyticsData.customers.segments} />
        <DeliveryHeatmap data={analyticsData.delivery.zones} />
      </div>

      {/* Real-time Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveOrderFeed />
        <AlertsAndNotifications />
      </div>
    </div>
  )
}

// Real-time Revenue Chart
function RevenueChart({ data, timeRange }: { data: RevenueMetrics, timeRange: string }) {
  const chartData = useMemo(() => {
    return generateChartData(data, timeRange)
  }, [data, timeRange])

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Revenue Trend</h3>
        <div className="flex gap-2">
          <span className="text-sm text-neutral-400">Growth:</span>
          <span className={`text-sm font-semibold ${
            data.growthRate >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {data.growthRate >= 0 ? '+' : ''}{data.growthRate.toFixed(1)}%
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
          <XAxis 
            dataKey="time" 
            stroke="#a3a3a3"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#a3a3a3"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `RM ${value}`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#171717',
              border: '1px solid #262626',
              borderRadius: '8px'
            }}
            formatter={(value) => [`RM ${value}`, 'Revenue']}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#39FF14" 
            strokeWidth={3}
            dot={{ fill: '#39FF14', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#39FF14', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Revenue Prediction */}
      <div className="mt-4 p-3 bg-neutral-800 rounded-lg">
        <p className="text-sm text-neutral-400 mb-1">Projected Daily Revenue</p>
        <p className="text-lg font-bold neon-text">
          RM {data.projectedDaily.toFixed(2)}
        </p>
        <p className="text-xs text-neutral-500">
          Based on current trends and historical data
        </p>
      </div>
    </div>
  )
}

// Live Order Feed
function LiveOrderFeed() {
  const [orders, setOrders] = useState<LiveOrder[]>([])

  useEffect(() => {
    // Subscribe to real-time order updates
    const subscription = supabase
      .channel('live_orders')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        setOrders(prev => [payload.new as LiveOrder, ...prev.slice(0, 9)])
      })
      .subscribe()

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></span>
        Live Orders
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg"
          >
            <div>
              <p className="font-semibold">Order #{order.id.slice(-8)}</p>
              <p className="text-sm text-neutral-400">
                {order.items.length} items • {order.customerName}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold neon-text">RM {order.total}</p>
              <p className="text-xs text-neutral-400">
                {formatRelativeTime(order.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Advanced Analytics API
export class AnalyticsService {
  static async getRevenueAnalytics(timeRange: string): Promise<RevenueMetrics> {
    const { data } = await supabase.rpc('get_revenue_analytics', { 
      time_range: timeRange 
    })
    
    return {
      today: data.today_revenue,
      yesterday: data.yesterday_revenue,
      thisWeek: data.week_revenue,
      lastWeek: data.last_week_revenue,
      thisMonth: data.month_revenue,
      lastMonth: data.last_month_revenue,
      growthRate: data.growth_rate,
      projectedDaily: data.projected_daily
    }
  }

  static async getCustomerSegmentation(): Promise<CustomerSegment[]> {
    const { data } = await supabase.rpc('analyze_customer_segments')
    
    return data.map(segment => ({
      name: segment.segment_name,
      count: segment.customer_count,
      avgOrderValue: segment.avg_order_value,
      frequency: segment.order_frequency,
      ltv: segment.lifetime_value
    }))
  }

  static async getPredictiveAnalytics(): Promise<PredictionData> {
    // Machine learning predictions
    const response = await fetch('/api/analytics/predictions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        features: await this.gatherPredictionFeatures()
      })
    })

    return response.json()
  }

  private static async gatherPredictionFeatures() {
    const [weather, events, historical] = await Promise.all([
      this.getWeatherData(),
      this.getLocalEvents(),
      this.getHistoricalPatterns()
    ])

    return {
      weather: weather.condition,
      temperature: weather.temperature,
      isWeekend: new Date().getDay() % 6 === 0,
      localEvents: events.length,
      historicalDemand: historical.averageDemand,
      seasonality: this.getSeasonalityFactor()
    }
  }
}
```

#### **A/B Testing Platform**
**Priority: MEDIUM** | **Complexity: High**

```typescript
// /utils/ab-testing/experimentEngine.ts
interface ExperimentConfig {
  id: string
  name: string
  description: string
  variants: ExperimentVariant[]
  trafficAllocation: number // 0-100
  targetMetric: string
  startDate: string
  endDate: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  minimumSampleSize: number
}

interface ExperimentVariant {
  id: string
  name: string
  allocation: number // 0-100
  config: any // Component configuration
  isControl: boolean
}

export class ABTestingEngine {
  private static instance: ABTestingEngine
  private experiments: Map<string, ExperimentConfig> = new Map()
  private userAssignments: Map<string, Map<string, string>> = new Map()

  static getInstance(): ABTestingEngine {
    if (!ABTestingEngine.instance) {
      ABTestingEngine.instance = new ABTestingEngine()
    }
    return ABTestingEngine.instance
  }

  // Assign user to experiment variant
  assignUserToExperiment(userId: string, experimentId: string): string | null {
    const experiment = this.experiments.get(experimentId)
    if (!experiment || experiment.status !== 'running') {
      return null
    }

    // Check if user already assigned
    const userExperiments = this.userAssignments.get(userId) || new Map()
    if (userExperiments.has(experimentId)) {
      return userExperiments.get(experimentId)!
    }

    // Determine if user should be included in experiment
    const userHash = this.hashUser(userId, experimentId)
    if (userHash > experiment.trafficAllocation) {
      return null // User not in experiment
    }

    // Assign to variant based on allocation
    const variantHash = userHash % 100
    let cumulativeAllocation = 0
    
    for (const variant of experiment.variants) {
      cumulativeAllocation += variant.allocation
      if (variantHash < cumulativeAllocation) {
        // Assign user to this variant
        userExperiments.set(experimentId, variant.id)
        this.userAssignments.set(userId, userExperiments)
        
        // Track assignment
        this.trackAssignment(userId, experimentId, variant.id)
        
        return variant.id
      }
    }

    return null
  }

  // Track experiment event
  trackEvent(
    userId: string, 
    experimentId: string, 
    eventType: string, 
    value?: number
  ) {
    const userExperiments = this.userAssignments.get(userId)
    const variantId = userExperiments?.get(experimentId)
    
    if (!variantId) return

    // Send to analytics
    this.sendAnalyticsEvent({
      userId,
      experimentId,
      variantId,
      eventType,
      value,
      timestamp: new Date().toISOString()
    })
  }

  // Get experiment results
  async getExperimentResults(experimentId: string): Promise<ExperimentResults> {
    const { data } = await supabase.rpc('get_experiment_results', {
      experiment_id: experimentId
    })

    const results: ExperimentResults = {
      experimentId,
      variants: data.map(variant => ({
        variantId: variant.variant_id,
        participants: variant.participant_count,
        conversions: variant.conversion_count,
        conversionRate: variant.conversion_rate,
        averageValue: variant.average_value,
        statisticalSignificance: variant.statistical_significance,
        confidenceInterval: variant.confidence_interval
      })),
      status: this.calculateExperimentStatus(data),
      recommendation: this.generateRecommendation(data)
    }

    return results
  }

  private hashUser(userId: string, experimentId: string): number {
    // Simple hash function for consistent user assignment
    const combined = `${userId}_${experimentId}`
    let hash = 0
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash) % 100
  }
}

// React Hook for A/B Testing
export function useABTest(experimentId: string, userId: string) {
  const [variant, setVariant] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const engine = ABTestingEngine.getInstance()
    const assignedVariant = engine.assignUserToExperiment(userId, experimentId)
    
    setVariant(assignedVariant)
    setIsLoading(false)
  }, [experimentId, userId])

  const trackConversion = useCallback((value?: number) => {
    if (!userId || !variant) return

    const engine = ABTestingEngine.getInstance()
    engine.trackEvent(userId, experimentId, 'conversion', value)
  }, [experimentId, userId, variant])

  const trackEvent = useCallback((eventType: string, value?: number) => {
    if (!userId || !variant) return

    const engine = ABTestingEngine.getInstance()
    engine.trackEvent(userId, experimentId, eventType, value)
  }, [experimentId, userId, variant])

  return {
    variant,
    isLoading,
    trackConversion,
    trackEvent,
    isInExperiment: variant !== null
  }
}

// Example A/B Test Component
export function ABTestPricingDisplay({ userId, itemId, basePrice }: {
  userId: string
  itemId: string
  basePrice: number
}) {
  const { variant, trackConversion, trackEvent } = useABTest('pricing_display_test', userId)

  const displayPrice = useMemo(() => {
    switch (variant) {
      case 'control':
        return basePrice
      case 'strikethrough':
        return {
          original: basePrice * 1.2,
          current: basePrice,
          savings: basePrice * 0.2
        }
      case 'percentage_off':
        return {
          current: basePrice,
          discount: '20% OFF'
        }
      default:
        return basePrice
    }
  }, [variant, basePrice])

  const handleAddToCart = () => {
    trackConversion(basePrice)
    trackEvent('add_to_cart', basePrice)
    // ... rest of add to cart logic
  }

  if (variant === 'strikethrough') {
    return (
      <div className="text-right">
        <p className="text-sm text-neutral-400 line-through">
          RM {displayPrice.original.toFixed(2)}
        </p>
        <p className="text-lg font-bold neon-text">
          RM {displayPrice.current.toFixed(2)}
        </p>
        <p className="text-xs text-green-400">
          Save RM {displayPrice.savings.toFixed(2)}
        </p>
      </div>
    )
  }

  if (variant === 'percentage_off') {
    return (
      <div className="text-right">
        <div className="flex items-center gap-2 justify-end">
          <span className="text-xs px-2 py-1 bg-red-500 text-white rounded-full">
            {displayPrice.discount}
          </span>
        </div>
        <p className="text-lg font-bold neon-text">
          RM {displayPrice.current.toFixed(2)}
        </p>
      </div>
    )
  }

  // Control variant
  return (
    <div className="text-right">
      <p className="text-lg font-bold neon-text">
        RM {displayPrice.toFixed(2)}
      </p>
    </div>
  )
}
```

---

## 🚀 PHASE 4: NEXT-GENERATION FEATURES

### 🌐 **AI & Machine Learning Integration**

#### **Intelligent Chatbot System**
**Priority: MEDIUM** | **Complexity: Very High**

```typescript
// /components/AI/ChatbotAssistant.tsx
import { useState, useEffect, useRef } from 'react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: {
    intent?: string
    entities?: any[]
    actions?: ChatAction[]
    confidence?: number
  }
}

interface ChatAction {
  type: 'order' | 'search' | 'recommend' | 'track' | 'support'
  data: any
  label: string
}

export function AIOrderAssistant({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize with welcome message
    addMessage({
      role: 'assistant',
      content: "Hi! I'm your CORNMAN assistant 🌽 I can help you find the perfect corn dish, track your orders, or answer any questions. What would you like to do today?",
      metadata: {
        actions: [
          { type: 'recommend', data: {}, label: 'Get Recommendations' },
          { type: 'search', data: {}, label: 'Browse Menu' },
          { type: 'track', data: {}, label: 'Track Order' }
        ]
      }
    })
  }, [])

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    addMessage({ role: 'user', content: input })
    const userInput = input
    setInput('')
    setIsTyping(true)

    try {
      // Send to AI service
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
          userId,
          context: await getConversationContext(userId),
          history: messages.slice(-10) // Last 10 messages for context
        })
      })

      const aiResponse = await response.json()
      
      // Add AI response
      addMessage({
        role: 'assistant',
        content: aiResponse.message,
        metadata: {
          intent: aiResponse.intent,
          entities: aiResponse.entities,
          actions: aiResponse.actions,
          confidence: aiResponse.confidence
        }
      })

      // Execute any actions
      if (aiResponse.actions) {
        await executeAIActions(aiResponse.actions)
      }

    } catch (error) {
      addMessage({
        role: 'assistant',
        content: "I'm sorry, I'm having trouble understanding that. Can you try rephrasing your question?"
      })
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-neon-green flex items-center justify-center">
          <span className="text-black text-sm">🤖</span>
        </div>
        <div>
          <h3 className="font-semibold">CORNMAN Assistant</h3>
          <p className="text-xs text-neutral-400">Always here to help</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-neutral-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="px-4 py-2 bg-neon-green text-black rounded-lg font-semibold text-sm disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-3 rounded-2xl ${
        isUser 
          ? 'bg-neon-green text-black ml-4' 
          : 'bg-neutral-800 text-white mr-4'
      }`}>
        <p className="text-sm">{message.content}</p>
        
        {/* Action Buttons */}
        {message.metadata?.actions && (
          <div className="mt-3 space-y-2">
            {message.metadata.actions.map((action, index) => (
              <button
                key={index}
                onClick={() => executeAction(action)}
                className="block w-full text-left px-3 py-2 text-xs bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// AI Backend Service
export class AIConversationService {
  static async processMessage(
    message: string, 
    userId: string, 
    context: ConversationContext
  ): Promise<AIResponse> {
    // 1. Intent Classification
    const intent = await this.classifyIntent(message)
    
    // 2. Entity Extraction
    const entities = await this.extractEntities(message)
    
    // 3. Context Understanding
    const enrichedContext = await this.enrichContext(context, entities)
    
    // 4. Response Generation
    const response = await this.generateResponse(intent, entities, enrichedContext)
    
    // 5. Action Planning
    const actions = await this.planActions(intent, entities, enrichedContext)

    return {
      message: response,
      intent: intent.name,
      entities,
      actions,
      confidence: intent.confidence
    }
  }

  private static async classifyIntent(message: string): Promise<Intent> {
    // Using a pre-trained model or rule-based classification
    const intents = [
      { name: 'order_food', keywords: ['order', 'buy', 'want', 'get'], confidence: 0 },
      { name: 'track_order', keywords: ['track', 'where', 'status', 'delivery'], confidence: 0 },
      { name: 'get_recommendations', keywords: ['recommend', 'suggest', 'best', 'popular'], confidence: 0 },
      { name: 'ask_question', keywords: ['what', 'how', 'when', 'why'], confidence: 0 },
      { name: 'complaint', keywords: ['problem', 'issue', 'wrong', 'bad'], confidence: 0 }
    ]

    const lowerMessage = message.toLowerCase()
    
    for (const intent of intents) {
      intent.confidence = intent.keywords.reduce((score, keyword) => {
        return lowerMessage.includes(keyword) ? score + 1 : score
      }, 0) / intent.keywords.length
    }

    return intents.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    )
  }

  private static async extractEntities(message: string): Promise<Entity[]> {
    const entities: Entity[] = []
    
    // Extract food items
    const menuItems = await this.getMenuItems()
    for (const item of menuItems) {
      if (message.toLowerCase().includes(item.name.toLowerCase())) {
        entities.push({
          type: 'food_item',
          value: item.name,
          id: item.id,
          confidence: 0.9
        })
      }
    }

    // Extract quantities
    const quantityMatch = message.match(/(\d+)\s*(cup|cups|serving|servings|order|orders)?/i)
    if (quantityMatch) {
      entities.push({
        type: 'quantity',
        value: parseInt(quantityMatch[1]),
        confidence: 0.8
      })
    }

    // Extract dietary preferences
    const dietary = ['vegetarian', 'vegan', 'spicy', 'mild', 'gluten-free']
    for (const diet of dietary) {
      if (message.toLowerCase().includes(diet)) {
        entities.push({
          type: 'dietary_preference',
          value: diet,
          confidence: 0.7
        })
      }
    }

    return entities
  }

  private static async generateResponse(
    intent: Intent, 
    entities: Entity[], 
    context: ConversationContext
  ): Promise<string> {
    switch (intent.name) {
      case 'order_food':
        return this.generateOrderResponse(entities, context)
      
      case 'track_order':
        return this.generateTrackingResponse(context)
      
      case 'get_recommendations':
        return this.generateRecommendationResponse(entities, context)
      
      case 'ask_question':
        return this.generateQuestionResponse(entities, context)
      
      default:
        return "I'm here to help with your corn orders! You can ask me to recommend dishes, track your order, or answer any questions about our menu."
    }
  }

  private static generateOrderResponse(entities: Entity[], context: ConversationContext): string {
    const foodItems = entities.filter(e => e.type === 'food_item')
    const quantity = entities.find(e => e.type === 'quantity')?.value || 1

    if (foodItems.length > 0) {
      const item = foodItems[0]
      return `Great choice! I can help you order ${quantity} ${item.value}${quantity > 1 ? 's' : ''}. Would you like to add it to your cart? The price is RM 8.90 each.`
    }

    return "I'd be happy to help you order! What corn dish are you in the mood for? We have classics like our CORNMAN Special Cup or something spicier like our Jalapeño Blast."
  }

  private static generateRecommendationResponse(entities: Entity[], context: ConversationContext): string {
    const dietary = entities.filter(e => e.type === 'dietary_preference')
    
    if (dietary.length > 0) {
      const pref = dietary[0].value
      return `Perfect! Based on your preference for ${pref} options, I'd recommend our ${this.getRecommendationForDietary(pref)}. It's one of our most popular ${pref} dishes!`
    }

    // Use context for personalized recommendations
    if (context.orderHistory?.length > 0) {
      return "Based on your previous orders, I think you'd love our new Truffle Parmesan Corn Cup - it's similar to what you usually order but with a gourmet twist!"
    }

    return "I'd love to recommend something perfect for you! Our CORNMAN Classic Cup is our most popular item - sweet corn with butter and cheese. For something spicier, try our Jalapeño Blast!"
  }
}
```

#### **Computer Vision for Food Recognition**
**Priority: LOW** | **Complexity: Very High**

```typescript
// /components/AI/FoodImageRecognition.tsx
interface RecognitionResult {
  dishName: string
  confidence: number
  ingredients: string[]
  nutritionEstimate: NutritionData
  similarMenuItems: MenuItem[]
  description: string
}

export function FoodImageUpload({ onRecognition }: { 
  onRecognition: (result: RecognitionResult) => void 
}) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (file: File) => {
    setIsProcessing(true)
    
    try {
      // Create preview
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)

      // Convert to base64 for API
      const base64 = await convertToBase64(file)
      
      // Send to computer vision API
      const response = await fetch('/api/ai/food-recognition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64,
          options: {
            includeNutrition: true,
            includeSimilarItems: true,
            confidence_threshold: 0.7
          }
        })
      })

      const result = await response.json()
      onRecognition(result)

    } catch (error) {
      console.error('Image recognition failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="material-icons text-neon-green">camera_alt</span>
        Find Similar Dishes
      </h3>
      
      <p className="text-neutral-400 text-sm mb-6">
        Upload a photo of corn food and I'll find similar items on our menu!
      </p>

      <div className="space-y-4">
        {previewUrl && (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Uploaded food" 
              className="w-full h-48 object-cover rounded-lg"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm">Analyzing image...</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            className="hidden"
          />
          
          <span className="material-icons text-4xl text-neutral-500 mb-4">
            cloud_upload
          </span>
          
          <p className="text-neutral-400 mb-4">
            Drag and drop an image here, or click to browse
          </p>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary"
            disabled={isProcessing}
          >
            Upload Image
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleCameraCapture()}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <span className="material-icons">camera_alt</span>
            Take Photo
          </button>
          
          <button
            onClick={() => handlePasteFromClipboard()}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <span className="material-icons">content_paste</span>
            Paste Image
          </button>
        </div>
      </div>
    </div>
  )
}

// Recognition Results Display
function RecognitionResults({ result }: { result: RecognitionResult }) {
  return (
    <div className="space-y-6">
      {/* Main Recognition */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center">
            <span className="material-icons text-neon-green text-2xl">restaurant</span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold">{result.dishName}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                result.confidence > 0.8 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {(result.confidence * 100).toFixed(0)}% match
              </span>
            </div>
            
            <p className="text-neutral-400 text-sm mb-4">{result.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {result.ingredients.map((ingredient, index) => (
                <span 
                  key={index}
                  className="text-xs px-2 py-1 bg-neutral-800 rounded-full"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition Estimate */}
      <div className="card p-6">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <span className="material-icons text-blue-400">local_dining</span>
          Estimated Nutrition
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NutritionItem 
            label="Calories" 
            value={result.nutritionEstimate.calories} 
            unit="kcal"
          />
          <NutritionItem 
            label="Protein" 
            value={result.nutritionEstimate.protein} 
            unit="g"
          />
          <NutritionItem 
            label="Carbs" 
            value={result.nutritionEstimate.carbohydrates} 
            unit="g"
          />
          <NutritionItem 
            label="Fat" 
            value={result.nutritionEstimate.fat} 
            unit="g"
          />
        </div>
      </div>

      {/* Similar Menu Items */}
      <div className="card p-6">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <span className="material-icons text-neon-green">restaurant_menu</span>
          Similar Items on Our Menu
        </h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          {result.similarMenuItems.map((item) => (
            <SimilarMenuItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Backend Computer Vision Service
export class FoodVisionService {
  static async recognizeFood(imageBase64: string): Promise<RecognitionResult> {
    try {
      // Use Google Vision API, AWS Rekognition, or custom ML model
      const visionResponse = await this.callVisionAPI(imageBase64)
      
      // Process vision results
      const recognizedItems = visionResponse.annotations
      const mainItem = recognizedItems[0] // Highest confidence item
      
      // Enrich with domain knowledge
      const enrichedResult = await this.enrichWithFoodKnowledge(mainItem)
      
      // Find similar menu items
      const similarItems = await this.findSimilarMenuItems(enrichedResult)
      
      return {
        dishName: enrichedResult.name,
        confidence: mainItem.confidence,
        ingredients: enrichedResult.ingredients,
        nutritionEstimate: enrichedResult.nutrition,
        similarMenuItems: similarItems,
        description: enrichedResult.description
      }
      
    } catch (error) {
      throw new Error(`Food recognition failed: ${error.message}`)
    }
  }

  private static async callVisionAPI(imageBase64: string) {
    // Example using Google Cloud Vision API
    const response = await fetch('https://vision.googleapis.com/v1/images:annotate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GOOGLE_CLOUD_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [{
          image: { content: imageBase64 },
          features: [
            { type: 'LABEL_DETECTION', maxResults: 10 },
            { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
            { type: 'TEXT_DETECTION' }
          ]
        }]
      })
    })

    return response.json()
  }

  private static async enrichWithFoodKnowledge(visionResult: any) {
    // Use food knowledge base to enrich basic vision results
    const foodDatabase = await this.getFoodDatabase()
    
    // Match vision labels with food database
    const matches = visionResult.labels.map(label => {
      return foodDatabase.find(food => 
        food.keywords.includes(label.description.toLowerCase())
      )
    }).filter(Boolean)

    // Return best match with enhanced data
    return matches[0] || this.generateGenericFoodInfo(visionResult)
  }

  private static async findSimilarMenuItems(recognizedFood: any): Promise<MenuItem[]> {
    // Vector similarity search in menu database
    const menuItems = await this.getMenuItemsWithEmbeddings()
    
    // Calculate similarity scores
    const similarities = menuItems.map(item => ({
      item,
      similarity: this.calculateFoodSimilarity(recognizedFood, item)
    }))

    // Return top matches
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 4)
      .map(s => s.item)
  }

  private static calculateFoodSimilarity(recognized: any, menuItem: MenuItem): number {
    let similarity = 0

    // Ingredient overlap
    const ingredientOverlap = this.calculateOverlap(
      recognized.ingredients, 
      menuItem.ingredients
    )
    similarity += ingredientOverlap * 0.4

    // Category similarity
    if (recognized.category === menuItem.category) {
      similarity += 0.3
    }

    // Cooking method similarity
    if (recognized.cookingMethod === menuItem.cookingMethod) {
      similarity += 0.2
    }

    // Flavor profile similarity
    const flavorSimilarity = this.calculateOverlap(
      recognized.flavorProfile,
      menuItem.flavorProfile
    )
    similarity += flavorSimilarity * 0.1

    return similarity
  }
}
```

---

## 🎯 IMMEDIATE ACTION PLAN

### 🚀 **Quick Implementation Priorities**

#### **Week 1-2: Foundation Enhancements**
```typescript
// Immediate tasks with code examples included above:

1. **Enhanced Authentication** ✅
   - Social login integration (Google, Facebook)
   - Two-factor authentication setup
   - Session management improvements

2. **Advanced Cart Features** ✅
   - Smart recommendations in cart
   - Save for later functionality
   - Cart synchronization across devices

3. **Payment System Upgrade** ✅
   - Multiple payment methods (Stripe, FPX, GrabPay)
   - Malaysian payment options
   - Dynamic pricing engine

4. **Real-time Order Tracking** ✅
   - GPS tracking integration
   - Live delivery maps
   - Driver location updates
```

#### **Week 3-4: Intelligence Layer**
```typescript
5. **AI Recommendation Engine** ✅
   - Machine learning food suggestions
   - Personalized menu filtering
   - Contextual recommendations

6. **Smart Search System** ✅
   - Natural language processing
   - Voice search capabilities
   - Intelligent auto-suggestions

7. **Advanced Loyalty Program** ✅
   - Tiered membership system
   - Dynamic challenges generation
   - Gamification elements
```

#### **Week 5-8: Analytics & Optimization**
```typescript
8. **Real-time Analytics Dashboard** ✅
   - Business intelligence metrics
   - Live order monitoring
   - Performance tracking

9. **A/B Testing Platform** ✅
   - Experiment management
   - Statistical significance testing
   - Automated optimization

10. **Predictive Analytics** ✅
    - Demand forecasting
    - Inventory optimization
    - Customer behavior prediction
```

#### **Week 9-12: Innovation Features**
```typescript
11. **AI Chatbot Assistant** ✅
    - Natural conversation flow
    - Order assistance
    - Customer support automation

12. **Computer Vision Integration** ✅
    - Food image recognition
    - Menu item matching
    - Nutrition estimation

13. **Advanced Personalization** ✅
    - Dynamic user interfaces
    - Contextual content delivery
    - Behavioral adaptation
```

### 📊 **Implementation Matrix**

| Feature Category | Priority | Complexity | Development Time | Business Impact |
|-----------------|----------|------------|------------------|-----------------|
| Enhanced Auth | 🔴 Critical | Medium | Week 1 | High |
| Payment System | 🔴 Critical | High | Week 1-2 | Very High |
| Real-time Tracking | 🔴 Critical | Very High | Week 2-3 | Very High |
| AI Recommendations | 🟡 High | Very High | Week 3-4 | High |
| Smart Search | 🟡 High | High | Week 3 | Medium |
| Advanced Loyalty | 🟡 High | Medium | Week 4 | High |
| Analytics Dashboard | 🟡 High | Very High | Week 5-6 | Very High |
| A/B Testing | 🟢 Medium | High | Week 7 | Medium |
| AI Chatbot | 🟢 Medium | Very High | Week 9-10 | Medium |
| Computer Vision | 🔵 Low | Very High | Week 11-12 | Low |

### 🛠️ **Technical Requirements**

#### **Infrastructure Needs:**
- Supabase Pro plan for advanced features
- CDN for global content delivery
- Redis for caching and real-time features
- ML/AI services (OpenAI, Google Cloud AI)
- Analytics services (Mixpanel, Amplitude)
- Payment gateways (Stripe, local Malaysian providers)

#### **Development Tools:**
- TypeScript for type safety
- Jest for testing
- Storybook for component documentation
- Sentry for error monitoring
- GitHub Actions for CI/CD

#### **Third-party Integrations:**
- Google Maps API for delivery tracking
- Weather API for contextual recommendations
- Social media APIs for sharing features
- Email service (SendGrid) for notifications
- SMS service for delivery updates

---

## 📈 **Success Metrics & KPIs**

### **Phase 1 Metrics:**
- User registration conversion: +25%
- Payment completion rate: +15%
- Order tracking engagement: +40%
- Customer satisfaction score: +20%

### **Phase 2 Metrics:**
- Recommendation click-through rate: +30%
- Search success rate: +50%
- Loyalty program engagement: +60%
- Average order value: +18%

### **Phase 3 Metrics:**
- Business intelligence adoption: 100%
- A/B test completion rate: +80%
- Predictive accuracy: >85%
- Operational efficiency: +25%

### **Phase 4 Metrics:**
- Chatbot resolution rate: >70%
- Computer vision accuracy: >90%
- Personalization effectiveness: +35%
- Innovation adoption rate: +45%

---

This comprehensive roadmap provides immediate, actionable development plans for transforming the THEFMSMKT food delivery application into a next-generation platform with cutting-edge features and industry-leading user experience.