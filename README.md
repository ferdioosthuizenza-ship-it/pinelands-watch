# Pinelands Watch

A simple neighbourhood watch app for Pinelands, Cape Town, for iPhone and Android.
Patrollers see each other on a live map and can raise incidents. Residents get one
big emergency button. Full details are in [docs/BRIEF.md](docs/BRIEF.md).

**Current status: Version 0.1, milestone 1 ("Hello Pinelands").** The app is a
single test screen that proves the publish-to-phone path works. No location,
map or alerts yet.

---

## What's in each folder

| Folder / file | What it is |
|---|---|
| `src/app/` | Screens. Every file here is a screen (Expo Router). `_layout.tsx` is the navigation shell. |
| `src/components/` | Reusable building blocks, e.g. `BigButton` (the 64pt full-width button every main action uses). |
| `src/constants/theme.ts` | Colours and text sizes. Red is reserved for emergency/incident buttons only. |
| `assets/` | App icon and splash image. |
| `app.json` | App settings: name, icon, update settings. |
| `eas.json` | Settings for Expo's build/update service (EAS). |
| `.env.example` | Template for the public Supabase settings. Copy to `.env`; never commit `.env`. |
| `docs/BRIEF.md` | The original build brief. |
| `CHANGELOG.md` | One short entry per working session. |
| `AGENTS.md` | Notes for Claude Code about how Expo works in this project. |

---

## Running the app

### Option A: on your iPhone from the cloud (the normal route)

Each test version is published to Expo's servers with **EAS Update** and opened in
the free **Expo Go** app. One-off setup:

1. On the iPhone: install **Expo Go** from the App Store and sign in with your Expo account.
2. In the cloud environment settings (Claude Code on the web, environment menu, then *Edit*):
   - **Environment variable** `EXPO_TOKEN` = an access token from
     https://expo.dev/accounts/[your-account]/settings/access-tokens
   - **Environment variables** `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
     (needed from milestone 2 onwards; the anon key is safe to be public).
   - **Network access**: allow `expo.dev`, `*.expo.dev`, `*.expo.io`, `exp.host`,
     `*.exp.host`, `*.supabase.co`, and keep "Allow package managers" ticked.
3. Connect the GitHub repository to the session.

Publishing a test version (Claude Code runs this after each milestone):

```bash
npx eas-cli@latest update:configure      # first time only: links the project to your Expo account
npx eas-cli@latest update --branch preview --message "what changed"
```

The command prints a link to the update on expo.dev. Open that link on the iPhone
(or scan its QR code with the Camera app) and it opens in Expo Go. Anyone with Expo Go
can open the same link.

### Option B: on your Mac (fallback if the cloud can't reach Expo)

```bash
git clone <this repository> && cd pinelands-watch
npm install
npx expo start
```

Scan the QR code in the terminal with the iPhone Camera app. Phone and Mac must be
on the same Wi-Fi.

### Checks before publishing

```bash
npm run typecheck   # TypeScript
npm run lint        # code style
npx expo export --platform ios   # proves the app bundles
```

---

## Known limits of the Expo Go demo

- Everything works only while the app is open on screen.
- No push notifications and no background location. These need a proper build (v0.2).

## Secrets: the rules

- Only values starting with `EXPO_PUBLIC_` go in `.env`; they are bundled into the app and are public.
- The Supabase **service role** key and all **AI keys** live only in Supabase Edge Function
  secrets. They must never appear in this repository or in the app.

## Supabase (from milestone 2)

Free Supabase projects pause after about a week without activity. To wake one up:
open https://supabase.com/dashboard, choose the project, and press **Restore project**.
It takes a minute or two.

## Branches

- `dev`: where work happens. Every milestone is committed here.
- `main`: only versions Ferdi has tested and approved.
