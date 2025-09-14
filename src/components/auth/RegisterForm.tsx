'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Card, CardBody, CardHeader } from '@heroui/react'
import { Eye, EyeOff } from 'lucide-react'
import { registerSchema, type RegisterInput } from '@/lib/validations'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

export default function RegisterForm() {
  const [isVisible, setIsVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const toggleVisibility = () => setIsVisible(!isVisible)
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible)

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    try {
      const response = await authApi.register(data)
      if (response.token && response.user) {
        setAuth(response.user, response.token)
        router.push('/dashboard')
      } else {
        // Registration successful but need to login
        router.push('/login')
      }
    } catch (error: any) {
      setError('root', {
        message: error.response?.data?.message || 'Erro ao criar conta',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Cadastro</h1>
        <p className="text-sm text-default-500">
          Crie sua conta para acessar o sistema
        </p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register('name')}
            label="Nome completo"
            placeholder="Digite seu nome"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
          />

          <Input
            {...register('email')}
            type="email"
            label="Email"
            placeholder="Digite seu email"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />

          <div className="grid grid-cols-3 gap-2">
            <Input
              {...register('phone.country')}
              label="País"
              placeholder="+55"
              isInvalid={!!errors.phone?.country}
              errorMessage={errors.phone?.country?.message}
            />
            <Input
              {...register('phone.ddd')}
              label="DDD"
              placeholder="11"
              isInvalid={!!errors.phone?.ddd}
              errorMessage={errors.phone?.ddd?.message}
            />
            <Input
              {...register('phone.number')}
              label="Número"
              placeholder="999999999"
              isInvalid={!!errors.phone?.number}
              errorMessage={errors.phone?.number?.message}
            />
          </div>

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

          <Input
            {...register('verifyPassword')}
            label="Confirmar senha"
            placeholder="Confirme sua senha"
            endContent={
              <button type="button" onClick={toggleConfirmVisibility}>
                {isConfirmVisible ? (
                  <EyeOff className="w-5 h-5 text-default-400" />
                ) : (
                  <Eye className="w-5 h-5 text-default-400" />
                )}
              </button>
            }
            type={isConfirmVisible ? 'text' : 'password'}
            isInvalid={!!errors.verifyPassword}
            errorMessage={errors.verifyPassword?.message}
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
            Criar conta
          </Button>

          <div className="text-center">
            <Button
              variant="light"
              onPress={() => router.push('/login')}
              className="text-sm"
            >
              Já tem uma conta? Faça login
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}