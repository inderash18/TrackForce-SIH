---
name: design-system
description: Design system guidelines, token catalog, and UI component creation procedures for React and Tailwind CSS.
---

# Design System & UI Engineering Skill

This skill provides step-by-step instructions for building high-quality, professional frontend interfaces using the project's free and open-source UI foundation.

## Step 1: Discover Existing Components
Always check `src/components/ui/` for available primitives:
- `Button` (`src/components/ui/button.tsx`)
- `Input` (`src/components/ui/input.tsx`)
- `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter` (`src/components/ui/card.tsx`)
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogFooter` (`src/components/ui/dialog.tsx`)
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` (`src/components/ui/tabs.tsx`)
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` (`src/components/ui/table.tsx`)
- `Badge` (`src/components/ui/badge.tsx`)
- `Skeleton` (`src/components/ui/skeleton.tsx`)
- `Alert` (`src/components/ui/alert.tsx`)

## Step 2: Assemble View Architecture
Follow this layout hierarchy:
1. **Page Header**: Single left-aligned `<h1>` with subtitle and right-aligned action group.
2. **Key Metric Cards**: Compact 3-to-4 column grid with labeled values and status indicators.
3. **Data Grid or List**: Search bar + filters + table with clean cell alignment and view action.
4. **Modals & Drawers**: Two-layer structure with fixed dimmed backdrop and solid `#FFFFFF` card.

## Step 3: Verify Token Consistency
Ensure styling uses:
- Background: `#F5F8FC`
- Surface: `#FFFFFF`
- Borders: `#E2E8F0`
- Text: `#172033` (primary) / `#526176` (secondary)
- Actions: `#172033` (primary) / `#0284C7` (accent)
