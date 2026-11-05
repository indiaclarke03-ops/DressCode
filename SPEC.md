# Dress Code: Build Spec (v2)

> **How to use this file**
> 1. Clone https://github.com/indiaclarke03-ops/DressCode and open it in VS Code.
> 2. Save this file in the root as `SPEC.md`.
> 3. In Claude Code, start with: *"Read SPEC.md. Build Phase 1 only, then stop and show me."*
> 4. Work through the phases in order. After each phase, review in the browser before moving on.
>
> Product name: **Dress Code**. Use it in the page title, header, footer, README, OG image and meta tags.

---

## 1. What we're building

A polished, public-facing web tool that helps people define a visual design style **by picking, not describing**. It turns those choices into ready-to-use prompts and files that tell Claude Code (or any AI coding agent) exactly how a project should look.

**The core insight:** AI agents produce generic UIs because they get vague briefs ("make it modern and clean"). This tool turns a few minutes of visual choices into a precise brief with real values (hex codes, font names, spacing scales, radius, shadows) plus an explicit list of things to avoid.

**Three modes**, chosen on the landing page:

| Mode | For someone who… | Main output |
|---|---|---|
| **Start fresh** | is about to build something new | `DESIGN.md` / `SKILL.md` / `CLAUDE.md` snippet + a kickoff prompt |
| **Restyle existing** | already has a v1 and dislikes how it looks | `DESIGN.md` + a step-by-step **restyle prompt** that migrates the codebase to the new look without breaking functionality |
| **Quick tweaks** | wants one small change (colours, font, add a table, change a map type) | a short, precise prompt to paste into Claude Code |

**Audience:** developers, designers, students and researchers who build with AI coding agents. The tool will be public, so it must look credible and finished.

**Branding rule:** the tool contains no institutional or organisational branding or attribution. The footer credits only the project name, a GitHub link and a privacy line.

---

## 2. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Vite + React 18 + TypeScript** | Fast, fully static output; ideal for GitHub Pages |
| Routing | **React Router with `HashRouter`** | GitHub Pages has no server-side routing; hash URLs avoid 404s on refresh |
| Styling | **Tailwind CSS v4** with CSS variables | The tool's theme and the live preview both run on CSS variables |
| Components | **Radix UI primitives** (tabs, dialog, tooltip, toggle group, slider, popover) | Accessible behaviour; we style them ourselves |
| Icons | **lucide-react** | Consistent line icons. No emoji anywhere in the UI |
| Animation | **Framer Motion** (sparingly) | Step transitions and choice selection only |
| Colour maths | **culori** | Tonal scales, WCAG contrast checks, colour extraction |
| Charts (preview) | **Recharts** | Styled entirely from tokens |
| Maps (preview) | **Static SVG maps** (e.g. a simplified world/US TopoJSON rendered with `d3-geo`) | No API keys, no tile servers; works offline on GitHub Pages |
| Fonts | Google Fonts, loaded on demand | Previews must render in the actual chosen fonts |
| State | React context + `useReducer`; config serialised to the URL | Shareable links, no backend |
| Zip export | **jszip** | "Download all" |
| Testing | **Vitest** (generators, parsers) + **Playwright** (visual checks) | |
| Deploy | **GitHub Pages** via GitHub Actions (see §11) | |

No backend, no accounts, no analytics in v1. Everything runs client-side. Nothing the user pastes leaves the browser.

---

## 3. Landing page

- Headline that states the value in one line (e.g. *"Give your AI agent taste."*, or something better).
- One sentence of explanation, plus a short before/after visual: a generic AI-made card next to the same card built from a generated brief.
- **Three large mode cards:** Start fresh / Restyle existing / Quick tweaks. Each has a one-line description and a small illustration.
- Secondary link: **See example briefs** (gallery of 4–6 preset styles that can be opened and edited).
- Footer: product name, GitHub repo link, "Everything runs in your browser. Nothing you paste is uploaded."

---

## 4. Shared step: What are you building?

Used by both **Start fresh** and **Restyle existing**. Single choice, with large cards and simple line illustrations, grouped under small headings:

**Websites**
- Marketing / landing page
- Portfolio / personal site
- Blog / editorial / publication
- Docs / knowledge base
- E-commerce / storefront
- Event / conference site

