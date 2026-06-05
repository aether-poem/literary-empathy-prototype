<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden bg-gradient-to-b from-[#0a0a12] via-[#0f0f1a] to-[#0a0a12]">
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div 
        v-for="i in 20" 
        :key="i"
        class="absolute text-white/10"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${10 + Math.random() * 10}s`,
          fontSize: `${8 + Math.random() * 12}px`
        }"
      >
        {{ ['❄️', '❅', '❆', '✻'][Math.floor(Math.random() * 4)] }}
      </div>
    </div>

    <div class="relative z-10 text-center max-w-2xl w-full">
      <div class="mb-12 opacity-60">
        <span class="text-6xl md:text-7xl">{{ '✻' }}</span>
      </div>

      <h1 class="text-4xl md:text-5xl font-extralight text-white mb-3 tracking-widest">
        THE DEAD
      </h1>
      
      <p class="text-gray-500 text-sm tracking-[0.3em] uppercase mb-8">
        by James Joyce
      </p>

      <div class="w-16 h-px bg-gradient-to-r from-transparent via-empathy-rose/50 to-transparent mx-auto mb-8"></div>

      <p class="text-gray-400 text-base md:text-lg leading-loose mb-12 font-light">
        Enter the inner lives of those who walk among us,
        <br class="hidden md:block" />
        yet remain unseen.
      </p>

      <div class="space-y-6">
        <button 
          @click="startExploration"
          class="group relative px-10 py-4 bg-transparent border border-white/20 text-white rounded-full text-base tracking-wider transition-all duration-500 hover:border-empathy-rose hover:text-empathy-rose hover:shadow-lg hover:shadow-empathy-rose/10"
        >
          <span class="relative z-10">Begin</span>
          <div class="absolute inset-0 bg-empathy-rose/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>

        <button
          @click="goToMemoryBoard"
          class="group relative px-10 py-3 bg-transparent border border-white/10 text-gray-400 rounded-full text-sm tracking-wider transition-all duration-500 hover:border-empathy-purple/50 hover:text-empathy-purple"
        >
          <span class="relative z-10">Memory Board</span>
        </button>

        <button
          @click="goToInteractiveGame"
          class="group relative px-10 py-3 bg-transparent border border-white/10 text-gray-400 rounded-full text-sm tracking-wider transition-all duration-500 hover:border-[#d7c08f]/50 hover:text-[#d7c08f]"
        >
          <span class="relative z-10">Interactive Story Game</span>
        </button>
        
        <p class="text-gray-600 text-xs tracking-wide">
          Exploration has no end. Only deeper understanding.
        </p>
      </div>
    </div>

    <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-gray-700 text-xs tracking-wider">
      Literary Empathy Experiment
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCharactersStore } from '@/stores/characters'
import { useMemoriesStore } from '@/stores/memories'
import { useRelationsStore } from '@/stores/relations'
import { useEmpathyStore } from '@/stores/empathy'
import { useInterpretationStore } from '@/stores/interpretation'
import { useStoryStore } from '@/stores/story'

const router = useRouter()
const charactersStore = useCharactersStore()
const memoriesStore = useMemoriesStore()
const relationsStore = useRelationsStore()
const empathyStore = useEmpathyStore()
const interpretationStore = useInterpretationStore()
const storyStore = useStoryStore()

onMounted(() => {
  loadData()
})

async function loadData() {
  const [, , , perspectives, triggers, events, objects, interpretations, chapters, achievements, endings] = await Promise.all([
    charactersStore.loadAll(),
    memoriesStore.loadAll(),
    relationsStore.loadAll(),
    import('@/data/works/the_dead/perspectives.json'),
    import('@/data/works/the_dead/memory_triggers.json'),
    import('@/data/works/the_dead/events.json'),
    import('@/data/works/the_dead/objects.json'),
    import('@/data/works/the_dead/interpretation_scenarios.json'),
    import('@/data/works/the_dead/story_chapters.json'),
    import('@/data/works/the_dead/achievements.json'),
    import('@/data/works/the_dead/endings.json')
  ])
  empathyStore.loadPerspectives(perspectives.default.perspectives)
  empathyStore.loadTriggers(triggers.default.triggers)
  empathyStore.loadEvents(events.default.events)
  memoriesStore.loadSceneObjects(objects.default.objects)
  interpretationStore.loadScenarios(interpretations.default.scenarios)
  storyStore.loadChapters(chapters.default.chapters)
  storyStore.loadAchievements(achievements.default.achievements)
  storyStore.loadEndings(endings.default.endings)
}

function startExploration() {
  router.push('/explore/gabriel')
}

function goToMemoryBoard() {
  router.push('/memory-board')
}

function goToInteractiveGame() {
  router.push('/interactive-game')
}
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
