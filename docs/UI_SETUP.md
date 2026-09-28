# Complete Free & Local UI Design Workflow Guide

This document outlines the architecture, installation, configuration, and daily development workflow for the fully free and open-source UI design system used with **Antigravity** and **OpenCode**.

---

## 1. System Architecture

```
                  Local Workspace Rules & Tokens
                  (AGENTS.md, docs/DESIGN_SYSTEM.md)
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
       Antigravity                             OpenCode
   (.agents/rules, skills)               (.opencode/rules)
            │                                     │
            └──────────────────┬──────────────────┘
                               ▼
                    Local Component System
                     (src/components/ui/)
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
        shadcn/ui          Lucide React         Motion
     (Tailwind v4)       (Semantic Icons)    (Transitions)
                               │
                               ▼
                     React 19 + Vite 8 App
```

---

## 2. Installed Dependencies & License Audit

Every package used in this UI workflow is 100% free, open-source, and permissive:

| Package | Version | Purpose | License |
|---|---|---|---|
| `react` / `react-dom` | `^19.2.8` | Core UI library | MIT |
| `tailwindcss` | `^4.3.3` | Utility-first styling | MIT |
| `@tailwindcss/vite` | `^4.3.3` | Vite integration for Tailwind v4 | MIT |
| `lucide-react` | `^1.39.0` | Accessible, clean UI iconography | ISC / MIT |
| `clsx` | `^2.1.1` | Conditional class manipulation | MIT |
| `tailwind-merge` | `^3.5.0` | Conflict-free Tailwind class merging | MIT |
| `class-variance-authority` | `^0.7.1` | Component variant schema management | Apache-2.0 |
| `motion` | `^12.40.0` | Purposeful micro-animations & transitions | MIT |

---

## 3. Reusable UI Primitives Catalog

All components are located in `src/components/ui/` and exported via `src/components/ui/index.ts`:

- **Button**: `import { Button } from '@/components/ui/button'` (Supports `variant: default | secondary | outline | accent | ghost | destructive | link`, `size: sm | default | lg | icon`).
- **Input / Textarea**: `import { Input, Textarea } from '@/components/ui'` (Clean border, focus rings, accessible placeholder).
- **Card**: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui'` (Structured container with 20px padding and subtle borders).
- **Badge**: `import { Badge } from '@/components/ui'` (Supports `variant: default | secondary | success | warning | destructive | accent`).
- **Dialog**: `import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui'` (Two-layer accessible modal with dimmed backdrop and solid `#FFFFFF` card).
- **Tabs**: `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'` (Segmented navigation pills).
- **DropdownMenu**: `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui'`.
- **Table**: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui'`.
- **Alert**: `import { Alert, AlertTitle, AlertDescription } from '@/components/ui'`.
- **Skeleton**: `import { Skeleton } from '@/components/ui'` (Animated pulse loading states).
- **Avatar**: `import { Avatar } from '@/components/ui'`.

---

## 4. MCP & Agent Configuration

### A. Antigravity Configuration
- **Project Rules**: `.agents/rules/ui_design_system.md`
- **Interactive Skill**: `.agents/skills/design-system/SKILL.md`
- **MCP Config**: `.agents/mcp_config.json` (filesystem MCP server)

### B. OpenCode Configuration
- **Global Rules**: `AGENTS.md` (read automatically from project root)
- **Tool Rules**: `.opencode/rules/ui_design_system.md`

---

## 5. Local AI (Ollama) Setup & Recommendations

For local AI model execution on this Windows machine:

1. **Hardware Profile**:
   - **OS**: Windows 11 Home
   - **RAM**: 8 GB Total System RAM (~1 GB Free Physical Memory)
2. **Recommended Free Models for 8GB RAM**:
   - `qwen2.5-coder:1.5b` (Uses ~1.2 GB RAM, fast code generation)
   - `qwen2.5-coder:3b` (Uses ~2.2 GB RAM, balanced UI & logic generation)
   - `phi3.5:3.8b` (Uses ~2.5 GB RAM, strong structured reasoning)
3. **Installation Command** (if Ollama is not yet installed):
   ```powershell
   winget install Ollama.Ollama
   # Download recommended lightweight coder model:
   ollama pull qwen2.5-coder:3b
   ```

---

## 6. How to Add New Components

To create a new component:
1. Define the component in `src/components/ui/<component-name>.tsx`.
2. Use the `cn()` utility from `src/lib/utils` for class composition.
3. Export it in `src/components/ui/index.ts`.
4. Document the variant props in `docs/DESIGN_SYSTEM.md`.

---

## 7. How to Safely Remove Any Component or Tool

- To remove a UI component: delete the file from `src/components/ui/` and remove its line from `src/components/ui/index.ts`.
- To uninstall an npm package: `npm uninstall <package-name>`.

---

## 8. Troubleshooting

- **Tailwind v4 class not applying**: Verify `@import "tailwindcss";` is present at the top of `src/index.css`.
- **Modal background transparent**: Ensure the dialog uses `bg-white` and sits above a separate `fixed inset-0 bg-slate-900/60` backdrop.
- **Port Conflict**: Vite automatically selects the next free port (`5173` -> `5174`). Check terminal logs for the active URL.
