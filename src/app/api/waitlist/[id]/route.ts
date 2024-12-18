import { NextResponse } from 'next/server'
import { WaitlistService } from '@/lib/services/waitlist'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const waitlistService = WaitlistService.getInstance()
    
    await waitlistService.updateEntry(id, {
      status: 'cancelled',
      internalNotes: `Cancelado el ${new Date().toISOString()}`
    })

    return NextResponse.json({
      success: true,
      message: 'Entry cancelled successfully'
    })
  } catch (error) {
    console.error('Error cancelling waitlist entry:', error)
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    )
  }
}