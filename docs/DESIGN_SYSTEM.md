# PAIMANA Design System & UI Specification

A production-grade, human-designed UI design system for React, Vite, Tailwind CSS, and Lucide React.

---

## 1. Design Principles

1. **Human-Crafted, Not Generic AI**:
   - Avoid generic AI visual tropes: excessive gradients, neon-purple accents, floating blurred blobs, oversized pill buttons, and low-density empty cards.
   - Design for real-world enterprise/government density: strong structural hierarchy, subtle borders (`#E2E8F0`), legible typography, and clear action grouping.
2. **Semantic Tokens First**:
   - Never hardcode raw hex colors across components; use defined semantic CSS variables and Tailwind utility classes.
3. **8px Rhythm & Restrained Geometry**:
   - Control element heights: Buttons (32px / 36px / 40px), Inputs (36px).
   - Corner radii: 6px–8px for small controls/badges, 12px–16px for cards and panels, never giant 50px pill cards.
4. **Purposeful Micro-Interactions**:
   - Use `motion` for modal transitions, page reveals, tab switches, and notification toasts.
   - Durations: 150ms–250ms with ease-out curves. No slow or distracting bounce animations.

---

## 2. Semantic Color Palette

| Token | Value | Semantic Purpose |
|---|---|---|
| `Page Background` | `#F5F8FC` | Soft neutral workspace background |
| `Surface / Card` | `#FFFFFF` | Primary card and modal panel surface |
| `Border` | `#E2E8F0` | Structural borders, card outlines, table dividers |
| `Text Primary` | `#172033` | Primary headings, table data, high-contrast labels |
| `Text Secondary`| `#526176` | Subtitles, helper text, table headers, metadata |
| `Primary Action` | `#172033` | High-priority submit, action, and filter buttons |
| `Accent Blue` | `#0284C7` | Interactive focus rings, active links, primary tags |
| `Pale Blue Panel`| `#EFF8FF` | Callout panels, suggested steps, highlighted context |
| `Success` | `#15803D` (`#DCFCE7`) | Completed milestones, on-track indicators |
| `Warning` | `#92400E` (`#FEF3C7`) | Moderate risks, pending reviews, cost alerts |
| `Destructive` | `#B91C1C` (`#FEE2E2`) | Critical delay, severe risk, cancellation actions |

---

## 3. Typography & Spacing Hierarchy

- **Font Family**: Modern sans-serif stack (`Montserrat`, `Inter`, system-ui).
- **Hierarchy**:
  - Page Title: `24px–28px` (`text-2xl font-bold text-[#172033]`)
  - Section Title: `16px–18px` (`text-base / text-lg font-bold text-[#172033]`)
  - Card Title: `14px–15px` (`text-sm font-semibold text-[#172033]`)
  - Body Text: `13px–14px` (`text-xs / text-sm text-[#172033] leading-relaxed`)
  - Helper & Metadata: `11px–12px` (`text-[11px] / text-xs text-[#526176]`)
- **Spacing Scale (8px rhythm)**:
  - `p-2` (8px), `p-3` (12px), `p-4` (16px), `p-5` (20px), `p-6` (24px), `p-8` (32px).
  - Modal & Panel Internal Padding: `20px–24px` (`p-5` or `p-6`).

---

## 4. Reusable UI Components Catalog (`src/components/ui/`)

All components are located in `src/components/ui/`:

- **Button** (`button.tsx`): Variants: `default`, `secondary`, `outline`, `accent`, `ghost`, `destructive`, `link`. Sizes: `sm`, `default`, `lg`, `icon`.
- **Input** (`input.tsx`): Accessible 36px text input with focus ring and clear placeholder styling.
- **Textarea** (`textarea.tsx`): Flexible multiline notes input.
- **Card** (`card.tsx`): `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- **Badge** (`badge.tsx`): Variants: `default`, `secondary`, `outline`, `success`, `warning`, `destructive`, `accent`.
- **Dialog** (`dialog.tsx`): Two-layer accessible modal with dimmed backdrop (`bg-slate-900/60`), opaque white card, `Escape` key dismissal, and scroll lock.
- **Tabs** (`tabs.tsx`): `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` segmented navigation.
- **DropdownMenu** (`dropdown-menu.tsx`): Accessible menu with outside-click listener.
- **Table** (`table.tsx`): `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`.
- **Skeleton** (`skeleton.tsx`): Smooth pulse loader.
- **Alert** (`alert.tsx`): Variants: `default`, `info`, `success`, `warning`, `destructive`.
- **Avatar** (`avatar.tsx`): User avatar with image fallback.

---

## 5. Responsive & Accessibility Rules

1. **Touch Targets**: All interactive elements must have a minimum hit area of `36px–44px`.
2. **Keyboard Navigation**:
   - `Tab` / `Shift+Tab` across buttons, inputs, tabs, and links.
   - `Escape` dismisses modals and drawers.
   - `Enter` / `Space` activates triggers and buttons.
3. **Responsive Collapse**:
   - On desktop (`>= 1024px`): Multi-column grids (2–4 cols) with persistent sidebar.
   - On tablet/mobile (`< 1024px`): Single column flow, collapsible sidebar drawer, horizontally scrollable tables.
