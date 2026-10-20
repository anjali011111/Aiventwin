# AEVITWIN — React frontend (synthetic demo data)

Run:  npm install && npm run dev      Build: npm run build

All patients, vitals and predictions are synthetic. Prototype decision support — not a medical device.
Demo sign-in is local only (no real auth); real roles must come from the backend.

## Movable / interactive pieces
- Hero (/): parallax twin, rotating rings, 4 cards you can fling (momentum + bounce), illustrative live ECG
- Dashboards (/patient/dashboard, /doctor/dashboard): drag the grip to reorder widgets; arrow keys also work; layout is remembered
- Digital Twin (/patient|doctor/digital-twin): free-floating panels, clickable organs, observation log + replay, what-if fork
- Family history: draggable tree with live curved links; click a risk to highlight carriers
- Ctrl/⌘ + K: command palette to jump anywhere
