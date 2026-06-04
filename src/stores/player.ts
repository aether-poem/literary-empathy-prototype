import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ExplorationStep, EmotionResponse, Insight, PlayerSession } from '@/types'
import { generateId } from '@/utils/helpers'

export const usePlayerStore = defineStore('player', () => {
  const sessionId = ref(generateId())
  const explorationPath = ref<ExplorationStep[]>([])
  const emotionResponses = ref<EmotionResponse[]>([])
  const insights = ref<Insight[]>([])
  const sessionStartTime = ref(Date.now())
  const exploredCharacters = ref<string[]>([])
  const exploredMemories = ref<string[]>([])
  const perspectiveSwitches = ref(0)

  const session = computed<PlayerSession>(() => ({
    sessionId: sessionId.value,
    workId: 'the_dead',
    startTime: sessionStartTime.value,
    explorationPath: explorationPath.value,
    emotionResponses: emotionResponses.value,
    insights: insights.value,
    exploredCharacters: exploredCharacters.value,
    exploredMemories: exploredMemories.value,
    perspectiveSwitches: perspectiveSwitches.value
  }))

  const explorationCount = computed(() => explorationPath.value.length)
  const insightCount = computed(() => insights.value.length)

  function recordStep(step: Omit<ExplorationStep, 'id' | 'timestamp'>) {
    const newStep: ExplorationStep = {
      ...step,
      id: generateId(),
      timestamp: Date.now()
    }
    explorationPath.value.push(newStep)

    if (step.action === 'select_character' && !exploredCharacters.value.includes(step.targetId)) {
      exploredCharacters.value.push(step.targetId)
    }
    if (step.action === 'view_memory' && !exploredMemories.value.includes(step.targetId)) {
      exploredMemories.value.push(step.targetId)
    }
    if (step.action === 'switch_perspective') {
      perspectiveSwitches.value++
    }
  }

  function recordEmotionResponse(response: Omit<EmotionResponse, 'id' | 'timestamp'>) {
    const newResponse: EmotionResponse = {
      ...response,
      id: generateId(),
      timestamp: Date.now()
    }
    emotionResponses.value.push(newResponse)
  }

  function addInsight(insight: Omit<Insight, 'id' | 'timestamp'>) {
    const newInsight: Insight = {
      ...insight,
      id: generateId(),
      timestamp: Date.now()
    }
    insights.value.push(newInsight)
  }

  function clearSession() {
    sessionId.value = generateId()
    explorationPath.value = []
    emotionResponses.value = []
    insights.value = []
    sessionStartTime.value = Date.now()
    exploredCharacters.value = []
    exploredMemories.value = []
    perspectiveSwitches.value = 0
  }

  function exportSession(): PlayerSession {
    return {
      ...session.value,
      endTime: Date.now()
    }
  }

  return {
    sessionId,
    explorationPath,
    emotionResponses,
    insights,
    sessionStartTime,
    exploredCharacters,
    exploredMemories,
    perspectiveSwitches,
    session,
    explorationCount,
    insightCount,
    recordStep,
    recordEmotionResponse,
    addInsight,
    clearSession,
    exportSession
  }
})