import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Character } from '@/types'
import { loadCharacters } from '@/utils/dataLoader'

export const useCharactersStore = defineStore('characters', () => {
  const list = ref<Character[]>([])
  const currentCharacter = ref<Character | null>(null)
  const emotionalHistory = ref<Record<string, number[]>>({})

  const loaded = computed(() => list.value.length > 0)

  async function loadAll() {
    list.value = await loadCharacters()
  }

  function setCurrentCharacter(characterId: string) {
    currentCharacter.value = list.value.find(c => c.id === characterId) || null
    if (!emotionalHistory.value[characterId]) {
      emotionalHistory.value[characterId] = []
    }
  }

  function updateEmotion(characterId: string, emotion: number) {
    if (!emotionalHistory.value[characterId]) {
      emotionalHistory.value[characterId] = []
    }
    emotionalHistory.value[characterId].push(emotion)
  }

  function getCharacterById(id: string): Character | undefined {
    return list.value.find(c => c.id === id)
  }

  return {
    list,
    currentCharacter,
    emotionalHistory,
    loaded,
    loadAll,
    setCurrentCharacter,
    updateEmotion,
    getCharacterById
  }
})