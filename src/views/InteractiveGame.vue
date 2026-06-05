<template>
  <div class="min-h-screen px-4 py-8 md:px-8 text-white">
    <div class="max-w-7xl mx-auto">
      <header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-6">
        <div>
          <p class="text-empathy-rose/80 text-xs tracking-[0.35em] uppercase mb-3">
            Interactive Adaptation
          </p>
          <h1 class="text-3xl md:text-5xl font-extralight tracking-wider">
            The Dead 文游
          </h1>
          <p class="text-gray-400 mt-4 max-w-3xl leading-relaxed">
            A playable adaptation with 52 story nodes, 9 endings, and 12 achievements. The embedded game loads its own JSON story data locally.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <a
            class="px-5 py-2 rounded-full border border-white/10 text-gray-300 hover:text-white hover:border-empathy-purple/50 transition-colors"
            href="/dead-game/the_dead_interactive_site.html"
            target="_blank"
            rel="noreferrer"
          >
            Open Full Game
          </a>
          <button
            class="px-5 py-2 rounded-full border border-white/10 text-gray-300 hover:text-white hover:border-empathy-rose/50 transition-colors"
            @click="router.push('/')"
          >
            Back
          </button>
        </div>
      </header>

      <section class="rounded-2xl border border-white/10 bg-black/30 overflow-hidden shadow-2xl shadow-black/30">
        <iframe
          class="block w-full h-[calc(100vh-220px)] min-h-[680px] bg-[#11120f]"
          src="/dead-game/the_dead_interactive_site.html"
          title="The Dead Interactive Game"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
