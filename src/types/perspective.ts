export interface InnerMonologue {
  id: string
  triggerMemoryId?: string
  triggerEmotion?: string
  content: string
  intensity: number
}

export interface VisibleInfo {
  characterId: string
  description: string
}

export interface HiddenInfo {
  characterId: string
  description: string
  revealMemoryId?: string
}

export interface PerspectiveData {
  characterId: string
  visibleInfo: VisibleInfo[]
  hiddenInfo: HiddenInfo[]
  biases: Record<string, string | undefined>
  innerMonologues: InnerMonologue[]
}

export interface CharacterPerspective {
  id: string
  characterName: string
  visibleFacts: string[]
  hiddenFacts: string[]
  assumptions: string[]
  emotionalState: string
}

export interface EventVersion {
  eventId: string
  characterId: string
  description: string
  assumptions: string[]
  emotionalState: string
}

export interface MultiVersionEvent {
  eventId: string
  title: string
  baseDescription: string
  versions: EventVersion[]
}

export interface CognitiveRecord {
  eventId: string
  firstBelievedCharacterId: string
  timestamp: number
  correctedCharacterId?: string
  correctedTimestamp?: number
}

export interface InterpretationOption {
  id: string
  text: string
  characterId?: string
}

export interface CustomInterpretation {
  id: string
  scenarioId: string
  customText: string
  timestamp: number
}

export interface InterpretationScenario {
  id: string
  eventDescription: string
  memoryId: string
  options: InterpretationOption[]
}

export interface InterpretationState {
  targetId: string
  confidence: number
  interpretation: string
  interpretationId: string
  revisionHistory: string[]
  timestamp: number
}

export interface EmpathyReport {
  earliestBelief: string
  misunderstoodCharacters: Array<{ characterId: string; misunderstanding: string }>
  revisionNodes: Array<{ scenarioId: string; oldInterpretation: string; newInterpretation: string; timestamp: number }>
  empathyPath: string[]
  narrativeSummary: string
}

export interface EmotionTrigger {
  emotion: string
  threshold: number
  targetMemoryIds: string[]
}

export interface MemoryTrigger {
  id: string
  type: string
  value: string
  intensity?: number
  targetMemoryIds: string[]
}

export interface EmpathyInsight {
  id: string
  type: 'understanding' | 'misunderstanding' | 'connection' | 'emotion'
  characterId: string
  content: string
  timestamp: number
  confidence: number
}

export interface EmpathyResult {
  firstUnderstood: string
  overlooked: string[]
  misread: Array<{ characterId: string; misunderstanding: string }>
  discoveredEmotions: Array<{ characterId: string; emotions: string[] }>
  narrativeArc: string
}