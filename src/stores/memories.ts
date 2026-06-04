import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MemoryFragment, SceneObject, MemoryCluster, PlayerMemoryStructure, EmotionTag, PlayerNote, CustomMemoryLink } from '@/types'
import { loadMemories } from '@/utils/dataLoader'
import { generateId } from '@/utils/helpers'
import { useStoryStore } from './story'
import { useInterpretationStore } from './interpretation'

type FilterType = 'all' | 'emotional' | 'recent'

export const useMemoriesStore = defineStore('memories', () => {
  const fragments = ref<MemoryFragment[]>([])
  const activeFragmentId = ref<string | null>(null)
  const exploredFragments = ref<Set<string>>(new Set())
  const currentFilter = ref<FilterType>('all')
  const sceneObjects = ref<SceneObject[]>([])
  const playerMemoryStructure = ref<PlayerMemoryStructure | null>(null)
  const memoryArrangement = ref<Array<{ fragmentId: string; position: { x: number; y: number } }>>([])
  const playerNotes = ref<PlayerNote[]>([])
  const customLinks = ref<CustomMemoryLink[]>([])

  const loaded = computed(() => fragments.value.length > 0)

  const activeFragment = computed(() => 
    fragments.value.find(f => f.id === activeFragmentId.value) || null
  )

  const filteredFragments = computed(() => {
    let result = [...fragments.value]
    switch (currentFilter.value) {
      case 'emotional':
        result = result.filter(f => f.emotionalContent.intensity > 0.6)
        break
      case 'recent':
        result = result.sort((a, b) => (b.narrativePosition || 0) - (a.narrativePosition || 0))
        break
    }
    return result
  })

  function isUnlocked(fragment: MemoryFragment): boolean {
    if (!fragment.unlockConditions) return true

    const { type, chapterId, memoryId, scenarioId } = fragment.unlockConditions
    const storyStore = useStoryStore()
    const interpretationStore = useInterpretationStore()

    switch (type) {
      case 'always':
        return true
      case 'chapter_completed':
        return chapterId ? storyStore.completedChapters.includes(chapterId) : true
      case 'memory_explored':
        return memoryId ? exploredFragments.value.has(memoryId) : true
      case 'interpretation_made':
        return scenarioId ? interpretationStore.getCurrentInterpretation(scenarioId) !== undefined : true
      default:
        return true
    }
  }

  const unlockedFragments = computed(() => 
    fragments.value.filter(f => isUnlocked(f))
  )

  const memoryClusters = computed((): MemoryCluster[] => {
    const clusters: Record<EmotionTag, MemoryFragment[]> = {
      love: [],
      loss: [],
      regret: [],
      shame: [],
      fear: []
    }
    
    fragments.value.forEach(fragment => {
      clusters[fragment.emotionTag].push(fragment)
    })

    return Object.entries(clusters)
      .map(([tag, frags]) => ({
        emotionTag: tag as EmotionTag,
        fragments: frags
      }))
      .filter(cluster => cluster.fragments.length > 0)
      .sort((a, b) => b.fragments.length - a.fragments.length)
  })

  const unlockedMemories = computed(() => 
    fragments.value.filter(f => exploredFragments.value.has(f.id))
  )

  const lockedMemories = computed(() => 
    fragments.value.filter(f => !exploredFragments.value.has(f.id))
  )

  async function loadAll() {
    fragments.value = await loadMemories()
  }

  async function loadSceneObjects(objects: SceneObject[]) {
    sceneObjects.value = objects
  }

  function selectFragment(fragmentId: string) {
    activeFragmentId.value = fragmentId
    markAsExplored(fragmentId)
  }

  function markAsExplored(fragmentId: string) {
    exploredFragments.value.add(fragmentId)
  }

  function isExplored(fragmentId: string): boolean {
    return exploredFragments.value.has(fragmentId)
  }

  function setFilter(filter: FilterType) {
    currentFilter.value = filter
  }

  function getFragmentsByCharacter(characterId: string): MemoryFragment[] {
    return fragments.value.filter(f => f.characterId === characterId)
  }

  function interactWithObject(objectId: string): MemoryFragment | null {
    const sceneObject = sceneObjects.value.find(o => o.id === objectId)
    if (!sceneObject || !sceneObject.interactable || !sceneObject.unlocksMemory) {
      return null
    }

    const memory = fragments.value.find(f => f.id === sceneObject.unlocksMemory)
    if (memory && !exploredFragments.value.has(memory.id)) {
      markAsExplored(memory.id)
      sceneObject.interactable = false
      return memory
    }
    return null
  }

  function updateMemoryPosition(fragmentId: string, x: number, y: number) {
    const existing = memoryArrangement.value.find(a => a.fragmentId === fragmentId)
    if (existing) {
      existing.position = { x, y }
    } else {
      memoryArrangement.value.push({ fragmentId, position: { x, y } })
    }
  }

  function addNote(memoryId: string, content: string): PlayerNote {
    const note: PlayerNote = {
      id: generateId(),
      memoryId,
      content,
      timestamp: Date.now()
    }
    playerNotes.value.push(note)
    
    const fragment = fragments.value.find(f => f.id === memoryId)
    if (fragment) {
      if (!fragment.playerNotes) {
        fragment.playerNotes = []
      }
      fragment.playerNotes.push(note)
    }
    
    return note
  }

  function getNotesForMemory(memoryId: string): PlayerNote[] {
    return playerNotes.value.filter(n => n.memoryId === memoryId)
  }

  function addCustomLink(sourceMemoryId: string, targetMemoryId: string, description: string): CustomMemoryLink {
    const existingLink = customLinks.value.find(
      link => (link.sourceMemoryId === sourceMemoryId && link.targetMemoryId === targetMemoryId) ||
              (link.sourceMemoryId === targetMemoryId && link.targetMemoryId === sourceMemoryId)
    )
    
    if (existingLink) {
      existingLink.description = description
      existingLink.timestamp = Date.now()
      return existingLink
    }

    const link: CustomMemoryLink = {
      id: generateId(),
      sourceMemoryId,
      targetMemoryId,
      description,
      timestamp: Date.now()
    }
    customLinks.value.push(link)
    
    return link
  }

  function getLinksForMemory(memoryId: string): CustomMemoryLink[] {
    return customLinks.value.filter(
      link => link.sourceMemoryId === memoryId || link.targetMemoryId === memoryId
    )
  }

  function reconstructMemory(): PlayerMemoryStructure {
    const exploredIds = Array.from(exploredFragments.value)
    const exploredFrags = fragments.value.filter(f => exploredIds.includes(f.id))
    
    const clusters: MemoryCluster[] = []
    const tagGroups: Record<EmotionTag, MemoryFragment[]> = {
      love: [],
      loss: [],
      regret: [],
      shame: [],
      fear: []
    }

    exploredFrags.forEach(frag => {
      tagGroups[frag.emotionTag].push(frag)
    })

    Object.entries(tagGroups).forEach(([tag, frags]) => {
      if (frags.length > 0) {
        clusters.push({
          emotionTag: tag as EmotionTag,
          fragments: frags
        })
      }
    })

    const narratives = [
      'In the silence between heartbeats, these moments weave together into a tapestry of longing and loss.',
      'The threads of memory connect past and present, revealing truths hidden in plain sight.',
      'Each fragment is a piece of a larger story - one that only you can fully understand.',
      'Through these memories, a portrait emerges of love that transcends time and death.',
      'The emotions you have uncovered tell a story uniquely yours, shaped by how you chose to see.',
      'Your notes and reflections have added new layers to this story, making it truly your own.'
    ]

    const narrative = narratives[Math.floor(Math.random() * narratives.length)]

    const structure: PlayerMemoryStructure = {
      id: generateId(),
      clusters,
      arrangement: memoryArrangement.value,
      narrative,
      timestamp: Date.now()
    }

    playerMemoryStructure.value = structure
    return structure
  }

  function getConnectedFragments(fragmentId: string): MemoryFragment[] {
    const fragment = fragments.value.find(f => f.id === fragmentId)
    if (!fragment) return []
    return fragment.connectedFragments
      .map(id => fragments.value.find(f => f.id === id))
      .filter((f): f is MemoryFragment => f !== undefined)
  }

  function getAllCustomLinks(): CustomMemoryLink[] {
    return customLinks.value
  }

  function getAllPlayerNotes(): PlayerNote[] {
    return playerNotes.value
  }

  return {
    fragments,
    activeFragmentId,
    activeFragment,
    exploredFragments,
    currentFilter,
    filteredFragments,
    loaded,
    sceneObjects,
    playerMemoryStructure,
    memoryArrangement,
    memoryClusters,
    unlockedFragments,
    unlockedMemories,
    lockedMemories,
    playerNotes,
    customLinks,
    loadAll,
    loadSceneObjects,
    selectFragment,
    markAsExplored,
    isExplored,
    isUnlocked,
    setFilter,
    getFragmentsByCharacter,
    interactWithObject,
    updateMemoryPosition,
    addNote,
    getNotesForMemory,
    addCustomLink,
    getLinksForMemory,
    reconstructMemory,
    getConnectedFragments,
    getAllCustomLinks,
    getAllPlayerNotes
  }
})