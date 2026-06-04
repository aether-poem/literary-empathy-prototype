<template>
  <div class="min-h-screen bg-gradient-to-b from-[#0a0a12] via-[#0f0f1a] to-[#0a0a12] p-4 md:p-8">
    <div class="max-w-2xl mx-auto">
      <div v-if="ending" class="text-center">
        <div class="mb-8 opacity-40">
          <span class="text-6xl">{{ getEndingIcon(ending.type) }}</span>
        </div>
        
        <h1 class="text-3xl md:text-4xl font-extralight text-white mb-4 tracking-wider">
          {{ ending.title }}
        </h1>
        
        <p class="text-gray-400 text-sm tracking-widest uppercase mb-8">
          {{ getEndingTypeLabel(ending.type) }}
        </p>

        <div class="glass-card p-8 mb-8">
          <p class="text-gray-300 leading-loose text-lg italic">
            {{ ending.description }}
          </p>
        </div>

        <div class="glass-card p-8 mb-8 border-l-2" :class="getEndingBorderClass(ending.type)">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-3xl">❄️</span>
            <h2 class="text-xl font-light text-white tracking-wide">Epilogue</h2>
          </div>
          <p class="text-gray-300 leading-loose">
            {{ ending.epilogue }}
          </p>
        </div>

        <div v-if="unlockedAchievements.length > 0" class="mb-8">
          <h3 class="text-lg font-light text-white mb-4 text-center">Achievements Unlocked</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div 
              v-for="achievement in unlockedAchievements" 
              :key="achievement.id"
              class="bg-white/5 p-4 rounded-lg text-center"
            >
              <span class="text-2xl mb-2 block">{{ achievement.icon }}</span>
              <p class="text-white text-sm font-medium">{{ achievement.title }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            @click="restartJourney" 
            class="px-8 py-3 bg-white/5 border border-white/20 text-white rounded-full text-sm tracking-wider hover:bg-white/10 transition-all duration-300"
          >
            Begin New Journey
          </button>
          <button 
            @click="viewReflection" 
            class="px-8 py-3 bg-transparent border border-empathy-rose/50 text-empathy-rose rounded-full text-sm tracking-wider hover:bg-empathy-rose/10 transition-all duration-300"
          >
            View Reflection
          </button>
        </div>
      </div>

      <div v-else class="glass-card p-12 text-center">
        <span class="text-6xl mb-6 block opacity-30">❄️</span>
        <h3 class="text-xl font-light text-white mb-4">The journey continues</h3>
        <p class="text-gray-500 text-sm">Complete the story to discover your ending.</p>
        <button 
          @click="$router.push('/explore/gabriel')" 
          class="mt-6 px-8 py-3 bg-empathy-rose/20 text-empathy-rose rounded-full text-sm tracking-wider hover:bg-empathy-rose/30 transition-all duration-300"
        >
          Continue Exploring
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStoryStore } from '@/stores/story'
import type { Ending } from '@/types'

const router = useRouter()
const storyStore = useStoryStore()

const ending = computed<Ending | null>(() => storyStore.getCurrentEnding())

const unlockedAchievements = computed(() => storyStore.getUnlockedAchievementsList())

function getEndingIcon(type: string): string {
  const icons: Record<string, string> = {
    truth: '💡',
    misunderstanding: '🎭',
    redemption: '✨',
    acceptance: '❄️'
  }
  return icons[type] || '❄️'
}

function getEndingTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    truth: 'THE TRUTH ENDING',
    misunderstanding: 'THE MASK ENDING',
    redemption: 'THE AWAKENING ENDING',
    acceptance: 'THE ACCEPTANCE ENDING'
  }
  return labels[type] || 'ENDING'
}

function getEndingBorderClass(type: string): string {
  const classes: Record<string, string> = {
    truth: 'border-empathy-blue/50',
    misunderstanding: 'border-yellow-500/50',
    redemption: 'border-empathy-rose/50',
    acceptance: 'border-green-500/50'
  }
  return classes[type] || 'border-white/20'
}

function restartJourney() {
  const { usePlayerStore } = require('@/stores/player')
  usePlayerStore().clearSession()
  router.push('/')
}

function viewReflection() {
  router.push('/reflection')
}

onMounted(() => {
  if (!ending.value) {
    router.push('/explore/gabriel')
  }
})
</script>