// Add the real dealer-stock listings (photos from ~/Downloads WhatsApp batches).
// Run with: npx tsx --env-file=.env.local scripts/add-dealer-listings.ts
//
// Idempotent — deterministic doc IDs, photos re-uploaded to the same paths.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import type { Listing } from "../src/lib/mock-listings";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const storageBucket =
  process.env.FIREBASE_STORAGE_BUCKET ?? "cartorque-sa.firebasestorage.app";

if (!projectId || !clientEmail || !privateKey) {
  console.error("FIREBASE_* env vars not set. Aborting.");
  process.exit(1);
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      storageBucket,
    });

const db = getFirestore(app);
const bucket = getStorage(app).bucket();

const DOWNLOADS = path.join(os.homedir(), "Downloads");
const MAX_PHOTOS = 6;

/** Seconds-of-day window for each WhatsApp batch. */
type Batch = { fromSec: number; toSec: number };
const sec = (h: number, m: number, s: number) => h * 3600 + m * 60 + s;

type DealerCar = Omit<
  Listing,
  "id" | "photos" | "createdAt" | "updatedAt" | "title"
> & { id: string; batches: Batch[] };

const COMMON = {
  ownerId: "cartorque-sa",
  ownerName: "Car Torque SA",
  ownerEmail: "hello@cartorque.co.za",
  location: "Gqeberha",
  province: "Eastern Cape" as const,
  status: "live" as const,
  verified: "vin_checked" as const,
  negotiable: false,
};

