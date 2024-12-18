// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Esta configuración evita crear múltiples instancias de Prisma durante el desarrollo
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma