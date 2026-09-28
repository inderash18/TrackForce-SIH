# OpenCode UI Design System Guidelines

When building or updating UI in this workspace:

1. **Stack**: React 19, Tailwind CSS v4, Lucide React, Motion.
2. **Tokens**: `#F5F8FC` (page bg), `#FFFFFF` (card/surface), `#172033` (primary text), `#526176` (secondary text), `#E2E8F0` (border), `#0284C7` (accent).
3. **Components**: Always import existing primitives from `src/components/ui/` (`Button`, `Input`, `Card`, `Badge`, `Dialog`, `Tabs`, `Table`, `Alert`, `Skeleton`).
4. **Style Guidelines**:
   - Clean, professional information density.
   - Restrained shadows and corners (8px–14px radius).
   - No generic AI neon gradients or giant floating pill buttons.
   - All modals must have an opaque `#FFFFFF` surface above a separate dark backdrop.
