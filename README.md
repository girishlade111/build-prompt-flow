# Build Prompt Flow

An AI-assisted code generation workspace. Describe what you want to build in a
chat panel, stream the generated code into a Monaco editor, preview it live,
and walk back through every version — a Lovable-style prompt → code → preview
loop in your own repo.

## What it does

Build Prompt Flow combines a conversational prompt interface with a real code
editor and live preview. You type (or refine) a prompt, the app calls an AI
code-generation backend, the result streams into the editor, and you can
preview, tweak, and iterate — with a full version history of everything
generated.

## Features

- **Prompt bar** — natural-language input for describing or refining the app to build
- **Chat panel** — conversational history of the build session
- **Streaming code generation** — AI-generated code streams in as it's produced
  (`src/hooks/useCodeGeneration.ts`)
- **Monaco code editor** — full-featured editor for generated code
  (`src/components/CodeEditor.tsx`)
- **Live preview** — render the generated app instantly
  (`src/components/LivePreview.tsx`)
- **Version history** — browse and restore earlier generations
  (`src/components/VersionHistory.tsx`)
- **Landing page** — marketing-style entry page (`src/components/LandingPage.tsx`)
- **Supabase integration** — AI generation goes through a Supabase Edge Function
  (`generate-code`), plus client-side auth/session helpers
- **Modern UI** — shadcn/ui components, Tailwind CSS, Framer Motion animations

## Tech stack

- **Vite** + **React 18** + **TypeScript**
- **Monaco Editor** (`@monaco-editor/react`)
- **Supabase** (`@supabase/supabase-js`) — Edge Function backend for code generation
- **shadcn/ui** (Radix primitives) + **Tailwind CSS**
- **Framer Motion**, **TanStack Query**, **React Router**

## Quick start

Prerequisites: Node.js 18+ and npm.

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open the printed local URL (default `http://localhost:8080`).

```bash
# Production build
npm run build        # output goes to dist/
npm run preview      # preview the production build
```

## Project structure

```
src/
  App.tsx                 # Router + providers (query client, tooltips, toasts)
  main.tsx                # Entry point
  pages/
    Index.tsx             # Main page composition
    NotFound.tsx          # 404 page
  components/
    LandingPage.tsx       # Marketing/entry page
    Workspace.tsx         # Main workspace layout
    ChatPanel.tsx         # Build-session chat
    PromptBar.tsx         # Prompt input
    CodeEditor.tsx        # Monaco editor for generated code
    LivePreview.tsx       # Live render of generated code
    VersionHistory.tsx    # Generation history browser
    ui/                   # shadcn/ui primitives
  hooks/
    useCodeGeneration.ts  # Calls the Supabase `generate-code` edge function
  integrations/
    supabase/
      client.ts           # Supabase client (URL + publishable key)
      types.ts            # Generated DB types
public/
  _redirects              # SPA fallback for static hosts
```

## Environment variables / backend notes

Code generation requires the Supabase Edge Function `generate-code` deployed on
the Supabase project configured in `src/integrations/supabase/client.ts`.
Without that function deployed (or with different credentials), the UI loads
but generation calls will fail. The key committed here is the Supabase
**publishable (anon) key**, which is safe to expose in a client app — row-level
security and function secrets live on the Supabase project itself.

## Deployment

Fully static (`vite build` → `dist/`). Deploy to any static host:

```bash
npm run build
# host the dist/ directory
```

`public/_redirects` (`/* /index.html 200`) keeps client-side routing working on
Cloudflare Pages / Netlify. Originally built with
[Lovable](https://lovable.dev/projects/6631c90c-7148-4828-ab48-1ce558de3a4b).

## Credits

Built by Girish Lade — https://ladestack.in
