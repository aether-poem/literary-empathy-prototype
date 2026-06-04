export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function getEmotionColor(emotion: string): string {
  const colors: Record<string, string> = {
    joy: '#fbbf24',
    sadness: '#3b82f6',
    anger: '#ef4444',
    fear: '#8b5cf6',
    love: '#ec4899',
    longing: '#f97316',
    regret: '#6b7280',
    pride: '#10b981',
    shame: '#6366f1'
  }
  return colors[emotion] || '#ffffff'
}

export function getRelationColor(type: string): string {
  const colors: Record<string, string> = {
    love: '#ec4899',
    friendship: '#10b981',
    conflict: '#ef4444',
    family: '#3b82f6',
    professional: '#6b7280',
    romantic: '#f97316',
    antagonistic: '#991b1b',
    sympathetic: '#06b6d4',
    memory: '#8b5cf6'
  }
  return colors[type] || '#ffffff'
}