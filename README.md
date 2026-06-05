# Literary Empathy Prototype

An experimental digital humanities prototype for exploring literary empathy
through multi-perspective storytelling, based on James Joyce's *The Dead*.

This version also integrates a TRPG world-status generation pipeline. The new
pipeline resolves coreferences in narrative text with AllenNLP + SpanBERT, then
calls the DeepSeek API to generate a structured tabletop role-playing game world
state.

It also includes a standalone interactive story-game adaptation of *The Dead*.
The game is served as a static embedded experience and loads its own validated
story JSON.

## Features

- Multi-perspective literary exploration of *The Dead*.
- Character perspective switching and memory reconstruction.
- Memory board, relation graph, reflection, and ending views.
- TRPG World Status page for narrative-to-world-state generation.
- Interactive Story Game page with 52 story nodes, 9 endings, and 12 achievements.
- Side-by-side display of:
  - original text,
  - coreference-resolved text,
  - generated world-state JSON.

## Architecture

```text
Vue 3 frontend
  |
  | /api/world-state
  v
FastAPI backend
  |
  v
Local sentence tokenizer
  |
  v
AllenNLP + SpanBERT coreference resolution
  |
  v
DeepSeek Chat Completions API
  |
  v
TRPG world-state JSON
```

The frontend and backend run as separate local services during development:

- Frontend: Vite on `http://127.0.0.1:5173`
- Backend: FastAPI/Uvicorn on `http://127.0.0.1:8000`

Vite proxies `/api/*` requests to the backend.

## Technology Stack

Frontend:

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- TailwindCSS
- Cytoscape.js

Backend:

- Python 3.9
- FastAPI
- Uvicorn
- AllenNLP
- AllenNLP Models
- SpanBERT large coreference model
- Hugging Face Transformers
- PyTorch
- spaCy
- DeepSeek Chat Completions API

## Project Structure

```text
.
├── src/                    # Vue frontend
│   ├── views/
│   │   ├── InteractiveGame.vue
│   │   └── WorldStatus.vue # TRPG world-status UI
│   ├── stores/
│   ├── router/
│   └── data/
├── public/
│   └── interactive-game/   # Static playable story-game adaptation
├── backend/                # Python API and NLP pipeline
│   ├── app.py
│   ├── pipeline.py
│   ├── requirements.txt
│   ├── utils/
│   ├── scripts/
│   └── data/
├── public/
├── package.json
└── vite.config.ts
```

## Frontend Setup

Install Node dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev:frontend
```

Open:

```text
http://127.0.0.1:5173
```

## Backend Setup

Create and activate a Python virtual environment:

```bash
cd backend
python -m venv trpg_env
source trpg_env/bin/activate
```

Install backend dependencies:

```bash
python -m pip install -r requirements.txt
```

If dependency resolution upgrades Pydantic to version 2, downgrade it because
the AllenNLP/spaCy stack used here expects Pydantic 1.x:

```bash
python -m pip install "pydantic<1.9" "fastapi<0.100" --force-reinstall
```

## DeepSeek Configuration

Create a backend `.env` file:

```bash
cp .env.example .env
```

Set your own DeepSeek API key:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
```

The repository does not include a real DeepSeek API key. Users must provide
their own key.

## Model Files

Large model files are not committed to the repository. Put them under
`backend/data/` before using the TRPG World Status page.

Required AllenNLP archive:

```text
backend/data/coref-spanbert-large-2021.03.10.tar.gz
```

Required SpanBERT transformer files:

```text
backend/data/spanbert-large-cased/config.json
backend/data/spanbert-large-cased/pytorch_model.bin
backend/data/spanbert-large-cased/vocab.txt
backend/data/spanbert-large-cased/tokenizer_config.json
```

Download SpanBERT files:

```bash
cd backend
bash scripts/download_spanbert.sh
python scripts/check_spanbert.py
```

If Hugging Face is unavailable:

```bash
HF_ENDPOINT=https://hf-mirror.com bash scripts/download_spanbert.sh
python scripts/check_spanbert.py
```

The AllenNLP predictor also requires a spaCy English model:

```bash
python -m spacy download en_core_web_sm
```

If using a local wheel:

```bash
python -m pip install data/spacy/en_core_web_sm-3.3.0-py3-none-any.whl
```

## Running the Full Workflow

Start the backend API:

```bash
npm run dev:api
```

In another terminal, start the frontend:

```bash
npm run dev:frontend
```

Then open:

```text
http://127.0.0.1:5173/world-status
```

Workflow:

1. Paste or load an English narrative passage.
2. Click `Generate World Status`.
3. The backend performs coreference resolution.
4. The resolved text is sent to DeepSeek.
5. The page displays the generated world-state JSON.

## Running the Interactive Story Game

Start the frontend:

```bash
npm run dev:frontend
```

Open:

```text
http://127.0.0.1:5173/interactive-game
```

The embedded game loads:

```text
public/interactive-game/the_dead_game.json
```

The game data contains 52 story nodes, 9 endings, and 12 achievements. The
adaptation notes are available from the page header.

## Netlify Deployment Preparation

Netlify can host the Vue frontend and the static interactive story game.

This includes:

- the main literary empathy interface,
- the `/interactive-game` wrapper page,
- the static story-game files under `/dead-game/`,
- the `/world-status` page layout.

However, Netlify does not run the local Python pipeline with AllenNLP,
SpanBERT, spaCy, PyTorch, and DeepSeek. The TRPG World Status backend must be
deployed separately on a Python-capable server.

Recommended deployment split:

```text
Netlify
  └── Vue frontend + static interactive game

Cloud server
  └── FastAPI backend + AllenNLP/SpanBERT + DeepSeek API key
```

Netlify settings:

```text
Build command: npm run build
Publish directory: dist
```

The repository includes `netlify.toml` for these settings and for Vue Router
fallbacks.

After deploying the Python backend, update the `/api/*` redirect in
`netlify.toml`:

```toml
[[redirects]]
from = "/api/*"
to = "https://YOUR_BACKEND_DOMAIN/api/:splat"
status = 200
force = true
```

Keep the DeepSeek API key only on the backend server. Do not place it in the
Netlify frontend environment unless the frontend never exposes it to browser
code.

## API

Health check:

```http
GET /api/health
```

Generate world state:

```http
POST /api/world-state
```

Request body:

```json
{
  "text": "Alice saw Bob. She waved to him.",
  "max_chars": 1200
}
```

Response includes:

```json
{
  "input_chunks": [],
  "resolved_chunks": [],
  "resolved_text": "...",
  "world_state": {},
  "model": "deepseek-chat",
  "usage": {}
}
```

## Notes

- The first coreference request may be slow because the model is loaded lazily.
- DeepSeek API usage is consumed only when `Generate World Status` is clicked.
- `.env`, virtual environments, local model files, and generated outputs are
  ignored by Git.
- The current coreference pipeline is optimized for English narrative text.
- LLM-generated world states should be reviewed by a human.

## License

See the repository license for permitted use.
