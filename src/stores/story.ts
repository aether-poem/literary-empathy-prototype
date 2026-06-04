import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { StoryChapter, Achievement, Ending, StoryProgress } from '@/types'

type RawChapter = Omit<StoryChapter, 'nextChapterId'> & { nextChapterId: string | null }
type RawAchievement = Omit<Achievement, 'unlockCondition'> & { unlockCondition: { type: string; targetId?: string; count?: number } }
type RawEnding = Omit<Ending, 'type'> & { type: string }

export const useStoryStore = defineStore('story', () => {
  const chapters = ref<StoryChapter[]>([])
  const achievements = ref<Achievement[]>([])
  const endings = ref<Ending[]>([])
  const completedChapters = ref<string[]>([])
  const unlockedAchievements = ref<string[]>([])
  const currentEndingId = ref<string | null>(null)

  const currentChapter = computed(() => {
    const sortedChapters = [...chapters.value].sort((a, b) => a.position - b.position)
    for (const chapter of sortedChapters) {
      if (!completedChapters.value.includes(chapter.id)) {
        return chapter
      }
    }
    return sortedChapters[sortedChapters.length - 1] || null
  })

  const progress = computed<StoryProgress>(() => ({
    currentChapterId: currentChapter.value?.id || '',
    completedChapters: completedChapters.value,
    unlockedAchievements: unlockedAchievements.value,
    currentEndingId: currentEndingId.value
  }))

  const unlockedChapters = computed(() => {
    return chapters.value.filter(chapter => {
      if (chapter.requiredMemories.length === 0) return true
      return chapter.requiredMemories.every(memoryId => {
        const playerStore = usePlayerStore()
        return playerStore.exploredMemories.includes(memoryId)
      })
    })
  })

  function loadChapters(data: RawChapter[]) {
    chapters.value = data.map(chapter => ({
      ...chapter,
      nextChapterId: chapter.nextChapterId || undefined
    }))
  }

  function loadAchievements(data: RawAchievement[]) {
    achievements.value = data as Achievement[]
  }

  function loadEndings(data: RawEnding[]) {
    endings.value = data as Ending[]
  }

  function completeChapter(chapterId: string) {
    if (!completedChapters.value.includes(chapterId)) {
      completedChapters.value.push(chapterId)
      checkAchievements()
      checkEnding()
    }
  }

  function onInterpretationMade() {
    checkAchievements()
  }

  function checkAchievements() {
    const playerStore = usePlayerStore()
    const interpretationStore = useInterpretationStore()
    
    achievements.value.forEach(achievement => {
      if (unlockedAchievements.value.includes(achievement.id)) return
      
      const condition = achievement.unlockCondition
      let unlocked = false

      switch (condition.type) {
        case 'memory':
          if (condition.targetId) {
            unlocked = playerStore.exploredMemories.includes(condition.targetId)
          } else if (condition.count) {
            unlocked = playerStore.exploredMemories.length >= condition.count
          }
          break
        case 'chapter':
          if (condition.count) {
            unlocked = completedChapters.value.length >= condition.count
          }
          break
        case 'interpretation':
          if (condition.count) {
            const interpretations = interpretationStore.getAllInterpretations()
            unlocked = interpretations.length >= condition.count
          }
          break
        case 'exploration':
          if (condition.count) {
            unlocked = playerStore.exploredCharacters.length >= condition.count
          }
          break
      }

      if (unlocked) {
        unlockedAchievements.value.push(achievement.id)
      }
    })
  }

  function checkEnding() {
    for (const ending of endings.value) {
      const allAchievementsUnlocked = ending.requiredAchievements.every(
        achId => unlockedAchievements.value.includes(achId)
      )
      if (allAchievementsUnlocked) {
        currentEndingId.value = ending.id
        break
      }
    }
  }

  function getCurrentEnding(): Ending | null {
    if (!currentEndingId.value) return null
    return endings.value.find(e => e.id === currentEndingId.value) || null
  }

  function getUnlockedAchievementsList(): Achievement[] {
    return achievements.value.filter(a => unlockedAchievements.value.includes(a.id))
  }

  function hasReachedEnding(): boolean {
    return currentEndingId.value !== null
  }

  return {
    chapters,
    achievements,
    endings,
    completedChapters,
    unlockedAchievements,
    currentEndingId,
    currentChapter,
    progress,
    unlockedChapters,
    loadChapters,
    loadAchievements,
    loadEndings,
    completeChapter,
    checkAchievements,
    checkEnding,
    getCurrentEnding,
    getUnlockedAchievementsList,
    hasReachedEnding,
    onInterpretationMade
  }
})

function usePlayerStore() {
  const { usePlayerStore: store } = require('@/stores/player')
  return store()
}

function useInterpretationStore() {
  const { useInterpretationStore: store } = require('@/stores/interpretation')
  return store()
}