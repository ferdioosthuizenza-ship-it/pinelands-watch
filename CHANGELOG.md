# Changelog

One short entry per working session, newest first.

## 2026-10-29 — Session 1: project skeleton and first publish (milestone 1)

- Created the Expo SDK 58 + TypeScript + Expo Router project.
- Built the "Hello Pinelands" test screen with a large tap-to-test button and
  version/update info, using the design rules (18pt+ text, 64pt buttons, calm colours).
- Added the shared theme and `BigButton` component.
- Configured `app.json` and `eas.json` for EAS Update so test versions can open in Expo Go.
- Added README, `.env.example`, ESLint, and this changelog.
- Verified: TypeScript, lint and a full iOS bundle export all pass.
- Later the same day, after Ferdi set up GitHub, the Expo account and network access:
  pushed `main` and `dev` to GitHub, linked the project to Expo (`@ferdi.oosthuizen/pinelands-watch`),
  and published the first update to the `preview` branch. Added the Expo Go QR code to `docs/`.
