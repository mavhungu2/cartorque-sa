// Remove the seeded mock/demo listings from Firestore, leaving real stock intact.
// Run with: npx tsx --env-file=.env.local scripts/remove-mock-listings.ts
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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
  const snap = await db.collection("listings").get();
  const mockDocs = snap.docs.filter(
    (d) => d.id.startsWith("mock-") || d.id.startsWith("demo-"),
  );

  if (mockDocs.length === 0) {
    console.log("No mock/demo listings found. Nothing to do.");
    return;
  }

  console.log(`Deleting ${mockDocs.length} mock/demo listings…\n`);
  for (const d of mockDocs) {
    await d.ref.delete();
    console.log(`  ✗ deleted ${d.id.padEnd(20)} ${d.get("title") ?? ""}`);
  }

  const remaining = await db.collection("listings").get();
  console.log(`\nDone. ${remaining.size} listings remain:`);
  for (const d of remaining.docs) {
    console.log(`  • ${d.id.padEnd(28)} ${d.get("title") ?? ""}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
