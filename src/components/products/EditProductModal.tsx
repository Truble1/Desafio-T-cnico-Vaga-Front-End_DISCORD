'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Input,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Image,
  Switch,
} from '@heroui/react'
import { Upload, X } from 'lucide-react'
import { productSchema } from '@/lib/validations'
import { productsApi } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { useProductStore } from '@/stores/productStore'
import type { Product } from '@/types/api'

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
  onSuccess?: () => void
}

export default function EditProductModal({ isOpen, onClose, product, onSuccess }: EditProductModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isThumbnailLoading, setIsThumbnailLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const token = useAuthStore((state) => state.token)
  const updateProduct = useProductStore((state) => state.updateProduct)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product.title,
      description: product.description,
      status: product.status,
    },
  })

  useEffect(() => {
    if (product) {
      setValue('title', product.title)
      setValue('description', product.description)
      setValue('status', product.status)
      setPreviewUrl(product.thumbnail?.url || null)
    }
  }, [product, setValue])

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('Edit - File selected:', file.name, file.type, file.size)
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('root', { message: 'Por favor, selecione apenas arquivos de imagem' })
        return
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('root', { message: 'Arquivo muito grande. Máximo 5MB' })
        return
      }
      
      // Clean up previous preview URL if it's not the original product image
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
      
      setNewThumbnail(file)
      const url = URL.createObjectURL(file)
      console.log('Edit - Preview URL created:', url)
      setPreviewUrl(url)
    } else {
      console.log('Edit - No file selected')
    }
  }

  const handleRemoveFile = () => {
    console.log('Edit - Removing file preview')
    
    // Clean up blob URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    
    setNewThumbnail(null)
    setPreviewUrl(product.thumbnail?.url || null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleThumbnailUpdate = async () => {
    if (!token || !newThumbnail) return

    setIsThumbnailLoading(true)
    try {
      await productsApi.updateProductThumbnail(token, product.id, newThumbnail)
      setNewThumbnail(null)
      onSuccess?.()
    } catch (error: any) {
      setError('root', {
        message: error.response?.data?.message || 'Erro ao atualizar imagem',
      })
    } finally {
      setIsThumbnailLoading(false)
    }
  }

  const onSubmit = async (data: any) => {
    if (!token) return

    setIsLoading(true)
    try {
      await productsApi.updateProduct(token, product.id, data)

      // Update thumbnail if changed
      if (newThumbnail) {
        await productsApi.updateProductThumbnail(token, product.id, newThumbnail)
      }

      // Get updated product
      const updatedProduct = await productsApi.getProduct(token, product.id)
      updateProduct(updatedProduct.data)

      onSuccess?.()
      onClose()
    } catch (error: any) {
      setError('root', {
        message: error.response?.data?.message || 'Erro ao atualizar produto',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            <h2 className="text-xl font-semibold">Editar produto</h2>
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

            <Switch {...register('status')} defaultSelected={product.status}>
              Produto ativo
            </Switch>

            <div className="space-y-2">
              <label className="text-sm font-medium">Imagem do produto</label>
              
              {previewUrl ? (
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
                        console.error('Edit - Error loading preview image:', previewUrl)
                        setPreviewUrl(null)
                      }}
                      onLoad={() => {
                        console.log('Edit - Preview image loaded successfully')
                      }}
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    {newThumbnail && (
                      <Button
                        size="sm"
                        color="success"
                        variant="flat"
                        isLoading={isThumbnailLoading}
                        onPress={handleThumbnailUpdate}
                        className="bg-white/80 backdrop-blur-sm"
                      >
                        Salvar
                      </Button>
                    )}
                    <Button
                      isIconOnly
                      size="sm"
                      color="primary"
                      variant="flat"
                      onPress={() => fileInputRef.current?.click()}
                      className="bg-white/80 backdrop-blur-sm"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    {newThumbnail && (
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={handleRemoveFile}
                        className="bg-white/80 backdrop-blur-sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-default-300 rounded-lg p-8 text-center cursor-pointer hover:border-default-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-default-400 mb-2" />
                  <p className="text-sm text-default-500">
                    Clique para selecionar uma imagem
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {errors.root && (
              <p className="text-sm text-danger">{errors.root.message}</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancelar
            </Button>
            <Button type="submit" color="primary" isLoading={isLoading}>
              Salvar alterações
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}