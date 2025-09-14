'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Image,
  Chip,
  Tooltip,
  Pagination,
  Input,
  useDisclosure,
} from '@heroui/react'
import { Edit, Trash2, Search, Plus } from 'lucide-react'
import { productsApi } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { useProductStore } from '@/stores/productStore'
import type { Product } from '@/types/api'
import CreateProductModal from './CreateProductModal'
import EditProductModal from '@/components/products/EditProductModal'

export default function ProductTable() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const token = useAuthStore((state) => state.token)
  const { products, loading, setProducts, setLoading, removeProduct } = useProductStore()

  const createModal = useDisclosure()
  const editModal = useDisclosure()

  const fetchProducts = async () => {
    if (!token) return

    setLoading(true)
    try {
      // Get basic product list
      const response = await productsApi.getProducts(token, page, 10, search)
      
      // Fetch detailed info with thumbnails for each product
      const productsWithThumbnails = await Promise.all(
        response.data.map(async (product) => {
          try {
            const detailResponse = await productsApi.getProduct(token, product.id)
            return detailResponse.data
          } catch (error) {
            console.warn(`Failed to fetch details for product ${product.id}:`, error)
            return product // Return original if detail fetch fails
          }
        })
      )
      
      setProducts(productsWithThumbnails)
      
    } catch (error: any) {
      console.error('Error fetching products:', error)
      
      if (error.response?.status === 401) {
        console.warn('Token may be expired, consider re-login')
      }
      
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page, token]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    setPage(1)
    fetchProducts()
  }

  const handleDelete = async (id: string) => {
    if (!token) return
    if (!confirm('Tem certeza que deseja deletar este produto?')) return

    try {
      await productsApi.deleteProduct(token, id)
      removeProduct(id)
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    editModal.onOpen()
  }

  const handleEditClose = () => {
    setSelectedProduct(null)
    editModal.onClose()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Input
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            startContent={<Search className="w-4 h-4 text-default-400" />}
          />
          <Button color="primary" onPress={handleSearch}>
            Buscar
          </Button>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={createModal.onOpen}
        >
          Novo Produto
        </Button>
      </div>

      <Table aria-label="Tabela de produtos">
        <TableHeader>
          <TableColumn>IMAGEM</TableColumn>
          <TableColumn>TÍTULO</TableColumn>
          <TableColumn>DESCRIÇÃO</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ATUALIZADO</TableColumn>
          <TableColumn>AÇÕES</TableColumn>
        </TableHeader>
        <TableBody
          items={products}
          isLoading={loading}
          emptyContent={
            !token 
              ? "Faça login para ver seus produtos"
              : loading 
              ? "Carregando produtos..." 
              : "Nenhum produto encontrado. Clique em 'Novo Produto' para criar seu primeiro produto!"
          }
        >
          {(product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center justify-center">
                  {product.thumbnail?.url ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={product.thumbnail.url}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        classNames={{
                          wrapper: "w-full h-full",
                          img: "w-full h-full object-cover"
                        }}
                        loading="lazy"
                        onError={() => {
                          // Silent error handling
                        }}
                        onLoad={() => {
                          // Silent success
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-default-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-default-500 text-center px-1">
                        Sem<br/>imagem
                      </span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-semibold">{product.title}</div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs truncate">{product.description}</div>
              </TableCell>
              <TableCell>
                <Chip color={product.status ? 'success' : 'danger'} size="sm">
                  {product.status ? 'Ativo' : 'Inativo'}
                </Chip>
              </TableCell>
              <TableCell>
                {new Date(product.updatedAt).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Tooltip content="Editar">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="primary"
                      onPress={() => handleEdit(product)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Deletar">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="danger"
                      onPress={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CreateProductModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        onSuccess={fetchProducts}
      />

      {selectedProduct && (
        <EditProductModal
          isOpen={editModal.isOpen}
          onClose={handleEditClose}
          product={selectedProduct}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  )
}