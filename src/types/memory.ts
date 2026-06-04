export interface SensoryDetails {
  visual?: string
  auditory?: string
  tactile?: string
  olfactory?: string
}

export interface MemoryContext {
  time?: string
  place?: string
  situation?: string
}

export interface EmotionalContent {
  primaryEmotion: 'joy' | 'sadness' | 'anger' | 'fear' | 'love' | 'longing' | 'regret' | 'pride' | 'shame'
  intensity: number
  valence: number
}

export interface RevealCondition {
  type: 'automatic' | 'exploration' | 'sequence'
  requiredFragments?: string[]
}

export type EmotionTag = 'love' | 'loss' | 'regret' | 'shame' | 'fear'

export interface UnlockCondition {
  type: 'chapter_completed' | 'memory_explored' | 'interpretation_made' | 'always'
  chapterId?: string
  memoryId?: string
  scenarioId?: string
  count?: number
}

export interface SceneObject {
  id: string
  name: string
  description: string
  location: string
  interactable: boolean
  unlocksMemory?: string
  hint?: string
}

export interface MemoryCluster {
  emotionTag: EmotionTag
  fragments: MemoryFragment[]
}

export interface PlayerMemoryStructure {
  id: string
  clusters: MemoryCluster[]
  arrangement: Array<{ fragmentId: string; position: { x: number; y: number } }>
  narrative: string
  timestamp: number
}

export interface PlayerNote {
  id: string
  memoryId: string
  content: string
  timestamp: number
}

export interface CustomMemoryLink {
  id: string
  sourceMemoryId: string
  targetMemoryId: string
  description: string
  timestamp: number
}

export interface MemoryFragment {
  id: string
  characterId: string
  title?: string
  content: string
  sensoryDetails?: SensoryDetails
  context?: MemoryContext
  emotionalContent: EmotionalContent
  reliability: number
  revealCondition?: RevealCondition
  narrativePosition?: number
  emotionTag: EmotionTag
  unlockConditions?: UnlockCondition
  connectedFragments: string[]
  playerNotes?: PlayerNote[]
  customLinks?: CustomMemoryLink[]
}