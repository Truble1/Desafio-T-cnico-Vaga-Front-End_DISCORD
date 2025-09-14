'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Card, CardBody, CardHeader } from '@heroui/react'
import { Eye, EyeOff } from 'lucide-react'
import { loginSchema, type LoginInput } from '@/lib/validations'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

export default function LoginForm() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const toggleVisibility = () => setIsVisible(!isVisible)

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    try {
      const response = await authApi.login(data)
      setAuth(response.user, response.token)
      router.push('/dashboard')
    } catch (error: any) {
      setError('root', {
        message: error.response?.data?.message || 'Erro ao fazer login',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-sm text-default-500">
          Entre com sua conta para acessar o sistema
        </p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register('email')}
            type="email"
            label="Email"
            placeholder="Digite seu email"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />

          <Input
            {...register('password')}
            label="Senha"
            placeholder="Digite sua senha"
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <EyeOff className="w-5 h-5 text-default-400" />
                ) : (
                  <Eye className="w-5 h-5 text-default-400" />
                )}
              </button>
            }
            type={isVisible ? 'text' : 'password'}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />

          {errors.root && (
            <p className="text-sm text-danger">{errors.root.message}</p>
          )}

          <Button
            type="submit"
            color="primary"
            isLoading={isLoading}
            className="w-full"
          >
            Entrar
          </Button>

          <div className="text-center">
            <Button
              variant="light"
              onPress={() => router.push('/register')}
              className="text-sm"
            >
              Não tem uma conta? Cadastre-se
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}