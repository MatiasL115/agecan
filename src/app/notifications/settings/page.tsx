// src/app/notifications/settings/page.tsx
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form"
import { useToast } from "@/components/ui/toast"

interface NotificationChannel {
  id: string
  type: 'email' | 'sms' | 'push'
  label: string
  description: string
  enabled: boolean
}

interface NotificationPreference {
  id: string
  category: 'appointments' | 'medications' | 'results' | 'general'
  label: string
  description: string
  timing: {
    beforeHours: number[]
    enabled: boolean
  }
  channels: {
    [key: string]: boolean // email, sms, push
  }
  priority: 'high' | 'medium' | 'low'
}

export default function NotificationSettingsPage() {
  const { showToast } = useToast()

  // Estado para los canales de comunicación disponibles
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'email',
      type: 'email',
      label: 'Correo electrónico',
      description: 'Recibe notificaciones detalladas en tu bandeja de entrada',
      enabled: true
    },
    {
      id: 'sms',
      type: 'sms',
      label: 'Mensajes de texto (SMS)',
      description: 'Recibe recordatorios cortos en tu teléfono',
      enabled: true
    },
    {
      id: 'push',
      type: 'push',
      label: 'Notificaciones push',
      description: 'Recibe alertas instantáneas en tu dispositivo',
      enabled: false
    }
  ])

  // Estado para las preferencias de notificación por categoría
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'appointments',
      category: 'appointments',
      label: 'Recordatorios de citas',
      description: 'Notificaciones sobre tus próximas consultas médicas',
      timing: {
        beforeHours: [24, 2],
        enabled: true
      },
      channels: {
        email: true,
        sms: true,
        push: false
      },
      priority: 'high'
    },
    {
      id: 'medications',
      category: 'medications',
      label: 'Recordatorios de medicamentos',
      description: 'Alertas sobre tomas de medicamentos y renovaciones',
      timing: {
        beforeHours: [48, 24],
        enabled: true
      },
      channels: {
        email: true,
        sms: true,
        push: false
      },
      priority: 'high'
    },
    {
      id: 'results',
      category: 'results',
      label: 'Resultados de exámenes',
      description: 'Notificaciones cuando tus resultados estén disponibles',
      timing: {
        beforeHours: [0],
        enabled: true
      },
      channels: {
        email: true,
        sms: false,
        push: false
      },
      priority: 'medium'
    }
  ])

  // Función para actualizar el estado de un canal
  const toggleChannel = (channelId: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId 
        ? { ...channel, enabled: !channel.enabled }
        : channel
    ))
  }

  // Función para actualizar las preferencias de una categoría
  const updatePreference = (
    preferenceId: string,
    updates: Partial<NotificationPreference>
  ) => {
    setPreferences(prev => prev.map(pref =>
      pref.id === preferenceId
        ? { ...pref, ...updates }
        : pref
    ))
  }

  // Función para guardar los cambios
  const handleSave = async () => {
    try {
      // Aquí iría la lógica para guardar en el backend
      showToast({
        title: "Preferencias actualizadas",
        message: "Tus preferencias de notificación han sido guardadas correctamente",
        type: "success"
      })
    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudieron guardar las preferencias. Por favor intenta nuevamente",
        type: "error"
      })
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Canales de comunicación */}
      <Card>
        <CardHeader>
          <CardTitle>Canales de notificación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channels.map(channel => (
              <div 
                key={channel.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{channel.label}</h3>
                  <p className="text-sm text-gray-600">{channel.description}</p>
                </div>
                <Button
                  variant={channel.enabled ? 'default' : 'outline'}
                  onClick={() => toggleChannel(channel.id)}
                >
                  {channel.enabled ? 'Activado' : 'Desactivado'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preferencias por categoría */}
      <Card>
        <CardHeader>
          <CardTitle>Preferencias por tipo de notificación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {preferences.map(preference => (
              <div 
                key={preference.id}
                className="p-4 border rounded-lg space-y-4"
              >
                <div>
                  <h3 className="font-medium">{preference.label}</h3>
                  <p className="text-sm text-gray-600">{preference.description}</p>
                </div>

                {/* Control de estado */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estado</span>
                  <Button
                    variant={preference.timing.enabled ? 'default' : 'outline'}
                    onClick={() => updatePreference(preference.id, {
                      timing: {
                        ...preference.timing,
                        enabled: !preference.timing.enabled
                      }
                    })}
                  >
                    {preference.timing.enabled ? 'Activado' : 'Desactivado'}
                  </Button>
                </div>

                {/* Canales habilitados */}
                <div>
                  <p className="text-sm font-medium mb-2">Canales de notificación</p>
                  <div className="flex space-x-2">
                    {channels.map(channel => (
                      <Button
                        key={channel.id}
                        variant={preference.channels[channel.id] ? 'default' : 'outline'}
                        disabled={!channel.enabled}
                        onClick={() => updatePreference(preference.id, {
                          channels: {
                            ...preference.channels,
                            [channel.id]: !preference.channels[channel.id]
                          }
                        })}
                      >
                        {channel.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Tiempos de notificación */}
                <div>
                  <p className="text-sm font-medium mb-2">Recordatorios</p>
                  <div className="flex flex-wrap gap-2">
                    {[48, 24, 2].map(hours => (
                      <Button
                        key={hours}
                        variant={
                          preference.timing.beforeHours.includes(hours)
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() => {
                          const newHours = preference.timing.beforeHours.includes(hours)
                            ? preference.timing.beforeHours.filter(h => h !== hours)
                            : [...preference.timing.beforeHours, hours].sort((a, b) => b - a)
                          
                          updatePreference(preference.id, {
                            timing: {
                              ...preference.timing,
                              beforeHours: newHours
                            }
                          })
                        }}
                      >
                        {hours} horas antes
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Prioridad */}
                <div>
                  <p className="text-sm font-medium mb-2">Prioridad</p>
                  <div className="flex space-x-2">
                    {(['high', 'medium', 'low'] as const).map(priority => (
                      <Button
                        key={priority}
                        variant={preference.priority === priority ? 'default' : 'outline'}
                        onClick={() => updatePreference(preference.id, { priority })}
                      >
                        {priority === 'high' ? 'Alta' : 
                         priority === 'medium' ? 'Media' : 'Baja'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline">
          Restaurar valores predeterminados
        </Button>
        <Button onClick={handleSave}>
          Guardar preferencias
        </Button>
      </div>
    </div>
  )
}