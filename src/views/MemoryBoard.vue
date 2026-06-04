<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0a0a12] via-[#12121f] to-[#0d0d1a] relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-empathy-rose/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-empathy-purple/5 rounded-full blur-3xl"></div>
    </div>

    <header class="relative z-10 p-4 md:p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-light text-white">Memory Board</h1>
          <p class="text-gray-500 text-sm">Arrange the fragments to reconstruct the story</p>
        </div>
        <nav class="flex items-center gap-2">
          <button
            @click="$router.push('/explore/gabriel')"
            class="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-all duration-300"
          >
            Back
          </button>
          <button
            @click="reconstructMemory"
            class="px-4 py-2 rounded-lg bg-empathy-rose/20 text-empathy-rose hover:bg-empathy-rose/30 transition-all duration-300"
            :disabled="memoriesStore.unlockedMemories.length < 2"
          >
            Reconstruct Memory
          </button>
        </nav>
      </div>
    </header>

    <div class="relative z-10 px-4 md:px-6">
      <div class="mb-6">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-green-500"></span>
            <span class="text-gray-400 text-sm">Discovered: {{ memoriesStore.unlockedMemories.length }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-white/30"></span>
            <span class="text-gray-400 text-sm">Undiscovered: {{ memoriesStore.lockedMemories.length }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-empathy-rose"></span>
            <span class="text-gray-400 text-sm">Your Notes: {{ memoriesStore.getAllPlayerNotes().length }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-3">
          <div class="glass-card p-6 min-h-[500px] relative">
            <div class="text-gray-500 text-xs uppercase tracking-wider mb-4">Memory Clusters</div>
            
            <div v-if="unlockedClusters.length === 0" class="flex items-center justify-center h-[400px]">
              <p class="text-gray-500">Begin exploring to unlock memories</p>
            </div>

            <div v-else class="space-y-6">
              <div
                v-for="cluster in unlockedClusters"
                :key="cluster.emotionTag"
                class="border-l-2 pl-4"
                :style="{ borderLeftColor: getEmotionTagColor(cluster.emotionTag) }"
              >
                <div class="flex items-center gap-3 mb-3">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    :style="{ backgroundColor: getEmotionTagColor(cluster.emotionTag) + '30', color: getEmotionTagColor(cluster.emotionTag) }"
                  >
                    {{ cluster.emotionTag }}
                  </span>
                  <span class="text-gray-500 text-sm">{{ cluster.fragments.length }} memories</span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    v-for="fragment in cluster.fragments"
                    :key="fragment.id"
                    @click="openMemoryDetail(fragment)"
                    class="p-4 rounded-lg cursor-pointer transition-all duration-300"
                    :class="memoriesStore.isExplored(fragment.id) ? 'bg-white/10 hover:bg-white/15' : 'bg-white/5 opacity-50'"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <h4 class="text-white font-medium text-sm">{{ fragment.title }}</h4>
                        <p class="text-gray-400 text-xs mt-1 line-clamp-2">{{ fragment.content }}</p>
                      </div>
                      <span
                        class="w-2 h-2 rounded-full ml-2 mt-1"
                        :class="memoriesStore.isExplored(fragment.id) ? 'bg-green-500' : 'bg-white/30'"
                      ></span>
                    </div>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="text-xs text-gray-500">{{ getCharacterName(fragment.characterId) }}</span>
                      <span v-if="memoriesStore.getNotesForMemory(fragment.id).length > 0" class="text-xs text-empathy-rose">
                        {{ memoriesStore.getNotesForMemory(fragment.id).length }} note(s)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="glass-card p-4 mb-4">
            <div class="text-gray-500 text-xs uppercase tracking-wider mb-3">Scene Objects</div>
            <div class="space-y-2">
              <div
                v-for="obj in memoriesStore.sceneObjects"
                :key="obj.id"
                @click="interactWithObject(obj)"
                class="p-3 rounded-lg cursor-pointer transition-all duration-300"
                :class="obj.interactable ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 opacity-50'"
                :title="obj.hint"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    {{ getObjectIcon(obj.name) }}
                  </div>
                  <div class="flex-1">
                    <p class="text-white text-sm">{{ obj.name }}</p>
                    <p class="text-gray-500 text-xs">{{ obj.location }}</p>
                  </div>
                  <svg v-if="obj.interactable" class="w-4 h-4 text-empathy-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="glass-card p-4">
            <div class="text-gray-500 text-xs uppercase tracking-wider mb-3">Discovered Memories</div>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div
                v-for="memory in memoriesStore.unlockedMemories"
                :key="memory.id"
                @click="openMemoryDetail(memory)"
                class="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-all"
              >
                <span class="w-2 h-2 rounded-full bg-green-500"></span>
                <span class="text-gray-300 text-sm truncate flex-1">{{ memory.title }}</span>
                <span v-if="memoriesStore.getNotesForMemory(memory.id).length > 0" class="text-xs text-empathy-rose">✎</span>
              </div>
              <div v-if="memoriesStore.unlockedMemories.length === 0" class="text-gray-500 text-sm text-center py-4">
                No memories discovered yet
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showMemoryDetail && selectedMemory" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div class="max-w-lg w-full glass-card p-6 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-xl font-light text-white">{{ selectedMemory.title }}</h2>
              <span class="text-gray-500 text-sm">{{ getCharacterName(selectedMemory.characterId) }}</span>
            </div>
            <button @click="closeMemoryDetail" class="text-gray-400 hover:text-white transition-colors">
              <span class="text-2xl">×</span>
            </button>
          </div>

          <div class="bg-empathy-purple/20 border border-empathy-purple/30 rounded-lg p-4 mb-6">
            <p class="text-gray-200 leading-relaxed">{{ selectedMemory.content }}</p>
          </div>

          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-gray-400 text-sm">Your Notes</h3>
              <button
                @click="addNewNote"
                class="text-xs text-empathy-rose hover:text-empathy-rose/80 transition-colors"
              >
                + Add Note
              </button>
            </div>
            
            <div v-if="showNoteInput" class="mb-4">
              <textarea
                v-model="newNoteContent"
                class="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-empathy-rose/50 transition-all"
                rows="3"
                placeholder="Write your thoughts about this memory..."
              ></textarea>
              <div class="flex justify-end gap-2 mt-2">
                <button @click="cancelNote" class="px-3 py-1 text-xs text-gray-400 hover:text-white">Cancel</button>
                <button @click="saveNote" class="px-3 py-1 text-xs bg-empathy-rose/20 text-empathy-rose rounded-lg hover:bg-empathy-rose/30">Save</button>
              </div>
            </div>

            <div class="space-y-3 max-h-40 overflow-y-auto">
              <div
                v-for="note in currentNotes"
                :key="note.id"
                class="bg-white/5 p-3 rounded-lg"
              >
                <p class="text-gray-300 text-sm">{{ note.content }}</p>
                <p class="text-gray-500 text-xs mt-1">{{ formatTime(note.timestamp) }}</p>
              </div>
              <div v-if="currentNotes.length === 0 && !showNoteInput" class="text-gray-500 text-sm text-center py-4">
                No notes yet. Add your thoughts about this memory.
              </div>
            </div>
          </div>

          <div v-if="showLinkMode" class="mb-6 p-4 bg-empathy-blue/10 border border-empathy-blue/30 rounded-lg">
            <p class="text-empathy-blue text-sm mb-3">Select another memory to link to this one</p>
            <div class="max-h-32 overflow-y-auto space-y-2">
              <div
                v-for="memory in linkableMemories"
                :key="memory.id"
                @click="createLink(memory.id)"
                class="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10"
              >
                <span class="w-2 h-2 rounded-full bg-empathy-blue"></span>
                <span class="text-gray-300 text-sm">{{ memory.title }}</span>
              </div>
            </div>
            <button @click="cancelLinkMode" class="mt-3 w-full py-2 text-sm text-gray-400 hover:text-white">Cancel Link Mode</button>
          </div>

          <div v-if="currentLinks.length > 0" class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-gray-400 text-sm">Your Connections</h3>
              <button
                @click="showLinkMode = true"
                class="text-xs text-empathy-blue hover:text-empathy-blue/80 transition-colors"
              >
                + Connect to Another Memory
              </button>
            </div>
            <div class="space-y-2">
              <div
                v-for="link in currentLinks"
                :key="link.id"
                class="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
              >
                <div class="text-empathy-blue">↔️</div>
                <div class="flex-1">
                  <p class="text-gray-300 text-sm">{{ getLinkedMemoryTitle(link) }}</p>
                  <p v-if="link.description" class="text-gray-500 text-xs">{{ link.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <button
            v-if="!showLinkMode && currentLinks.length === 0"
            @click="showLinkMode = true"
            class="w-full py-2 text-sm text-empathy-blue hover:text-empathy-blue/80 border border-empathy-blue/30 rounded-lg"
          >
            + Connect to Another Memory
          </button>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showReconstruction" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div class="max-w-2xl w-full glass-card p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-light text-white">Your Memory Reconstruction</h2>
            <button @click="showReconstruction = false" class="text-gray-400 hover:text-white transition-colors">
              <span class="text-2xl">×</span>
            </button>
          </div>

          <div v-if="reconstructedMemory" class="space-y-6">
            <div class="bg-empathy-purple/20 border border-empathy-purple/30 rounded-lg p-4">
              <p class="text-gray-200 text-lg leading-relaxed italic">
                "{{ reconstructedMemory.narrative }}"
              </p>
            </div>

            <div>
              <h3 class="text-gray-400 text-sm mb-3">Your Clusters</h3>
              <div class="space-y-3">
                <div
                  v-for="cluster in reconstructedMemory.clusters"
                  :key="cluster.emotionTag"
                  class="border-l-2 pl-4"
                  :style="{ borderLeftColor: getEmotionTagColor(cluster.emotionTag) }"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <span
                      class="px-2 py-0.5 rounded text-xs"
                      :style="{ backgroundColor: getEmotionTagColor(cluster.emotionTag) + '30', color: getEmotionTagColor(cluster.emotionTag) }"
                    >
                      {{ cluster.emotionTag }}
                    </span>
                  </div>
                  <ul class="text-gray-300 text-sm space-y-1">
                    <li v-for="frag in cluster.fragments" :key="frag.id">- {{ frag.title }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div v-if="memoriesStore.getAllPlayerNotes().length > 0">
              <h3 class="text-gray-400 text-sm mb-3">Your Notes</h3>
              <div class="space-y-2">
                <div
                  v-for="note in memoriesStore.getAllPlayerNotes()"
                  :key="note.id"
                  class="p-3 bg-white/5 rounded-lg"
                >
                  <p class="text-gray-300 text-sm">{{ note.content }}</p>
                  <p class="text-gray-500 text-xs">— {{ getMemoryTitle(note.memoryId) }}</p>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3">
              <button
                @click="showReconstruction = false"
                class="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMemoriesStore } from '@/stores/memories'
import { useCharactersStore } from '@/stores/characters'
import type { SceneObject, PlayerMemoryStructure, MemoryFragment, PlayerNote, MemoryCluster } from '@/types'

const memoriesStore = useMemoriesStore()
const charactersStore = useCharactersStore()

const showReconstruction = ref(false)
const reconstructedMemory = ref<PlayerMemoryStructure | null>(null)

const showMemoryDetail = ref(false)
const selectedMemory = ref<MemoryFragment | null>(null)
const showNoteInput = ref(false)
const newNoteContent = ref('')
const showLinkMode = ref(false)

const currentNotes = computed<PlayerNote[]>(() => {
  if (!selectedMemory.value) return []
  return memoriesStore.getNotesForMemory(selectedMemory.value.id)
})

const currentLinks = computed(() => {
  if (!selectedMemory.value) return []
  return memoriesStore.getLinksForMemory(selectedMemory.value.id)
})

const linkableMemories = computed(() => {
  if (!selectedMemory.value) return []
  return memoriesStore.unlockedMemories.filter(
    m => m.id !== selectedMemory.value?.id
  )
})

const unlockedClusters = computed<MemoryCluster[]>(() => {
  const clusters: Record<string, MemoryFragment[]> = {
    love: [],
    loss: [],
    regret: [],
    shame: [],
    fear: []
  }
  
  memoriesStore.unlockedFragments.forEach((fragment: MemoryFragment) => {
    clusters[fragment.emotionTag].push(fragment)
  })
  
  return Object.entries(clusters)
    .map(([tag, frags]) => ({
      emotionTag: tag as any,
      fragments: frags
    }))
    .filter(cluster => cluster.fragments.length > 0)
    .sort((a, b) => b.fragments.length - a.fragments.length)
})

function getEmotionTagColor(tag: string): string {
  const colors: Record<string, string> = {
    love: '#ff6b9d',
    loss: '#6366f1',
    regret: '#f59e0b',
    shame: '#8b5cf6',
    fear: '#ef4444'
  }
  return colors[tag] || '#9ca3af'
}

function getCharacterName(characterId: string): string {
  const character = charactersStore.getCharacterById(characterId)
  return character?.name || characterId
}

function getObjectIcon(name: string): string {
  const icons: Record<string, string> = {
    'Piano': '🎹',
    'Window': '🪟',
    'Fireplace': '🔥',
    'Photograph': '🖼️',
    'Letter': '📝',
    'Mirror': '🪞',
    'Old Cloak': '🧥',
    'Tea Set': '🍵'
  }
  return icons[name] || '📦'
}

function interactWithObject(obj: SceneObject) {
  if (!obj.interactable) return
  
  const unlockedMemory = memoriesStore.interactWithObject(obj.id)
  if (unlockedMemory) {
    showNotification(`Unlocked: ${unlockedMemory.title}`)
  }
}

function reconstructMemory() {
  if (memoriesStore.unlockedMemories.length < 2) return
  
  reconstructedMemory.value = memoriesStore.reconstructMemory()
  showReconstruction.value = true
}

function showNotification(message: string) {
  const notification = document.createElement('div')
  notification.className = 'fixed bottom-6 right-6 px-4 py-3 bg-empathy-rose/20 border border-empathy-rose/30 rounded-lg text-empathy-rose text-sm z-50'
  notification.textContent = message
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.remove()
  }, 3000)
}

function openMemoryDetail(fragment: MemoryFragment) {
  if (!memoriesStore.isExplored(fragment.id)) return
  selectedMemory.value = fragment
  showMemoryDetail.value = true
  showNoteInput.value = false
  showLinkMode.value = false
}

function closeMemoryDetail() {
  showMemoryDetail.value = false
  selectedMemory.value = null
  showNoteInput.value = false
  showLinkMode.value = false
}

function addNewNote() {
  showNoteInput.value = true
  newNoteContent.value = ''
}

function cancelNote() {
  showNoteInput.value = false
  newNoteContent.value = ''
}

function saveNote() {
  if (!newNoteContent.value.trim() || !selectedMemory.value) return
  
  memoriesStore.addNote(selectedMemory.value.id, newNoteContent.value.trim())
  showNoteInput.value = false
  newNoteContent.value = ''
}

function cancelLinkMode() {
  showLinkMode.value = false
}

function createLink(targetMemoryId: string) {
  if (!selectedMemory.value) return
  
  memoriesStore.addCustomLink(selectedMemory.value.id, targetMemoryId, '')
  showLinkMode.value = false
}

function getLinkedMemoryTitle(link: { sourceMemoryId: string; targetMemoryId: string }): string {
  const targetId = link.sourceMemoryId === selectedMemory.value?.id ? link.targetMemoryId : link.sourceMemoryId
  const memory = memoriesStore.fragments.find(m => m.id === targetId)
  return memory?.title || 'Unknown Memory'
}

function getMemoryTitle(memoryId: string): string {
  const memory = memoriesStore.fragments.find(m => m.id === memoryId)
  return memory?.title || 'Unknown Memory'
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString()
}
</script>