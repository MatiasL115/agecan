// src/app/notifications/page.tsx
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form"

// Definimos los tipos de notificaciones que manejará nuestro sistema
interface Notification {
  id: string
  type: 'appointment' | 'medication' | 'result' | 'general'
  title: string
  message: string
  date: string
  priority: 'high' | 'medium' | 'low'
  read: boolean
  actionRequired: boolean
  // Define la acción que se puede tomar directamente desde la notificación
  action?: {
    type: 'viewAppointment' | 'scheduleMedication' | 'viewResults' | 'other'
    label: string
    url: string
  }
}

export default function NotificationsPage() {
  // En una implementación real, estas notificaciones vendrían de una API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'appointment',
      title: 'Recordatorio de Cita',
      message: 'Tu cita con la Dra. María González está programada para mañana a las 14:30.',
      date: '2024-12-06T14:30:00',
      priority: 'high',
      read: false,
      actionRequired: true,
      action: {
        type: 'viewAppointment',
        label: 'Ver detalles de la cita',
        url: '/appointments/123'
      }
    },
    {
      id: '2',
      type: 'medication',
      title: 'Renovación de Medicamento',
      message: 'Tu prescripción de Enalapril necesita ser renovada en los próximos 5 días.',
      date: '2024-12-10T00:00:00',
      priority: 'medium',
      read: false,
      actionRequired: true,
      action: {
        type: 'scheduleMedication',
        label: 'Programar renovación',
        url: '/medications/renew/456'
      }
    }
  ])

  // Función para manejar la lectura de notificaciones
  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  // Función para agrupar notificaciones por fecha
  const groupNotificationsByDate = () => {
    return notifications.reduce((groups, notification) => {
      const date = new Date(notification.date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(notification)
      return groups
    }, {} as Record<string, Notification[]>)
  }

  // Obtiene el ícono según el tipo de notificación
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return '📅'
      case 'medication':
        return '💊'
      case 'result':
        return '📋'
      case 'general':
        return 'ℹ️'
    }
  }

  // Obtiene el color de fondo según la prioridad
  const getPriorityStyles = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-l-4 border-red-500'
      case 'medium':
        return 'bg-yellow-50 border-l-4 border-yellow-500'
      case 'low':
        return 'bg-blue-50 border-l-4 border-blue-500'
    }
  }

  const groupedNotifications = groupNotificationsByDate()

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Notificaciones</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => {
                  setNotifications(prev =>
                    prev.map(n => ({ ...n, read: true }))
                  )
                }}
              >
                Marcar todas como leídas
              </Button>
              <Button variant="outline">
                Configurar preferencias
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([date, notifications]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-gray-500 mb-3">{date}</h3>
                <div className="space-y-3">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg ${getPriorityStyles(notification.priority)} ${
                        notification.read ? 'opacity-75' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{notification.title}</h4>
                            <span className="text-sm text-gray-500">
                              {new Date(notification.date).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          {notification.action && (
                            <div className="mt-3">
                              <Button variant="outline" size="sm">
                                {notification.action.label}
                              </Button>
                            </div>
                          )}
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Marcar como leída
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}