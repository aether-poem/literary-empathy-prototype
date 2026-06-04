import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PerspectiveData, MemoryTrigger, EmpathyInsight, EmpathyResult, MultiVersionEvent, EventVersion, CognitiveRecord } from '@/types'
import { generateId } from '@/utils/helpers'

export const useEmpathyStore = defineStore('empathy', () => {
  const perspectives = ref<PerspectiveData[]>([])
  const triggers = ref<MemoryTrigger[]>([])
  const insights = ref<EmpathyInsight[]>([])
  const activeMonologueId = ref<string | null>(null)
  const events = ref<MultiVersionEvent[]>([])
  const cognitiveRecords = ref<CognitiveRecord[]>([])

  const currentPerspective = computed(() => (characterId: string) => 
    perspectives.value.find(p => p.characterId === characterId)
  )

  const currentMonologue = computed(() => 
    perspectives.value.flatMap(p => p.innerMonologues).find(m => m.id === activeMonologueId.value)
  )

  function loadPerspectives(data: PerspectiveData[]) {
    perspectives.value = data
  }

  function loadTriggers(data: MemoryTrigger[]) {
    triggers.value = data
  }

  function loadEvents(data: MultiVersionEvent[]) {
    events.value = data
  }

  function getInnerMonologues(characterId: string, memoryId?: string) {
    const perspective = currentPerspective.value(characterId)
    if (!perspective) return []
    
    if (memoryId) {
      return perspective.innerMonologues.filter(m => m.triggerMemoryId === memoryId)
    }
    return perspective.innerMonologues
  }

  function getVisibleInfo(characterId: string) {
    const perspective = currentPerspective.value(characterId)
    return perspective?.visibleInfo || []
  }

  function getHiddenInfo(characterId: string, exploredMemoryIds: string[]) {
    const perspective = currentPerspective.value(characterId)
    if (!perspective) return []
    
    return perspective.hiddenInfo.filter(info => {
      if (!info.revealMemoryId) return true
      return exploredMemoryIds.includes(info.revealMemoryId)
    })
  }

  function getBiases(characterId: string) {
    const perspective = currentPerspective.value(characterId)
    return perspective?.biases || {}
  }

  function getEventVersion(eventId: string, characterId: string): EventVersion | undefined {
    const event = events.value.find(e => e.eventId === eventId)
    if (!event) return undefined
    return event.versions.find(v => v.characterId === characterId)
  }

  function getEventsForCharacter(characterId: string): Array<{ event: MultiVersionEvent; version: EventVersion }> {
    return events.value
      .map(event => {
        const version = event.versions.find(v => v.characterId === characterId)
        return version ? { event, version } : null
      })
      .filter((item): item is { event: MultiVersionEvent; version: EventVersion } => item !== null)
  }

  function getAllEvents() {
    return events.value
  }

  function recordCognitiveShift(eventId: string, characterId: string) {
    const existingRecord = cognitiveRecords.value.find(r => r.eventId === eventId)
    
    if (!existingRecord) {
      cognitiveRecords.value.push({
        eventId,
        firstBelievedCharacterId: characterId,
        timestamp: Date.now()
      })
    } else if (existingRecord.firstBelievedCharacterId !== characterId && !existingRecord.correctedCharacterId) {
      existingRecord.correctedCharacterId = characterId
      existingRecord.correctedTimestamp = Date.now()
    }
  }

  function getCognitiveRecord(eventId: string) {
    return cognitiveRecords.value.find(r => r.eventId === eventId)
  }

  function getAllCognitiveRecords() {
    return cognitiveRecords.value
  }

  function triggerMemoryByEmotion(emotion: string, intensity: number): string[] {
    const matchedTriggers = triggers.value.filter(t => 
      t.type === 'emotion' && t.value === emotion && t.intensity && intensity >= t.intensity
    )
    return [...new Set(matchedTriggers.flatMap(t => t.targetMemoryIds))]
  }

  function triggerMemoryByMemory(memoryId: string): string[] {
    const matchedTriggers = triggers.value.filter(t => 
      t.type === 'memory' && t.value === memoryId
    )
    return [...new Set(matchedTriggers.flatMap(t => t.targetMemoryIds))]
  }

  function triggerMemoryByCharacter(characterId: string): string[] {
    const matchedTriggers = triggers.value.filter(t => 
      t.type === 'character' && t.value === characterId
    )
    return [...new Set(matchedTriggers.flatMap(t => t.targetMemoryIds))]
  }

  function addInsight(type: EmpathyInsight['type'], characterId: string, content: string) {
    const insight: EmpathyInsight = {
      id: generateId(),
      type,
      characterId,
      content,
      timestamp: Date.now(),
      confidence: Math.random() * 0.3 + 0.7
    }
    insights.value.push(insight)
  }

  function setActiveMonologue(monologueId: string | null) {
    activeMonologueId.value = monologueId
  }

  function generateEmpathyResult(
    exploredCharacters: string[],
    exploredMemories: string[],
    explorationOrder: string[]
  ): EmpathyResult {
    const mainCharacters = ['gabriel', 'gretta', 'michael']
    const firstCharacter = explorationOrder.find(c => mainCharacters.includes(c)) || 'gabriel'
    
    const overlooked = mainCharacters.filter(c => !exploredCharacters.includes(c))
    
    const misread: Array<{ characterId: string; misunderstanding: string }> = []
    if (!exploredMemories.includes('gretta_2')) {
      misread.push({
        characterId: 'gretta',
        misunderstanding: 'You may have seen Gretta as simply melancholic, without realizing the depth of her grief'
      })
    }
    if (!exploredMemories.includes('michael_1')) {
      misread.push({
        characterId: 'michael',
        misunderstanding: 'You may have seen Michael as just a memory, without understanding the sacrifice he made'
      })
    }

    const discoveredEmotions: Array<{ characterId: string; emotions: string[] }> = []
    const emotionMap: Record<string, string[]> = {
      gabriel: [],
      gretta: [],
      michael: []
    }

    exploredMemories.forEach(memoryId => {
      if (memoryId.startsWith('gabriel')) {
        emotionMap.gabriel.push(...['anxiety', 'fear', 'sadness'])
      }
      if (memoryId.startsWith('gretta')) {
        emotionMap.gretta.push(...['longing', 'regret', 'love'])
      }
      if (memoryId.startsWith('michael')) {
        emotionMap.michael.push(...['love', 'devotion'])
      }
    })

    Object.entries(emotionMap).forEach(([charId, emotions]) => {
      if (emotions.length > 0) {
        discoveredEmotions.push({
          characterId: charId,
          emotions: [...new Set(emotions)]
        })
      }
    })

    let narrativeArc = ''
    if (exploredMemories.includes('gabriel_3')) {
      narrativeArc = 'You followed Gabriel through his journey from anxious speaker to humbled witness, experiencing his epiphany as the snow fell upon all the living and the dead.'
    } else if (exploredMemories.includes('gretta_2')) {
      narrativeArc = 'You walked with Gretta through her confession, understanding the weight of a love that transcends death.'
    } else if (exploredMemories.includes('michael_1')) {
      narrativeArc = 'You stood in the snow with Michael, feeling the purity of a love that defied even the cold grip of death.'
    } else {
      narrativeArc = 'Your journey through these lives has just begun. There are still depths to explore.'
    }

    return {
      firstUnderstood: firstCharacter,
      overlooked,
      misread,
      discoveredEmotions,
      narrativeArc
    }
  }

  return {
    perspectives,
    triggers,
    insights,
    activeMonologueId,
    events,
    cognitiveRecords,
    currentPerspective,
    currentMonologue,
    loadPerspectives,
    loadTriggers,
    loadEvents,
    getInnerMonologues,
    getVisibleInfo,
    getHiddenInfo,
    getBiases,
    getEventVersion,
    getEventsForCharacter,
    getAllEvents,
    recordCognitiveShift,
    getCognitiveRecord,
    getAllCognitiveRecords,
    triggerMemoryByEmotion,
    triggerMemoryByMemory,
    triggerMemoryByCharacter,
    addInsight,
    setActiveMonologue,
    generateEmpathyResult
  }
})