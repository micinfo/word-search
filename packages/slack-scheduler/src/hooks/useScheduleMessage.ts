import { useState } from 'react'

export function useScheduleMessage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scheduleMessage = async (data: {
    channel: string
    message: string
    delayMinutes: number
  }) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to schedule message')
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { scheduleMessage, isLoading, error }
}