**Apps & tools**
- Web app / SaaS product
- Internal tool / admin panel
- AI chat / assistant interface
- Form / survey / questionnaire
- Calculator / estimator
- Mobile-first web app

**Data & research**
- Data dashboard
- Simulator / scenario model (sliders, inputs, live outputs; e.g. policy or risk simulators)
- Map-based tool / geospatial explorer
- Interactive data story / scrollytelling report
- Research report / policy brief (web)
- Educational explainer / interactive lesson

**Other**
- Game / playful interactive
- Presentation-style microsite
- *Something else* (free-text field; falls back to the "Web app" defaults)

Each type maps to one of the **preview scene families** in §8 and to a set of type-specific questions in §5.6.

---

## 5. Mode A: Start fresh

A progress indicator shows the steps; the user can jump back to any completed step. A **live preview panel** is visible from step A2 onward (right side on desktop, collapsible bottom sheet on mobile).

### A1. What are you building?
See §4.

### A2. This or that (8 rounds)
Each round shows **the same mini UI component rendered two ways, side by side**. The user clicks one, or "No preference" (uses a sensible default for the project type). Keyboard: ← / → to choose, N for no preference.

| Round | Option A | Option B | Maps to |
|---|---|---|---|
| 1. Theme | Light | Dark | `mode` |
| 2. Density | Airy | Compact | `density` |
| 3. Corners | Sharp (0–4px) | Soft (12–16px) | `radius` |
| 4. Depth | Flat (borders) | Layered (soft shadows) | `depth` |
| 5. Colour use | Monochrome + one accent | Multi-colour / expressive | `colorStrategy` |
| 6. Headings | Sans-serif | Serif | `headingStyle` |
| 7. Motion | Quiet (fades, ≤150ms) | Expressive (springs, stagger) | `motion` |
| 8. Layout | Strict grid | Editorial / asymmetrical | `layout` |

The demo component suits the project type: a KPI card for dashboards, a slider panel for simulators, a map legend card for map tools, a hero snippet for marketing, a chat bubble pair for AI chat, and so on. Build each pair from the **same React component** with different token props, so the comparison is honest.

### A3. Colour
- **Accent:** 10 curated swatches (avoid default purple/indigo; include deep green, ink blue, terracotta, ochre, teal, etc.) plus a custom hex input.
- **Neutral temperature:** Cool / Warm / True neutral.
- Auto-generate the full palette: background, surface, surface-raised, border, text, text-muted, accent, accent-foreground, success, warning, danger.
- **Contrast checklist**, shown live: WCAG AA pass/fail for key pairs, with a one-click "Fix contrast" option.
- For "expressive" colour, or for dashboards, simulators and maps, also generate data palettes: categorical (5–8), sequential and diverging.

### A4. Typography
- 8–10 curated pairings, filtered by serif/sans. Each card renders a real heading, paragraph, label and number in those fonts.
- Suggested set (verify each is on Google Fonts):
  - Sans: *Geist + Geist Mono*, *Inter Tight + Inter*, *Manrope*, *IBM Plex Sans + IBM Plex Mono*, *DM Sans*, *Space Grotesk + Inter*
  - Serif headings: *Instrument Serif + Geist*, *Fraunces + Inter*, *Newsreader + Source Sans 3*, *Playfair Display + Lato*
- Type scale: Tight (1.125) / Balanced (1.2) / Dramatic (1.333).

### A5. Project-specific details (§5.6)

### A6. Avoid list (§7)

### A7. Review & export (§9)

### 5.6 Type-specific questions
Ask only what's relevant, 2–4 questions per type, all multiple-choice with visual examples where possible.

| Project type | Questions |
|---|---|
| **Dashboard** | Chart palette (categorical / sequential / diverging) · Number format (tabular figures, abbreviations) · Table density · Nav (sidebar / top bar) |
| **Simulator** | Control style (sliders / steppers / numeric inputs) · Layout (controls left + output right / controls top / floating panel) · Output emphasis (big headline number / chart / both) · Show uncertainty (ranges, bands) yes/no |
| **Map tool** | Map type (choropleth / points / heatmap / flow lines / hexbin) · Basemap style (minimal light / minimal dark / none, shapes only) · Legend position · Side panel for details yes/no |
| **Data story / report** | Reading width · Chart annotation style (callouts / minimal) · Section transitions (scroll-triggered / static) |
| **Web app / internal tool** | Nav (sidebar / top / both) · Form style (outlined / filled / underline) · Empty states (illustrated / text) · Table style |
| **AI chat** | Message style (bubbles / flat transcript) · Input position · Show sources/citations panel yes/no |
| **Form / survey** | One question per screen vs. long form · Progress style · Input style |
| **Calculator** | Result placement · Live update vs. "Calculate" button · Show breakdown yes/no |
| **Marketing / event** | Hero style · Section rhythm · Button style |
| **E-commerce** | Product card style · Grid density · Price emphasis |
| **Portfolio / blog / docs** | Content width · Image treatment · Code block theme (docs) |
| **Educational explainer** | Step-by-step vs. free exploration · Quiz/check-in style |
| **Game / playful** | Playfulness level · Sound/motion intensity |

