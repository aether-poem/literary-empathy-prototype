# Literary Empathy Prototype

An experimental digital humanities prototype for exploring literary empathy through multi-perspective storytelling, based on James Joyce's *The Dead*.

## 🌟 Features

### Core Systems
- **Perspective Bias System** - Experience the story through different character perspectives, each with their own limited view of reality
- **Memory Reconstruction System** - Unlock memory fragments by exploring and connecting them through emotional themes
- **Interpretation Revision System** - Form your own understanding of events with no "correct" answers

### Gameplay Features
- Multi-character perspective switching (Gabriel, Gretta, Michael Furey)
- Progressive memory unlocking based on narrative progress
- Memory clustering by emotional themes (love, loss, regret, shame, fear)
- Free text interpretation input
- Memory note-taking and custom connections
- Achievement and ending system
- Literary-style empathy feedback

## 🛠️ Tech Stack

- **Framework**: Vue 3 + TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **Styling**: TailwindCSS 3
- **Graph Visualization**: Cytoscape.js
- **Routing**: Vue Router

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
├── src/
│   ├── components/          # Vue components
│   │   └── InterpretationModal.vue
│   ├── stores/             # Pinia stores
│   │   ├── empathy.ts      # Empathy engine core
│   │   ├── memories.ts     # Memory management
│   │   ├── interpretation.ts # Interpretation system
│   │   ├── story.ts        # Story progression
│   │   └── characters.ts   # Character management
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── views/              # Page views
│   │   ├── Landing.vue     # Entry page
│   │   ├── CharacterSelect.vue
│   │   ├── ImmersiveExplore.vue # Main exploration view
│   │   ├── MemoryBoard.vue # Memory reconstruction board
│   │   ├── RelationGraph.vue
│   │   ├── Reflection.vue  # Empathy summary
│   │   └── Ending.vue      # Ending screen
│   └── router/             # Router configuration
├── public/data/works/the_dead/  # Story data
│   ├── characters.json     # Character definitions
│   ├── memories.json       # Memory fragments
│   ├── perspectives.json   # Perspective biases
│   ├── relations.json      # Character relationships
│   ├── events.json         # Multi-version events
│   ├── story_chapters.json # Story chapters
│   ├── achievements.json   # Achievements
│   └── endings.json        # Endings
└── index.html
```

## 🎮 How to Play

1. **Start**: Click "Begin" on the landing page
2. **Choose Perspective**: Select a character to view their perspective
3. **Explore Memories**: Click on unlocked memories to read them
4. **Interpret**: When prompted, choose from preset interpretations or write your own
5. **Connect Memories**: Use the Memory Board to organize and connect memory fragments
6. **Progress**: Unlock new memories by exploring existing ones
7. **Reflect**: Visit the Reflection page to see your empathy journey
8. **End**: Reach one of multiple endings based on your exploration

## 📖 About *The Dead*

*The Dead* is a short story by James Joyce, first published in 1914 as part of *Dubliners*. It explores themes of love, loss, memory, and the epiphany of Gabriel Conroy as he confronts his wife's past.

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.
