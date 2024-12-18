// src/lib/types/waitlist.ts
// Definimos todos los tipos que usaremos en el sistema
export interface WaitlistEntry {
    id: string
    patientName: string
    contactEmail: string | null
    contactPhone: string | null
    status: WaitlistStatus
    requestDate: Date
    urgencyLevel: UrgencyLevel
    preferredTimeRanges: TimeRange[]
    lastContactAttempt: Date | null
    contactAttempts: number
    notes: string | null
    internalNotes: string | null
    createdAt: Date
    updatedAt: Date
  }
  
  export type WaitlistStatus = 
    | 'waiting'    // Esperando en lista
    | 'contacted'  // Se intentó contactar
    | 'scheduled'  // Cita programada
    | 'cancelled'  // Cancelado
    | 'expired'    // Expirado por tiempo
  
  export type UrgencyLevel = 'low' | 'medium' | 'high'
  
  export interface TimeRange {
    startTime: string
    endTime: string
    daysOfWeek?: number[] // 0-6, donde 0 es domingo
  }
  
  // src/lib/types/notification.ts

  
  