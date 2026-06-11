// Verifies the mirrored contract modules haven't drifted from the web source.
// Compares normalized type/function bodies; fails loudly on mismatch.
// Run: npm run check-contracts (from mobile/)
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(here, "../../src/lib");
const mobileContracts = path.resolve(here, "../src/lib/contracts");

function normalize(src) {
  return src
    .replace(/\/\/[^\n]*/g, "") // line comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // block comments
    .replace(/\s+/g, " ")
    .trim();
}

/** Extract a block starting at a marker through balanced braces (or to `;` for type aliases). */
function extract(src, marker) {
  const start = src.indexOf(marker);
  if (start === -1) return null;
  let i = src.indexOf("{", start);
  const semi = src.indexOf(";", start);
  if (i === -1 || (semi !== -1 && semi < i)) return src.slice(start, semi + 1);
  let depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  return null;
}

const checks = [
  {
    web: "mock-listings.ts",
    mobile: "listing.ts",
    blocks: [
      "export type Listing =",
      "export type ListingFilters =",
      "export type ListingFacets =",
      "export function applyListingFilters",
    ],
  },
  {
    web: "finance.ts",
    mobile: "finance.ts",
    blocks: [
      "export function estimateInstalment",
      "export function isValidSaId",
    ],
  },
];

let failed = false;
for (const { web, mobile, blocks } of checks) {
  const webSrc = readFileSync(path.join(webRoot, web), "utf8");
  const mobileSrc = readFileSync(path.join(mobileContracts, mobile), "utf8");
  for (const marker of blocks) {
    const a = extract(webSrc, marker);
    const b = extract(mobileSrc, marker);
    if (!a || !b) {
      console.error(`✗ ${marker} — missing in ${!a ? `web/${web}` : `mobile/${mobile}`}`);
      failed = true;
      continue;
    }
    if (normalize(a) !== normalize(b)) {
      console.error(`✗ ${marker} — drifted between web/${web} and mobile/contracts/${mobile}`);
      failed = true;
    } else {
      console.log(`✓ ${marker}`);
    }
  }
}

if (failed) {
  console.error("\nContract drift detected. Update mobile/src/lib/contracts to match the web source.");
  process.exit(1);
}
console.log("\nAll contracts in sync.");
