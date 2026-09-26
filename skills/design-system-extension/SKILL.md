---
name: design-system-extension
description: Add a reusable slide page template or design component while preserving the JSON component contract and renderer separation.
---

# Design-system extension workflow

Use this workflow when a requested slide cannot be expressed with the existing templates or components.

## Required sequence

1. Describe the visual problem and identify whether it is a page template, layout, content component, or visualization component.
2. Decide the reuse scope: material-specific, deck-local, or shared design-system.
3. Define the component contract: `component`, `kind`, `version`, `variant`, `props`, and `slots` where applicable.
4. Specify required props, optional props, defaults, constraints, and one JSON example.
5. Implement the renderer in the selected theme registry.
6. Add a representative fixture or sample usage.
7. Render the fixture to HTML and verify overflow, hierarchy, contrast, and readability.
8. Promote to a shared component only after human confirmation.

## Boundaries

- Keep content data in JSON and visual implementation in the design system.
- Do not add presentation-specific business logic to the Marp CLI.
- Do not copy a one-off visual into the shared library without parameterizing it.
- Keep future HTML/React renderers possible by avoiding Marp-only data structures in JSON.
