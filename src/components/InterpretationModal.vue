<template>
  <Teleport to="body">
    <div v-if="showModal" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div class="max-w-lg w-full glass-card p-8 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-light text-white mb-1">
              {{ hasPreviousInterpretation ? 'Reconsider your understanding' : 'How do you interpret this?' }}
            </h2>
            <p class="text-gray-500 text-sm">
              {{ hasPreviousInterpretation ? 'Choose what this moment means to you now' : 'Choose how you understand this event' }}
            </p>
          </div>
          <button @click="handleClose" class="text-gray-400 hover:text-white transition-colors">
            <span class="text-2xl">×</span>
          </button>
        </div>

        <div class="bg-empathy-purple/20 border border-empathy-purple/30 rounded-lg p-4 mb-6">
          <p class="text-gray-200 text-lg leading-relaxed italic">
            "{{ scenario?.eventDescription }}"
          </p>
        </div>

        <div v-if="hasPreviousInterpretation && previousInterpretation" class="mb-6 p-4 bg-empathy-blue/10 border border-empathy-blue/30 rounded-lg">
          <p class="text-empathy-blue text-sm mb-2">Your previous understanding:</p>
          <p class="text-gray-300 italic">"{{ previousInterpretation }}"</p>
        </div>

        <div class="mb-6">
          <label class="text-gray-400 text-sm mb-2 block">Or write your own interpretation:</label>
          <textarea
            v-model="customInterpretation"
            class="w-full p-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-empathy-rose/50 transition-all duration-300"
            rows="3"
            placeholder="What does this moment mean to you?..."
          ></textarea>
        </div>

        <div class="space-y-3 mb-6">
          <p class="text-gray-500 text-xs mb-3">Or choose from these perspectives:</p>
          <button
            v-for="option in scenario?.options"
            :key="option.id"
            @click="handleSelect(option)"
            class="w-full text-left p-4 rounded-lg border transition-all duration-300"
            :class="selectedOption === option.id 
              ? 'bg-empathy-rose/20 border-empathy-rose/50 text-white' 
              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'"
          >
            <div class="flex items-center gap-3">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                :class="selectedOption === option.id ? 'bg-empathy-rose/30' : 'bg-white/10'"
              >
                {{ getOptionLabel(option.id) }}
              </div>
              <div>
                <p class="font-medium">{{ option.text }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ getCharacterName(option.characterId) }}</p>
              </div>
            </div>
          </button>
        </div>

        <button
          @click="handleConfirm"
          :disabled="!selectedOption && !customInterpretation.trim()"
          class="w-full mt-6 py-3 rounded-lg font-medium transition-all duration-300"
          :class="selectedOption || customInterpretation.trim()
            ? 'bg-empathy-rose/20 text-empathy-rose border border-empathy-rose/50 hover:bg-empathy-rose/30' 
            : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'"
        >
          {{ hasPreviousInterpretation ? 'Update Your Understanding' : 'Confirm Interpretation' }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useCharactersStore } from '@/stores/characters'
import type { InterpretationScenario, InterpretationOption } from '@/types'

const props = defineProps<{
  showModal: boolean
  scenario: InterpretationScenario | null
  isChallenge: boolean
  previousInterpretation?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', option: InterpretationOption | null, customText: string): void
}>()

const charactersStore = useCharactersStore()
const selectedOption = ref<string | null>(null)
const customInterpretation = ref('')

const hasPreviousInterpretation = computed(() => !!props.previousInterpretation)

const optionLabels: Record<string, string> = {
  'opt_a': 'A',
  'opt_b': 'B',
  'opt_c': 'C'
}

function getOptionLabel(optionId: string): string {
  return optionLabels[optionId] || optionId
}

function getCharacterName(characterId?: string): string {
  if (!characterId) return ''
  const character = charactersStore.getCharacterById(characterId)
  return character ? `— ${character.name}'s perspective` : ''
}

function handleSelect(option: InterpretationOption) {
  selectedOption.value = option.id
  customInterpretation.value = ''
}

function handleConfirm() {
  if (!props.scenario) return
  
  if (customInterpretation.value.trim()) {
    emit('select', null, customInterpretation.value.trim())
    handleClose()
  } else if (selectedOption.value) {
    const option = props.scenario.options.find(o => o.id === selectedOption.value)
    if (option) {
      emit('select', option, '')
      handleClose()
    }
  }
}

function handleClose() {
  selectedOption.value = null
  customInterpretation.value = ''
  emit('close')
}

watch(() => props.showModal, (newVal) => {
  if (!newVal) {
    selectedOption.value = null
    customInterpretation.value = ''
  }
})
</script>