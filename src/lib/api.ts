import axios from 'axios'
import type { 
  AuthResponse, 
  ProductsResponse, 
  ProductResponse, 
  ApiResponse,
  User 
} from '@/types/api'
import type { LoginInput, RegisterInput } from '@/lib/validations'

const API_BASE_URL = 'https://api-teste-front-production.up.railway.app'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
})

// Auth API
export const authApi = {
  login: async (credentials: LoginInput): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials)
    return data
  },

  register: async (userData: RegisterInput): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/users', userData)
    return data
  },

  refreshToken: async (token: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/session', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return data
  },
}

// Products API
export const productsApi = {
  getProducts: async (
    token: string, 
    page = 1, 
    pageSize = 10, 
    filter?: string
  ): Promise<ProductsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })
    
    if (filter) {
      params.append('filter', filter)
    }
    
    const { data } = await api.get<ProductsResponse>(`/products?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return data
  },

  getProduct: async (token: string, id: string): Promise<ProductResponse> => {
    const { data } = await api.get<ProductResponse>(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return data
  },

  createProduct: async (
    token: string, 
    productData: { title: string; description: string; thumbnail: File }
  ): Promise<ApiResponse> => {
    const formData = new FormData()
    formData.append('title', productData.title)
    formData.append('description', productData.description)
    formData.append('thumbnail', productData.thumbnail)

    const { data } = await api.post<ApiResponse>('/products', formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    return data
  },

  updateProduct: async (
    token: string, 
    id: string, 
    productData: { title: string; description: string; status?: boolean }
  ): Promise<ApiResponse> => {
    const { data } = await api.put<ApiResponse>(`/products/${id}`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return data
  },

  updateProductThumbnail: async (
    token: string, 
    id: string, 
    thumbnail: File
  ): Promise<ApiResponse> => {
    const formData = new FormData()
    formData.append('thumbnail', thumbnail)

    const { data } = await api.patch<ApiResponse>(`/products/thumbnail/${id}`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    return data
  },

  deleteProduct: async (token: string, id: string): Promise<ApiResponse> => {
    const { data } = await api.delete<ApiResponse>(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return data
  },
}

export default api