---

## 6. Mode B: Restyle existing

For someone with a working v1 who wants a new look **without breaking anything**.

### B1. About your current project
- **What is it?** (same picker as §4)
- **How is it styled now?** Plain CSS / Tailwind / CSS Modules / styled-components / Sass / MUI / shadcn/ui / Bootstrap / Chakra / Streamlit / Not sure
- **Paste your current styles (optional):** a large text area for CSS, a Tailwind config, a theme file, or a list of colours. Parse it client-side to extract:
  - colours (hex, rgb, hsl, CSS variables)
  - font families
  - border-radius values
  - shadow declarations

  Show the result as a **"Your current palette"** strip. This is optional; the flow works without it.
- **Screenshot (optional):** drop an image to extract its dominant colours (canvas sampling plus quantisation). The image stays in the browser.

### B2. What should stay the same?
Checkboxes (multi-select):
- Layout and page structure
- All copy/text
- Component library (e.g. keep shadcn, just re-theme it)
- Brand/logo colour (if checked, ask which colour from the extracted palette)
- Icons
- Functionality and behaviour (**always checked and locked**, with the explanation "We never change what your app does")

### B3. How big a change?
- **Full redesign:** new tokens everywhere, layout polish allowed
- **Re-theme only:** colours, fonts, radius, shadows; no layout changes
- **Gradual:** apply to one page/component first, then roll out

### B4–B9. Same as Start fresh A2–A7
Show a **"current → new" comparison** wherever there's a palette or font: the old palette strip above the new one, and the old font above the new font. In the preview panel, a toggle switches between "Current" (built from the extracted values) and "New".

### B10. Restyle output
In addition to the standard exports, generate **`RESTYLE.md`**, a migration prompt for Claude Code (template in §9.6).

---

## 7. Avoid list

A checklist of common AI-generated UI tells, **all pre-checked by default**. The user can uncheck any and add their own.
- Purple-to-blue or rainbow gradients
- Emoji used as icons
- Three identical feature cards in a row
- Everything centre-aligned
- Glassmorphism / heavy blur
- Oversized border radius on everything
- Generic stock-style hero illustrations
- Drop shadows on every element
- Placeholder copy ("Lorem ipsum", "Welcome to our platform")
- Too many font weights and sizes
- Low-contrast grey text on grey backgrounds
- Decorative animations on load
- Rainbow chart palettes / default library chart colours
- Maps with full-colour default basemaps that compete with the data

---

## 8. Live preview

- Rendered inside a container that receives derived tokens as **scoped CSS variables** (`--bb-color-accent`, etc.), isolated from the tool's own theme.
- Desktop / mobile toggle resizes the frame. Updates must feel instant (<50ms): update CSS variables rather than re-mounting.
- **Realistic content only.** Never use lorem ipsum.

**Scene families.** Build 8 scenes; each project type maps to the closest one, with small content variations.

| Scene | Used for | Contents |
|---|---|---|
| `DashboardScene` | Dashboard, internal tool | Sidebar, 4 KPI cards, line + bar chart, data table |
| `SimulatorScene` | Simulator, calculator | Control panel with sliders and toggles, big output number, chart with an uncertainty band, scenario tabs |
| `MapScene` | Map tool | SVG choropleth or point map, legend, filter panel, detail side panel |
| `AppScene` | Web app, mobile-first app, form/survey | Settings page, form fields, toggles, modal trigger, empty state |
| `ChatScene` | AI chat | Message thread, input bar, sources panel |
| `MarketingScene` | Marketing, event, e-commerce, presentation | Hero, logo strip, features, pricing/product cards, footer |
| `EditorialScene` | Blog, data story, research report, educational | Long-form article with pull quote, annotated chart, callout |
| `DocsScene` | Docs, portfolio | Sidebar nav, article with code block, table of contents |

