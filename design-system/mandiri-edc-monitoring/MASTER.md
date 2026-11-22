# Design System Master File

> **LOGIC:** When building a specific page, check `design-system/mandiri-edc-monitoring/pages/[page-name].md` first.
> If that file exists, its rules **override** this Master file. Otherwise follow the rules below.

---

**Project:** Mandiri EDC Monitoring
**Updated:** 2026-11-22 (revamp to map-first glassmorphic style, after the BFTM Radar reference)
**Category:** Map-first spatial monitoring tool (field prospecting style)
**Token files:** `tokens.json` (W3C Design Tokens JSON) and `tokens.css` (`:root` custom properties). Edit `tokens.json` first, then mirror into `tokens.css`.
**Implementation:** `src/app/globals.css` (component classes) and `tailwind.config.ts` (Tailwind aliases that point to these tokens).

---

## 1. Design Direction

* **Archetype:** A full-viewport map with floating glass panels. No rigid split-screen layout.
* **Core principle:** The map fills `100vw × 100vh`. Search, filters, merchant results, and merchant detail float on translucent panels with hairline borders.
* **Map provider:** OpenStreetMap tiles through Leaflet. The map is desaturated with CSS filters so the markers stand out. Leaflet's default zoom control is disabled (`zoomControl={false}`), and custom floating controls replace it.
* **Dials:** Variance 3/10 (disciplined, one memorable element: the glass panel over the map) | Motion 2/10 (subtle, 150ms transitions) | Density 6/10 (dense enough for field use, with room to breathe in cards).

---

## 2. Design Tokens

### 2.1 Color

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-canvas` | `#F4F6F9` | App background, map fallback |
| `--surface-glass` | `rgba(255,255,255,0.92)` | Floating panels, detail popover, control pills |
| `--surface-subtle` | `#F8FAFC` | Secondary button fill, footer summary, stat wells |
| `--surface-hover` | `#F1F5F9` | Hover on cards, inputs, secondary buttons |
| `--border-hairline` | `rgba(15,23,42,0.08)` | Outer borders for panels and icon controls |
| `--border-control` | `#E2E8F0` | Inputs, dropdowns, inactive chips |
| `--text-primary` | `#0F172A` | Headings, primary button, active chip |
| `--text-secondary` | `#475569` | Subtitles, metadata, inactive chip labels |
| `--text-muted` | `#94A3B8` | Placeholders, micro labels |
| `--accent-cobalt` | `#2563EB` | Focus ring, active selection outline, live dot |
| `--accent-sky` | `#38BDF8` | Branch marker core |
| `--status-red` | `#DC2626` | RED health: needs visit |
| `--status-amber` | `#D97706` | YELLOW health: watchlist |
| `--status-emerald` | `#10B981` | GREEN health: healthy, confirmations |
| `--status-teal` | `#0D9488` | Spare category color |

Contrast: `--text-muted` on white is below 4.5:1. Use it only for placeholders and decorative micro labels, never for information that must be read. Use `--text-secondary` for real metadata.

### 2.2 Typography

* **UI sans:** Inter (`400 / 500 / 600`).
* **Mono / tabular:** JetBrains Mono (`500 / 600`) with `font-variant-numeric: tabular-nums`. Use it only for coordinates, distances, counts, IDR amounts, and MIDs.
* **Google Fonts import:** `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap`

| Role | Font | Size | Weight | Tracking / Line height |
|------|------|------|--------|------------------------|
| App title | Inter | 16px | 600 | -0.01em / 1.2 |
| Section header | Inter | 13px | 600 | 0 / 1.3 |
| Micro label | Inter | 11px | 500 | +0.05em / uppercase |
| Body / control | Inter | 13px | 500 | 0 / 1.4 |
| Caption / address | Inter | 11.5px | 400 | 0 / 1.4 |
| Numeric badge / coordinates | JetBrains Mono | 11–12px | 500–600 | 0 / 1.2 |

### 2.3 Elevation, blur, radii

* **Glass:** `backdrop-filter: blur(20px)` with `-webkit-` prefix.
* **Panel shadow:** `0 12px 36px -4px rgba(15,23,42,0.09), 0 2px 6px rgba(15,23,42,0.04)`
* **Control shadow:** `0 4px 12px rgba(15,23,42,0.05)`
* **Radii (strict):** panels and popovers `16px` · list cards `12px` · buttons, inputs, chips, coordinate pill `10px` · status pills `9999px`.

### 2.4 Spacing

Use an 4px base. Panel padding `16px`. Card padding `12px`. Gaps between controls `6px` (icon stacks) or `8px` (sections).

---

## 3. Component Primitives (strict)

Every interactive control must use one of these classes from `src/app/globals.css`. Do not hand-roll button styles.

