import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RelationData, GraphNode, GraphEdge } from '@/types'
import { loadRelations } from '@/utils/dataLoader'

export const useRelationsStore = defineStore('relations', () => {
  const data = ref<RelationData | null>(null)
  const visibleEdges = ref<Set<string>>(new Set())
  const selectedNodeId = ref<string | null>(null)

  const loaded = computed(() => data.value !== null)

  const nodes = computed(() => data.value?.nodes || [])
  const edges = computed(() => data.value?.edges || [])

  const visibleEdgesList = computed(() => 
    edges.value.filter(e => e.visible || visibleEdges.value.has(e.id))
  )

  const selectedNode = computed(() => 
    nodes.value.find(n => n.id === selectedNodeId.value) || null
  )

  async function loadAll() {
    data.value = await loadRelations()
    data.value.edges.forEach(edge => {
      if (edge.visible) {
        visibleEdges.value.add(edge.id)
      }
    })
  }

  function revealEdge(edgeId: string) {
    visibleEdges.value.add(edgeId)
  }

  function isEdgeVisible(edgeId: string): boolean {
    return visibleEdges.value.has(edgeId)
  }

  function selectNode(nodeId: string | null) {
    selectedNodeId.value = nodeId
  }

  function getNodeById(id: string): GraphNode | undefined {
    return nodes.value.find(n => n.id === id)
  }

  function getEdgesByNode(nodeId: string): GraphEdge[] {
    return edges.value.filter(e => e.source === nodeId || e.target === nodeId)
  }

  return {
    data,
    visibleEdges,
    selectedNodeId,
    nodes,
    edges,
    visibleEdgesList,
    selectedNode,
    loaded,
    loadAll,
    revealEdge,
    isEdgeVisible,
    selectNode,
    getNodeById,
    getEdgesByNode
  }
})