Sample content topics: energy prices, supply chains, city transit, climate scenarios, a fictional product. Keep them neutral and plausible.

---

## 9. Review & export

- Full-width preview of the scene.
- Tabs with syntax-highlighted code, each with **Copy** and **Download**:
  - `DESIGN.md` · `SKILL.md` · `CLAUDE.md snippet` · `tokens.css` · `tailwind` · **`KICKOFF prompt`** (Start fresh) or **`RESTYLE.md`** (Restyle)
- **Download all (.zip)** and **Copy share link**.
- A "How to use this" panel with 3 steps, tailored to the mode.
- An optional "Name your style" field, used in headers and the skill name.

All generators are **pure functions** in `src/generators/`, `(config, tokens) => string`, each with unit tests.

### 9.1 `DESIGN.md` (target shape)

```markdown
# Design Brief: Quiet Ledger
Project type: Data dashboard

## Direction
A calm, information-dense dashboard. Light theme, sharp corners, flat surfaces
separated by hairline borders. One deep-green accent used sparingly for
primary actions and highlights. Typography carries the hierarchy, not colour.

## Colour tokens
| Token | Value | Use |
|---|---|---|
| background | #FAFAF7 | Page background |
| surface | #FFFFFF | Cards, panels |
| border | #E4E2DC | Dividers, card outlines |
| text | #1C1B18 | Primary text |
| text-muted | #6B6860 | Secondary text, labels |
| accent | #1F5C45 | Primary buttons, active states, key data |

Data palette (categorical): #1F5C45, #C2763A, #3D6A9E, #9C8A4A, #7A5C8F
Sequential: #E8F0EC → #1F5C45

## Typography
- Headings: Geist 600 · Body: Geist 400, 14px base · Numbers: Geist Mono, tabular figures
- Scale: 1.125 (12 / 14 / 16 / 18 / 20 / 24 / 28)

## Spacing, radius, depth
- Spacing: 4, 8, 12, 16, 24, 32, 48
- Radius: 4px (inputs, buttons), 6px (cards)
- No shadows. Use 1px borders.

## Motion
Quiet. Fades and colour transitions only, 120–150ms, ease-out. No load animations.

## Layout rules
- Left sidebar, 240px · 12-column grid, 24px gutters · Left-align text

## Dashboard rules
- Tabular figures; right-align numeric columns
- Abbreviate in cards (1.2K), full values in tables

## Do not
- Use purple/blue gradients
- Use emoji as icons (use lucide-react)
- ...

## Before you finish
1. Run the app and screenshot each new or changed screen at 1440px and 390px wide.
2. Check every screen against this brief, especially "Do not".
3. Check text contrast meets WCAG AA.
4. Fix anything that doesn't match, then screenshot again.
```

The "Before you finish" section must appear in **every** output.

### 9.2 `SKILL.md`
Same content as `DESIGN.md`, with frontmatter:

```markdown
---
name: quiet-ledger-design
description: Visual design system for this project. Use whenever creating or restyling pages, components, charts, maps or layouts.
---
```
Include an install note: `.claude/skills/quiet-ledger-design/SKILL.md`.

### 9.3 `CLAUDE.md` snippet
Condensed (≤40 lines): tokens, do-not list, verify steps. Starts with `## Design system`.

### 9.4 `tokens.css` and 9.5 Tailwind
CSS custom properties (plus a dark block if relevant). Tailwind as both a v3 `theme.extend` and a v4 `@theme` block, labelled.

### 9.6 `RESTYLE.md` (Restyle mode only)

```markdown
# Restyle: apply the "Quiet Ledger" design to this project

Read DESIGN.md first. Your job is to change how this project LOOKS, not what it DOES.

## Rules
- Do not change functionality, data logic, routes, or copy.
- Keep: <list from B2, e.g. layout, shadcn/ui components, logo colour #1F5C45>
- Scope: <Full redesign | Re-theme only | Gradual: start with <page>>

## Steps
1. **Audit.** Find where styles live (<framework from B1>). List every hard-coded
   colour, font, radius and shadow, with file paths. Show me the list before changing anything.
2. **Screenshot "before".** Run the app; capture key screens at 1440px and 390px.
3. **Create tokens.** Add the tokens from DESIGN.md as <CSS variables | Tailwind theme |
   theme file>, in one place.
4. **Map old → new.** Replace hard-coded values with tokens. Old → new map:
   - #6C5CE7 → accent
   - #F1F1F1 → surface
   - ...
5. **Apply layout and component rules** (skip this step if "Re-theme only").
6. **Screenshot "after"** at the same sizes. Compare with the "before" screenshots and with DESIGN.md.
7. **Report** what changed, file by file, and anything you weren't sure about.

Work in small commits, one step per commit, so changes are easy to review or revert.
```