| Class | Usage | Key specs |
|-------|-------|-----------|
| `.btn-primary` | Primary actions (Navigate, Save pin) | 40px high, `#0F172A` fill (hover `#1E293B`), white 13px / 500, inset top highlight |
| `.btn-secondary` | Secondary actions (Log visit, Cancel) | 40px high, `#F8FAFC` fill, `1px #E2E8F0` border (hover `#F1F5F9`, border `#CBD5E1`) |
| `.btn-icon` | Icon controls (export, settings, zoom, recenter) | 40×40px, 10px radius, glass fill, 17px icon `#334155` |
| `.btn-danger` | Destructive confirm | `#DC2626` fill, white text |
| `.chip` | Filter chips and segmented controls | 34px high, 10px radius, 12px / 500. Active (`aria-pressed="true"`): `#0F172A` fill, white text, count badge `rgba(255,255,255,0.15)` |
| `.field` | Inputs, selects, textareas | 38px high, 10px radius, `#E2E8F0` border, focus border cobalt + 3px cobalt ring |
| `.glass-panel` | Every floating surface | glass fill, blur 20px, 16px radius, hairline border, panel shadow |
| `.pill` | Status pills, live badge, instruction pill | 9999px radius |

Focus: every interactive element shows `outline: 2px solid #2563EB; outline-offset: 2px` on `:focus-visible`.

---

## 4. Layout Zones

1. **Map canvas (`z-index: 0`):** `100vw × 100vh`, fills the viewport.
2. **Floating sidebar (`z-index: 20`):** `top 16px · left 16px · bottom 16px · width 380px`. It contains, top to bottom:
   * A. Header: app title, `LIVE` pill, branch readout, `.btn-icon` for demo data and settings.
   * B. Search `.field` (38px) and a 2×2 grid of status `.chip`s with counts, followed by a row of product chips.
   * C. Results: section header with entity count and a priority pill, then a scrollable list of prospect cards (12px radius).
   * D. Pinned footer: `needs visit`, `watchlist`, and `healthy` counts in mono.
3. **Instruction pill (`z-index: 10`):** `top 16px · right 16px · height 38px · pill`. Pulsing cobalt dot plus a short instruction. While adjusting a pin it switches to the adjust instruction with Save and Cancel.
4. **Map controls (`z-index: 10`):** bottom-right stack of three `.btn-icon`s (Recenter, Zoom in, Zoom out) with a 34px mono coordinate pill below them. The pill shows the map center.
5. **Detail popover (`z-index: 20`):** `left 412px · bottom 16px · width 340px` on desktop. It opens when a marker or a list card is selected. It holds the merchant detail, Detail / Visit history tabs, Navigate, and Log visit.
6. **Mobile (<768px):** the sidebar becomes a bottom sheet (`bottom 8px`, max height 40dvh). The popover becomes a top sheet. Map controls rise above the sheet.

---

## 5. Map Markers

* **Health markers:** 26px white circle, 2.5px border in the health color (`RED #DC2626`, `YELLOW #D97706`, `GREEN #10B981`), a small center dot in `#0F172A`. Selected: `#0F172A` fill with a white center dot.
* **RED pulse:** a soft ring pulse on RED markers only, and only when selected or flagged for adjustment. It is disabled under `prefers-reduced-motion`.
* **Branch anchor:** 22px `#0F172A` circle with a 2.5px white border, `#38BDF8` core, and a soft cobalt halo.
* **Hover label:** a Leaflet tooltip with the merchant name. Glass background, 10px radius.

---

## 6. Motion

* Transitions: 150ms `cubic-bezier(0.16, 1, 0.3, 1)` on color, border, and background.
* Map fly-to on select: 500ms, offset so the marker sits to the right of the sidebar.
* No scroll-triggered reveals. The app is a tool, so motion only answers user actions.
* Reduced motion: disable pulses and reduce transitions to `0.01ms`.

---

## 7. Accessibility and Quality Floor

* Text contrast at least 4.5:1 for information. `--text-muted` is decorative only.
* Visible focus on every control. Keyboard support for list, chips, and map controls.
* All icons are Lucide SVGs. No emoji as icons.
* `cursor: pointer` on every clickable element.
* Tested widths: 375px, 768px, 1024px, 1440px. No horizontal page scroll.
* Nothing essential sits behind the sidebar or the popover without a way to reach it.

---

## 8. Anti-Patterns

* ❌ Split-screen sidebars that lock the map into a box.
* ❌ Dark theme. The revamp is light glass on the desaturated map.
* ❌ Hand-rolled button or input classes that drift from the primitives.
* ❌ Emoji icons, layout-shifting hovers (scale transforms), or invisible focus.
* ❌ Google Maps controls or paid map providers without an explicit request.
