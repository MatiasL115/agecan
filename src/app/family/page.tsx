// src/app/family/page.tsx
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

// Definimos la estructura de datos para los miembros de la familia
interface FamilyMember {
  id: string
  name: string
  relationship: string
  age: number
  dateOfBirth: string
  bloodType?: string
  upcomingAppointments: {
    id: string
    date: string
    time: string
    doctor: string
    specialty: string
  }[]
  activeMedications: {
    id: string
    name: string
    dosage: string
    nextRefill: string
  }[]
  // Utilizamos un enum para los niveles de acceso
  accessLevel: 'full' | 'limited' | 'view-only'
}

// Datos de ejemplo para mostrar la funcionalidad
const sampleFamilyMembers: FamilyMember[] = [
  {
    id: '1',
    name: 'Ana Pérez',
    relationship: 'Hija',
    age: 12,
    dateOfBirth: '2012-05-15',
    bloodType: 'A+',
    upcomingAppointments: [
      {
        id: '1',
        date: '2024-12-12',
        time: '15:00',
        doctor: 'Dr. Roberto Sánchez',
        specialty: 'Pediatría'
      }
    ],
    activeMedications: [
      {
        id: '1',
        name: 'Vitamina D',
        dosage: '800 UI diarias',
        nextRefill: '2024-12-20'
      }
    ],
    accessLevel: 'limited'
  },
  // Podemos agregar más miembros aquí
]

export default function FamilyPortalPage() {
  // Estado para controlar el miembro de la familia seleccionado
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const { showToast } = useToast()

  // Función para formatear fechas de manera consistente
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return new Date(dateStr).toLocaleDateString('es-ES', options)
  }

  // Función que calcula la edad a partir de la fecha de nacimiento
  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  return (
    <div className="space-y-6">
      {/* Panel superior con resumen familiar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold mb-4">Portal Familiar</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  👥
                </div>
                <div>
                  <p className="text-sm text-gray-600">Miembros de la Familia</p>
                  <p className="text-2xl font-bold">{sampleFamilyMembers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  📅
                </div>
                <div>
                  <p className="text-sm text-gray-600">Próximas Citas Familiares</p>
                  <p className="text-2xl font-bold">
                    {sampleFamilyMembers.reduce((total, member) => 
                      total + member.upcomingAppointments.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  💊
                </div>
                <div>
                  <p className="text-sm text-gray-600">Medicamentos Activos</p>
                  <p className="text-2xl font-bold">
                    {sampleFamilyMembers.reduce((total, member) => 
                      total + member.activeMedications.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sección principal con lista de miembros y detalles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel izquierdo con lista de miembros */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Miembros de la Familia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sampleFamilyMembers.map(member => (
                  <div
                    key={member.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMember === member.id
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedMember(member.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm opacity-80">
                          {member.relationship} - {calculateAge(member.dateOfBirth)} años
                        </p>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        selectedMember === member.id
                          ? 'bg-white/20'
                          : 'bg-gray-100'
                      }`}>
                        {member.accessLevel === 'full' ? 'Acceso total' : 
                         member.accessLevel === 'limited' ? 'Acceso limitado' : 
                         'Solo lectura'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">
                Agregar Miembro
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Panel derecho con detalles del miembro seleccionado */}
        <div className="md:col-span-2">
          {selectedMember ? (
            <div className="space-y-4">
              {sampleFamilyMembers
                .filter(member => member.id === selectedMember)
                .map(member => (
                  <div key={member.id} className="space-y-4">
                    {/* Información personal */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Información Personal</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Nombre completo</p>
                            <p className="font-medium">{member.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Fecha de nacimiento</p>
                            <p className="font-medium">{formatDate(member.dateOfBirth)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Edad</p>
                            <p className="font-medium">{calculateAge(member.dateOfBirth)} años</p>
                          </div>
                          {member.bloodType && (
                            <div>
                              <p className="text-sm text-gray-600">Grupo sanguíneo</p>
                              <p className="font-medium">{member.bloodType}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Próximas citas */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Próximas Citas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {member.upcomingAppointments.length > 0 ? (
                          <div className="space-y-3">
                            {member.upcomingAppointments.map(appointment => (
                              <div
                                key={appointment.id}
                                className="p-3 border rounded-lg"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{appointment.doctor}</p>
                                    <p className="text-sm text-gray-600">
                                      {appointment.specialty}
                                    </p>
                                  </div>
                                  <p className="text-sm">
                                    {formatDate(appointment.date)} - {appointment.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-gray-500 py-4">
                            No hay citas programadas
                          </p>
                        )}
                        <Button className="w-full mt-4">
                          Agendar Nueva Cita
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Medicamentos activos */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Medicamentos Activos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {member.activeMedications.length > 0 ? (
                          <div className="space-y-3">
                            {member.activeMedications.map(medication => (
                              <div
                                key={medication.id}
                                className="p-3 border rounded-lg"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{medication.name}</p>
                                    <p className="text-sm text-gray-600">
                                      {medication.dosage}
                                    </p>
                                  </div>
                                  <p className="text-sm">
                                    Próxima renovación: {formatDate(medication.nextRefill)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-gray-500 py-4">
                            No hay medicamentos activos
                          </p>
                        )}
                        <Button className="w-full mt-4">
                          Agregar Medicamento
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Opciones de acceso y permisos */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Permisos y Acceso</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Nivel de acceso actual</p>
                              <p className="text-sm text-gray-600">
                                {member.accessLevel === 'full' ? 'Acceso total' :
                                 member.accessLevel === 'limited' ? 'Acceso limitado' :
                                 'Solo lectura'}
                              </p>
                            </div>
                            <Button variant="outline">
                              Modificar Permisos
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500">
                  Selecciona un miembro de la familia para ver sus detalles
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}