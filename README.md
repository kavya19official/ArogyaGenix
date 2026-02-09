# ArogyaGenix — From Missed Pills to Meaningful Prevention

Human‑centric generative AI health platform that turns complex medical data and silent medication non‑adherence signals into early, explainable, and actionable health insights for patients and doctors.
  
Predictive and educational — not a diagnosis.

## Overview
- Translates non‑adherence and vitals into a Predictive Risk Score (LOW / MODERATE / HIGH) with time‑to‑impact guidance
- Generates plain‑language, multilingual explanations (English / Hindi / Hinglish) for medicines and risk context
- Guides safe next steps through Smart Interventions: teleconsult booking, caregiver alerts, home monitoring plans
- Supports both Patient view (risk meter, vitals, symptoms, interventions) and Doctor view (risk‑sorted list)

## Prevention Story (60 seconds)
1. Medication disposal → early warning recorded  
2. Pattern matches → based on similar patients  
3. Predicted timeline → next 3–5 days  
4. ArogyaGenix explanation → plain, elder‑friendly language (English/Hindi/Hinglish)  
5. Doctor alert → timely care coordination  
6. Avoided ER visit → prevention achieved, stress avoided, costs reduced  

## Risk Meter (Meaning)
- LOW: keep routine monitoring and adherence
- MODERATE: resume medicine, monitor vitals, consider teleconsult
- HIGH: escalate care promptly; follow safety tips
- Not a diagnosis — use for early guidance

## ArogyaGenix Explanation (Centerpiece)
- Communicates consequences calmly and clearly without fear
- Example: “When BP medicine is missed, blood pressure can rise over the next 3–5 days. Please resume medicine as advised, check vitals, and contact your doctor if symptoms worsen.”
- Language toggle: English / Hindi / Hinglish

## Impact: Avoided ER Visit
- Prevention achieved: early action guided
- Stress avoided: scenario explained in simple language
- Estimated cost saved: ₹20k+ (illustrative, depends on context)

## Clinician View Snapshot
- Risk‑sorted list highlights Maria (MODERATE) and contributing signals (disposal, inactivity, manual stop)
- Suggested actions: schedule teleconsult, share care plan
- Plain‑language explanation to support shared decision‑making

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
- Human‑centric language and safety‑first defaults across the experience

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

## Closing Line
Every unused pill carries a warning. We built the system that finally listens.