When the user pasted current styles, fill the old → new map automatically by nearest role (darkest → text, lightest → background, most saturated → accent, etc.). The user can edit the mapping in the UI before exporting.

### 9.7 Kickoff prompt (Start fresh mode only)
A short prompt: *"Read DESIGN.md. We're building a <type>. Before writing features, set up the design tokens, base layout and a small component set (button, card, input, table/chart as relevant). Screenshot and check against the brief, then wait for me."*

---

## 10. Mode C: Quick tweaks

A separate page that gives a fast way to get a **short, precise prompt** for one change. No long flow.

### Layout
- Left: category list. Right: tweak cards for the selected category.
- Each tweak card has 1–4 small inputs (dropdowns, colour pickers, toggles) and a live **prompt preview** that updates as you change them.
- **Copy** button on every card.
- **Tweak basket:** add several tweaks, then copy them all as one numbered prompt.
- Global toggle: **"I have a DESIGN.md"**. When on, prompts end with "Follow DESIGN.md for anything not specified here."
- Global toggle: **"Ask Claude to screenshot and check"** (on by default). Appends a one-line verification instruction.

### Categories and tweaks

| Category | Tweaks |
|---|---|
| **Colour** | Change accent colour · Change whole palette (pick a preset) · Add dark mode · Fix low contrast · Make it more muted / more vibrant |
| **Typography** | Change font pairing · Make headings bigger/smaller · Use tabular numbers · Tighten line length for reading |
| **Layout & spacing** | More/less whitespace · Switch to sidebar/top nav · Make it responsive for mobile · Align to a grid · Make cards consistent height |
| **Components** | Add a table (sortable / filterable / sticky header / pagination) · Add cards · Add a modal · Add tabs · Add an empty state · Add a loading skeleton · Add toast notifications |
| **Charts** | Change chart type (line / bar / area / scatter / donut → *avoid* advice where relevant) · Apply brand palette to charts · Add annotations · Add uncertainty bands · Simplify gridlines/axes |
| **Maps** | Change map type (choropleth / points / heatmap / flow / hexbin) · Change basemap style · Change colour scale (sequential / diverging) · Add legend · Add hover tooltips · Add a details side panel · Choose library (Leaflet / MapLibre / D3) |
| **Simulators & inputs** | Swap inputs for sliders · Add preset scenarios · Show output ranges · Add a "reset to defaults" button · Show a live-updating headline number |
| **Motion** | Remove animations · Add subtle transitions · Respect reduced motion |
| **Polish & accessibility** | Consistent icon set · Visible focus states · Keyboard navigation · Alt text · Remove AI-generic tells (uses the avoid list) |

### Prompt shape
Short, specific, scoped, with the verification line. Example (Maps → Change map type):

```
Change the map on the <page name> page from a point map to a choropleth.
- Shade regions by <metric> using a sequential scale from #E8F0EC to #1F5C45 (5 steps).
- Add a legend in the bottom-left showing the steps and their ranges.
- Keep hover tooltips showing region name and value.
- Don't change the data loading or any other page.
Follow DESIGN.md for anything not specified here.
When done, screenshot the page at 1440px and 390px and check the legend is readable.
```

Placeholders like `<page name>` appear as editable inline fields in the UI, so the copied prompt is complete.

Store tweak definitions as **data** (`src/tweaks/*.ts`): id, category, title, inputs schema and a template function. This makes adding new tweaks easy without touching UI code.

---

## 11. Hosting: GitHub Pages

