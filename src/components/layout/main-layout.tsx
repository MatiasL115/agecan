// src/components/layout/main-layout.tsx
"use client"

import React from 'react'
import { Card } from "@/components/ui/card"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MainLayout({ children }: { children: React.ReactNode }) {
  // Usamos usePathname para saber en qué página estamos y resaltar la navegación correspondiente
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegación principal */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo y nombre del sistema */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">Agecan</span>
            </Link>

            {/* Enlaces de navegación principales */}
            <div className="hidden md:flex space-x-6">
              <NavLink 
                href="/appointments"
                isActive={pathname === '/appointments'}
              >
                Agendar Cita
              </NavLink>
              <NavLink 
                href="/waitlist"
                isActive={pathname === '/waitlist'}
              >
                Lista de Espera
              </NavLink>
              <NavLink 
                href="/my-appointments"
                isActive={pathname === '/my-appointments'}
              >
                Mis Citas
              </NavLink>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Pie de página */}
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2024 Agecan - Sistema de Agendamiento Hospitalario
          </p>
        </div>
      </footer>
    </div>
  )
}

// Componente auxiliar para los enlaces de navegación
function NavLink({ 
  href, 
  isActive, 
  children 
}: { 
  href: string
  isActive: boolean
  children: React.ReactNode 
}) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium hover:text-primary transition-colors ${
        isActive ? 'text-primary' : 'text-gray-600'
      }`}
    >
      {children}
    </Link>
  )
}