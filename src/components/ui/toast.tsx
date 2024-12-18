// src/components/ui/toast.tsx
"use client"

import * as React from "react"
import { Card } from "./card"

interface ToastProps {
  title: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  onClose?: () => void
}

// Este componente renderiza una notificación individual con estilos según su tipo
export function Toast({ title, message, type = 'info', onClose }: ToastProps) {
  // Definimos colores según el tipo de notificación para mantener consistencia visual
  const styles = {
    success: 'border-green-500 bg-green-50',
    error: 'border-red-500 bg-red-50',
    warning: 'border-yellow-500 bg-yellow-50',
    info: 'border-blue-500 bg-blue-50'
  }

  // Iconos según el tipo (usando caracteres unicode por simplicidad)
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  return (
    <Card className={`${styles[type]} border-l-4 mb-2`}>
      <div className="p-4 flex items-start">
        <span className="mr-2">{icons[type]}</span>
        <div className="flex-1">
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </Card>
  )
}

// El contexto nos permitirá mostrar notificaciones desde cualquier parte de la aplicación
export const ToastContext = React.createContext<{
  showToast: (toast: Omit<ToastProps, 'onClose'>) => void
}>({
  showToast: () => {},
})

// Este proveedor maneja la lógica de mostrar y ocultar notificaciones
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: number })[]>([])
  let nextId = React.useRef(0)

  const showToast = React.useCallback((toast: Omit<ToastProps, 'onClose'>) => {
    const id = nextId.current++
    setToasts(current => [...current, { ...toast, id }])
    
    // Automáticamente remove la notificación después de 5 segundos
    setTimeout(() => {
      setToasts(current => current.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = React.useCallback((id: number) => {
    setToasts(current => current.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Contenedor de notificaciones en la esquina superior derecha */}
      <div className="fixed top-4 right-4 z-50 w-96 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Hook personalizado para usar las notificaciones fácilmente
export function useToast() {
  return React.useContext(ToastContext)
}