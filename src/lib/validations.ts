import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  verifyPassword: z.string(),
  phone: z.object({
    country: z.string().min(1, 'Código do país é obrigatório'),
    ddd: z.string().min(2, 'DDD é obrigatório'),
    number: z.string().min(8, 'Número de telefone é obrigatório'),
  }),
}).refine((data) => data.password === data.verifyPassword, {
  message: "As senhas não coincidem",
  path: ["verifyPassword"],
})

// Product schemas
export const productSchema = z.object({
  title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  status: z.boolean().default(true),
})

export const createProductSchema = z.object({
  title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  status: z.boolean().default(true),
  thumbnail: z.any().refine((file) => file?.length == 1, 'Imagem é obrigatória')
    .refine((file) => file?.[0]?.size <= 5000000, 'Imagem deve ter no máximo 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file?.[0]?.type),
      'Apenas arquivos .jpg, .jpeg, .png e .webp são suportados.'
    ),
})

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
export type CreateProductInput = z.infer<typeof createProductSchema>