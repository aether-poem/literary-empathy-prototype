export interface EmotionalBaseline {
  mood: number
  temperament: 'calm' | 'volatile' | 'melancholic' | 'passionate'
}

export interface Misconception {
  aboutCharacterId: string
  misconception: string
  truth: string
}

export interface CharacterVisual {
  colorScheme: string
  symbol: string
  ambientSound?: string
}

export interface Character {
  id: string
  name: string
  fullName?: string
  role: string
  description: string
  personalityTraits: string[]
  emotionalBaseline: EmotionalBaseline
  secrets: string[]
  misconceptions: Misconception[]
  visual: CharacterVisual
}