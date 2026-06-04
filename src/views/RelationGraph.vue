<template>
  <div class="min-h-screen p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-light text-white mb-2">Relationship Map</h1>
          <p class="text-gray-400">Explore the connections between characters, events, and themes</p>
        </div>
        <div class="flex items-center gap-4">
          <button @click="goToCharacters" class="px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all">
            Characters
          </button>
          <button @click="goToReflection" class="px-4 py-2 bg-empathy-rose rounded-lg text-white hover:bg-empathy-rose/80 transition-all">
            Reflection
          </button>
        </div>
      </div>

      <div class="glass-card p-6">
        <div ref="graphContainer" class="h-[600px] relative"></div>
      </div>

      <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="(color, type) in relationColors" 
          :key="type"
          class="flex items-center gap-2"
        >
          <div 
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: color }"
          ></div>
          <span class="text-sm text-gray-400 capitalize">{{ type }}</span>
        </div>
      </div>

      <div v-if="selectedNode" class="mt-6 glass-card p-6">
        <h3 class="text-xl font-medium text-white mb-4">Selected: {{ selectedNode.label }}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span class="text-gray-500 text-sm">Type</span>
            <p class="text-white capitalize">{{ selectedNode.type }}</p>
          </div>
          <div>
            <span class="text-gray-500 text-sm">ID</span>
            <p class="text-white">{{ selectedNode.id }}</p>
          </div>
        </div>
        <div v-if="selectedNodeEdges.length > 0" class="mt-4 pt-4 border-t border-white/10">
          <p class="text-gray-400 text-sm mb-3">Connections</p>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="edge in selectedNodeEdges"
              :key="edge.id"
              class="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full"
            >
              <span 
                class="w-2 h-2 rounded-full"
                :style="{ backgroundColor: getRelationColor(edge.relationType) }"
              ></span>
              <span class="text-sm text-gray-300">{{ getNodeLabel(edge.source) }} ↔ {{ getNodeLabel(edge.target) }}</span>
              <span class="text-xs text-gray-500 capitalize">{{ edge.relationType }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import cytoscape from 'cytoscape'
import { useRelationsStore } from '@/stores/relations'
import { usePlayerStore } from '@/stores/player'
import { getRelationColor } from '@/utils/helpers'

const router = useRouter()
const relationsStore = useRelationsStore()
const playerStore = usePlayerStore()

const graphContainer = ref<HTMLElement | null>(null)
let cy: cytoscape.Core | null = null

const relationColors: Record<string, string> = {
  love: '#ec4899',
  friendship: '#10b981',
  conflict: '#ef4444',
  family: '#3b82f6',
  professional: '#6b7280',
  romantic: '#f97316',
  antagonistic: '#991b1b',
  sympathetic: '#06b6d4',
  memory: '#8b5cf6'
}

const selectedNode = ref(relationsStore.selectedNode)

const selectedNodeEdges = ref(relationsStore.getEdgesByNode(selectedNode.value?.id || ''))

watch(() => relationsStore.selectedNodeId, (newId) => {
  selectedNode.value = relationsStore.selectedNode
  selectedNodeEdges.value = relationsStore.getEdgesByNode(newId || '')
})

onMounted(() => {
  initGraph()
})

function initGraph() {
  if (!graphContainer.value || !relationsStore.loaded) return

  const nodes = relationsStore.nodes.map(node => ({
    data: {
      id: node.id,
      label: node.label,
      type: node.type,
      characterId: node.characterId
    }
  }))

  const edges = relationsStore.visibleEdgesList.map(edge => ({
    data: {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      relationType: edge.relationType,
      strength: edge.strength
    }
  }))

  if (cy) {
    cy.destroy()
  }

  cy = cytoscape({
    container: graphContainer.value,
    elements: { nodes, edges },
    style: [
      {
        selector: 'node',
        style: {
          'label': 'data(label)',
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': '14px',
          'font-family': 'Cormorant Garamond, serif',
          'color': '#e8e8e8',
          'background-color': (ele: cytoscape.NodeSingular) => {
            const type = ele.data('type') as string
            if (type === 'character') return '#1e3a5f'
            if (type === 'event') return '#4a1942'
            if (type === 'theme') return '#2d1b69'
            return '#333'
          },
          'border-color': (ele: cytoscape.NodeSingular) => {
            const type = ele.data('type') as string
            if (type === 'character') return '#3b82f6'
            if (type === 'event') return '#ec4899'
            if (type === 'theme') return '#8b5cf6'
            return '#666'
          },
          'border-width': 2,
          'width': 60,
          'height': 60
        }
      },
      {
        selector: 'edge',
        style: {
          'curve-style': 'bezier',
          'width': (ele: cytoscape.EdgeSingular) => (ele.data('strength') as number) * 4,
          'line-color': (ele: cytoscape.EdgeSingular) => {
            const type = ele.data('relationType') as string
            return getRelationColor(type)
          },
          'target-arrow-color': (ele: cytoscape.EdgeSingular) => {
            const type = ele.data('relationType') as string
            return getRelationColor(type)
          },
          'target-arrow-shape': 'triangle'
        }
      },
      {
        selector: 'node:selected',
        style: {
          'border-width': 4,
          'border-color': '#8b2635',
          'background-color': '#8b2635'
        }
      }
    ],
    layout: {
      name: 'cose',
      idealEdgeLength: 150,
      nodeOverlap: 20,
      refresh: 20,
      fit: true,
      padding: 50,
      randomize: true,
      componentSpacing: 100,
      nodeRepulsion: 400000,
      edgeElasticity: 100,
      nestingFactor: 5,
      gravity: 80,
      numIter: 1000,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0
    }
  })

  cy.on('tap', 'node', (event) => {
    const nodeId = event.target.data('id') as string
    relationsStore.selectNode(nodeId)
  })

  cy.on('tap', (event) => {
    if (event.target === cy) {
      relationsStore.selectNode(null)
    }
  })

  playerStore.recordStep({
    action: 'explore_graph',
    targetId: 'graph',
    characterId: null,
    duration: 0
  })
}

function getNodeLabel(nodeId: string): string {
  const node = relationsStore.getNodeById(nodeId)
  return node?.label || nodeId
}

function goToCharacters() {
  router.push('/characters')
}

function goToReflection() {
  router.push('/reflection')
}
</script>