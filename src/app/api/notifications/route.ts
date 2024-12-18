import { NextResponse } from 'next/server'
import { NotificationService } from '@/lib/services/notifications'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const recipientId = searchParams.get('recipientId')
    const status = searchParams.get('status')
    
    const notifications = await prisma.notification.findMany({
      where: {
        ...(recipientId && { recipientId }),
        ...(status && { status })
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    )
  }
}
