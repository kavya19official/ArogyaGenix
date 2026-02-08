# ArogyaGenix

Human‑centric generative AI health platform that turns complex medical data and silent medication non‑adherence signals into early, explainable, and actionable health insights for patients and doctors.

## Overview
- Translates non‑adherence and vitals into a Predictive Risk Score (LOW / MODERATE / HIGH) with time‑to‑impact guidance
- Generates plain‑language, multilingual explanations (English / Hindi / Hinglish) for medicines and risk context
- Guides safe next steps through Smart Interventions: teleconsult booking, caregiver alerts, home monitoring plans
- Supports both Patient view (risk meter, vitals, symptoms, interventions) and Doctor view (risk‑sorted list)

## Live Demo (Local)
- Requirements: Any static server (Python 3 recommended)
- Start:
  - macOS/Linux: `python3 -m http.server 8000`
  - Windows: `py -m http.server 8000`
- Open: http://localhost:8000/ in your browser (Safari/Chrome/Edge)

## Quick Start
1. Patient tab
   - Record a signal: Unused Medication QR, Smart Bottle Inactivity, or Manual Stop
   - Watch the Risk Meter update with a status badge and time‑to‑impact
   - Use Explain‑My‑Medicine for brand/generic names (e.g., Dolo 650 → paracetamol) with confidence badge
   - Add vitals and symptoms to refine risk (BP, glucose, peak flow; dizziness, headache, wheeze, thirst, fatigue)
   - Launch Smart Interventions: book teleconsult, notify caregiver, start home monitoring plan, download summary
2. Doctor tab
   - Load synthetic patients, filter by condition, and review suggested interventions
3. Demo tab
   - Step through Maria’s scenario to see early warnings and avoided harm
4. Community tab
   - Aggregate anonymized risk distribution across conditions

## Design System
- Palette: Deep teal #0F766E (primary), Soft blue #2563EB (action), Health green #22C55E (success), Amber #F59E0B (warning), Red #EF4444 (critical)
- Background: Subtle vertical gradient #F8FAFC → #F1F5F9 → #ECFEFF; cards in #FFFFFF / #FAFAFA with 12–16px radius and soft shadows
- Typography: Inter/SF Pro, titles 26px semibold, headers 18px, labels 12–13px
- Icons: Minimal outline icons for scannability
- Meaning‑based color coding: green = safe, amber = warning, red = critical, blue = action

## Architecture
- Silent signal ingestion → Temporal risk engine → Explainability → Smart interventions
- Deterministic risk evaluation tuned by recent vitals/symptoms
- Brand↔generic and synonym handling for common medicines (e.g., paracetamol/Dolo/Crocin/Calpol, ibuprofen/Brufen)
- UI is a static HTML/CSS/JS app; all data is synthetic or stored locally (profile) for demo purposes

## Privacy & Ethical Use
- No PHI is transmitted; synthetic patient data used for demos
- Patient profile is stored locally in the browser (localStorage)
- Predictive Risk Score offers guidance, not a diagnosis; consult a clinician for decisions

## Roadmap
- Secure authentication and role‑based access
- Scheduling and messaging integrations (teleconsult APIs, caregiver channels)
- Expanded medicine ontology and clinical guidance
- Localization, accessibility enhancements, and test coverage

## Repository Layout
- `index.html` — application shell and sections (Patient, Doctor, Demo, Community)
- `styles.css` — design system, gradients, cards, risk meter, icons
- `app.js` — risk engine, explanations, interventions, synthetic data, patient profile
- `README.md` — this document

## Development Notes
- Uses vanilla HTML/CSS/JS to maximize portability and demo speed
- Run via any static server; no build step required
- Contributions: keep UI accessible, color contrast high, and language clear; avoid introducing secrets
