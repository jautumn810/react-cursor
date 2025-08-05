import { useState, useCallback } from 'react'

interface ApiResponse<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
}

export function useApi<T = any>() {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    loading: false,
    error: null
  })

  const fetchData = useCallback(async (url: string, options: ApiOptions = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setState({ data, loading: false, error: null })
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    fetchData,
    reset
  }
}

// Specific API hooks
export function useProducts() {
  const api = useApi<{
    products: any[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }>()

  const fetchProducts = useCallback(async (params: {
    page?: number
    limit?: number
    search?: string
    category?: string
    sortBy?: string
    minPrice?: string
    maxPrice?: string
  } = {}) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    return api.fetchData(`/api/products?${searchParams.toString()}`)
  }, [api.fetchData])

  return {
    ...api,
    fetchProducts
  }
}

export function useProduct() {
  const api = useApi<{
    product: any
    reviews: any[]
  }>()

  const fetchProduct = useCallback(async (id: string) => {
    return api.fetchData(`/api/products/${id}`)
  }, [api.fetchData])

  return {
    ...api,
    fetchProduct
  }
}

export function useCategories() {
  const api = useApi<any[]>()

  const fetchCategories = useCallback(async () => {
    return api.fetchData('/api/categories')
  }, [api.fetchData])

  return {
    ...api,
    fetchCategories
  }
}

export function useCart() {
  const api = useApi<any[]>()

  const fetchCart = useCallback(async () => {
    return api.fetchData('/api/cart')
  }, [api.fetchData])

  const addToCart = useCallback(async (data: {
    productId: string
    quantity: number
    size?: string
    color?: string
  }) => {
    return api.fetchData('/api/cart', {
      method: 'POST',
      body: data
    })
  }, [api.fetchData])

  const updateCartItem = useCallback(async (data: {
    productId: string
    quantity: number
    size?: string
    color?: string
  }) => {
    return api.fetchData('/api/cart', {
      method: 'PUT',
      body: data
    })
  }, [api.fetchData])

  const removeFromCart = useCallback(async (data: {
    productId: string
    size?: string
    color?: string
  }) => {
    return api.fetchData('/api/cart', {
      method: 'DELETE',
      body: data
    })
  }, [api.fetchData])

  return {
    ...api,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart
  }
}

export function useOrders() {
  const api = useApi<{
    message: string
    order: any
  }>()

  const createOrder = useCallback(async (data: {
    shippingAddress: any
    paymentInfo: any
    shippingMethod: string
    items: any[]
  }) => {
    return api.fetchData('/api/orders', {
      method: 'POST',
      body: data
    })
  }, [api.fetchData])

  const fetchOrders = useCallback(async (params: {
    page?: number
    limit?: number
  } = {}) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })

    return api.fetchData(`/api/orders?${searchParams.toString()}`)
  }, [api.fetchData])

  return {
    ...api,
    createOrder,
    fetchOrders
  }
} 