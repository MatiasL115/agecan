// src/app/medications/page.tsx
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form"
import { useToast } from "@/components/ui/toast"

// Definimos la estructura clara de los datos de medicamentos para mantener consistencia
interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  nextRefill: string
  daysRemaining: number
  instructions: string
  status: 'active' | 'completed' | 'paused'
  doctor: string
  specialty: string
}

// Datos de ejemplo que representan medicamentos existentes
const sampleMedications: Medication[] = [
  {
    id: '1',
    name: 'Enalapril',
    dosage: '10mg',
    frequency: '1 vez al día',
    startDate: '2024-11-01',
    endDate: '2025-01-01',
    nextRefill: '2024-12-15',
    daysRemaining: 10,
    instructions: 'Tomar en ayunas',
    status: 'active',
    doctor: 'Dra. María González',
    specialty: 'Cardiología'
  }
]

export default function MedicationsPage() {
  // Estado para controlar el filtrado de medicamentos
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('active')
  const { showToast } = useToast()

  // Función para filtrar medicamentos según el estado seleccionado
  const filteredMedications = sampleMedications.filter(med => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'active') return med.status === 'active'
    return med.status === 'completed'
  })

  // Función mejorada para calcular el progreso del tratamiento de manera consistente
  const calculateProgress = (medication: Medication) => {
    if (!medication.endDate) return 100
    
    const start = new Date(medication.startDate).getTime()
    const end = new Date(medication.endDate).getTime()
    // Usamos una fecha fija para evitar diferencias entre servidor y cliente
    const current = new Date(new Date().toISOString().split('T')[0]).getTime()
    
    const progress = Math.floor(((current - start) / (end - start)) * 100)
    return Math.min(Math.max(progress, 0), 100)
  }

  // Función para formatear fechas de manera consistente
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return new Date(dateStr).toLocaleDateString('es-ES', options)
  }

  return (
    <div className="space-y-6">
      {/* Panel de resumen con estadísticas clave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                💊
              </div>
              <div>
                <p className="text-sm text-gray-600">Medicamentos Activos</p>
                <p className="text-2xl font-bold">
                  {sampleMedications.filter(m => m.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                ⏰
              </div>
              <div>
                <p className="text-sm text-gray-600">Próximas Renovaciones</p>
                <p className="text-2xl font-bold">
                  {sampleMedications.filter(m => m.daysRemaining <= 10).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                ✓
              </div>
              <div>
                <p className="text-sm text-gray-600">Tratamientos Completados</p>
                <p className="text-2xl font-bold">
                  {sampleMedications.filter(m => m.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de filtrado y acción principal */}
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
          >
            Todos
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('active')}
          >
            Activos
          </Button>
          <Button
            variant={filterStatus === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('completed')}
          >
            Completados
          </Button>
        </div>
        <Button className="flex items-center">
          Agregar Medicamento
        </Button>
      </div>

      {/* Lista de medicamentos con detalles */}
      <div className="space-y-4">
        {filteredMedications.map(medication => (
          <Card key={medication.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Encabezado del medicamento */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{medication.name}</h3>
                    <p className="text-sm text-gray-600">
                      {medication.dosage} - {medication.frequency}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    medication.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {medication.status === 'active' ? 'Activo' : 'Completado'}
                  </span>
                </div>

                {/* Información del tratamiento */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Inicio del tratamiento</p>
                    <p className="font-medium">{formatDate(medication.startDate)}</p>
                  </div>
                  {medication.endDate && (
                    <div>
                      <p className="text-sm text-gray-600">Fin del tratamiento</p>
                      <p className="font-medium">{formatDate(medication.endDate)}</p>
                    </div>
                  )}
                </div>

                {/* Barra de progreso */}
                {medication.endDate && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progreso del tratamiento</span>
                      <span>{calculateProgress(medication)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ 
                          width: `${calculateProgress(medication)}%` 
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Instrucciones y detalles médicos */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Instrucciones: </span>
                      {medication.instructions}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Médico tratante: </span>
                      {medication.doctor} - {medication.specialty}
                    </p>
                  </div>
                </div>

                {/* Sección de renovación y acciones */}
                {medication.status === 'active' && (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Próxima renovación</p>
                      <p className="font-medium">
                        {formatDate(medication.nextRefill)} ({medication.daysRemaining} días)
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline">
                        Editar
                      </Button>
                      <Button>
                        Renovar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}