- Repo: `https://github.com/indiaclarke03-ops/DressCode`. Live URL: `https://indiaclarke03-ops.github.io/DressCode/`.
- In `vite.config.ts`, set `base: '/DressCode/'` (case-sensitive; must match the repo name). Read it from an env var so a custom domain can later switch to `'/'`.
- Use `HashRouter` so deep links and refreshes work.
- Encode the share-link config in a query param inside the hash: `#/review?c=<base64url>`.
- Add `.github/workflows/deploy.yml`:
  - Triggers on push to `main`
  - Node 20, `npm ci`, `npm run test`, `npm run build`
  - Uses `actions/upload-pages-artifact` + `actions/deploy-pages`
- In repo Settings → Pages, set **Source: GitHub Actions**.
- Add `public/404.html` that redirects to the root (safety net).
- Add favicon, OG image (1200×630) and meta tags with absolute URLs using the Pages URL.
- Write a README with: a screenshot, what it does, the three modes, local dev commands, and the licence.

---

## 12. The tool's own design

The tool must itself be an example of good taste. If it looks generic, nobody will trust its output.

**Direction:** editorial and calm, like a well-made design publication crossed with a precise instrument. Warm and confident, not playful.

| Token | Light | Dark |
|---|---|---|
| background | `#F7F5F0` | `#141413` |
| surface | `#FFFFFF` | `#1D1D1B` |
| border | `#E3DFD6` | `#2E2D2A` |
| text | `#1A1915` | `#EDEBE5` |
| text-muted | `#6E6A60` | `#9C988E` |
| accent | `#C2552D` (terracotta) | `#E07A52` |

- **Fonts:** *Instrument Serif* for display headings, *Geist* for UI and body, *Geist Mono* for code and values.
- **Radius:** 8px cards, 6px buttons. **Shadows:** almost none; use borders, with one soft shadow only on the selected choice card.
- **Spacing:** generous. One decision per screen in the guided flows.
- **Choice cards:** on hover, the border darkens. When selected, show an accent border, a check icon and scale 1.01. No glow.
- **Motion:** 200ms fade/slide between steps; respect reduced motion.
- **Light/dark toggle** in the header; default to `prefers-color-scheme`.
- The tool follows its own Avoid list.

---

## 13. Data model

```ts
type Mode = 'fresh' | 'restyle' | 'tweak';

type ProjectType =
  | 'marketing' | 'portfolio' | 'editorial' | 'docs' | 'ecommerce' | 'event'
  | 'app' | 'internal' | 'chat' | 'form' | 'calculator' | 'mobile'
  | 'dashboard' | 'simulator' | 'map' | 'datastory' | 'report' | 'explainer'
  | 'game' | 'presentation' | 'other';

interface DesignConfig {
  version: 2;
  mode: Exclude<Mode, 'tweak'>;
  name: string;
  projectType: ProjectType;
  projectTypeOther?: string;
  theme: 'light' | 'dark';
  density: 'airy' | 'compact';
  radius: 'sharp' | 'soft';
  depth: 'flat' | 'layered';
  colorStrategy: 'mono-accent' | 'expressive';
  headingStyle: 'sans' | 'serif';
  motion: 'quiet' | 'expressive';
  layout: 'grid' | 'editorial';
  accent: string;
  neutral: 'cool' | 'warm' | 'neutral';
  fontPairingId: string;
  typeScale: 'tight' | 'balanced' | 'dramatic';
  projectOptions: Record<string, string | boolean>;
  avoid: string[];
  restyle?: {
    stylingSystem: string;
    extracted?: { colors: string[]; fonts: string[]; radii: string[]; shadows: string[] };
    keep: string[];
    scope: 'full' | 'retheme' | 'gradual';
    gradualTarget?: string;
    colorMap: Record<string, string>;   // old hex -> token name
  };
}

interface TweakDefinition {
  id: string;
  category: string;
  title: string;
  inputs: TweakInput[];               // select | color | toggle | text
  template: (values: Record<string, unknown>, opts: { hasDesignMd: boolean; verify: boolean }) => string;
}
```

**Rule:** `deriveTokens(config)` is the single source of truth. The preview, every generator and the CSS variables all read from it.

---

## 14. File structure

