# Dashboard Page Overrides

> **PROJECT:** Mandiri EDC Monitoring
> **Updated:** 2026-11-22
> **Page type:** Map-first monitoring dashboard (`/`)

> ⚠️ Rules in this file **override** `MASTER.md`. Only deviations are listed here.

---

## Layout

* **Pattern:** Full-viewport map with floating glass panels. No page scroll on desktop.
* **Zones:** Map (full bleed) · left floating sidebar (380px) · top-right instruction pill · bottom-right map controls · detail popover to the right of the sidebar (`left: 412px`, 340px wide).
* **Remove:** the old top header bar and the stat-card grid. Summary counts live in the sidebar header and the pinned footer.
* **Settings and demo data:** icon buttons in the sidebar header. Settings is the only route that scrolls the page (`/settings` keeps its own scroll container with a floating back pill).

## Sidebar content

* **Header:** `Mandiri EDC` title with `LIVE` pill. Branch name and branch code as the readout (`Bank Mandiri KCP Wisma Danantara Indonesia · 07000`).
* **Search:** placeholder `Search name, CIF, MID`.
* **Status chips (2×2):** `All`, `Needs visit`, `Watchlist`, `Healthy`, each with a mono count.
* **Product chips (one row):** `All products`, `EDC`, `Livin'`, `Both`.
* **Results:** count `N of M merchants` and a `N needs visit` pill. Each card is a button showing name, address, distance and MID in mono, volume in mono (compact IDR), and the status badge.
* **Empty state:** `No merchants match these filters.` Plain copy, no apology.
* **Footer:** `needs visit`, `watchlist`, `healthy` counts in mono.

## Map behaviour

* Zoom controls are custom (`zoomControl={false}`). Scroll zoom stays on.
* Recenter flies back to the branch anchor.
* Coordinate pill shows the map center to 5 decimals and updates on `moveend`.
* Selecting a marker or card flies to it with the sidebar offset, so the marker is never hidden under the panel.
* Pin adjustment: the instruction pill switches to adjust mode. Dragging a pin shows Save and Cancel.

## Component overrides

* Leaflet is still client-only (`next/dynamic`, `ssr: false`).
* Health pins use the Master marker spec (section 5).
* The detail popover keeps the existing behaviour: Detail and Visit history tabs, Navigate (Google Maps directions link), Log visit (modal).

## Recommendations

* Keyboard: sidebar list is a listbox. Arrow keys move between cards, Enter selects.
* Avoid freezing the UI during load. Show a spinner inside a glass panel.
