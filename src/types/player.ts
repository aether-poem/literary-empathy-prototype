export interface ExplorationStep {
  id: string
  timestamp: number
  action: 'select_character' | 'view_memory' | 'switch_perspective' | 'explore_graph' | 'add_insight'
  targetId: string
  characterId: string | null
  duration: number
}

export interface EmotionResponse {
  id: string
  timestamp: number
  memoryFragmentId: string
  playerEmotion: {
    type: 'joy' | 'sadness' | 'anger' | 'fear' | 'empathy' | 'confusion'
    intensity: number
  }
  characterId: string
}

export interface Insight {
  id: string
  timestamp: number
  type: 'connection' | 'realization' | 'question' | 'empathy'
  content: string
  relatedCharacterIds: string[]
  relatedMemoryIds: string[]
  confidence: number
}

export interface PlayerSession {
  sessionId: string
  workId: string
  startTime: number
  endTime?: number
  explorationPath: ExplorationStep[]
  emotionResponses: EmotionResponse[]
  insights: Insight[]
  exploredCharacters: string[]
  exploredMemories: string[]
  perspectiveSwitches: number
}