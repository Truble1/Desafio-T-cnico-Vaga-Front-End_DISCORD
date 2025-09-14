// API types based on the documentation

export interface User {
  phone: {
    country: string
    ddd: string
    number: string
  }
  avatar: Array<{
    id: string
    url: string
  }>
  number: string
  email: string
  platformRole: "USER"
  status: "ACTIVE"
  name: string
  id: string
  emailStatus: "VERIFIED"
  createdAt: string
  updatedAt: string
  street: string
  complement: string
  district: string
  city: string
  state: string
  country: string
  zip: string
  renewalsNumber: number
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Product {
  id: string
  title: string
  description: string
  status: boolean
  updatedAt: string
  thumbnail?: {
    id: string
    userId: string
    createdAt: string
    updatedAt: string
    url: string
    size: number
    originalName: string
    mimeType: string
    key: string
    idModule: string
  }
  userId?: string
  idThumbnail?: string
  createdAt?: string
}

export interface ProductsResponse {
  data: Product[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface ProductResponse {
  data: Product
}

export interface ApiResponse {
  codeIntern: string
  message: string
  id?: string
}