```
.github/workflows/deploy.yml
public/ (favicon, og-image.png, 404.html)
src/
  app/        App.tsx, routes.tsx, ConfigContext.tsx
  pages/      Landing.tsx, Examples.tsx, Tweaks.tsx
  flows/
    fresh/    steps for Start fresh
    restyle/  CurrentProject.tsx, KeepList.tsx, ChangeSize.tsx
    shared/   ProjectType.tsx, ThisOrThat.tsx, Colour.tsx, Typography.tsx,
              ProjectDetails.tsx, AvoidList.tsx, Review.tsx
  preview/    PreviewFrame.tsx, scenes/*.tsx, demos/*.tsx
  tokens/     deriveTokens.ts, palette.ts, fontPairings.ts, defaults.ts
  restyle/    parseStyles.ts, extractImageColors.ts, autoColorMap.ts
  tweaks/     colour.ts, typography.ts, layout.ts, components.ts,
              charts.ts, maps.ts, simulators.ts, motion.ts, polish.ts
  generators/ designMd.ts, skillMd.ts, claudeMdSnippet.ts, tokensCss.ts,
              tailwind.ts, restyleMd.ts, kickoff.ts, __tests__/
  components/ui/
  lib/        urlState.ts, fonts.ts, zip.ts
  styles/     globals.css
```

---

## 15. Build phases

Stop after each phase so I can review it in the browser.

1. **Foundation:** scaffold, the tool's own tokens, fonts, dark mode, UI kit (Button, ChoiceCard, Stepper, Tabs, CodeBlock), landing page with the three mode cards, empty step shells, and the GitHub Pages workflow deploying a first version. ✅ Live URL works and the landing page looks finished.
2. **Config + tokens:** types, reducer, defaults, URL state, `deriveTokens`, palette and contrast helpers, with tests. ✅ Tests pass.
3. **Start fresh flow:** all steps working, including This-or-That and the project-type questions. ✅ Full run-through possible.
4. **Live preview:** PreviewFrame and all 8 scenes with realistic content. ✅ Every choice visibly changes the preview; every scene looks like a real product.
5. **Exports:** all generators plus the Review step (tabs, copy, download, zip, share link). ✅ Generated briefs for 3 configs read like a human designer wrote them.
6. **Restyle flow:** style parser, image colour extraction, keep-list, scope, current-vs-new preview toggle, editable old → new colour map, and `RESTYLE.md`. ✅ Pasting a real Tailwind config or CSS file produces a sensible map.
7. **Quick tweaks:** tweak data files, page layout, inline placeholders, basket, global toggles. ✅ At least 40 tweaks across all categories.
8. **Polish + ship:** responsive pass (390 / 768 / 1440), accessibility pass, examples gallery, OG image, README. ✅ Acceptance criteria in §17 met.

---

## 16. Quality bar (every phase)

- **Visual verification:** after building or changing any screen, run the dev server, take Playwright screenshots at 1440px and 390px, review them, and fix anything misaligned, cramped, inconsistent or generic before reporting back.
- **Accessibility:** keyboard-reachable controls; visible focus rings (accent, 2px offset); choice cards as proper radio groups; WCAG AA contrast; respect `prefers-reduced-motion`.
- **Code:** strict TypeScript, no `any`; no style values outside the token files; pure, tested generators; files under ~250 lines.
- **Content:** no lorem ipsum anywhere; short, plain, confident microcopy; one-line explanation per This-or-That round.
- **Privacy:** pasted styles and screenshots never leave the browser. Say so in the UI next to the paste/upload fields.

---

## 17. Acceptance criteria for v1

- [ ] Start fresh: landing page to downloaded brief in under 3 minutes.
- [ ] Restyle: pasting a real CSS/Tailwind file extracts colours and fonts, shows current vs. new, and produces a `RESTYLE.md` with a sensible old → new map.
- [ ] Quick tweaks: any single tweak can be found and copied in under 20 seconds; the basket combines several tweaks cleanly.
- [ ] Every choice visibly changes the live preview.
- [ ] Share links restore the exact configuration.
- [ ] Manual test: run a generated `RESTYLE.md` on a real v1 project in Claude Code. The look changes, and functionality doesn't.
- [ ] Lighthouse: Accessibility ≥ 95, Performance ≥ 90.
- [ ] Looks finished at 390 / 768 / 1440px in light and dark mode.
- [ ] Deployed and working on GitHub Pages, including refresh on deep links.

---

## 18. Open decisions

- Tagline (name is final: Dress Code)
- Repo: decided (`indiaclarke03-ops/DressCode`)
- Licence (MIT suggested)
- v2 ideas: import an existing `DESIGN.md` to edit it; community gallery of shared styles; browser bookmarklet that extracts a live site's styles for Restyle mode
