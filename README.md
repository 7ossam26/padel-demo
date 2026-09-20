# Padel Egypt frontend demo

A browser-only Arabic/RTL demo of the complete player and club-owner journeys. The original `player-flow/` and `owner-flow/` exports are preserved as visual references; the working application lives in `src/`.

## Run locally

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

## Demo behavior

- All routes, forms, filters, availability calculations, bookings, owner actions, and dashboard metrics run in the browser.
- State is stored as one versioned document under `padel-egypt-demo:v1` in `localStorage` and updates across open tabs through the browser `storage` event.
- Demo dates are seeded relative to the local date. Use **إعادة ضبط التجربة** on the start screen to remove mutations and create a fresh relative seed.
- Card payment and notifications are deliberately simulated. No payment details, credentials, network API, or backend are used.
- Calendar export creates and downloads a local `.ics` file.

## Main routes

- Player: `/player/courts`, `/player/courts/:clubId`, `/player/courts/:clubId/time`, `/player/checkout`, `/player/bookings`
- Owner: `/owner/setup/club`, `/owner/setup/schedule`, `/owner/dashboard`, `/owner/bookings`, `/owner/bookings/:bookingId`, `/owner/availability/block`

## Deploy to Vercel

Import this repository with the Vite preset, use `npm run build`, and set the output directory to `dist`. No environment variables are required. `vercel.json` contains the SPA catch-all rewrite, so nested routes can be opened and refreshed directly.
