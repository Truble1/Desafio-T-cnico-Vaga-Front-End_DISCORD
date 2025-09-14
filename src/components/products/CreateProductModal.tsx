'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Input,
  Textarea,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
} from '@heroui/react'
import { Upload, X } from 'lucide-react'
import { createProductSchema, type CreateProductInput } from '@/lib/validations'
import { productsApi } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { useProductStore } from '@/stores/productStore'

interface CreateProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function CreateProductModal({ isOpen, onClose, onSuccess }: CreateProductModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const token = useAuthStore((state) => state.token)
  const addProduct = useProductStore((state) => state.addProduct)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(createProductSchema),
  })

  const thumbnailFile = watch('thumbnail')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('File selected:', file.name, file.type, file.size)
      
      // Clean up previous URL to prevent memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('thumbnail', { message: 'Por favor, selecione apenas arquivos de imagem' })
        return
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('thumbnail', { message: 'Arquivo muito grande. Máximo 5MB' })
        return
      }
      
      setValue('thumbnail', e.target.files)
      const url = URL.createObjectURL(file)
      console.log('Preview URL created:', url)
      setPreviewUrl(url)
    } else {
      console.log('No file selected')
    }
  }

  const handleRemoveFile = () => {
    console.log('Removing file preview')
    
    // Clean up URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    
    setValue('thumbnail', undefined)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (data: any) => {
    if (!token) {
      console.error('❌ No token available for creating product')
      return
    }

    console.log('🚀 Starting product creation:', {
      title: data.title,
      description: data.description,
      hasThumbnail: !!data.thumbnail?.[0],
      thumbnailFile: data.thumbnail?.[0] ? {
        name: data.thumbnail[0].name,
        type: data.thumbnail[0].type,
        size: data.thumbnail[0].size
      } : null
    })

    if (!data.thumbnail?.[0]) {
      console.warn('⚠️ No thumbnail file selected')
      setError('thumbnail', { message: 'Por favor, selecione uma imagem para o produto' })
      return
    }

    setIsLoading(true)
    try {
      console.log('📤 Calling API to create product...')
      const response = await productsApi.createProduct(token, {
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail[0],
      })
      
      console.log('✅ Product created successfully:', response)

      // Get the created product
      if (response.id) {
        console.log('🔄 Fetching created product details...')
        const productResponse = await productsApi.getProduct(token, response.id)
        console.log('📦 Created product details:', productResponse.data)
        addProduct(productResponse.data)
      }

      reset()
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(null)
      onSuccess?.()
      onClose()
    } catch (error: any) {
      console.error('💥 Error creating product:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
      
      setError('root', {
        message: error.response?.data?.message || 'Erro ao criar produto. Verifique o console para mais detalhes.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    console.log('Closing modal, cleaning up resources')
    
    // Clean up URL to prevent memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    
    reset()
    setPreviewUrl(null)
    onClose()
  }

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            <h2 className="text-xl font-semibold">Criar novo produto</h2>
          </ModalHeader>
          <ModalBody className="space-y-4">
            <Input
              {...register('title')}
              label="Título"
              placeholder="Digite o título do produto"
              isInvalid={!!errors.title}
              errorMessage={errors.title?.message}
            />

            <Textarea
              {...register('description')}
              label="Descrição"
              placeholder="Digite a descrição do produto"
              rows={4}
              isInvalid={!!errors.description}
              errorMessage={errors.description?.message}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Imagem do produto</label>
              
              {!previewUrl ? (
                <div
                  className="border-2 border-dashed border-default-300 rounded-lg p-8 text-center cursor-pointer hover:border-default-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-default-400 mb-2" />
                  <p className="text-sm text-default-500">
                    Clique para selecionar uma imagem
                  </p>
                  <p className="text-xs text-default-400 mt-1">
                    PNG, JPG, JPEG ou WebP (máx. 5MB)
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <Image
                      src={previewUrl}
                      alt="Preview do produto"
                      className="w-full h-full object-cover"
                      classNames={{
                        wrapper: "w-full h-full",
                        img: "w-full h-full object-cover"
                      }}
                      loading="lazy"
                      onError={() => {
                        console.error('Error loading preview image')
                        setPreviewUrl(null)
                      }}
                      onLoad={() => {
                        console.log('Preview image loaded successfully')
                      }}
                    />
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    variant="flat"
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm"
                    onPress={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {errors.thumbnail && (
                <p className="text-sm text-danger">{errors.thumbnail.message?.toString()}</p>
              )}
            </div>

            {errors.root && (
              <p className="text-sm text-danger">{errors.root.message}</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" color="primary" isLoading={isLoading}>
              Criar produto
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}