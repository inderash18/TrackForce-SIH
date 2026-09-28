---
description: Design system and UI component guidelines for React and Tailwind CSS
globs: src/**/*.{tsx,ts,jsx,js,css}
alwaysApply: true
---

# Antigravity UI Design System Rules

When generating or editing user interfaces in this project:

1. **Use Semantic Design Tokens**:
   - Page Background: `#F5F8FC`
   - Card/Surface: `#FFFFFF`
   - Border: `#E2E8F0`
   - Primary Text: `#172033`
   - Secondary Text: `#526176`
   - Primary Action Button: `#172033` (white text)
   - Accent: `#0284C7`
   - Callout Section: `#EFF8FF`

2. **Reuse Existing UI Primitives**:
   - Import from `src/components/ui`: `Button`, `Input`, `Textarea`, `Card`, `Badge`, `Dialog`, `Tabs`, `Table`, `Skeleton`, `Alert`, `DropdownMenu`.
   - Use `cn(...)` from `src/lib/utils` for merging class names.

3. **Human-Centric Layout**:
   - Page padding: `24px` on desktop (`p-6`), `16px` on mobile (`p-4`).
   - Card internal padding: `20px–24px` (`p-5` or `p-6`).
   - Corner radius: `8px` (`rounded-lg`) for controls, `12px–16px` (`rounded-xl` / `rounded-2xl`) for panels.
   - Spacing: 8px rhythm (`gap-2`, `gap-3`, `gap-4`, `gap-6`).

4. **Avoid AI Clichés**:
   - No neon purple gradients, no giant floating pills, no oversized empty cards.
   - Keep header, body, and footer alignment consistent and left-aligned.
