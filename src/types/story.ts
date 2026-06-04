export interface StoryChapter {
  id: string
  title: string
  description: string
  position: number
  requiredMemories: string[]
  unlocked: boolean
  nextChapterId?: string
  triggerMemoryId?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockCondition: {
    type: 'memory' | 'chapter' | 'interpretation' | 'exploration'
    targetId?: string
    count?: number
  }
}

export interface Ending {
  id: string
  title: string
  description: string
  epilogue: string
  requiredAchievements: string[]
  requiredInterpretations?: string[]
  type: 'truth' | 'misunderstanding' | 'redemption' | 'acceptance'
}

export interface StoryProgress {
  currentChapterId: string
  completedChapters: string[]
  unlockedAchievements: string[]
  currentEndingId: string | null
}