const CARS: DealerCar[] = [
  {
    ...COMMON,
    id: "vw-tiguan-rline-110kw",
    make: "Volkswagen",
    model: "Tiguan",
    variant: "1.4 TSI 110kW R-Line Auto",
    year: 2026,
    mileageKm: 0,
    condition: "new",
    transmission: "automatic",
    fuelType: "petrol",
    bodyType: "SUV",
    color: "White",
    priceZar: 732000,
    monthlyZar: 14639.99,
    description:
      "Brand-new 2026 Volkswagen Tiguan 1.4 TSI 110kW R-Line Auto. Digital cockpit, R-Line styling inside and out, paddle shifters, full infotainment suite. Estimated instalment ±R14,639.99/month (terms and approval apply). Arranged through Car Torque SA.",
    batches: [
      { fromSec: sec(12, 15, 45), toSec: sec(12, 15, 49) }, // exterior
      { fromSec: sec(20, 18, 30), toSec: sec(20, 18, 44) }, // interior (evening shoot)
    ],
  },
  {
    ...COMMON,
    id: "vw-golf-gti",
    make: "Volkswagen",
    model: "Golf",
    variant: "GTI 2.0 TSI Auto",
    year: 2026,
    mileageKm: 0,
    condition: "new",
    transmission: "dct",
    fuelType: "petrol",
    bodyType: "Hatchback",
    color: "White",
    priceZar: 858000,
    monthlyZar: 17159.99,
    location: "Bloemfontein",
    province: "Free State",
    description:
      "Brand-new 2026 Volkswagen Golf GTI Auto. The benchmark hot hatch — 2.0 TSI, DSG, red-caliper brakes, GTI interior. Estimated instalment ±R17,159.99/month (terms and approval apply). Arranged through Car Torque SA.",
    batches: [{ fromSec: sec(20, 20, 1), toSec: sec(20, 20, 24) }],
  },
  {
    ...COMMON,
    id: "vw-polo-vivo-14",
    make: "Volkswagen",
    model: "Polo Vivo",
    variant: "Hatch 1.4 Manual",
    year: 2026,
    mileageKm: 0,
    condition: "new",
    transmission: "manual",
    fuelType: "petrol",
    bodyType: "Hatchback",
    color: "Blue",
    priceZar: 245500,
    monthlyZar: 4910,
    location: "Bloemfontein",
    province: "Free State",
    description:
      "Brand-new 2026 Volkswagen Polo Vivo Hatch 1.4 manual. SA's best-selling entry VW — bulletproof 1.4, low running costs, full dealer warranty. Estimated instalment ±R4,910/month (terms and approval apply). Arranged through Car Torque SA.",
    batches: [{ fromSec: sec(20, 14, 4), toSec: sec(20, 14, 18) }],
  },
  {
    ...COMMON,
    id: "vw-polo-hatch-70kw",
    make: "Volkswagen",
    model: "Polo",
    variant: "Hatch 1.0 TSI 70kW",
    year: 2026,
    mileageKm: 0,
    condition: "new",
    transmission: "manual",
    fuelType: "petrol",
    bodyType: "Hatchback",
    color: "White",
    priceZar: 335500,
    monthlyZar: 6709.99,
    description:
      "Brand-new 2026 Volkswagen Polo Hatch 1.0 TSI 70kW manual. SA's favourite hatch with the efficient 1.0 turbo three-cylinder. Estimated instalment ±R6,709.99/month (terms and approval apply). Arranged through Car Torque SA.",
    batches: [{ fromSec: sec(12, 18, 56), toSec: sec(12, 18, 59) }],
  },
  {
    ...COMMON,
    id: "gwm-p300-single-cab-sx",
    make: "GWM",
    model: "P300",
    variant: "2.0T Single Cab SX",
    year: 2026,
    mileageKm: 0,
    condition: "new",
    transmission: "manual",
    fuelType: "diesel",
    bodyType: "Bakkie",
    color: "White",
    priceZar: 379900,
    monthlyZar: 7597.99,
    description:
      "Brand-new 2026 GWM P300 2.0T Single Cab SX manual. Serious workhorse value — 2.0 turbodiesel, load bed with rails, modern cab. Estimated instalment ±R7,597.99/month (terms and approval apply). Arranged through Car Torque SA.",
    batches: [{ fromSec: sec(12, 18, 20), toSec: sec(12, 18, 25) }],
  },
  {
    ...COMMON,
    id: "gwm-tank-300-ultra-luxury",
    make: "GWM",
    model: "Tank 300",
    variant: "2.4T Ultra Luxury 4WD Auto",
    year: 2026,
    mileageKm: 0,
    condition: "new",
    transmission: "automatic",
    fuelType: "diesel",
    bodyType: "SUV",
    color: "Grey",
    priceZar: 759900,
    monthlyZar: 15197.99,
    description:
      "Brand-new 2026 GWM Tank 300 2.4T Ultra Luxury 4WD Auto. Proper ladder-frame off-roader with a premium cabin — quilted leather, dual screens, full driver assistance. Estimated instalment ±R15,197.99/month (terms and approval apply). Arranged through Car Torque SA.",
    batches: [{ fromSec: sec(12, 17, 27), toSec: sec(12, 17, 33) }],
  },
  {
    ...COMMON,
    id: "vw-tiguan-rline-4motion",
    make: "Volkswagen",
    model: "Tiguan",
    variant: "1.4 TSI R-Line DSG 4Motion",
    year: 2026,
    mileageKm: 0,
    condition: "new",
    transmission: "dct",
    fuelType: "petrol",
    bodyType: "SUV",
    color: "Red",
    priceZar: 739500,
    monthlyZar: 14790,
    description:
      "Brand-new 2026 Volkswagen Tiguan 1.4 TSI R-Line DSG 4Motion. All-wheel drive, panoramic roof, R-Line leather sport interior. Estimated instalment ±R14,790/month (terms and approval apply). Arranged through Car Torque SA.",
    batches: [{ fromSec: sec(12, 28, 27), toSec: sec(12, 28, 31) }],
  },
  {
    ...COMMON,
    id: "suzuki-ertiga-15-gl",
    make: "Suzuki",
    model: "Ertiga",
    variant: "1.5 GL",
    year: 2025,
    mileageKm: 7934,
    condition: "used",
    transmission: "manual",
    fuelType: "petrol",
    bodyType: "MPV",
    color: "White",
    priceZar: 339995,
    monthlyZar: 6799.9,
    negotiable: true,
    description:
      "2025 Suzuki Ertiga 1.5 GL manual with only 7,934 km — effectively new. Seven seats, legendary Suzuki running costs, balance of factory warranty. Estimated instalment ±R6,799.90/month (terms and approval apply). Arranged through Car Torque SA.",
    batches: [{ fromSec: sec(11, 55, 39), toSec: sec(11, 55, 46) }],
  },
  {
    ...COMMON,
    id: "toyota-rumion-15-sx",
    make: "Toyota",
    model: "Rumion",
    variant: "1.5 SX",
    year: 2025,
    mileageKm: 10306,
    condition: "used",
    transmission: "manual",
    fuelType: "petrol",
    bodyType: "MPV",
    color: "Silver",
    priceZar: 359995,
    monthlyZar: 7199.9,
    negotiable: true,
    description:
      "2025 Toyota Rumion 1.5 SX manual, 10,306 km, Toyota Certified. Seven-seat practicality with Toyota's dealer network behind it. Estimated instalment ±R7,199.90/month (terms and approval apply). Arranged through Car Torque SA.",
    batches: [{ fromSec: sec(11, 55, 10), toSec: sec(11, 55, 12) }],
  },
];

