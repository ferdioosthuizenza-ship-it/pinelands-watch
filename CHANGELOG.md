# Changelog

One short entry per working session, newest first.

## 2026-10-29 — Session 1: project skeleton (milestone 1, not yet published)

- Created the Expo SDK 58 + TypeScript + Expo Router project.
- Built the "Hello Pinelands" test screen with a large tap-to-test button and
  version/update info, using the design rules (18pt+ text, 64pt buttons, calm colours).
- Added the shared theme and `BigButton` component.
- Configured `app.json` and `eas.json` for EAS Update so test versions can open in Expo Go.
- Added README, `.env.example`, ESLint, and this changelog.
- Verified: TypeScript, lint and a full iOS bundle export all pass.
- **Not done:** publishing to Expo. The cloud environment blocks `expo.dev`, has no
  `EXPO_TOKEN`, and no GitHub repository was attached. See README for the setup steps.
