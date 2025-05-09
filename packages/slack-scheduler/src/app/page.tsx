'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useScheduleMessage } from '@/hooks/useScheduleMessage'
import { toast } from 'sonner'

export default function Home() {
  const [channel, setChannel] = useState('')
  const [message, setMessage] = useState('')
  const [delayAmount, setDelayAmount] = useState('')
  const [delayUnit, setDelayUnit] = useState('minutes')
  const { scheduleMessage, isLoading, error } = useScheduleMessage()

  const getDelayInMinutes = () => {
    const amount = parseInt(delayAmount, 10)
    switch(delayUnit) {
      case 'seconds':
        return amount / 60
      case 'hours':
        return amount * 60
      default:
        return amount
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Ensure channel starts with #
    const formattedChannel = channel.startsWith('#') ? channel : `#${channel}`
    
    if (!formattedChannel.match(/^#[a-zA-Z0-9-_]+$/)) {
      toast.error('Invalid channel format', {
        description: 'Channel name can only contain letters, numbers, hyphens and underscores'
      })
      return
    }
    
    const success = await scheduleMessage({
      channel: formattedChannel,
      message,
      delayMinutes: getDelayInMinutes()
    })

    if (success) {
      toast.success('Message scheduled successfully', {
        description: 'Your message has been scheduled'
      })
      setChannel('')
      setMessage('')
      setDelayAmount('')
    } else {
      const errorMessage = error?.toLowerCase().includes('channel_not_found') 
        ? 'Channel not found. Please check the channel name and try again.'
        : error || 'Failed to schedule message'
      
      toast.error('Error', {
        description: errorMessage
      })
    }
  }

  const isFormValid = channel && message && delayAmount
  const getButtonText = () => {
    if (!delayAmount) return 'Send'
    const unit = delayUnit.slice(0, -1) // remove 's' from end
    return `Send in ${delayAmount} ${parseInt(delayAmount, 10) === 1 ? unit : delayUnit}`
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Slack Message Scheduler</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Channel</label>
            <Input 
              type="text" 
              placeholder="#all-challenge-message" 
              value={channel}
              onChange={(e) => setChannel(e.target.value.trim())}
              required 
              pattern="^#?[a-zA-Z0-9-_]+$"
              title="Channel name can only contain letters, numbers, hyphens and underscores"
            />
            <p className="text-sm text-muted-foreground mt-1">Use the exact channel name as shown in Slack</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <Textarea 
              placeholder="Type your message here..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required 
            />
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Delay</label>
              <Input 
                type="number" 
                min="1" 
                placeholder="5" 
                value={delayAmount}
                onChange={(e) => setDelayAmount(e.target.value)}
                required 
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">Unit</label>
              <select
                className="w-full h-9 rounded-md border bg-transparent px-3 py-1"
                value={delayUnit}
                onChange={(e) => setDelayUnit(e.target.value)}
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={!isFormValid || isLoading}>
            {isLoading ? 'Scheduling...' : getButtonText()}
          </Button>
        </form>
      </Card>
    </main>
  )
}
