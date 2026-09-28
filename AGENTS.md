# Workspace Coding & UI Design Rules for AI Agents (Antigravity & OpenCode)

All AI agents working on this workspace MUST adhere to the following UI engineering principles and component architecture:

---

## 1. UI Stack & Component Foundation

- **Framework**: React 19 + Vite 8 + Tailwind CSS v4 + TypeScript.
- **Icon Library**: `lucide-react` only. (Do NOT use arbitrary SVG/emoji sets).
- **Animation**: `motion` (formerly framer-motion) for purposeful, lightweight transitions (150ms–250ms).
- **Component Primitives**: Always reuse components from `src/components/ui/` (`Button`, `Input`, `Card`, `Badge`, `Dialog`, `Tabs`, `Table`, `Alert`, `Skeleton`, `DropdownMenu`, etc.) using the `cn()` utility (`src/lib/utils.ts`).

---

## 2. Design System Tokens

- **Page Background**: `#F5F8FC`
- **Surface / Cards**: `#FFFFFF`
- **Primary Text**: `#172033` (Charcoal)
- **Secondary Text**: `#526176` (Slate)
- **Border**: `#E2E8F0`
- **Primary Button**: `#172033` with white text (`bg-[#172033] hover:bg-[#23304a] text-white`)
- **Accent Blue**: `#0284C7` (`text-[#0284C7]` / `bg-[#0284C7]`)
- **Pale Blue Panel**: `#EFF8FF` (`bg-sky-50`)
- **Semantic Risk / Status**:
  - Success / On Track: `emerald` (`#15803D`)
  - Warning / Moderate: `amber` (`#92400E`)
  - Destructive / Critical: `red` (`#B91C1C`)

---

## 3. Human-Designed UI Rules (Avoid AI Clichés)

- **DO NOT** use neon purple/cyan gradients or generic dark AI glow effects.
- **DO NOT** create giant pill buttons or oversized 40px rounded cards.
- **DO NOT** leave excessive empty whitespace or use giant decorative cards with mock numbers.
- **DO NOT** apply opacity/blur to parent containers of modals (modals must have a solid `#FFFFFF` card above a separate fixed backdrop).
- **ALWAYS** keep information density realistic, alignment strictly left-aligned, and typography clear.
- **ALWAYS** handle all UI states: `loading` (Skeleton), `empty` (descriptive message + action), `error`, and `active`.

---

## 4. Component Reuse Checklist

Before creating any new UI component:
1. Check `src/components/ui/` for existing primitives (`Button`, `Input`, `Card`, `Tabs`, `Table`, `Dialog`).
2. Compose existing primitives with Tailwind classes and `cn()`.
3. Never create duplicate button/card files (e.g. `PrimaryButton.tsx`, `CustomCard.tsx`).
