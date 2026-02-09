# ArogyaGenix

## Overview
Human-centric generative AI health platform that turns complex medical data and silent medication non-adherence signals into early, explainable, and actionable health insights for patients and doctors.

## Current State
- Fully functional static HTML/CSS/JS application
- No build step required
- Served via a simple Node.js static file server on port 5000

## Project Architecture
- `index.html` — Application shell with tabs: Patient, Doctor, Demo, Community
- `styles.css` — Design system (teal/blue palette, cards, risk meter, responsive)
- `app.js` — Main logic: risk engine, explanations, interventions, vitals, profile, synthetic data
- `app2.js` — Older/alternate version of app logic (not used in production)
- `server.js` — Simple Node.js static file server bound to 0.0.0.0:5000

## Key Features
- Predictive Risk Score (LOW/MODERATE/HIGH) with time-to-impact
- Multilingual explanations (English/Hindi/Hinglish)
- Smart Interventions: teleconsult, caregiver alerts, home monitoring
- Patient and Doctor views
- Synthetic data demo with 10,000 patients

## Tech Stack
- Vanilla HTML/CSS/JS (no frameworks, no build tools)
- Node.js for static file serving
- All data is synthetic or stored in browser localStorage

## Recent Changes
- 2026-02-08: Added a login screen with role selection (Doctor/Patient).
- 2026-02-08: Integrated Chart.js to show weekly vitals trends.
- 2026-02-08: Fixed CSS filename mismatch and organized codebase.
