---
name: design-template-setup
description: Analyze a reference slide design image or PDF and create a reusable design foundation and use-case presentation template for this project.
---

# Design template setup

Use this workflow when a user provides slide screenshots, images, or a PDF as a visual design reference. The reference describes the desired visual language; it is not a draft deck to import.

## Workflow

1. Ask for the intended presentation use case, audience, venue/medium, typical duration, and whether the reference is inspiration or a design to reproduce closely. Do not infer the use case from visual appearance alone.
2. Inspect every supplied page where possible. Record observable evidence separately from interpretation: palette, type scale, margins, title/body placement, grid, recurring motifs, density, chart/table treatment, and opening/transition/closing patterns. Mark uncertain readings as inferences and ask only about decisions that materially affect the package.
3. Keep reusable visual primitives in `foundation.json`: color, typography, spacing, and shape tokens, plus source kind (`reference-image` or `reference-pdf`) and notes about evidence and uncertainty.
4. Keep use-case and composition decisions in `template.json`: purpose/audience, page-template regions, allowed component types, default density, recommended story sequence, and composition rules. The same foundation may be paired with more than one use-case template.
5. Start with the renderer's registered page templates and components. Do not claim a custom component works unless it is implemented in `src/design-system/technical-clean.js` and covered by the package contract. If the reference requires a genuinely new diagram, chart, or table type, explain the gap and use the `design-system-extension` workflow before selecting it.
6. Save the package under `designs/<use-case>/<package-id>/` when it is a distinct reusable package; use `designs/<use-case>/` for the initial package in an existing use case. Keep the original reference outside generated output and do not overwrite it.
7. Validate with `node src/cli.js validate-design <package-directory>`. Add the package to a representative slide JSON via `meta.designPackage` (path relative to that JSON), then validate and render HTML. Inspect the output against the reference and refine tokens/template rules; do not treat schema validity as visual approval.
8. Summarize which choices came from direct observation, which are inferred, and which reference details remain unsupported by the renderer.

## Boundaries

- A single set of visual tokens is not itself a complete presentation template; keep visual foundation and use-case composition separate.
- Do not hard-code a single reference slide's exact content as reusable design behavior.
- Do not ingest or convert a draft presentation as part of this workflow. Draft handoff/import format is intentionally undecided.
- Do not promise exact fidelity from screenshots/PDFs when font files, source assets, or measurements are unavailable.
