'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from '@heroui/react'
import { ShoppingBag, BarChart3, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, clearAuth } = useAuthStore()

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  return (
    <Navbar maxWidth="xl" className="border-b border-divider">
      <NavbarBrand>
        <ShoppingBag className="w-6 h-6 mr-2" />
        <p className="font-bold text-inherit">CRUD Discord</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathname === '/dashboard'}>
          <Button
            variant={pathname === '/dashboard' ? 'solid' : 'light'}
            color={pathname === '/dashboard' ? 'primary' : 'default'}
            startContent={<BarChart3 className="w-4 h-4" />}
            onPress={() => router.push('/dashboard')}
          >
            Dashboard
          </Button>
        </NavbarItem>
        <NavbarItem isActive={pathname === '/products'}>
          <Button
            variant={pathname === '/products' ? 'solid' : 'light'}
            color={pathname === '/products' ? 'primary' : 'default'}
            startContent={<ShoppingBag className="w-4 h-4" />}
            onPress={() => router.push('/products')}
          >
            Produtos
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              size="sm"
              src={undefined}  // Removido para não usar imagem incorreta
              name={user?.name}
              showFallback
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Logado como</p>
              <p className="font-semibold">{user?.email}</p>
            </DropdownItem>
            <DropdownItem key="settings" startContent={<User className="w-4 h-4" />}>
              Meu Perfil
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              startContent={<LogOut className="w-4 h-4" />}
              onPress={handleLogout}
            >
              Sair
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  )
}