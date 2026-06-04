<template>
  <div class="min-h-screen p-8 md:p-16">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-light text-white mb-4">Choose a Perspective</h1>
        <p class="text-gray-400">Each character sees the world through their own lens. What will you discover?</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="character in charactersStore.list"
          :key="character.id"
          @click="selectCharacter(character.id)"
          class="glass-card p-6 cursor-pointer transition-all duration-300 hover:border-empathy-rose/50 hover:bg-empathy-rose/10 group"
        >
          <div class="flex items-start gap-4">
            <div 
              class="w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110"
              :style="{ backgroundColor: character.visual.colorScheme + '30' }"
            >
              {{ character.visual.symbol }}
            </div>
            
            <div class="flex-1">
              <h3 class="text-xl font-medium text-white mb-1">{{ character.name }}</h3>
              <p class="text-sm text-gray-400 mb-3">{{ character.role }}</p>
              <p class="text-gray-300 text-sm leading-relaxed">{{ character.description }}</p>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-white/10">
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">Emotional State:</span>
              <div class="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-500"
                  :style="{ 
                    width: ((character.emotionalBaseline.mood + 1) * 50) + '%',
                    backgroundColor: character.visual.colorScheme
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 text-center">
        <button 
          @click="goToGraph"
          class="px-8 py-3 border border-white/20 text-white rounded-lg transition-all duration-300 hover:bg-white/10"
        >
          View Relationship Map
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCharactersStore } from '@/stores/characters'
import { usePlayerStore } from '@/stores/player'

const router = useRouter()
const charactersStore = useCharactersStore()
const playerStore = usePlayerStore()

function selectCharacter(characterId: string) {
  playerStore.recordStep({
    action: 'select_character',
    targetId: characterId,
    characterId: characterId,
    duration: 0
  })
  router.push(`/explore/${characterId}`)
}

function goToGraph() {
  router.push('/graph')
}
</script>