function parseTimestamp(filename: string): number | null {
  // "WhatsApp Image 2026-06-10 at HH.MM.SS (N).jpeg"
  const m = filename.match(/2026-06-10 at (\d{2})\.(\d{2})\.(\d{2})/);
  if (!m) return null;
  return sec(Number(m[1]), Number(m[2]), Number(m[3]));
}

function filesInBatch(batch: Batch, all: string[]): string[] {
  return all
    .filter((f) => {
      const t = parseTimestamp(f);
      return t !== null && t >= batch.fromSec && t <= batch.toSec;
    })
    .sort();
}

/** Spread the photo budget across batches (e.g. exterior + interior shoots). */
function photosForBatches(batches: Batch[], all: string[]): string[] {
  const perBatch = Math.max(1, Math.ceil(MAX_PHOTOS / batches.length));
  return batches.flatMap((b) => filesInBatch(b, all).slice(0, perBatch)).slice(0, MAX_PHOTOS);
}

async function main() {
  const files = (await readdir(DOWNLOADS)).filter((f) =>
    /^WhatsApp Image 2026-06-10 at .*\.jpeg$/i.test(f),
  );
  console.log(`Found ${files.length} WhatsApp photos in Downloads.\n`);

  for (const car of CARS) {
    const batchFiles = photosForBatches(car.batches, files);
    if (batchFiles.length === 0) {
      console.warn(`! ${car.id}: no photos matched batch window — skipping photos`);
    }

    const urls: string[] = [];
    for (let i = 0; i < batchFiles.length; i++) {
      const localPath = path.join(DOWNLOADS, batchFiles[i]);
      const buf = await readFile(localPath);
      const dest = `listings/${car.id}/${String(i + 1).padStart(2, "0")}.jpeg`;
      const fileRef = bucket.file(dest);
      await fileRef.save(buf, { contentType: "image/jpeg" });
      const url = await getDownloadURL(fileRef);
      urls.push(url);
    }

    const ref = db.collection("listings").doc(car.id);
    const existing = await ref.get();
    const now = new Date().toISOString();
    const { id, batches: _batches, ...data } = car;
    const title = `${car.year} ${car.make} ${car.model} ${car.variant ?? ""}`.trim();
    await ref.set(
      {
        ...data,
        title,
        photos: urls,
        createdAt: existing.exists ? existing.get("createdAt") : now,
        updatedAt: now,
      },
      { merge: true },
    );
    console.log(
      `${existing.exists ? "↻" : "✓"} ${id.padEnd(28)} ${title}  (${urls.length} photos)`,
    );
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
