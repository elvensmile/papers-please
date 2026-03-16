[ONLINE DEMO](https://papers-please-khaki.vercel.app/)

# Paper to Startup

Turn one academic PDF into a startup thesis.

This project takes a research paper and transforms it into a founder-friendly opportunity brief: a paper summary, startup concepts, ranked opportunities, a winning concept, a feasibility radar, an opportunity graph, and a generated visual direction. It is fast to demo, fun to use, and structured like a real product rather than a one-off prototype.

## Why this project is exciting

Paper to Startup sits at the intersection of applied AI, product design, and venture thinking.

- Upload a PDF and get structured startup outputs instead of raw model text.
- Generate multiple startup concepts from a single piece of research.
- Rank ideas by novelty, feasibility, market potential, and defensibility.
- Visualize the journey from research insight to company concept.
- Keep the UX engaging with animated loading states, sample papers, and bilingual UI support.

This is the kind of app that feels immediate in a demo, but is also built on foundations that can scale.

## Why this architecture scales

The codebase is intentionally modular, typed, and adapter-driven.

- `src/adapters/llm/` isolates the LLM provider behind an interface, so model vendors can be swapped without rewriting the product.
- `src/adapters/image/` does the same for image generation.
- `src/services/paperService.ts` orchestrates the workflow instead of burying business logic inside the route layer.
- `src/types/analysis.ts` defines explicit contracts for the analysis pipeline, which keeps the UI and backend aligned.
- `src/i18n/ui.ts` centralizes typed UI copy for multilingual expansion.
- `src/server/uploadRateLimit.ts` provides a clean place to evolve request protection from in-memory limits to Redis or another shared store.

The current version is an MVP, but the seams are already there for:

- queue-backed background processing
- persistent rate limiting and quotas
- per-user accounts and billing
- model A/B testing
- multi-paper batch analysis
- richer observability and analytics
- multi-region or multi-instance deployment

In other words: this app is not boxed into a hackathon architecture. It is shaped to grow.

## Product highlights

- Next.js App Router frontend and API routes
- Mantine-powered UI with a polished, demo-friendly experience
- TanStack Query for async orchestration on the client
- React Flow opportunity map for structured graph visualization
- Recharts feasibility radar for fast startup comparison
- English and Japanese UI localization
- Sample paper shortcuts for zero-friction onboarding
- Upload protection with a per-IP daily cap
- Gemini-based analysis and image generation with mock fallback support

## How it works

1. A user uploads a research PDF.
2. The server sends the paper to the LLM adapter.
3. Stage 1 extracts the summary, core innovation, startup ideas, and graph structure.
4. Stage 2 ranks and scores the startup opportunities.
5. The image adapter generates a visual concept for the winning startup.
6. The UI renders a founder-ready report instead of an unstructured AI blob.

## Local development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Environment

Create `.env.local` with:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
GEMINI_IMAGE_MODEL=gemini-2.5-flash-image
MOCK_GEMINI=false
```

If `MOCK_GEMINI=true` or no key is available, the app can still run in mock mode for local demos.

## Project structure

```text
app/
  api/analyze/route.ts        # Upload endpoint
  page.tsx                    # Main product experience

src/
  adapters/                   # LLM and image provider abstractions
  components/                 # Product UI blocks
  config/                     # Env and constant definitions
  hooks/                      # Client-side mutation hooks
  i18n/                       # Typed translation dictionaries
  server/                     # Server-only request protections
  services/                   # Business orchestration layer
  types/                      # Shared contracts
```

## Built by

Built by Natalia Riabova.

This project reflects the kind of engineering work I do especially well:

- turning ambiguous AI ideas into usable products
- designing systems that are demo-ready now and scalable later
- combining strong frontend execution with thoughtful backend boundaries
- shipping polished UX without sacrificing architecture
