// src/app/dashboard/page.tsx
"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Esta interfaz define la estructura de una cita médica
interface Appointment {
  id: string
  doctorName: string
  specialty: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed'
}

// Esta interfaz define la estructura de un medicamento
interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  nextRefill: string
  daysRemaining: number
}

export default function DashboardPage() {
  // En una implementación real, estos datos vendrían de una API
  const upcomingAppointments: Appointment[] = [
    {
      id: '1',
      doctorName: 'Dra. María González',
      specialty: 'Cardiología',
      date: '2024-12-10',
      time: '14:30',
      status: 'confirmed'
    },
    {
      id: '2',
      doctorName: 'Dr. Juan Pérez',
      specialty: 'Traumatología',
      date: '2024-12-15',
      time: '10:00',
      status: 'pending'
    }
  ]

  const medications: Medication[] = [
    {
      id: '1',
      name: 'Enalapril',
      dosage: '10mg',
      frequency: '1 vez al día',
      nextRefill: '2024-12-15',
      daysRemaining: 10
    }
  ]

  // Función para formatear fechas de manera amigable
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Sección de bienvenida y acciones rápidas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold mb-4">Bienvenido, Juan</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-24 text-lg">
            Nueva Cita
          </Button>
          <Button variant="outline" className="h-24 text-lg">
            Ver Mis Medicamentos
          </Button>
          <Button variant="outline" className="h-24 text-lg">
            Gestionar Familia
          </Button>
        </div>
      </div>

      {/* Grid principal de información */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Próximas citas */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map(appointment => (
                <div 
                  key={appointment.id} 
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{appointment.doctorName}</h3>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(appointment.date)} - {appointment.time}
                  </p>
                </div>
              ))}
              {upcomingAppointments.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No tienes citas programadas
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medicamentos activos */}
        <Card>
          <CardHeader>
            <CardTitle>Medicamentos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medications.map(medication => (
                <div 
                  key={medication.id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{medication.name}</h3>
                      <p className="text-sm text-gray-600">
                        {medication.dosage} - {medication.frequency}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Próxima renovación: {medication.nextRefill}</span>
                      <span>{medication.daysRemaining} días restantes</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(medication.daysRemaining / 30) * 100}%` }}
                      />
                    </div>
                  </div>

                  {medication.daysRemaining <= 10 && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-3"
                    >
                      Programar renovación
                    </Button>
                  )}
                </div>
              ))}
              {medications.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No tienes medicamentos activos
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Historial Familiar */}
        <Card>
          <CardHeader>
            <CardTitle>Familia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Ana Pérez</p>
                  <p className="text-sm text-gray-600">Hija - 12 años</p>
                </div>
                <Button variant="outline" size="sm">Ver perfil</Button>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Carlos Pérez</p>
                  <p className="text-sm text-gray-600">Hijo - 8 años</p>
                </div>
                <Button variant="outline" size="sm">Ver perfil</Button>
              </div>
            </div>
            <Button className="w-full mt-4">
              Agregar familiar
            </Button>
          </CardContent>
        </Card>

        {/* Recordatorios y Alertas */}
        <Card>
          <CardHeader>
            <CardTitle>Recordatorios y Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h4 className="font-medium text-yellow-800">Renovación próxima</h4>
                <p className="text-sm text-yellow-600">
                  Tu medicamento Enalapril necesita renovación en 10 días
                </p>
              </div>
              <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                <h4 className="font-medium text-blue-800">Próxima cita</h4>
                <p className="text-sm text-blue-600">
                  Recuerda tu cita de Cardiología el próximo martes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}