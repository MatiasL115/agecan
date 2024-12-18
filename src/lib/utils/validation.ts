export function validateTimeRange(range: TimeRange): boolean {
    const start = parseTime(range.startTime)
    const end = parseTime(range.endTime)
    
    return start < end && 
           start >= 0 && 
           start < 24 * 60 && 
           end > 0 && 
           end <= 24 * 60
  }
  
  export function validateWaitlistEntry(data: Partial<WaitlistEntry>): string[] {
    const errors: string[] = []
  
    if (!data.patientName?.trim()) {
      errors.push('Patient name is required')
    }
  
    if (!data.contactEmail && !data.contactPhone) {
      errors.push('At least one contact method is required')
    }
  
    if (data.contactEmail && !validateEmail(data.contactEmail)) {
      errors.push('Invalid email format')
    }
  
    if (data.preferredTimeRanges) {
      for (const range of data.preferredTimeRanges) {
        if (!validateTimeRange(range)) {
          errors.push('Invalid time range format')
          break
        }
      }
    }
  
    return errors
  }
  
  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }