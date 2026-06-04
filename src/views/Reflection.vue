<template>
  <div class="min-h-screen bg-gradient-to-b from-[#0a0a12] via-[#0f0f1a] to-[#0a0a12] p-4 md:p-8">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-12">
        <div class="mb-6 opacity-40">
          <span class="text-5xl">✧</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-extralight text-white mb-2 tracking-wider">
          REFLECTION
        </h1>
        <p class="text-gray-500 text-sm tracking-widest uppercase">What have you seen?</p>
      </div>

      <div v-if="empathyResult" class="space-y-8">
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-4 px-6 py-3 bg-white/5 rounded-full">
            <span class="text-gray-400 text-sm">Voices heard</span>
            <span class="w-8 h-px bg-gray-600"></span>
            <span class="text-empathy-rose text-lg">{{ playerStore.exploredCharacters.length }}</span>
          </div>
          <div class="inline-flex items-center gap-4 px-6 py-3 bg-white/5 rounded-full mt-3">
            <span class="text-gray-400 text-sm">Memories uncovered</span>
            <span class="w-8 h-px bg-gray-600"></span>
            <span class="text-empathy-purple text-lg">{{ playerStore.exploredMemories.length }}</span>
          </div>
        </div>

        <div class="prose prose-invert max-w-none">
          <div class="glass-card p-8 md:p-10">
            <div class="text-center mb-8">
              <span class="text-6xl opacity-30">❄️</span>
            </div>
            <p class="text-gray-300 leading-loose text-lg italic text-center">
              {{ empathyResult.narrativeArc }}
            </p>
          </div>
        </div>

        <div class="glass-card p-8">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-2xl">💡</span>
            <h2 class="text-xl font-light text-white tracking-wide">First Understanding</h2>
          </div>
          <div class="flex items-start gap-4">
            <div 
              class="w-14 h-14 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
              :style="{ backgroundColor: getCharacterColor(empathyResult.firstUnderstood) + '20' }"
            >
              {{ getCharacterSymbol(empathyResult.firstUnderstood) }}
            </div>
            <div>
              <p class="text-lg text-white mb-2">{{ getCharacterName(empathyResult.firstUnderstood) }}</p>
              <p class="text-gray-400 text-sm leading-relaxed">{{ getFirstUnderstandingText(empathyResult.firstUnderstood) }}</p>
            </div>
          </div>
        </div>

        <div v-if="empathyResult.overlooked.length > 0" class="glass-card p-8 border-l-2 border-yellow-500/50">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-2xl">👁️</span>
            <h2 class="text-xl font-light text-white tracking-wide">Unheard Voices</h2>
          </div>
          <p class="text-gray-400 text-sm mb-6 italic">"There are stories yet untold."</p>
          <div class="space-y-4">
            <div 
              v-for="charId in empathyResult.overlooked" 
              :key="charId"
              class="flex items-center gap-4 bg-white/5 p-4 rounded-lg"
            >
              <span class="text-2xl opacity-60">{{ getCharacterSymbol(charId) }}</span>
              <div>
                <p class="text-white text-sm">{{ getCharacterName(charId) }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ getOverlookedText(charId) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="empathyResult.misread.length > 0" class="glass-card p-8 border-l-2 border-empathy-rose/50">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-2xl">🔍</span>
            <h2 class="text-xl font-light text-white tracking-wide">Misread Hearts</h2>
          </div>
          <p class="text-gray-400 text-sm mb-6 italic">"We see not with the eyes, but with the heart."</p>
          <div class="space-y-4">
            <div 
              v-for="misunderstanding in empathyResult.misread" 
              :key="misunderstanding.characterId"
              class="bg-empathy-rose/5 p-4 rounded-lg border border-empathy-rose/20"
            >
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg opacity-60">{{ getCharacterSymbol(misunderstanding.characterId) }}</span>
                <span class="text-white text-sm">{{ getCharacterName(misunderstanding.characterId) }}</span>
              </div>
              <p class="text-gray-300 text-sm italic">"{{ misunderstanding.misunderstanding }}"</p>
            </div>
          </div>
        </div>

        <div v-if="empathyResult.discoveredEmotions.length > 0" class="glass-card p-8 border-l-2 border-green-500/50">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-2xl">❤️</span>
            <h2 class="text-xl font-light text-white tracking-wide">Emotions Uncovered</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              v-for="emotionData in empathyResult.discoveredEmotions" 
              :key="emotionData.characterId"
              class="bg-white/5 p-4 rounded-lg"
            >
              <div class="flex items-center gap-2 mb-3">
                <span class="text-xl opacity-60">{{ getCharacterSymbol(emotionData.characterId) }}</span>
                <span class="text-white text-sm">{{ getCharacterName(emotionData.characterId) }}</span>
              </div>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="emotion in emotionData.emotions" 
                  :key="emotion"
                  class="px-2 py-0.5 rounded text-xs"
                  :style="{ backgroundColor: getEmotionColor(emotion) + '20', color: getEmotionColor(emotion) }"
                >
                  {{ emotion }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="empathyReport" class="space-y-6">
          <div class="glass-card p-8 border-l-2 border-empathy-blue/50">
            <div class="flex items-center gap-3 mb-6">
              <span class="text-2xl">📖</span>
              <h2 class="text-xl font-light text-white tracking-wide">Empathy Report</h2>
            </div>
            
            <div class="space-y-6">
              <div>
                <h3 class="text-empathy-blue text-sm font-medium mb-3">Your Earliest Belief</h3>
                <p class="text-gray-300 italic">"{{ empathyReport.earliestBelief }}"</p>
              </div>

              <div v-if="empathyReport.misunderstoodCharacters.length > 0">
                <h3 class="text-empathy-rose text-sm font-medium mb-3">Misunderstandings</h3>
                <div class="space-y-3">
                  <div 
                    v-for="misunderstanding in empathyReport.misunderstoodCharacters" 
                    :key="misunderstanding.characterId"
                    class="bg-empathy-rose/5 p-3 rounded-lg"
                  >
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-lg">{{ getCharacterSymbol(misunderstanding.characterId) }}</span>
                      <span class="text-white text-sm">{{ getCharacterName(misunderstanding.characterId) }}</span>
                    </div>
                    <p class="text-gray-400 text-sm italic">You thought: "{{ misunderstanding.misunderstanding }}"</p>
                  </div>
                </div>
              </div>

              <div v-if="empathyReport.revisionNodes.length > 0">
                <h3 class="text-empathy-purple text-sm font-medium mb-3">Revision Journey</h3>
                <div class="relative">
                  <div class="absolute left-4 top-0 bottom-0 w-px bg-white/10"></div>
                  <div class="space-y-4">
                    <div 
                      v-for="(node, index) in empathyReport.revisionNodes" 
                      :key="index"
                      class="relative pl-12"
                    >
                      <div class="absolute left-2 w-5 h-5 rounded-full bg-empathy-purple/30 border border-empathy-purple/50"></div>
                      <div class="bg-white/5 p-3 rounded-lg">
                        <p class="text-gray-500 text-xs mb-1">Revision {{ index + 1 }}</p>
                        <p class="text-gray-400 text-sm line-through italic mb-1">"{{ node.oldInterpretation }}"</p>
                        <p class="text-empathy-purple text-sm italic">"{{ node.newInterpretation }}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-empathy-green text-sm font-medium mb-3">Your Empathy Path</h3>
                <div class="flex flex-wrap items-center gap-2">
                  <template v-for="(step, index) in empathyReport.empathyPath" :key="index">
                    <span 
                      class="px-3 py-1 rounded-full text-xs"
                      :class="index === empathyReport.empathyPath.length - 1 
                        ? 'bg-empathy-green/20 text-empathy-green' 
                        : 'bg-white/5 text-gray-400'"
                    >
                      {{ step }}
                    </span>
                    <span v-if="index < empathyReport.empathyPath.length - 1" class="text-gray-600">→</span>
                  </template>
                </div>
              </div>

              <div class="pt-4 border-t border-white/10">
                <p class="text-gray-300 italic text-sm leading-relaxed">
                  {{ empathyReport.narrativeSummary }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card p-8 text-center">
          <div class="mb-6">
            <span class="text-4xl opacity-30">✧</span>
          </div>
          <p class="text-gray-400 italic text-sm leading-relaxed">
            "His soul swooned slowly as he heard the snow falling faintly through the universe 
            and faintly falling, like the descent of their last end, 
            upon all the living and the dead."
          </p>
          <p class="text-gray-600 text-xs mt-4">— The Dead, James Joyce</p>
        </div>
      </div>

      <div v-else class="glass-card p-12 text-center">
        <span class="text-6xl mb-6 block opacity-30">❄️</span>
        <h3 class="text-xl font-light text-white mb-4">Your journey awaits</h3>
        <p class="text-gray-500 text-sm">Begin exploring the characters' perspectives to discover their stories.</p>
      </div>

      <div class="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <button 
          @click="continueExploring" 
          class="px-8 py-3 bg-transparent border border-white/20 text-white rounded-full text-sm tracking-wider hover:border-empathy-rose hover:text-empathy-rose transition-all duration-300"
        >
          Continue Exploring
        </button>
        <button 
          @click="resetSession" 
          class="px-8 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-full text-sm tracking-wider hover:bg-white/10 hover:text-white transition-all duration-300"
        >
          Start New Journey
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useCharactersStore } from '@/stores/characters'
import { useEmpathyStore } from '@/stores/empathy'
import { useInterpretationStore } from '@/stores/interpretation'
import { getEmotionColor } from '@/utils/helpers'
import type { EmpathyResult, EmpathyReport } from '@/types'

const router = useRouter()
const playerStore = usePlayerStore()
const charactersStore = useCharactersStore()
const empathyStore = useEmpathyStore()
const interpretationStore = useInterpretationStore()

const empathyReport = computed<EmpathyReport | null>(() => {
  if (playerStore.exploredCharacters.length === 0) return null
  return interpretationStore.generateEmpathyReport()
})

const explorationOrder = computed(() => 
  playerStore.explorationPath
    .filter(s => s.action === 'select_character')
    .map(s => s.targetId)
)

const empathyResult = computed<EmpathyResult | null>(() => {
  if (playerStore.exploredCharacters.length === 0) return null
  return empathyStore.generateEmpathyResult(
    playerStore.exploredCharacters,
    playerStore.exploredMemories,
    explorationOrder.value
  )
})

function getCharacterName(charId: string): string {
  const char = charactersStore.getCharacterById(charId)
  return char?.name || charId
}

function getCharacterSymbol(charId: string): string {
  const char = charactersStore.getCharacterById(charId)
  return char?.visual.symbol || '?'
}

function getCharacterColor(charId: string): string {
  const char = charactersStore.getCharacterById(charId)
  return char?.visual.colorScheme || '#ffffff'
}

function getFirstUnderstandingText(charId: string): string {
  const texts: Record<string, string> = {
    gabriel: 'You first saw the world through Gabriel\'s anxious eyes, feeling his intellectual distance and hidden insecurities.',
    gretta: 'You began by understanding Gretta\'s quiet melancholy, sensing the depth of emotions beneath her gentle exterior.',
    michael: 'You started with Michael, feeling the intensity of a love that transcends even death itself.'
  }
  return texts[charId] || 'Your journey began with this character.'
}

function getOverlookedText(charId: string): string {
  const texts: Record<string, string> = {
    gabriel: 'There are vulnerabilities yet to discover.',
    gretta: 'Secrets of love and loss await.',
    michael: 'A love that defies mortality.'
  }
  return texts[charId] || 'There is more to discover.'
}

function continueExploring() {
  const lastCharacter = playerStore.exploredCharacters[playerStore.exploredCharacters.length - 1]
  if (lastCharacter) {
    router.push(`/explore/${lastCharacter}`)
  } else {
    router.push('/explore/gabriel')
  }
}

function resetSession() {
  playerStore.clearSession()
  router.push('/')
}
</script>