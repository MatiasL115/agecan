// src/components/waitlist/base-form.tsx
"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Esta interfaz define los campos básicos que cualquier formulario de lista de espera necesitará
export interface BaseWaitlistFormData {
  patientName: string
  contactInfo: {
    phone?: string
    email?: string
  }
  preferredTimeRanges: {
    startTime: string
    endTime: string
  }[]
  notes: string
}

interface BaseFormProps {
  data: BaseWaitlistFormData
  onChange: (data: BaseWaitlistFormData) => void
  onSubmit: () => void
  isLoading?: boolean
}

export function BaseWaitlistForm({ data, onChange, onSubmit, isLoading }: BaseFormProps) {
  const updateField = (field: keyof BaseWaitlistFormData, value: any) => {
    onChange({
      ...data,
      [field]: value
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de contacto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre completo
          </label>
          <input
            type="text"
            value={data.patientName}
            onChange={e => updateField('patientName', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="tel"
              value={data.contactInfo.phone || ''}
              onChange={e => updateField('contactInfo', {
                ...data.contactInfo,
                phone: e.target.value
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={data.contactInfo.email || ''}
              onChange={e => updateField('contactInfo', {
                ...data.contactInfo,
                email: e.target.value
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Horarios preferidos
          </label>
          {data.preferredTimeRanges.map((range, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-xs text-gray-500">Desde</label>
                <input
                  type="time"
                  value={range.startTime}
                  onChange={e => {
                    const newRanges = [...data.preferredTimeRanges]
                    newRanges[index].startTime = e.target.value
                    updateField('preferredTimeRanges', newRanges)
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Hasta</label>
                <input
                  type="time"
                  value={range.endTime}
                  onChange={e => {
                    const newRanges = [...data.preferredTimeRanges]
                    newRanges[index].endTime = e.target.value
                    updateField('preferredTimeRanges', newRanges)
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={() => updateField('preferredTimeRanges', [
              ...data.preferredTimeRanges,
              { startTime: '', endTime: '' }
            ])}
          >
            Agregar otro horario
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notas adicionales
          </label>
          <textarea
            value={data.notes}
            onChange={e => updateField('notes', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={3}
            placeholder="Información adicional que pueda ser relevante..."
          />
        </div>

        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Procesando...' : 'Enviar solicitud'}
        </Button>
      </CardContent>
    </Card>
  )
}