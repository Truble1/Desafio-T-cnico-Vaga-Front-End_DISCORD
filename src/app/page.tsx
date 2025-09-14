'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@heroui/react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">
          Sistema CRUD de Produtos
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Gerencie seus produtos com facilidade
        </p>
        
        <div className="flex gap-6 justify-center">
          <Button
            color="primary"
            size="lg"
            onClick={() => {
              window.location.href = '/login'
            }}
          >
            Fazer Login
          </Button>
          
          <Button
            color="secondary"
            variant="bordered"
            size="lg"
            onClick={() => {
              window.location.href = '/register'
            }}
          >
            Criar Conta
          </Button>
        </div>
        
        <div className="mt-8 flex gap-4 justify-center">
          <Button
            color="warning"
            variant="light"
            size="sm"
            onClick={() => {
              window.location.href = '/test-api'
            }}
          >
            🔧 Testar API
          </Button>
          
          <Button
            color="danger"
            variant="light"
            size="sm"
            onClick={() => {
              window.location.href = '/debug-products'
            }}
          >
            🔍 Debug Produtos
          </Button>
        </div>
      </div>
    </main>
  )
}