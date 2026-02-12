# CLAUDE.md — BMC Panelin Assistant Pro

## Project Overview

BMC Panelin Assistant Pro is a technical sales assistant for thermal insulation panels (isopaneles) built for BMC Uruguay. It provides AI-powered consultancy via a chat interface, including product recommendations, structural validation, and automated quoting with bill of materials (BOM).

Designed for Google AI Studio as the hosting platform.

## Tech Stack

- **Language:** TypeScript (ES2022 target)
- **Framework:** React 19 with hooks (no class components)
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS (loaded via CDN in index.html)
- **AI Backend:** Google Gemini API (`@google/genai` SDK, model `gemini-3-pro-preview`)
- **Package Manager:** npm
- **Module System:** ES Modules (`"type": "module"`)

## Project Structure

```
/
├── App.tsx              # Main React component (sidebar + chat UI)
├── index.tsx            # React DOM entry point
├── index.html           # HTML template (Tailwind CDN, import maps for React via esm.sh)
├── types.ts             # All TypeScript interfaces (Product, QuoteParams, TechnicalData, Message, etc.)
├── constants.ts         # Product catalog, accessories, system instructions, company info
├── services/
│   └── geminiService.ts # BMCBot class — Gemini API integration, function calling, audio
├── vite.config.ts       # Vite config (port 3000, env vars, path aliases)
├── tsconfig.json        # TypeScript config (bundler resolution, @/* path alias)
├── package.json         # Dependencies and scripts
├── metadata.json        # AI Studio app metadata (microphone permission)
└── .env.local           # GEMINI_API_KEY (not committed)
```

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build
npm run preview      # Preview production build
```

## Environment Setup

Requires a `.env.local` file at the project root with:

```
GEMINI_API_KEY=your_key_here
```

The key is injected via Vite's `define` config as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`.

**Security note:** Because this is a purely client-side app, any API key injected into the bundle will be visible to users in the browser and cannot be kept secret. You must either (a) configure strict restrictions on the key (for example, HTTP referrer restrictions and limited quota/permissions) or (b) move the Gemini API calls behind a server-side proxy and keep the key only on the server if you require real secrecy.

## Architecture

### State Management

All state is managed with React hooks (`useState`, `useEffect`, `useRef`, `useMemo`) inside `App.tsx`. No external state library (Redux, Zustand, etc.).

### Service Layer

`services/geminiService.ts` contains the `BMCBot` class which:
- Manages a Gemini chat session with persistent message history
- Implements function calling (tools): `calculateQuote()`, `checkAutoportancia()`
- Supports Google Search grounding for external validation
- Handles multimodal input (text, images, PDFs via base64)
- Provides audio features: `transcribeAudio()`, `generateSpeech()`, `connectLive()`

### UI Components (all in App.tsx)

- **TechnicalDataCard** — Renders quote/validation results with progress bars
- **ProductDetailModal** — Modal overlay for product specifications
- **Sidebar** — Integration status indicators and configuration toggles
- **Message feed** — Chat interface with user/bot message bubbles
- **Input area** — Text input with file attachment support

### Data Model (types.ts)

Key interfaces: `Product`, `Accessory`, `BOMItem`, `QuoteParams`, `TechnicalData`, `Message`, `Attachment`.

### Business Logic (constants.ts)

- `PRODUCT_CATALOG` — 7 panel products with pricing, thermal properties, dimensions
- `ACCESSORIES_CATALOG` — 7 installation hardware items
- `INSTITUTIONAL_INFO` — BMC Uruguay contact info, IVA rate (22%), currency (USD)
- `SYSTEM_INSTRUCTIONS` — Detailed AI prompt defining consultancy behavior and calculation rules

## Path Aliases

`@/*` maps to the project root (configured in both `tsconfig.json` and `vite.config.ts`).

## Key Conventions

- **Language:** The application UI and all business content are in Spanish
- **Single-file components:** All UI components live in `App.tsx`
- **No test framework:** No tests are configured (no Jest, Vitest, etc.)
- **No linter/formatter:** No ESLint or Prettier configuration
- **No CI/CD:** No automated pipelines
- **Tailwind via CDN:** Styles use Tailwind utility classes; no local Tailwind config file
- **React via import maps:** In production, React is loaded from `esm.sh` CDN (see index.html)

## Important Notes

- The Gemini API key must never be committed to the repository
- Product pricing and technical specifications are hardcoded in `constants.ts`
- The app uses the Gemini function-calling API for deterministic calculations (quotes, structural checks) rather than letting the LLM generate numbers
- Currency is USD; tax rate is 22% IVA (Uruguay)
