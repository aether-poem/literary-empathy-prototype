import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { InterpretationState, InterpretationScenario, EmpathyReport, CustomInterpretation } from '@/types'

export const useInterpretationStore = defineStore('interpretation', () => {
  const scenarios = ref<InterpretationScenario[]>([])
  const interpretations = ref<Map<string, InterpretationState>>(new Map())
  const customInterpretations = ref<CustomInterpretation[]>([])
  const revisionEvents = ref<Array<{ scenarioId: string; oldInterpretation: string; newInterpretation: string; timestamp: number; isCustom: boolean }>>([])

  function loadScenarios(data: InterpretationScenario[]) {
    scenarios.value = data
  }

  function getScenarioByMemoryId(memoryId: string): InterpretationScenario | undefined {
    return scenarios.value.find(s => s.memoryId === memoryId)
  }

  function selectInterpretation(scenarioId: string, optionId: string | null, optionText: string, isCustom: boolean = false) {
    const existing = interpretations.value.get(scenarioId)
    const textToUse = optionText || ''
    
    if (existing) {
      const oldInterpretation = existing.interpretation
      
      revisionEvents.value.push({
        scenarioId,
        oldInterpretation,
        newInterpretation: textToUse,
        timestamp: Date.now(),
        isCustom
      })
      
      existing.revisionHistory.push(oldInterpretation)
      existing.interpretation = textToUse
      existing.interpretationId = optionId || 'custom'
      existing.confidence = 0.5
      existing.timestamp = Date.now()
    } else {
      interpretations.value.set(scenarioId, {
        targetId: scenarioId,
        confidence: 0.5,
        interpretation: textToUse,
        interpretationId: optionId || 'custom',
        revisionHistory: [],
        timestamp: Date.now()
      })
    }

    if (isCustom && textToUse) {
      customInterpretations.value.push({
        id: `custom_${Date.now()}`,
        scenarioId,
        customText: textToUse,
        timestamp: Date.now()
      })
    }
  }

  function getCurrentInterpretation(scenarioId: string): InterpretationState | undefined {
    return interpretations.value.get(scenarioId)
  }

  function getAllInterpretations(): InterpretationState[] {
    return Array.from(interpretations.value.values())
  }

  function getRevisionEvents() {
    return revisionEvents.value
  }

  function getCustomInterpretations() {
    return customInterpretations.value
  }

  function generateEmpathyReport(): EmpathyReport {
    const allInterpretations = getAllInterpretations()
    const customInterps = getCustomInterpretations()
    
    const earliestBelief = allInterpretations.length > 0 
      ? allInterpretations.reduce((earliest, current) => 
          current.timestamp < earliest.timestamp ? current : earliest
        ).interpretation
      : 'No interpretations made'

    const empathyPath: string[] = []
    if (revisionEvents.value.length === 0) {
      empathyPath.push('Observation')
      empathyPath.push('Understanding')
    } else {
      empathyPath.push('Observation')
      empathyPath.push('Initial Interpretation')
      empathyPath.push('Revision')
      empathyPath.push('Evolved Understanding')
    }

    const narrativeSummaries = [
      'Your journey through these lives has been one of personal exploration. You formed impressions and, when new information emerged, you chose how to understand them.',
      'You navigated the complexities of human emotion, making choices about what each moment meant. This is the essence of building your own narrative.',
      'Your understanding evolved as you gathered more information, moving from initial impressions to a more layered comprehension of these interconnected lives.',
      'The stories you uncovered allowed you to form your own interpretations, inviting you to revisit and revise your understanding whenever you wished.'
    ]
    
    if (customInterps.length > 0) {
      narrativeSummaries.push(
        `You chose to express your own understanding ${customInterps.length} time(s), creating a truly personal narrative that reflects your unique perspective.`,
        `Your custom interpretations added depth to the story, showing how your own experiences and insights shaped your understanding of these characters.`
      )
    }
    
    const narrativeSummary = narrativeSummaries[Math.floor(Math.random() * narrativeSummaries.length)]

    return {
      earliestBelief,
      misunderstoodCharacters: [],
      revisionNodes: revisionEvents.value.map(evt => ({
        scenarioId: evt.scenarioId,
        oldInterpretation: evt.oldInterpretation,
        newInterpretation: evt.newInterpretation,
        timestamp: evt.timestamp
      })),
      empathyPath,
      narrativeSummary
    }
  }

  function getAvailableScenario(memoryId: string): InterpretationScenario | null {
    const scenario = getScenarioByMemoryId(memoryId)
    if (!scenario) return null
    return scenario
  }

  function closeModal() {
    // No-op in current implementation
  }

  return {
    scenarios,
    interpretations,
    customInterpretations,
    revisionEvents,
    loadScenarios,
    getScenarioByMemoryId,
    selectInterpretation,
    getCurrentInterpretation,
    getAllInterpretations,
    getRevisionEvents,
    getCustomInterpretations,
    generateEmpathyReport,
    getAvailableScenario,
    closeModal
  }
})