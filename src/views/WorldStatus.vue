<template>
  <div class="min-h-screen px-4 py-8 md:px-8 text-white">
    <div class="max-w-7xl mx-auto">
      <header class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <p class="text-empathy-rose/80 text-xs tracking-[0.35em] uppercase mb-3">
            AllenNLP + DeepSeek
          </p>
          <h1 class="text-3xl md:text-5xl font-extralight tracking-wider">
            TRPG World Status
          </h1>
          <p class="text-gray-400 mt-4 max-w-2xl leading-relaxed">
            Resolve literary references, then generate a structured tabletop world state from the narrative passage.
          </p>
        </div>

        <button
          class="px-5 py-2 rounded-full border border-white/10 text-gray-300 hover:text-white hover:border-empathy-rose/50 transition-colors"
          @click="router.push('/')"
        >
          Back
        </button>
      </header>

      <section class="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-sm text-gray-300">{{ saveStatusText }}</p>
            <p class="text-xs text-gray-500 mt-1">
              Snapshots are stored in this browser only and do not call DeepSeek again.
            </p>
            <p
              v-if="storageNotice"
              class="mt-2 rounded-lg border px-3 py-2 text-xs"
              :class="storageNoticeClass"
            >
              {{ storageNotice }}
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              class="px-4 py-2 rounded-full border border-white/10 text-sm text-gray-300 hover:border-empathy-purple/60 hover:text-white disabled:opacity-40 transition-colors"
              :disabled="!canSave"
              @click="saveSnapshot"
            >
              Save Snapshot
            </button>
            <button
              class="px-4 py-2 rounded-full border border-white/10 text-sm text-gray-300 hover:border-empathy-purple/60 hover:text-white disabled:opacity-40 transition-colors"
              :disabled="!hasStoredSnapshot"
              @click="loadSnapshot"
            >
              Load Last
            </button>
            <button
              class="px-4 py-2 rounded-full border border-white/10 text-sm text-gray-300 hover:border-red-400/50 hover:text-red-200 disabled:opacity-40 transition-colors"
              :disabled="!hasStoredSnapshot && !canSave"
              @click="clearSnapshot"
            >
              Clear
            </button>
            <button
              class="px-4 py-2 rounded-full border border-white/10 text-sm text-gray-300 hover:border-empathy-rose/60 hover:text-white disabled:opacity-40 transition-colors"
              :disabled="!worldStateText"
              @click="downloadFullJson"
            >
              Download JSON
            </button>
            <button
              class="px-4 py-2 rounded-full border border-white/10 text-sm text-gray-300 hover:border-empathy-rose/60 hover:text-white disabled:opacity-40 transition-colors"
              :disabled="!resolvedText"
              @click="downloadResolvedText"
            >
              Download TXT
            </button>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div class="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h2 class="text-lg font-light tracking-wide">Original Text</h2>
            <label class="px-4 py-2 rounded-full border border-white/10 text-sm text-gray-300 cursor-pointer hover:border-empathy-purple/60 hover:text-white transition-colors">
              Load .txt
              <input class="hidden" type="file" accept=".txt,text/plain,.md,text/markdown" @change="loadFile" />
            </label>
          </div>

          <textarea
            v-model="sourceText"
            class="w-full min-h-[460px] bg-transparent text-gray-200 p-5 outline-none resize-y leading-7 font-serif"
            spellcheck="false"
            placeholder="Paste a passage from The Dead or another English narrative text..."
          />

          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-t border-white/10">
            <label class="flex items-center gap-3 text-sm text-gray-400">
              Chunk size
              <input
                v-model.number="maxChars"
                class="w-24 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-empathy-rose/60"
                type="number"
                min="300"
                max="3000"
                step="100"
              />
            </label>

            <button
              class="px-6 py-3 rounded-full bg-empathy-rose/20 border border-empathy-rose/50 text-empathy-rose hover:bg-empathy-rose/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :disabled="isRunning || !sourceText.trim()"
              @click="generateWorldStatus"
            >
              {{ isRunning ? 'Generating...' : 'Generate World Status' }}
            </button>
          </div>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h2 class="text-lg font-light tracking-wide">World State JSON</h2>
            <button
              class="px-4 py-2 rounded-full border border-white/10 text-sm text-gray-300 hover:border-empathy-purple/60 hover:text-white disabled:opacity-40 transition-colors"
              :disabled="!worldStateText"
              @click="copyWorldState"
            >
              {{ copied ? 'Copied' : 'Copy' }}
            </button>
          </div>

          <pre class="min-h-[552px] max-h-[640px] overflow-auto p-5 text-sm leading-6 text-teal-100 whitespace-pre-wrap break-words">{{ worldStateText || '{}' }}</pre>
        </div>
      </section>

      <section class="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-b border-white/10">
          <h2 class="text-lg font-light tracking-wide">Coreference Resolution Result</h2>
          <p class="text-sm text-gray-500">{{ metaText }}</p>
        </div>

        <pre class="min-h-[220px] max-h-[420px] overflow-auto p-5 text-gray-300 leading-7 whitespace-pre-wrap break-words font-serif">{{ resolvedText || statusText }}</pre>
      </section>

      <p v-if="errorMessage" class="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-red-200">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

