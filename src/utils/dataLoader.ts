﻿import type { Character, MemoryFragment, RelationData, PerspectiveData, MemoryTrigger, MultiVersionEvent } from '@/types'

const WORK_ID = 'the_dead'

export async function loadCharacters(): Promise<Character[]> {
  const response = await fetch('/data/works/' + WORK_ID + '/characters.json')
  const data = await response.json()
  return data.characters
}

export async function loadMemories(): Promise<MemoryFragment[]> {
  const response = await fetch('/data/works/' + WORK_ID + '/memories.json')
  const data = await response.json()
  return data.fragments
}

export async function loadRelations(): Promise<RelationData> {
  const response = await fetch('/data/works/' + WORK_ID + '/relations.json')
  return response.json()
}

export async function loadPerspectives(): Promise<PerspectiveData[]> {
  const response = await fetch('/data/works/' + WORK_ID + '/perspectives.json')
  const data = await response.json()
  return data.perspectives
}

export async function loadTriggers(): Promise<MemoryTrigger[]> {
  const response = await fetch('/data/works/' + WORK_ID + '/memory_triggers.json')
  const data = await response.json()
  return data.triggers
}

export async function loadEvents(): Promise<MultiVersionEvent[]> {
  const response = await fetch('/data/works/' + WORK_ID + '/events.json')
  const data = await response.json()
  return data.events
}

export async function loadWorkIndex(): Promise<{ works: Array<{ id: string; title: string; author: string }> }> {
  const response = await fetch('/data/works/index.json')
  return response.json()
}

export async function loadAllData() {
  return Promise.all([
    loadCharacters(),
    loadMemories(),
    loadRelations(),
    loadPerspectives(),
    loadTriggers(),
    loadEvents()
  ])
}