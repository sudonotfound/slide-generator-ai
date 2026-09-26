---
name: slide-authoring
description: Create or revise an AI-first slide document through clarification, explicit assumptions, JSON updates, validation, and rendered preview.
---

# Slide authoring workflow

Use this workflow when the user wants to create or revise a slide deck.

## Required sequence

1. Confirm or ask for the purpose, audience, occasion, duration, language, desired outcome, and presentation medium.
2. Separate user-provided facts from AI inferences. Put inferences in `assumptions` with `source: "ai-inference"` and a confidence value.
3. Propose the thesis and story pattern before filling slide content.
4. Choose existing page templates and components from the design system. Do not invent a new component silently.
5. Update one `presentation.json` file as the source of truth.
6. Validate the JSON document.
7. Generate Marp Markdown and render HTML for browser viewing.
8. Report unresolved assumptions and ask for the next focused change instead of claiming the deck is final.

## Editing rules

- Preserve the user's confirmed context unless they explicitly change it.
- Change only the JSON source and component definitions needed for the requested revision.
- Keep one message per slide whenever possible.
- Prefer low-density layouts for lightning talks.
- Use speaker notes for delivery guidance, not as a substitute for the visible message.
- If no suitable template or component exists, stop and use the `design-system-extension` workflow.

## Commands

```sh
npm run validate -- examples/presentation.json
node src/cli.js markdown examples/presentation.json
node src/cli.js render examples/presentation.json
```
