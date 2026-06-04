<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0a0a12] via-[#12121f] to-[#0d0d1a] relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-empathy-rose/30 to-transparent"></div>
      <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-empathy-purple/30 to-transparent"></div>
    </div>

    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-empathy-rose/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-empathy-purple/5 rounded-full blur-3xl"></div>

    <header class="relative z-10 p-4 md:p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div 
            class="w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-500"
            :style="{ backgroundColor: currentCharacter?.visual.colorScheme + '30' }"
          >
            {{ currentCharacter?.visual.symbol }}
          </div>
          <div>
            <h1 class="text-xl font-light text-white">{{ currentCharacter?.name }}</h1>
            <div class="flex items-center gap-2">
              <span 
                class="px-2 py-0.5 rounded text-xs"
                :style="{ backgroundColor: getEmotionColor(currentMood) + '20', color: getEmotionColor(currentMood) }"
              >
                {{ currentMood }}
              </span>
              <span class="text-gray-500 text-xs">{{ currentCharacter?.role }}</span>
            </div>
          </div>
        </div>
        
        <nav class="flex items-center gap-2">
          <button 
            @click="showRelations = !showRelations"
            class="p-2 rounded-lg transition-all duration-300"
            :class="showRelations ? 'bg-empathy-rose/20 text-empathy-rose' : 'bg-white/5 text-gray-400 hover:bg-white/10'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
          </button>
          <button 
            @click="$router.push('/reflection')"
            class="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-all duration-300"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </button>
        </nav>
      </div>
    </header>

    <div class="relative z-10 px-4 md:px-6">
      <div class="mb-4">
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <div class="text-gray-500 text-xs uppercase tracking-wider mb-2">Scene</div>
            <p class="text-gray-300 text-lg">{{ currentScene }}</p>
          </div>
          <div class="text-right">
            <div class="text-gray-500 text-xs uppercase tracking-wider mb-1">Chapter {{ currentChapter?.position }}/{{ storyStore.chapters.length }}</div>
            <p class="text-empathy-rose text-sm font-medium">{{ currentChapter?.title }}</p>
          </div>
        </div>
      </div>

      <div v-if="currentChapter" class="mb-6">
        <div class="glass-card p-4 bg-empathy-purple/10 border border-empathy-purple/20">
          <p class="text-gray-300 text-sm">{{ currentChapter.description }}</p>
        </div>
      </div>

      <div v-if="activeMonologue" class="mb-8">
        <div class="glass-card p-6 border-l-4 border-empathy-purple">
          <div class="flex items-start gap-4">
            <div class="text-2xl mt-1">💭</div>
            <div class="flex-1">
              <p class="text-gray-200 text-lg leading-relaxed italic">"{{ activeMonologue.content }}"</p>
              <p class="text-xs text-gray-500 mt-3">— Inner thought</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <div class="text-gray-500 text-xs uppercase tracking-wider mb-3">Memories</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="fragment in characterMemories"
            :key="fragment.id"
            @click="selectMemory(fragment.id)"
            class="group relative p-4 rounded-lg cursor-pointer transition-all duration-500"
            :class="getMemoryCardClass(fragment)"
          >
            <div class="flex items-start justify-between mb-2">
              <h4 class="text-white font-medium group-hover:text-empathy-rose transition-colors">
                {{ fragment.title }}
              </h4>
              <span 
                class="w-2 h-2 rounded-full"
                :class="memoriesStore.isExplored(fragment.id) ? 'bg-green-500' : 'bg-white/30'"
              ></span>
            </div>
            <p class="text-gray-400 text-sm line-clamp-2">{{ fragment.content }}</p>
            <div class="flex items-center gap-2 mt-3">
              <span 
                class="px-2 py-0.5 rounded text-xs"
                :style="{ backgroundColor: getEmotionColor(fragment.emotionalContent.primaryEmotion) + '20', color: getEmotionColor(fragment.emotionalContent.primaryEmotion) }"
              >
                {{ fragment.emotionalContent.primaryEmotion }}
              </span>
              <span class="text-gray-500 text-xs">{{ fragment.context?.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <div class="text-gray-500 text-xs uppercase tracking-wider mb-3">Awareness</div>
        <div class="glass-card p-4">
          <div class="flex flex-wrap gap-2">
            <div 
              v-for="info in visibleInfo" 
              :key="info.characterId"
              class="bg-white/5 px-3 py-2 rounded-lg"
            >
              <span class="text-empathy-blue text-sm">{{ getCharacterName(info.characterId) }}:</span>
              <span class="text-gray-300 text-sm ml-1">{{ info.description }}</span>
            </div>
          </div>
          
          <div v-if="revealedInfo.length > 0" class="mt-4 pt-4 border-t border-white/10">
            <div class="text-xs text-empathy-rose mb-2">Truths Uncovered</div>
            <div class="flex flex-wrap gap-2">
              <div 
                v-for="info in revealedInfo" 
                :key="info.characterId"
                class="bg-empathy-rose/10 border border-empathy-rose/30 px-3 py-2 rounded-lg"
              >
                <span class="text-empathy-rose text-sm">{{ getCharacterName(info.characterId) }}:</span>
                <span class="text-gray-300 text-sm ml-1">{{ info.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <div class="text-gray-500 text-xs uppercase tracking-wider mb-3">Current Understanding</div>
        <div class="glass-card p-4">
          <div v-if="currentCharacterEvents.length > 0">
            <div v-for="{ event, version } in currentCharacterEvents" :key="event.eventId" class="mb-4 last:mb-0">
              <div class="flex items-center gap-2 mb-2">
                <h4 class="text-white text-sm font-medium">{{ event.title }}</h4>
                <span 
                  class="px-2 py-0.5 rounded text-xs"
                  :style="{ backgroundColor: getEmotionColor(version.emotionalState) + '20', color: getEmotionColor(version.emotionalState) }"
                >
                  {{ version.emotionalState }}
                </span>
              </div>
              <p class="text-gray-300 text-sm leading-relaxed italic mb-3">"{{ version.description }}"</p>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="(assumption, index) in version.assumptions" 
                  :key="index"
                  class="bg-white/5 px-2 py-1 rounded text-xs text-gray-400"
                >
                  {{ assumption }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500 text-sm">
            Begin exploring memories to uncover {{ currentCharacter?.name }}'s perspective on events.
          </div>
        </div>
      </div>

      <div v-if="activeFragment" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div class="max-w-2xl w-full glass-card p-8 max-h-[80vh] overflow-y-auto">
          <div class="flex items-start justify-between mb-6">
            <div>
              <span 
                class="inline-block px-3 py-1 rounded-full text-xs mb-2"
                :style="{ backgroundColor: currentCharacter?.visual.colorScheme + '30', color: currentCharacter?.visual.colorScheme }"
              >
                {{ currentCharacter?.name }}
              </span>
              <h2 class="text-2xl font-light text-white">{{ activeFragment.title }}</h2>
            </div>
            <button @click="closeMemory" class="text-gray-400 hover:text-white transition-colors">
              <span class="text-2xl">×</span>
            </button>
          </div>

          <p class="text-gray-200 text-lg leading-relaxed mb-6">{{ activeFragment.content }}</p>

          <div v-if="activeFragment.sensoryDetails" class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div v-if="activeFragment.sensoryDetails.visual" class="bg-white/5 rounded-lg p-3">
              <span class="text-gray-500 text-xs">👁</span>
              <p class="text-sm text-gray-300 mt-1">{{ activeFragment.sensoryDetails.visual }}</p>
            </div>
            <div v-if="activeFragment.sensoryDetails.auditory" class="bg-white/5 rounded-lg p-3">
              <span class="text-gray-500 text-xs">👂</span>
              <p class="text-sm text-gray-300 mt-1">{{ activeFragment.sensoryDetails.auditory }}</p>
            </div>
            <div v-if="activeFragment.sensoryDetails.tactile" class="bg-white/5 rounded-lg p-3">
              <span class="text-gray-500 text-xs">🤚</span>
              <p class="text-sm text-gray-300 mt-1">{{ activeFragment.sensoryDetails.tactile }}</p>
            </div>
            <div v-if="activeFragment.sensoryDetails.olfactory" class="bg-white/5 rounded-lg p-3">
              <span class="text-gray-500 text-xs">👃</span>
              <p class="text-sm text-gray-300 mt-1">{{ activeFragment.sensoryDetails.olfactory }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <span 
                class="px-2 py-1 rounded text-sm"
                :style="{ backgroundColor: getEmotionColor(activeFragment.emotionalContent.primaryEmotion) + '30', color: getEmotionColor(activeFragment.emotionalContent.primaryEmotion) }"
              >
                {{ activeFragment.emotionalContent.primaryEmotion }}
              </span>
              <span class="text-gray-500 text-sm">Intensity: {{ Math.round(activeFragment.emotionalContent.intensity * 100) }}%</span>
            </div>
            <span class="text-gray-500 text-sm">{{ activeFragment.context?.time }} · {{ activeFragment.context?.place }}</span>
          </div>

          <div v-if="triggeredMemories.length > 0" class="mt-6 pt-6 border-t border-white/10">
            <p class="text-gray-400 text-sm mb-3">Connected Memories</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="fragment in triggeredMemories"
                :key="fragment.id"
                @click="selectMemory(fragment.id)"
                class="px-3 py-1 bg-empathy-purple/20 border border-empathy-purple/50 rounded-full text-sm text-gray-300 hover:bg-empathy-purple/30 transition-all"
              >
                {{ fragment.title }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
      <div class="flex items-center gap-2 glass-card px-4 py-2">
        <button
          v-for="char in mainCharacters"
          :key="char.id"
          @click="switchCharacter(char.id)"
          class="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300"
          :class="char.id === characterId ? 'bg-empathy-rose/30 scale-110' : 'bg-white/5 hover:bg-white/10'"
          :style="char.id === characterId ? { boxShadow: `0 0 20px ${char.visual.colorScheme}50` } : {}"
        >
          {{ char.visual.symbol }}
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showRelations" class="fixed inset-0 bg-black/90 z-50 p-4 md:p-8">
        <div class="max-w-4xl mx-auto h-full">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-light text-white">Connections</h2>
            <button @click="showRelations = false" class="text-gray-400 hover:text-white transition-colors">
              <span class="text-2xl">×</span>
            </button>
          </div>
          <div class="glass-card p-4 h-[calc(100%-60px)] overflow-hidden">
            <div ref="graphContainer" class="h-full"></div>
          </div>
        </div>
      </div>
    </Teleport>

    <InterpretationModal
      :show-modal="showInterpretationModal"
      :scenario="currentInterpretationScenario"
      :is-challenge="isRevisionChallenge"
      :previous-interpretation="previousInterpretationText"
      @close="closeInterpretationModal"
      @select="handleInterpretationSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import cytoscape from 'cytoscape'
import { useCharactersStore } from '@/stores/characters'
import { useMemoriesStore } from '@/stores/memories'
import { usePlayerStore } from '@/stores/player'
import { useEmpathyStore } from '@/stores/empathy'
import { useRelationsStore } from '@/stores/relations'
import { useInterpretationStore } from '@/stores/interpretation'
import { useStoryStore } from '@/stores/story'
import { getEmotionColor } from '@/utils/helpers'
import InterpretationModal from '@/components/InterpretationModal.vue'
import type { InnerMonologue, MemoryFragment, InterpretationOption, InterpretationScenario } from '@/types'

const route = useRoute()
const router = useRouter()
const charactersStore = useCharactersStore()
const memoriesStore = useMemoriesStore()
const playerStore = usePlayerStore()
const empathyStore = useEmpathyStore()
const relationsStore = useRelationsStore()
const interpretationStore = useInterpretationStore()
const storyStore = useStoryStore()

const characterId = computed(() => route.params.characterId as string)
const currentChapter = computed(() => storyStore.currentChapter)
const showInterpretationModal = ref(false)
const currentInterpretationScenario = ref<InterpretationScenario | null>(null)
const isRevisionChallenge = ref(false)
const previousInterpretationText = ref('')
const activeFragment = ref<MemoryFragment | null>(null)
const activeMonologue = ref<InnerMonologue | null>(null)
const showRelations = ref(false)
const graphContainer = ref<HTMLElement | null>(null)
let cy: cytoscape.Core | null = null

const mainCharacters = computed(() => 
  charactersStore.list.filter(c => ['gabriel', 'gretta', 'michael'].includes(c.id))
)

const currentCharacter = computed(() => charactersStore.getCharacterById(characterId.value))

const characterMemories = computed(() => 
  memoriesStore.unlockedFragments.filter((f: MemoryFragment) => f.characterId === characterId.value)
)

const exploredMemoryIds = computed(() => playerStore.exploredMemories)

const currentMood = computed(() => {
  const emotions = characterMemories.value
    .filter((m: MemoryFragment) => memoriesStore.isExplored(m.id))
    .map((m: MemoryFragment) => m.emotionalContent.primaryEmotion)
  return emotions[emotions.length - 1] || 'neutral'
})

const currentScene = computed(() => {
  const exploredMemories = characterMemories.value.filter((m: MemoryFragment) => memoriesStore.isExplored(m.id))
  if (exploredMemories.length === 0) {
    return 'The room is dimly lit. Shadows dance on the walls.'
  }
  const lastMemory = exploredMemories[exploredMemories.length - 1]
  return `${lastMemory.context?.place || 'A place'}, ${lastMemory.context?.time || 'a time'}`
})

const visibleInfo = computed(() => empathyStore.getVisibleInfo(characterId.value))

const revealedInfo = computed(() => empathyStore.getHiddenInfo(characterId.value, exploredMemoryIds.value))

const currentCharacterEvents = computed(() => {
  return empathyStore.getEventsForCharacter(characterId.value)
})

const suggestedMemories = computed(() => {
  const exploredIds = exploredMemoryIds.value
  const allTriggered: string[] = []
  exploredIds.forEach(memoryId => {
    const triggered = empathyStore.triggerMemoryByMemory(memoryId)
    allTriggered.push(...triggered)
  })
  return [...new Set(allTriggered)].filter(id => !exploredIds.includes(id))
})

const triggeredMemories = computed(() => {
  if (!activeFragment.value) return []
  const triggeredIds = empathyStore.triggerMemoryByMemory(activeFragment.value.id)
  return triggeredIds
    .map(id => memoriesStore.fragments.find(f => f.id === id))
    .filter((f): f is MemoryFragment => f !== undefined)
})

watch(activeFragment, (newFragment) => {
  if (newFragment) {
    const monologues = empathyStore.getInnerMonologues(characterId.value, newFragment.id)
    if (monologues.length > 0) {
      activeMonologue.value = monologues[0]
    }
  } else {
    activeMonologue.value = null
  }
})

watch(showRelations, (show) => {
  if (show) {
    nextTick(() => initGraph())
  } else {
    if (cy) {
      cy.destroy()
      cy = null
    }
  }
})

onMounted(() => {
  ensureDataLoaded().then(() => {
    charactersStore.setCurrentCharacter(characterId.value)
    triggerInitialMonologue()
  })
})

async function ensureDataLoaded() {
  if (!charactersStore.loaded) {
    await charactersStore.loadAll()
  }
  if (!memoriesStore.loaded) {
    await memoriesStore.loadAll()
  }
  if (!relationsStore.loaded) {
    await relationsStore.loadAll()
  }
}

function triggerInitialMonologue() {
  const exploredMemories = characterMemories.value.filter((m: MemoryFragment) => memoriesStore.isExplored(m.id))
  if (exploredMemories.length === 0) {
    const initialMonologues = empathyStore.getInnerMonologues(characterId.value)
    if (initialMonologues.length > 0) {
      setTimeout(() => {
        activeMonologue.value = initialMonologues[0]
      }, 1500)
    }
  }
}

function initGraph() {
  if (!graphContainer.value || !relationsStore.loaded) return

  const nodes = relationsStore.nodes.map(node => ({
    data: {
      id: node.id,
      label: node.label,
      type: node.type
    }
  }))

  const edges = relationsStore.visibleEdgesList.map(edge => ({
    data: {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      relationType: edge.relationType,
      strength: edge.strength
    }
  }))

  if (cy) cy.destroy()

  cy = cytoscape({
    container: graphContainer.value,
    elements: { nodes, edges },
    style: [
      {
        selector: 'node',
        style: {
          'label': 'data(label)',
          'font-size': '12px',
          'color': '#e8e8e8',
          'background-color': '#1e3a5f',
          'border-color': '#3b82f6',
          'border-width': 2,
          'width': 50,
          'height': 50
        }
      },
      {
        selector: 'edge',
        style: {
          'curve-style': 'bezier',
          'width': (ele: cytoscape.EdgeSingular) => (ele.data('strength') as number) * 3,
          'line-color': (ele: cytoscape.EdgeSingular) => getRelationColor(ele.data('relationType') as string)
        }
      },
      {
        selector: 'node:selected',
        style: { 'border-width': 4, 'border-color': '#8b2635' }
      }
    ],
    layout: {
      name: 'cose',
      idealEdgeLength: 120,
      fit: true,
      padding: 40
    }
  })

  cy.on('tap', 'node', () => {})
}

function getMemoryCardClass(fragment: MemoryFragment) {
  const isExplored = memoriesStore.isExplored(fragment.id)
  const isSuggested = suggestedMemories.value.includes(fragment.id)
  
  if (isSuggested && !isExplored) {
    return 'bg-empathy-purple/10 border border-empathy-purple/30 hover:bg-empathy-purple/20'
  }
  if (isExplored) {
    return 'bg-white/5 opacity-60 hover:opacity-80'
  }
  return 'bg-white/5 hover:bg-white/10'
}

function selectMemory(fragmentId: string) {
  memoriesStore.selectFragment(fragmentId)
  activeFragment.value = memoriesStore.fragments.find(f => f.id === fragmentId) || null
  playerStore.recordStep({
    action: 'view_memory',
    targetId: fragmentId,
    characterId: characterId.value,
    duration: 0
  })
  
  checkChapterCompletion(fragmentId)
  
  setTimeout(() => {
    checkInterpretationTrigger(fragmentId)
  }, 300)
  
  if (storyStore.hasReachedEnding()) {
    setTimeout(() => {
      router.push('/ending')
    }, 1500)
  }
}

function checkChapterCompletion(memoryId: string) {
  const chapter = storyStore.chapters.find(ch => ch.triggerMemoryId === memoryId)
  if (chapter && !storyStore.completedChapters.includes(chapter.id)) {
    storyStore.completeChapter(chapter.id)
  }
}

function checkInterpretationTrigger(memoryId: string) {
  const existingScenario = interpretationStore.getScenarioByMemoryId(memoryId)
  if (!existingScenario) return
  
  const existingInterpretation = interpretationStore.getCurrentInterpretation(existingScenario.id)
  
  if (existingInterpretation) {
    isRevisionChallenge.value = true
    previousInterpretationText.value = existingInterpretation.interpretation
  } else {
    isRevisionChallenge.value = false
    previousInterpretationText.value = ''
  }
  
  currentInterpretationScenario.value = existingScenario
  showInterpretationModal.value = true
}

function handleInterpretationSelect(option: InterpretationOption | null, customText: string) {
  if (!currentInterpretationScenario.value) return
  
  const isCustom = !option && !!customText
  
  interpretationStore.selectInterpretation(
    currentInterpretationScenario.value.id,
    option?.id || null,
    customText || option?.text || '',
    isCustom
  )
  
  storyStore.onInterpretationMade()
  
  showInterpretationModal.value = false
  currentInterpretationScenario.value = null
}

function closeInterpretationModal() {
  showInterpretationModal.value = false
  currentInterpretationScenario.value = null
  interpretationStore.closeModal()
}

function closeMemory() {
  activeFragment.value = null
  activeMonologue.value = null
}

function switchCharacter(newCharacterId: string) {
  playerStore.recordStep({
    action: 'switch_perspective',
    targetId: newCharacterId,
    characterId: characterId.value,
    duration: 0
  })
  activeFragment.value = null
  activeMonologue.value = null
  router.push(`/explore/${newCharacterId}`)
}

function getCharacterName(charId: string): string {
  const char = charactersStore.getCharacterById(charId)
  return char?.name || charId
}

function getRelationColor(type: string): string {
  const colors: Record<string, string> = {
    love: '#ec4899', friendship: '#10b981', conflict: '#ef4444',
    family: '#3b82f6', romantic: '#f97316', memory: '#8b5cf6'
  }
  return colors[type] || '#666'
}
</script>