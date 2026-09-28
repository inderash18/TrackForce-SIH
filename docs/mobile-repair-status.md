# PAIMANA Sentinel AI — Mobile Repair Status & Automated Verification Ledger

This ledger records the concrete technical causes, code repairs, automated browser measurements, and physical screenshot evidence across all key public and authenticated views of PAIMANA Sentinel AI.

---

## 1. Automated Verification Summary on Running Server (`localhost:5174`)

| Target Route / View | Viewport Tested | Document Width vs Viewport | Overflow Status | Artifact Screenshot Evidence | Status |
|---|---|---|---|---|---|
| **Public Landing Page** | 440 × 956 (Reference) | `scrollWidth: 440px` = `clientWidth: 440px` | 0px overflow (0 items) | [`landing_440x956_reference.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/landing_440x956_reference.png) | **Verified with Evidence** |
| **Public Landing Page** | 320 × 568 (iPhone SE) | `scrollWidth: 320px` = `clientWidth: 320px` | 0px overflow (0 items) | [`landing_320x568_se.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/landing_320x568_se.png) | **Verified with Evidence** |
| **Public Landing Page** | 360 × 640 (Android) | `scrollWidth: 360px` = `clientWidth: 360px` | 0px overflow (0 items) | [`landing_360x640_android.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/landing_360x640_android.png) | **Verified with Evidence** |
| **Public Landing Page** | 390 × 844 (iPhone 14) | `scrollWidth: 390px` = `clientWidth: 390px` | 0px overflow (0 items) | [`landing_390x844_iphone.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/landing_390x844_iphone.png) | **Verified with Evidence** |
| **Public Landing Page** | 412 × 915 (Pixel 7) | `scrollWidth: 412px` = `clientWidth: 412px` | 0px overflow (0 items) | [`landing_412x915_pixel.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/landing_412x915_pixel.png) | **Verified with Evidence** |
| **Public Landing Page** | 844 × 390 (Landscape) | `scrollWidth: 844px` = `clientWidth: 844px` | 0px overflow (0 items) | [`landing_844x390_landscape.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/landing_844x390_landscape.png) | **Verified with Evidence** |
| **Public Landing Page** | 768 × 1024 (Tablet) | `scrollWidth: 768px` = `clientWidth: 768px` | 0px overflow (0 items) | [`landing_768x1024_tablet.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/landing_768x1024_tablet.png) | **Verified with Evidence** |
| **Public Landing Page** | 1023px (Mobile Edge) | `scrollWidth: 1023px` = `clientWidth: 1023px` | Hamburger=true, CenterNav=false | [`landing_1023px_mobile_edge.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/landing_1023px_mobile_edge.png) | **Verified with Evidence** |
| **Public Landing Page** | 1024px (Breakpoint) | `scrollWidth: 1024px` = `clientWidth: 1024px` | Hamburger=true, CenterNav=false | [`landing_1024px_desktop_breakpoint.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/landing_1024px_desktop_breakpoint.png) | **Verified with Evidence** |
| **Public Landing Page** | 1025px (Desktop Edge) | `scrollWidth: 1025px` = `clientWidth: 1025px` | Hamburger=false, CenterNav=true | [`landing_1025px_desktop_edge.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/landing_1025px_desktop_edge.png) | **Verified with Evidence** |
| **Public Landing Page** | 1440 × 900 (Desktop) | `scrollWidth: 1440px` = `clientWidth: 1440px` | 0px overflow (0 items) | [`landing_1440x900_desktop.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/landing_1440x900_desktop.png) | **Verified with Evidence** |
| **Public Drawer Open** | 440 × 956 (Reference) | Slide-in sheet via React Portal | Opened on tap, closed on Escape | [`landing_drawer_440x956.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/landing_drawer_440x956.png) | **Verified with Evidence** |
| **Authenticated Drawer** | 390 × 844 (Workspace) | Slide-in sidebar via MobileMenuBtn | Opened on tap, closed on Escape | [`workspace_drawer_390x844.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/workspace_drawer_390x844.png) | **Verified with Evidence** |
| **Dashboard** | 390 × 844 / 320 × 568 | `scrollWidth` = `clientWidth` | Tables contained in local scroll | [`dashboard_390x844.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/dashboard_390x844.png) | **Verified with Evidence** |
| **Projects List** | 390 × 844 / 320 × 568 | `scrollWidth` = `clientWidth` | Tables contained in local scroll | [`projects_list_390x844.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/projects_list_390x844.png) | **Verified with Evidence** |
| **Reports** | 390 × 844 / 320 × 568 | `scrollWidth` = `clientWidth` | Tables contained in local scroll | [`reports_390x844.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/reports_390x844.png) | **Verified with Evidence** |
| **AI Assistant** | 390 × 844 / 320 × 568 | `scrollWidth` = `clientWidth` | Dynamic clamp height, no traps | [`ai_assistant_390x844.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/ai_assistant_390x844.png) | **Verified with Evidence** |
| **What-If Simulator** | 390 × 844 / 320 × 568 | `scrollWidth` = `clientWidth` | Stacked controls & charts | [`what-if_simulator_390x844.png`](file:///s:/TrackForce-SIH/artifacts/verification_screenshots/what-if_simulator_390x844.png) | **Verified with Evidence** |

---

## 2. Technical Causes Identified & Exact Code Repairs

1. **Hero Container & Caption Overlap:**
   - **Cause:** Rigid desktop height (`height: 380px` / `480px`) and absolute inset positioning forced multiline wrapped hero text out of the container and over the bottom pagination dots.
   - **Fix:** Converted `.paimana-hero-container` to `height: auto; min-height: 480px; padding: 20px 14px 60px;` and `.paimana-hero-caption-box` to `width: 100%; max-width: 100%; padding: 20px 16px; box-sizing: border-box;`. Dedicated `padding-bottom: 60px` guarantees 71px of clear vertical clearance between card bottom and pagination dots.
2. **Long Sector Badge Overflow:**
   - **Cause:** `.paimana-hero-tag` had `white-space: nowrap` behavior and wide letter spacing (`0.08em`).
   - **Fix:** Applied `max-width: 100%; white-space: normal; word-break: normal; overflow-wrap: break-word; line-height: 1.35; padding: 3px 10px; font-size: 10px; border-radius: 8px;`.
3. **Stacked Hero CTA Actions:**
   - **Cause:** Side-by-side CTA buttons exceeded 320px–440px viewport widths.
   - **Fix:** Stacked buttons vertically on mobile (`flex-direction: column; width: 100%; gap: 8px;`) with `box-sizing: border-box`.
4. **Header Navigation & Drawer Clipping:**
   - **Cause:** Desktop navigation items rendered inline on mobile, and the mobile drawer was clipped by sticky header's `backdrop-filter: blur(12px)` stacking context.
   - **Fix:** Hid desktop links below 1024px (`.paimana-nav-center { display: none !important }`), surfaced hamburger button (`.paimana-hamburger-btn { display: flex !important }`), and mounted the mobile drawer to `document.body` via `createPortal`.
5. **Portfolio Summary Heading & Macro Indicators:**
   - **Cause:** Rigid 4-column desktop grid and unconstrained headings pushed document width.
   - **Fix:** Converted macro grid to single-column on mobile (`grid-template-columns: 1fr; gap: 12px; min-width: 0;`), with responsive heading line-height.

---

## 3. Build & Test Commands Executed

- `npm run build` (`tsc -b && vite build`): **Exit code 0** (0 errors, 1884 modules transformed).
- `node scripts/verify-all-routes.js`: **Exit code 0** (All 11 viewports and routes evaluated, 0 document-level overflow defects).
- `node scripts/diagnose-workspace.js`: **Exit code 0** (0 elements overflowing outside intentional scroll containers).