interface WorldStateResponse {
  resolved_text: string
  resolved_chunks: string[]
  world_state: unknown
  model: string
  usage?: Record<string, unknown>
}

interface StoredSnapshot {
  sourceText: string
  resolvedText: string
  worldState: unknown
  maxChars: number
  model?: string
  usage?: Record<string, unknown>
  savedAt: string
}

const STORAGE_KEY = 'literary-empathy-world-status:last-snapshot'

const router = useRouter()

const sourceText = ref('')
const resolvedText = ref('')
const worldState = ref<unknown>(null)
const maxChars = ref(1200)
const isRunning = ref(false)
const errorMessage = ref('')
const copied = ref(false)
const lastSavedAt = ref('')
const hasStoredSnapshot = ref(false)
const responseModel = ref('')
const responseUsage = ref<Record<string, unknown> | undefined>()
const storageNotice = ref('')
const storageNoticeType = ref<'success' | 'error' | 'info'>('info')
let storageNoticeTimer: number | undefined

const worldStateText = computed(() => {
  return worldState.value ? JSON.stringify(worldState.value, null, 2) : ''
})

const statusText = computed(() => {
  return isRunning.value
    ? 'Resolving references, calling DeepSeek, and building world status...'
    : 'Waiting for generation.'
})

const metaText = computed(() => {
  if (!resolvedText.value) return 'No resolved text yet'
  const modelText = responseModel.value ? ` · ${responseModel.value}` : ''
  return `Resolved text prepared for DeepSeek${modelText}`
})

const canSave = computed(() => {
  return Boolean(sourceText.value.trim() || resolvedText.value || worldState.value)
})

const saveStatusText = computed(() => {
  if (lastSavedAt.value) return `Last saved: ${formatDate(lastSavedAt.value)}`
  if (hasStoredSnapshot.value) return 'A saved snapshot is available.'
  return 'No saved snapshot yet.'
})

const storageNoticeClass = computed(() => {
  if (storageNoticeType.value === 'success') {
    return 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
  }
  if (storageNoticeType.value === 'error') {
    return 'border-red-400/30 bg-red-500/10 text-red-200'
  }
  return 'border-white/10 bg-white/[0.04] text-gray-300'
})

async function loadFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  sourceText.value = await file.text()
}

