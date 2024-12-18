export function isTimeRangeOverlap(range1: TimeRange, range2: TimeRange): boolean {
    const [start1, end1] = [parseTime(range1.startTime), parseTime(range1.endTime)]
    const [start2, end2] = [parseTime(range2.startTime), parseTime(range2.endTime)]
  
    return start1 < end2 && start2 < end1
  }
  
  export function parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number)
    return hours * 60 + minutes
  }
  
  export function formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }