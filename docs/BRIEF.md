# Pinelands Watch App — Build Brief for Claude Code

**Owner:** Ferdi Oosthuizen (solo project, personal — not Atlantis Foods)
**Working name:** Pinelands Watch (final name still open)
**Target of this brief:** Version 0.1 — a free demo that runs on Ferdi's iPhone through the **Expo Go** app, to show watch members and get feedback before paying any app-store fees.
**Brief date:** 29 October 2026

---

## 0. How to use this brief (instructions to Claude Code)

You are building this app from scratch in a cloud session. Ferdi is not a mobile developer and this is his first app, so:

1. **Work in small, visible steps.** Build the skeleton first, get it running on Ferdi's phone as early as possible, then add features one at a time.
2. **Explain things in plain English** when you report back. Avoid jargon; when you must use a technical term, say what it means in one line.
3. **Ask before** anything that costs money, creates accounts, or is hard to undo. Everything in version 0.1 should be free.
4. **Never put secret keys in the app code.** AI keys and Supabase service keys live only in Supabase Edge Function secrets or environment variables.
5. **Keep a `README.md`** that explains how to run the app, how to publish a test build, and what each folder does.
6. **Keep a `CHANGELOG.md`** with one short entry per working session.
7. **Commit to a `dev` branch.** `main` is reserved for versions Ferdi has tested and approved.
8. Section 11 explains how Ferdi will test on his iPhone. Get that path working **first**, before building features.

---

## 1. What the app is

A neighbourhood watch app for **Pinelands, Cape Town**, for both **iPhone and Android**.

- **Patrollers** (watch volunteers) see each other's cars live on a map while on patrol, can call each other with one tap, and can report incidents that instantly alert everyone on patrol.
- **Residents** of Pinelands can open the app and press an **emergency / report** button. Their location is captured, checked to be inside Pinelands, logged, and sent to the patrollers. Residents **never** see where patrollers are.
- **Watch admins** (Ferdi to start with) invite, approve and remove members.

Later: the Pinelands police get their own access, a proper walkie-talkie feature is added, and the app is rolled out to other neighbourhood watches.

### Why build it when other apps exist

South African apps already exist (AfriForum's watch app, Sector Patrol, The Watch, Namola). Ferdi's experience is that they are **clunky, slow and hard to get people onto**. His watch doesn't use one today.

**The differentiator is simplicity.** It must be obviously easier than anything else: open the app, press one big button, and you're on patrol. Many patrollers are older volunteers who are not IT-inclined, so every design decision must favour clarity over features.

---

## 2. Non-negotiable principles

1. **Simple beats clever.** Few screens, big buttons, large text, high contrast, plain words. If an older volunteer can't use a screen without help, it's wrong.
2. **Nothing ever sits between a person and help.** The emergency and incident buttons work instantly and never wait for AI, transcription, or any optional service. AI only adds detail *after* the alert has gone.
3. **Thieves must not see the patrollers.** Live patroller locations are visible only to approved patrollers (and later, police). This is enforced in the database (Row Level Security), not just hidden in the app.
4. **Privacy (POPIA).** Live location is personal information. Track only while a patroller has switched patrol mode on. Get clear consent at sign-up, show a short privacy notice, and keep as little location history as possible.
5. **Multi-watch from day one.** Every record belongs to a `watch`. Pinelands is the first watch; adding Rondebosch later should be configuration, not a rebuild.
6. **Free for the demo.** Expo Go + Supabase free tier + free maps. No paid services in v0.1.

---

## 3. Users and roles

| Role | Who | Can see live patroller map | Can report incidents | Can approve/remove members |
|---|---|---|---|---|
| **Patroller** | Vetted watch volunteers | Yes | Yes | No |
| **Resident** | People living in Pinelands | **No** | Yes (emergency button) | No |
| **Admin** | Watch committee (Ferdi) | Yes | Yes | Yes |
| **Police** *(later)* | Pinelands SAPS | Yes (later, likely via a web dashboard) | — | No |

A person can hold one role per watch. Admin is a patroller with extra rights.

---

## 4. Onboarding and security

The goal is **very easy joining** (scan a QR code and the app is already connected to the watch) **without** letting a potential criminal join and watch the patrollers.

### Patrollers (strict)
1. An admin opens **"Invite a patroller"** in the app and types the person's name and cell number.
2. The app shows a **personal, single-use QR code** that expires (default 24 hours).
3. The new patroller opens the app, taps **"I have an invite"**, and scans the QR from the admin's screen (use `expo-camera` to scan).
4. They confirm their name, cell number, and vehicle details (make, colour, registration — shown on the map).
5. They accept the privacy/consent notice.
6. Their account is **pending** until an admin taps **Approve**. Until then they see a friendly "Waiting for approval" screen and cannot read any locations.
7. An admin can **remove** a member at any time; removal takes effect immediately (their session can no longer read data, enforced by RLS).

**SMS verification** of the cell number is part of the plan but costs money (an SMS provider), so for v0.1: build the flow so an SMS step can be slotted in later, but don't require it in the demo.

### Residents (lighter)
Residents can't see the map, so the risk is lower. Suggested flow (Ferdi to confirm — see Open Decisions):
1. Scan a **watch-wide resident QR** (printable, can be put on a flyer), or a personal invite.
2. Enter name, cell number, and street address.
3. Accept the privacy notice.
4. Resident accounts are usable immediately for the emergency button; admins can review and remove them.

### Authentication for the demo
Use **Supabase Auth with anonymous sign-in** tied to the invite token, plus the profile details captured above, so no email links or SMS are needed in Expo Go. Persist the session on the phone so people stay logged in. Design it so phone-number login (SMS OTP) can replace this later.

---

## 5. Version 0.1 features (the demo)

### 5.1 Patrol mode (patrollers)
- One huge **Start patrol** button on the home screen. Pressing it starts sharing location; the button becomes **End patrol**.
- While on patrol, send position roughly every 10 seconds or 25 metres moved, whichever comes first (foreground only in Expo Go).
- Show a clear "You are on patrol — your car is visible to other patrollers" banner.

### 5.2 Live map (patrollers and admins only)
- Map of Pinelands showing every patroller currently on patrol as a car marker with their name and vehicle.
- Markers update live (Supabase Realtime).
- Markers that haven't updated for 2 minutes turn grey; after 10 minutes they disappear.
- Recent open incidents also show on the map as distinct markers.
- On iPhone the demo uses **Apple Maps** (via `react-native-maps`), which is fine and free.

### 5.3 Tap to call
- Tap a car marker → a card with the patroller's name, vehicle, and a big **Call** button that opens the phone dialler (`tel:` link).
- Walkie-talkie is **not** in v0.1.

### 5.4 Incident button (patrollers)
- Big red **Report incident** button.
- One tap sends the alert **immediately** with GPS location, time, and reporter.
- Then (optional, after sending) the reporter can add: a category (Suspicious person, Suspicious vehicle, Break-in, Fire, Medical, Other), a short note, or a **voice report** (see 5.7).
- A short "Sent by mistake? Cancel" option appears for 10 seconds after sending.
- Everyone on patrol sees an **in-app alert** (full-screen banner with sound/vibration while the app is open). Proper push notifications come later (see section 9).

### 5.5 Resident emergency button
- Residents' home screen is essentially **one big emergency button** plus clear buttons to call **10111** (SAPS) and **112** (from a cell phone).
- Pressing the emergency button immediately captures the resident's location and creates an alert to all patrollers on duty.
- The app checks the location is **inside the Pinelands boundary** (point-in-polygon against the watch's boundary). If outside, still log it but flag it "outside watch area" and tell the resident to call 10111/112 — never silently drop an emergency.
- Same optional follow-up details and voice report as 5.4.
- The resident sees a confirmation: "The watch has been alerted," and later "A patroller has acknowledged" when someone taps Acknowledge.

### 5.6 Incident handling (patrollers/admins)
- Incident list (newest first) with status: **Open → Acknowledged → Resolved**.
- Any patroller can tap **I'm responding** (acknowledge) and **Resolve** with a short note.
- Tap an incident to see it on the map and to call the reporter.

### 5.7 Voice features (to help older users)
Ferdi's insight: walkie-talkie voices are often unintelligible. So instead of relaying a person's crackly voice, **transcribe** what they said and have the receiving phone **read it aloud in a clear computer voice**, while keeping the original recording for playback and verification.

For v0.1:
- **Voice report:** hold a mic button, speak, release. Record with `expo-audio`, upload to Supabase Storage, and send to a Supabase **Edge Function** that calls a cheap AI model (e.g. Gemini Flash or Claude Haiku) to:
  1. transcribe the audio, and
  2. tidy it into a short structured report (what, where, description of person/vehicle, direction of travel).
- **Read aloud:** when a voice report arrives, the receiving phone reads the tidied text aloud using the phone's built-in text-to-speech (`expo-speech`).
- **Play original:** always show a "Play original recording" button beside the text.
- **Warning label:** transcription can mishear number plates and street names, so show "Transcribed automatically — check the original" on every transcribed message.
- **Fallback:** if transcription fails or is slow, the alert has already gone and the original recording is still playable. Nothing depends on AI working.
- The keyboard's own dictation microphone should work in every text field as a simple extra option.

Note: on-device speech recognition libraries (e.g. `expo-speech-recognition`) don't run inside Expo Go, which is why v0.1 uses record-and-transcribe via the Edge Function. Revisit when the app moves to a proper development build.

### 5.8 Admin screens
- Members list (pending / active / removed) with Approve and Remove buttons.
- Create patroller invite (QR) and show/print the resident QR.
- Edit the watch boundary (v0.1 can simply load a stored GeoJSON polygon; editing can come later).

### 5.9 Demo mode (important for showing people)
Ferdi will often demo the app alone. Add an admin-only **Demo mode** switch that creates 3–5 **simulated patrol cars** driving along Pinelands streets, plus the ability to trigger a sample incident and a sample resident emergency. Simulated data must be clearly tagged and easy to wipe, and must never mix with real data.

---

## 6. Screens (keep it to this)

**Patroller / Admin**
1. Home — Start/End patrol, Report incident, (Admin: Members)
2. Map — live cars + incidents
3. Incidents — list and detail
4. Members & invites (admin only)
5. Settings — profile, vehicle, privacy notice, sign out

**Resident**
1. Home — big Emergency button, call 10111, call 112
2. My reports — status of what they've reported
3. Settings — profile, address, privacy notice, sign out

**Onboarding**
- Welcome → "I have an invite" (scan QR) → details → consent → waiting for approval / done

### Design rules
- Minimum body text 18pt; buttons at least 64pt tall; main action buttons full width.
- Maximum two levels deep from Home. No hamburger menus.
- High-contrast colours; red is reserved for emergency/incident only.
- Every icon has a text label.
- Support the phone's large-text accessibility setting without breaking layouts.
- Pleasant and calm, not "security-company aggressive".

---

## 7. Technical stack

| Piece | Choice | Notes |
|---|---|---|
| App framework | **Expo (React Native) + TypeScript** | One codebase for iPhone and Android. Use the Expo SDK version supported by the current Expo Go app in the App Store. |
| Navigation | Expo Router | |
| Maps | `react-native-maps` | Apple Maps on iPhone in the demo. |
| Location | `expo-location` | Foreground only in v0.1. |
| QR scanning | `expo-camera` | |
| QR display | a QR rendering library (e.g. `react-native-qrcode-svg`) | |
| Audio record/playback | `expo-audio` | |
| Text-to-speech | `expo-speech` | |
| Backend | **Supabase (free tier)** | Postgres, Auth, Realtime, Storage, Edge Functions. |
| AI | Cheap cloud model via Supabase Edge Function | Key stored as an Edge Function secret only. |
| Code hosting | GitHub (`main` + `dev` branches) | |
| Test builds | Expo **EAS Update** | See section 11. |

Note: Supabase free projects pause after about a week of no activity; the README should explain how to wake one up.

---

## 8. Data model (starting point)

All tables include `watch_id` and timestamps. All access controlled with **Row Level Security**.

- **watches** — id, name, boundary (GeoJSON polygon), settings
- **members** — id, watch_id, user_id, role (patroller/resident/admin/police), status (pending/active/removed), full_name, cell_number, address (residents), consent_at
- **vehicles** — id, member_id, make, colour, registration
- **invites** — id, watch_id, type (patroller/resident), token, created_by, intended_name, intended_cell, expires_at, used_at, used_by
- **patrol_sessions** — id, member_id, started_at, ended_at
- **patrol_positions** — member_id (one row per patroller, upserted), lat, lng, heading, speed, updated_at, is_simulated
- **incidents** — id, watch_id, reported_by, reporter_role, lat, lng, inside_boundary, category, note, status, acknowledged_by, resolved_by, resolution_note, is_simulated, created_at
- **incident_media** — id, incident_id, audio_path, transcript_raw, transcript_clean, ai_model, created_at
- **audit_log** — who did what and when (approvals, removals, incident status changes)

### Key security rules (must be enforced by RLS and tested)
- Only **active patrollers/admins** of a watch can read `patrol_positions` and other patrollers' details for that watch.
- **Residents** can create incidents and read **only their own** incidents. They can never read positions.
- **Pending** or **removed** members can read nothing except their own profile.
- Only admins can approve/remove members and create patroller invites.
- Invite tokens are single-use and expire; redeeming is done by a database function, not by the app writing directly.

### Data retention (POPIA)
- Keep only each patroller's **latest** position; delete it when patrol ends (or after 10 minutes stale).
- Keep incidents and their locations (they're the watch's record).
- Write the retention rules into the privacy notice.

---

## 9. Known limits of the Expo Go demo (and that's fine)

- Everything works **while the app is open on screen**.
- If a patroller switches apps or locks their phone, their car stops updating and they won't see alerts until they reopen the app.
- No true push notifications in Expo Go.
- No on-device speech recognition library (handled by record-and-transcribe instead).

These are fixed when the app moves to a proper build (section 10). Show a gentle in-app note: "Keep the app open while on patrol."

---

## 10. Later versions (do NOT build in v0.1, but don't design them out)

**v0.2 — real app on phones (requires Apple $99/yr and Google $25 once-off)**
- EAS Build, TestFlight (iPhone) and Google Play internal testing as the test channel.
- Background location while on patrol (Apple and Google review this carefully — patrol-mode-only tracking and a clear explanation are required).
- Push notifications for incidents.
- SMS verification of cell numbers.
- One-QR onboarding: a single QR that installs/opens the app *and* applies the invite.
- On-device speech recognition.

**v0.3+**
- **Walkie-talkie / push-to-talk** (LiveKit or Agora; iPhone has a dedicated Push to Talk framework), with the transcribe-and-read-aloud approach plus original audio.
- **Police access** — likely a simple web dashboard for the station.
- **AI callback after a panic press** — an AI voice phones the person back to gather details (ideally cheap/free models). Never delays the alert itself.
- **Integration with a responder network** such as Aura (private armed response/medical), and investigating whether government emergency services offer something similar.
- **Other watches** (e.g. Rondebosch) — multi-suburb setup and tiers.
- **Monetisation** (still being decided): patrollers and residents' emergency use stay free; possible revenue from security companies/CIDs paying for alerts, paid admin features for watch committees, local sponsorship, multi-suburb tiers, optional resident extras (walk-me-home, street alerts, family accounts), or linking to the watch's existing resident subscription.

---

## 11. How Ferdi tests on his iPhone from a cloud session

A cloud session can't run a live development server that Ferdi's phone connects to directly. Instead, publish each test version to Expo's servers with **EAS Update**, and Ferdi opens it in Expo Go by scanning a QR code.

**What Ferdi provides to the session (one-off):**
1. A GitHub repository for the code.
2. A free Expo account, and an **Expo access token** added as the environment variable `EXPO_TOKEN`.
3. A free Supabase project: its URL and **anon** key as environment variables (the service-role key only as an Edge Function secret).
4. Cloud environment **network access** set to allow at least: `expo.dev`, `*.expo.dev`, `*.expo.io`, `*.supabase.co`, plus the default package registries.

**What Claude Code does:**
1. Configure the project for EAS Update so updates open in Expo Go (runtime version tied to the Expo SDK).
2. After each milestone, run `eas update --branch preview --message "<what changed>"`.
3. Report back the link to the update page on expo.dev, where the **QR code** is shown.
4. If network access to Expo is blocked, say so plainly and stop; don't try workarounds.

**What Ferdi does on his iPhone:**
1. Install **Expo Go** from the App Store and sign in with the same Expo account.
2. Open the update page link (or scan its QR code with the iPhone camera) → it opens in Expo Go.
3. Other people can test too by installing Expo Go and opening the same link.

**Fallback:** if the cloud route can't reach Expo, Ferdi pulls the GitHub repo onto his Mac, runs `npx expo start` (or has Claude Code on the Mac do it), and scans the QR code shown in the terminal.

---

## 12. Build order (milestones)

1. **Hello Pinelands** — empty Expo app published via EAS Update; Ferdi opens it on his iPhone. *(Proves the test path.)*
2. Supabase connected; tables, RLS policies and seed data (Pinelands watch + boundary polygon) created; RLS tests written.
3. Onboarding: invites, QR scanning, profile, consent, pending/approval, admin approve/remove.
4. Patrol mode + live map + tap to call.
5. Demo mode with simulated cars.
6. Patroller incident button + in-app alerts + incident list/handling.
7. Resident home + emergency button + boundary check + "My reports".
8. Voice reports: record, upload, Edge Function transcription, read aloud, play original.
9. Polish pass for older users (text size, contrast, wording), privacy notice, README.

After each milestone: publish an update, send Ferdi the link, and list in plain English what to test.

---

## 13. Acceptance checks for v0.1

- [ ] A brand-new patroller can join from an admin's QR code in under 2 minutes without help.
- [ ] A pending or removed member cannot see any patroller locations (tested at database level, not just in the app).
- [ ] A resident can never see patroller locations (tested at database level).
- [ ] An expired or already-used invite QR is rejected with a friendly message.
- [ ] Start patrol → the car appears on another patroller's map within ~10 seconds.
- [ ] Incident and emergency alerts appear on all open patroller phones within a few seconds, **even if the AI service is switched off**.
- [ ] A resident emergency outside Pinelands is still logged, flagged, and the resident is told to call 10111/112.
- [ ] A voice report is transcribed, read aloud clearly, and the original recording plays.
- [ ] Demo mode shows moving simulated cars and can be wiped cleanly.
- [ ] No secret keys are in the app bundle or the repository.

---

## 14. Open decisions for Ferdi

1. **App name** (working name "Pinelands Watch").
2. **Resident onboarding:** watch-wide resident QR (easy, e.g. on flyers) vs personal invites only (safer, more admin work)?
3. **Resident approval:** usable immediately, or admin approval first?
4. **Invite expiry:** 24 hours OK?
5. **AI model** for transcription/cleanup: Gemini Flash or Claude Haiku (both cheap).
6. **Pinelands boundary:** Claude Code will draft an approximate polygon; Ferdi confirms or adjusts it.
7. **Languages:** English only for the demo, or Afrikaans too?
