# Car Torque SA — Setup

## Firebase setup (one-time)

1. Go to https://console.firebase.google.com and create a new project — suggested name **`cartorque-sa`** (keep it separate from `rois-movers`).
2. Enable **Firestore Database** (start in *production mode* — rules are committed in this repo at `firestore.rules`).
3. Enable **Storage** (for listing photos — Phase 2).
4. Enable **Authentication** with Email + Google providers (Phase 2; safe to enable now).
5. In **Project Settings → General → Your apps**, add a **Web app**. Copy the config object — you'll need the values for the `NEXT_PUBLIC_FIREBASE_*` variables below.
6. In **Project Settings → Service Accounts → Firebase Admin SDK**, click **Generate new private key**. Save the JSON file somewhere secure; do not commit it.

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values from your Firebase project.

For the service account private key, take the `private_key` field from the JSON file you downloaded. Wrap it in double quotes and keep the embedded `\n` line breaks as-is — Next.js parses them correctly at runtime.

## Firestore indexes

Phase 1 needs a couple of composite indexes for sorted+filtered queries. Firestore will print the exact create-index URL in your dev-server logs the first time a query runs — click it and approve. (You can also pre-create them via the Firebase console once the data shape settles.)

## Running

```bash
npm install
npm run dev
```

If `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is unset, the marketplace pages render with **seeded mock listings** so you can demo the UI before wiring up Firebase. Once you set the env vars, real Firestore data takes over automatically — no code changes.

## Admin moderation

`/admin/listings` shows the moderation queue for `pending_review` listings, with one-click
approve / reject. To require a password, add this to `.env.local`:

```
ADMIN_PASSWORD=pick-something-strong
```

If unset, the admin pages are open (a banner warns you in the UI). Replace this with
Firebase Auth + role claims in Phase 2.

## Deploying the Firestore rules

```bash
# install the firebase CLI once
npm install -g firebase-tools

# from the project root
firebase login
firebase use <your-project-id>
firebase deploy --only firestore:rules
```
