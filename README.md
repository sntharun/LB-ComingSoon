# Living Bridges — React coming soon page

The page now uses the supplied animated radial-gradient component, a locally authored **dog** Lottie animation, subtle Framer Motion transitions, and a responsive launch layout. There is no form.

## Start

```sh
cd /Users/kratos_2004/Downloads/RIED/Canine-Nose-Print/coming-soon
npm install
npm run dev
```

Open the local URL printed by Vite. For production, run `npm run build` and publish `dist/`. `npm run preview` serves that production build. Opening the React `index.html` directly does not compile TypeScript.

Installation was attempted in the editing environment but npm registry DNS resolution failed. Dependencies are declared in `package.json`; a lockfile and compiled build could not be generated or verified here.

## Structure

| Purpose | Path relative to this project |
| --- | --- |
| Reusable UI components | `components/ui/` |
| Supplied gradient component | `components/ui/animated-gradient-background.tsx` |
| Adapted demo and launch page | `components/ui/demo.tsx` |
| Dog player with SVG fallback | `components/ui/dog-companion.tsx` |
| Global styles and Tailwind import | `src/index.css` |
| React entry | `src/main.tsx` |
| shadcn configuration | `components.json` |
| Class-name helper | `lib/utils.ts` |
| Dog animation and fallback | `public/animations/` |

The `@/` alias resolves to the project root. Keeping reusable components in `components/ui` makes the supplied import work unchanged and gives the shadcn CLI a consistent destination; otherwise generated files and imports can disagree.

## Stack setup

Vite, React, TypeScript, Tailwind CSS v4, the Tailwind Vite plugin, path aliases, and shadcn-compatible configuration are already provided. There is no existing React application elsewhere in this repository that this page depends on.

For a new project from scratch:

```sh
npm create vite@latest my-launch-page -- --template react-ts
cd my-launch-page
npm install
npm install tailwindcss @tailwindcss/vite framer-motion @lottiefiles/dotlottie-react
npx shadcn@latest init
```

Configure Tailwind's Vite plugin, import `tailwindcss` in the global stylesheet, and add the `@/` alias to Vite and TypeScript, as in this project's configuration. To add shadcn components to this already-configured project, use `npx shadcn@latest add button`; do not reinitialize over the custom launch styles.

## Gradient integration

The original component's public props, including the capitalized `Breathing`, are retained. This version initializes its background immediately, uses stable default arrays, validates stop ordering and dimensions, avoids an animation loop when breathing is disabled, respects reduced motion, caps gradient repainting at 30 fps, and pauses when the tab is hidden. Unused example imports and invalid `delay`/`duration` attributes on a native div were removed.

## Dog instead of cat

`DogCompanion` loads the supplied `public/animations/cute-doggie.lottie` in the hero. `Say hello` briefly speeds up the animation and changes the caption. A still SVG from the same animation stays visible until Lottie loads and remains available if the player cannot initialize. The Lottie runtime may load its WebAssembly renderer from its default CDN, so an internet connection may be required for its first load; the SVG fallback does not require a connection.

Motion can be paused. System reduced-motion preferences disable the looping effects, and Lottie playback stops in background tabs.

## Supplied favicon

The supplied dog artwork is saved unchanged at `public/dog.svg`. The Vite app references this file as its favicon.
