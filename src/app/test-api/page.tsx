'use client'

import { useState } from 'react'
import { Button } from '@heroui/react'
import api from '@/lib/api'

export default function TestApiPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult('Testando conexão...')
    
    try {
      // Teste 1: Healthcheck
      console.log('Testando healthcheck...')
      const healthResponse = await api.get('/healthcheck', { timeout: 10000 })
      setResult(`✅ Healthcheck OK: ${JSON.stringify(healthResponse.data)}`)
      
    } catch (error: any) {
      console.error('Erro no teste:', error)
      
      if (error.code === 'ECONNABORTED') {
        setResult('❌ TIMEOUT - Servidor não responde em 10s')
      } else if (error.response) {
        setResult(`❌ Erro HTTP ${error.response.status}: ${error.response.statusText}`)
      } else if (error.request) {
        setResult('❌ Sem resposta do servidor (problema de rede)')
      } else {
        setResult(`❌ Erro: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const testBaseUrl = async () => {
    setLoading(true)
    setResult('Testando URL base...')
    
    try {
      console.log('Testando URL base...')
      const response = await api.get('/', { timeout: 10000 })
      setResult(`✅ Base URL OK: Status ${response.status}`)
      
    } catch (error: any) {
      console.error('Erro no teste base:', error)
      
      if (error.code === 'ECONNABORTED') {
        setResult('❌ TIMEOUT - Servidor não responde em 10s')
      } else if (error.response) {
        setResult(`❌ Erro HTTP ${error.response.status}: ${error.response.statusText}`)
      } else if (error.request) {
        setResult('❌ Sem resposta do servidor')
      } else {
        setResult(`❌ Erro: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teste de API</h1>
        
        <div className="flex gap-4 mb-8">
          <Button
            color="primary"
            onClick={testConnection}
            isDisabled={loading}
          >
            Testar Healthcheck
          </Button>
          
          <Button
            color="secondary"
            onClick={testBaseUrl}
            isDisabled={loading}
          >
            Testar URL Base
          </Button>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg min-h-[200px]">
          <h3 className="font-bold mb-2">Resultado:</h3>
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {loading ? 'Testando...' : result || 'Clique em um botão para testar'}
          </pre>
        </div>
        
        <div className="mt-4">
          <a 
            href="/"
            className="text-blue-500 hover:underline"
          >
            ← Voltar para Home
          </a>
        </div>
      </div>
    </div>
  )
}