async function generateWorldStatus() {
  isRunning.value = true
  errorMessage.value = ''
  resolvedText.value = ''
  worldState.value = null

  try {
    const response = await fetch('/api/world-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: sourceText.value,
        max_chars: maxChars.value
      })
    })

    const payload = await response.json()
    if (!response.ok) {
      throw new Error(payload.detail || 'World status generation failed.')
    }

    const result = payload as WorldStateResponse
    resolvedText.value = result.resolved_text
    worldState.value = result.world_state
    responseModel.value = result.model
    responseUsage.value = result.usage
    saveSnapshot()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unknown error.'
  } finally {
    isRunning.value = false
  }
}

async function copyWorldState() {
  await navigator.clipboard.writeText(worldStateText.value)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1200)
}

function saveSnapshot() {
  const savedAt = new Date().toISOString()
  const snapshot: StoredSnapshot = {
    sourceText: sourceText.value,
    resolvedText: resolvedText.value,
    worldState: worldState.value,
    maxChars: maxChars.value,
    model: responseModel.value,
    usage: responseUsage.value,
    savedAt
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    lastSavedAt.value = savedAt
    hasStoredSnapshot.value = true
    showStorageNotice('Saved locally. You can reopen this same browser page and use Load Last.', 'success')
  } catch {
    showStorageNotice(
      'Save failed: browser storage unavailable. This can happen in private browsing, restricted browser settings, or when site data is full.',
      'error',
      7000
    )
  }
}

function loadSnapshot() {
  const snapshot = readStoredSnapshot()
  if (!snapshot) return

  sourceText.value = snapshot.sourceText || ''
  resolvedText.value = snapshot.resolvedText || ''
  worldState.value = snapshot.worldState ?? null
  maxChars.value = snapshot.maxChars || 1200
  responseModel.value = snapshot.model || ''
  responseUsage.value = snapshot.usage
  lastSavedAt.value = snapshot.savedAt || ''
  hasStoredSnapshot.value = true
  errorMessage.value = ''
  showStorageNotice('Loaded the last saved snapshot from this browser.', 'info')
}

function clearSnapshot() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    showStorageNotice('Could not clear browser storage from this page.', 'error', 7000)
  }
  sourceText.value = ''
  resolvedText.value = ''
  worldState.value = null
  maxChars.value = 1200
  responseModel.value = ''
  responseUsage.value = undefined
  lastSavedAt.value = ''
  hasStoredSnapshot.value = false
  errorMessage.value = ''
  showStorageNotice('Snapshot cleared from this browser.', 'info')
}

function downloadFullJson() {
  const savedAt = lastSavedAt.value || new Date().toISOString()
  const payload: StoredSnapshot = {
    sourceText: sourceText.value,
    resolvedText: resolvedText.value,
    worldState: worldState.value,
    maxChars: maxChars.value,
    model: responseModel.value,
    usage: responseUsage.value,
    savedAt
  }

  downloadFile(
    `world-status-${fileDate(savedAt)}.json`,
    JSON.stringify(payload, null, 2),
    'application/json'
  )
}

function downloadResolvedText() {
  const savedAt = lastSavedAt.value || new Date().toISOString()
  downloadFile(
    `coreference-resolved-${fileDate(savedAt)}.txt`,
    resolvedText.value,
    'text/plain;charset=utf-8'
  )
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function readStoredSnapshot(): StoredSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredSnapshot) : null
  } catch {
    return null
  }
}

function showStorageNotice(
  message: string,
  type: 'success' | 'error' | 'info' = 'info',
  timeout = 4500
) {
  storageNotice.value = message
  storageNoticeType.value = type

  if (storageNoticeTimer) {
    window.clearTimeout(storageNoticeTimer)
  }

  storageNoticeTimer = window.setTimeout(() => {
    storageNotice.value = ''
    storageNoticeTimer = undefined
  }, timeout)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

function fileDate(value: string) {
  return value.replace(/[:.]/g, '-').slice(0, 19)
}

const initialSnapshot = readStoredSnapshot()
hasStoredSnapshot.value = Boolean(initialSnapshot)
if (initialSnapshot) {
  loadSnapshot()
}
</script>
