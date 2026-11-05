# Dress Code

Give your AI agent a dress code. Dress Code turns visual choices into a precise design brief for Claude Code or any AI coding agent: real hex codes, fonts, spacing and a list of things to avoid.

**Live:** https://indiaclarke03-ops.github.io/DressCode/

Everything runs in your browser. Nothing you paste is uploaded.

## Three modes

- **Start fresh:** set the look of a new project and get `DESIGN.md`, `SKILL.md`, a `CLAUDE.md` snippet and a kickoff prompt.
- **Restyle existing:** migrate a working v1 to a new look without changing what it does, using a generated `RESTYLE.md`.
- **Quick tweaks:** get a short, precise prompt for one small change.

The build is in progress. See [SPEC.md](SPEC.md) for the phases.

## Local development

```sh
npm install
npm run dev        # http://localhost:5173/DressCode/
npm run test       # unit tests
npm run test:e2e   # Playwright checks, screenshots in e2e/screenshots
npm run build
```

`base` defaults to `/DressCode/` for GitHub Pages. Set `VITE_BASE=/` to build for a custom domain.

## Licence

[MIT](LICENSE)
