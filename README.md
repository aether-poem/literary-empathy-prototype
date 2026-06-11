# Literary Empathy Prototype

An experimental digital humanities prototype for exploring literary empathy
through multi-perspective storytelling, based on James Joyce's *The Dead*.

This branch also embeds a standalone interactive story-game adaptation of
*The Dead*. The game is served as a static playable experience and loads its
own story JSON.

The TRPG World Status pipeline has been separated into its own repository:

```text
https://github.com/aether-poem/TRPG-World-Status
```

## Features

- Multi-perspective literary exploration of *The Dead*.
- Character perspective switching and memory reconstruction.
- Memory board, relation graph, reflection, and ending views.
- Interactive Story Game page with 52 story nodes, 9 endings, and 12 achievements.
- Static game assets that can be hosted with the Vue frontend.
- External access to the public ontology-oriented TRPG World Status tool.

## Technology Stack

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- TailwindCSS
- Cytoscape.js

## Project Structure

```text
.
├── src/
│   ├── views/
│   │   └── InteractiveGame.vue
│   ├── stores/
│   ├── router/
│   └── data/
├── public/
│   └── dead-game/
│       ├── the_dead_interactive_site.html
│       ├── the_dead_game.json
│       └── the_dead_adaptation_notes.md
├── package.json
├── vite.config.ts
└── netlify.toml
```

## Setup

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

## Interactive Story Game

Open:

```text
http://127.0.0.1:5173/interactive-game
```

The embedded game loads static files from:

```text
public/dead-game/
```

The game data contains 52 story nodes, 9 endings, and 12 achievements. The
adaptation notes are kept with the static game files for reference.

## Netlify Deployment

Netlify can host this project as a static Vue site.

Recommended settings:

```text
Build command: npm run build
Publish directory: dist
```

The repository includes `netlify.toml` for the build settings and Vue Router
fallbacks.

## Notes

- This repository no longer contains the TRPG World Status backend.
- The DeepSeek API key and AllenNLP model files belong in the separate
  `aether-poem/TRPG-World-Status` repository, not in this frontend collaboration
  repository.
- The interactive game is static and does not call DeepSeek or any backend API.
- The external World Status tool provides clickable micro, meso, macro, context, and full-JSON result filters.

## License

See the repository license for permitted use.
