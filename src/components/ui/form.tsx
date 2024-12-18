// src/components/ui/form.tsx
import * as React from "react"
import { Input } from "./input"

// Componente para campos de formulario con label y mensajes de error
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helper?: string
}

export function FormField({ label, error, helper, className = "", ...props }: FormFieldProps) {
  // Generamos un ID único para mantener la accesibilidad
  const id = React.useId()
  
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <Input
        id={id}
        className={`w-full ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

// Componente para agrupar campos de formulario
export function FormGroup({ children, title }: { children: React.ReactNode, title?: string }) {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      {title && (
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      )}
      {children}
    </div>
  )
}

// Componente para el pie del formulario (botones de acción)
export function FormActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
      {children}
    </div>
  )
}