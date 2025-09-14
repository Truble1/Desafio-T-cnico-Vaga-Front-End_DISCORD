'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@heroui/react'
import Link from 'next/link'
import Image from 'next/image'
import { productsApi } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

export default function DebugProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)

  const fetchProducts = useCallback(async () => {
    if (!token) {
      setError('❌ Token não encontrado - faça login primeiro')
      return
    }

    setLoading(true)
    setError(null)
    try {
      console.log('🔄 Buscando produtos...')
      const response = await productsApi.getProducts(token, 1, 10)
      console.log('📦 Resposta da API:', response)
      setProducts(response.data || [])
      setError(null)
    } catch (err: any) {
      console.error('💥 Erro ao buscar produtos:', err)
      setError(`❌ Erro: ${err.message} (Status: ${err.response?.status})`)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      fetchProducts()
    }
  }, [token, fetchProducts])

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Debug de Produtos</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Info do usuário */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">👤 Usuário Logado</h2>
            <div className="space-y-2 font-mono text-sm">
              <div><strong>Nome:</strong> {user?.name || 'N/A'}</div>
              <div><strong>Email:</strong> {user?.email || 'N/A'}</div>
              <div><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'N/A'}</div>
            </div>
          </div>

          {/* Controles */}
          <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">🎮 Controles</h2>
            <div className="space-y-4">
              <Button 
                color="primary" 
                onClick={fetchProducts}
                isLoading={loading}
                className="w-full"
              >
                {loading ? 'Carregando...' : '🔄 Buscar Produtos'}
              </Button>
              
              {error && (
                <div className="bg-red-100 dark:bg-red-900 p-3 rounded text-red-800 dark:text-red-200">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de produtos */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">📋 Produtos Encontrados: {products.length}</h2>
          
          {products.length === 0 && !loading && (
            <div className="bg-yellow-100 dark:bg-yellow-900 p-6 rounded-lg text-center">
              <p className="text-lg">📭 Nenhum produto encontrado</p>
              <p className="text-sm mt-2">Certifique-se de ter criado produtos ou verifique se está logado na conta correta.</p>
            </div>
          )}

          <div className="space-y-6">
            {products.map((product, index) => (
              <div key={product.id || index} className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                <h3 className="text-xl font-bold mb-4">
                  📦 Produto #{index + 1}: {product.title || 'Sem título'}
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Dados básicos */}
                  <div>
                    <h4 className="font-bold mb-2">ℹ️ Dados Básicos</h4>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded font-mono text-sm space-y-1">
                      <div><strong>ID:</strong> {product.id}</div>
                      <div><strong>Título:</strong> {product.title}</div>
                      <div><strong>Descrição:</strong> {product.description}</div>
                      <div><strong>Status:</strong> {product.status ? '✅ Ativo' : '❌ Inativo'}</div>
                      <div><strong>Criado:</strong> {product.createdAt}</div>
                      <div><strong>Atualizado:</strong> {product.updatedAt}</div>
                    </div>
                  </div>

                  {/* Dados da thumbnail */}
                  <div>
                    <h4 className="font-bold mb-2">🖼️ Thumbnail</h4>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded font-mono text-sm">
                      {product.thumbnail ? (
                        <div className="space-y-1">
                          <div><strong>✅ Tem thumbnail:</strong> Sim</div>
                          <div><strong>ID:</strong> {product.thumbnail.id}</div>
                          <div><strong>URL:</strong> 
                            <br/>
                            <a 
                              href={product.thumbnail.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline break-all"
                            >
                              {product.thumbnail.url}
                            </a>
                          </div>
                          <div><strong>Nome original:</strong> {product.thumbnail.originalName}</div>
                          <div><strong>Tipo:</strong> {product.thumbnail.mimeType}</div>
                          <div><strong>Tamanho:</strong> {product.thumbnail.size} bytes</div>
                          
                          {/* Preview da imagem */}
                          <div className="mt-4">
                            <strong>🖼️ Preview:</strong>
                            <div className="mt-2 w-32 h-32 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center relative">
                              <Image 
                                src={product.thumbnail.url} 
                                alt={product.title}
                                fill
                                className="object-contain rounded"
                                onLoad={() => console.log('✅ Preview carregou:', product.title)}
                                onError={() => console.log('❌ Erro no preview:', product.title)}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>❌ <strong>Sem thumbnail</strong></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Link para voltar */}
        <div className="mt-8">
          <Link 
            href="/products"
            className="text-blue-500 hover:underline"
          >
            ← Voltar para Gerenciar Produtos
          </Link>
        </div>
      </div>
    </div>
  )
}