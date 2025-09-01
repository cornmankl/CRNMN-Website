import { supabase } from './supabase/client'
import { projectId, publicAnonKey } from './supabase/info'

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-81d654e2`

// Get auth headers
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || publicAnonKey}`
  }
}

export const api = {
  // Auth
  signUp: async (userData: any) => {
    const response = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(userData)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Signup failed')
    }
    return response.json()
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE}/profile`, {
      headers: await getAuthHeaders()
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch profile')
    }
    return response.json()
  },

  // Orders
  createOrder: async (orderData: any) => {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(orderData)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create order')
    }
    return response.json()
  },

  getOrder: async (orderId: string) => {
    const response = await fetch(`${API_BASE}/orders/${orderId}`, {
      headers: await getAuthHeaders()
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch order')
    }
    return response.json()
  },

  getOrderHistory: async () => {
    const response = await fetch(`${API_BASE}/orders`, {
      headers: await getAuthHeaders()
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch order history')
    }
    return response.json()
  },

  // Delivery
  getDeliveryEstimate: async (location: any) => {
    const response = await fetch(`${API_BASE}/delivery-estimate`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(location)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get delivery estimate')
    }
    return response.json()
  },

  // Payment
  processPayment: async (paymentData: any) => {
    const response = await fetch(`${API_BASE}/process-payment`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(paymentData)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Payment failed')
    }
    return response.json()
  }
}