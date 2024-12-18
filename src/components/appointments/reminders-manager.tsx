import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

interface ReminderPreferences {
  email: boolean
  sms: boolean
  timeBeforeAppointment: {
    days: number
    hours: number
  }
  additionalPhoneNumbers: string[]
  additionalEmails: string[]
  enabledReminders: {
    confirmation: boolean
    dayBefore: boolean
    hoursBefore: boolean
    missedAppointment: boolean
    followUp: boolean
  }
}

interface ReminderTemplate {
  id: string
  type: 'confirmation' | 'reminder' | 'followUp' | 'missed'
  title: string
  message: string
  timing: {
    type: 'before' | 'after'
    value: number
    unit: 'minutes' | 'hours' | 'days'
  }
}

export default function RemindersManager() {
  const [preferences, setPreferences] = useState<ReminderPreferences>({
    email: true,
    sms: true,
    timeBeforeAppointment: {
      days: 1,
      hours: 2
    },
    additionalPhoneNumbers: [],
    additionalEmails: [],
    enabledReminders: {
      confirmation: true,
      dayBefore: true,
      hoursBefore: true,
      missedAppointment: false,
      followUp: true
    }
  })

  const [templates, setTemplates] = useState<ReminderTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    loadPreferences()
    loadTemplates()
  }, [])

  const loadPreferences = async () => {
    try {
      const response = await fetch('/api/reminders/preferences')
      if (!response.ok) throw new Error('Error cargando preferencias')
      const data = await response.json()
      setPreferences(data.preferences)
    } catch (error) {
      console.error('Error:', error)
      showToast({
        title: "Error",
        message: "No se pudieron cargar las preferencias",
        type: "error"
      })
    }
  }

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/reminders/templates')
      if (!response.ok) throw new Error('Error cargando plantillas')
      const data = await response.json()
      setTemplates(data.templates)
    } catch (error) {
      console.error('Error:', error)
      showToast({
        title: "Error",
        message: "No se pudieron cargar las plantillas",
        type: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const savePreferences = async () => {
    try {
      const response = await fetch('/api/reminders/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences })
      })

      if (!response.ok) throw new Error('Error guardando preferencias')

      showToast({
        title: "Éxito",
        message: "Preferencias actualizadas correctamente",
        type: "success"
      })
    } catch (error) {
      console.error('Error:', error)
      showToast({
        title: "Error",
        message: "No se pudieron guardar las preferencias",
        type: "error"
      })
    }
  }

  const addContactMethod = (type: 'phone' | 'email') => {
    if (type === 'phone') {
      setPreferences(prev => ({
        ...prev,
        additionalPhoneNumbers: [...prev.additionalPhoneNumbers, '']
      }))
    } else {
      setPreferences(prev => ({
        ...prev,
        additionalEmails: [...prev.additionalEmails, '']
      }))
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p>Cargando configuración de recordatorios...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Métodos de contacto */}
      <Card>
        <CardHeader>
          <CardTitle>Métodos de Contacto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Preferencias principales */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emailEnabled"
                  checked={preferences.email}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    email: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="emailEnabled" className="text-sm">
                  Notificaciones por email
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="smsEnabled"
                  checked={preferences.sms}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    sms: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="smsEnabled" className="text-sm">
                  Notificaciones por SMS
                </label>
              </div>
            </div>

            {/* Contactos adicionales */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfonos adicionales
                </label>
                {preferences.additionalPhoneNumbers.map((phone, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const newPhones = [...preferences.additionalPhoneNumbers]
                        newPhones[index] = e.target.value
                        setPreferences(prev => ({
                          ...prev,
                          additionalPhoneNumbers: newPhones
                        }))
                      }}
                      className="flex-1 rounded-md border-gray-300"
                      placeholder="Número de teléfono adicional"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPreferences(prev => ({
                          ...prev,
                          additionalPhoneNumbers: prev.additionalPhoneNumbers
                            .filter((_, i) => i !== index)
                        }))
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addContactMethod('phone')}
                >
                  Agregar teléfono
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emails adicionales
                </label>
                {preferences.additionalEmails.map((email, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        const newEmails = [...preferences.additionalEmails]
                        newEmails[index] = e.target.value
                        setPreferences(prev => ({
                          ...prev,
                          additionalEmails: newEmails
                        }))
                      }}
                      className="flex-1 rounded-md border-gray-300"
                      placeholder="Email adicional"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPreferences(prev => ({
                          ...prev,
                          additionalEmails: prev.additionalEmails
                            .filter((_, i) => i !== index)
                        }))
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addContactMethod('email')}
                >
                  Agregar email
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de recordatorios */}
      <Card>
        <CardHeader>
          <CardTitle>Recordatorios Automáticos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Tiempos de recordatorio */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días antes
                </label>
                <select
                  value={preferences.timeBeforeAppointment.days}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    timeBeforeAppointment: {
                      ...prev.timeBeforeAppointment,
                      days: Number(e.target.value)
                    }
                  }))}
                  className="rounded-md border-gray-300"
                >
                  {[1, 2, 3, 4, 5].map(days => (
                    <option key={days} value={days}>{days} días</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horas antes
                </label>
                <select
                  value={preferences.timeBeforeAppointment.hours}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    timeBeforeAppointment: {
                      ...prev.timeBeforeAppointment,
                      hours: Number(e.target.value)
                    }
                  }))}
                  className="rounded-md border-gray-300"
                >
                  {[1, 2, 3, 4].map(hours => (
                    <option key={hours} value={hours}>{hours} horas</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tipos de recordatorios */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="confirmationEnabled"
                  checked={preferences.enabledReminders.confirmation}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    enabledReminders: {
                      ...prev.enabledReminders,
                      confirmation: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="confirmationEnabled" className="text-sm">
                  Confirmación de cita agendada
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="dayBeforeEnabled"
                  checked={preferences.enabledReminders.dayBefore}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    enabledReminders: {
                      ...prev.enabledReminders,
                      dayBefore: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="dayBeforeEnabled" className="text-sm">
                  Recordatorio un día antes
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hoursBeforeEnabled"
                  checked={preferences.enabledReminders.hoursBefore}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    enabledReminders: {
                      ...prev.enabledReminders,
                      hoursBefore: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="hoursBeforeEnabled" className="text-sm">
                  Recordatorio horas antes
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="missedEnabled"
                  checked={preferences.enabledReminders.missedAppointment}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    enabledReminders: {
                      ...prev.enabledReminders,
                      missedAppointment: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="missedEnabled" className="text-sm">
                  Notificación de cita perdida
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="followUpEnabled"
                  checked={preferences.enabledReminders.followUp}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    enabledReminders: {
                      ...prev.enabledReminders,
                      followUp: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="followUpEnabled" className="text-sm">
                  Seguimiento post-consulta
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={loadPreferences}
        >
          Restaurar valores
        </Button>
        <Button
          onClick={savePreferences}
        >
          Guardar cambios
        </Button>
      </div>
    </div>
  )
}