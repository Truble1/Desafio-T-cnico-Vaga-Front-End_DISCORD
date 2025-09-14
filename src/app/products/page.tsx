'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import ProductTable from '@/components/products/ProductTable'

export default function ProductsPage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gerenciar Produtos</h1>
          <p className="text-default-500">
            Crie, edite e gerencie seus produtos
          </p>
        </div>

        <ProductTable />
      </div>
    </div>
  )
}