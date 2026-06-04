export interface GraphNode {
  id: string
  type: 'character' | 'event' | 'object' | 'theme'
  label: string
  characterId?: string
  metadata?: Record<string, unknown>
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  relationType: 'love' | 'friendship' | 'conflict' | 'family' | 'professional' | 'romantic' | 'antagonistic' | 'sympathetic' | 'memory'
  strength: number
  directional: boolean
  visible: boolean
  revealCondition?: {
    type: 'automatic' | 'exploration'
    requiredFragments?: string[]
  }
}

export interface RelationData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}