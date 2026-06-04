// Seed Firestore with the mock listings.
// Run with: npx tsx --env-file=.env.local scripts/seed-listings.ts
//
// Idempotent — re-running upserts by id, so no duplicates.
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { MOCK_LISTINGS } from "../src/lib/mock-listings";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("FIREBASE_* env vars not set. Aborting.");
  process.exit(1);
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });

const db = getFirestore(app);

async function main() {
  console.log(`Seeding ${MOCK_LISTINGS.length} listings to Firestore…\n`);
  for (const l of MOCK_LISTINGS) {
    const { id, ...data } = l;
    await db.collection("listings").doc(id).set(data, { merge: true });
    console.log(`  ✓ ${id.padEnd(20)} ${l.title}`);
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
