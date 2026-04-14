// Build-time YAML → TS generator.
// Reads every YAML file under src/data/dioceses/, validates lightly, and writes
// src/lib/data.generated.ts with typed arrays consumed by src/lib/data.ts.
//
// Run automatically via `predev` / `prebuild` in package.json.

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const DIOCESES_DIR = path.resolve("src/data/dioceses");
const OUTPUT_FILE = path.resolve("src/lib/data.generated.ts");

function loadDiocese(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const doc = yaml.load(raw);
  if (!doc || typeof doc !== "object") {
    throw new Error(`Invalid YAML in ${filePath}`);
  }
  if (!doc.diocese?.id) {
    throw new Error(`Missing diocese.id in ${filePath}`);
  }
  return doc;
}

function withDioceseId(items, dioceseId) {
  return (items ?? []).map((item) => ({ dioceseId, ...item }));
}

function main() {
  if (!fs.existsSync(DIOCESES_DIR)) {
    throw new Error(`Missing directory: ${DIOCESES_DIR}`);
  }

  const files = fs
    .readdirSync(DIOCESES_DIR)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .sort()
    .map((f) => path.join(DIOCESES_DIR, f));

  if (files.length === 0) {
    throw new Error(`No YAML files in ${DIOCESES_DIR}`);
  }

  const dioceses = [];
  const personnes = [];
  const paroisses = [];
  const ensemblesParoissiaux = [];
  const doyennes = [];
  const lieuxSpeciaux = [];

  for (const file of files) {
    const doc = loadDiocese(file);
    const dioceseId = doc.diocese.id;

    const diocese = {
      ...doc.diocese,
      doyennes: (doc.doyennes ?? []).map((d) => d.id),
      lieuxSpeciaux: (doc.lieux ?? []).map((l) => l.id),
    };
    dioceses.push(diocese);

    personnes.push(...withDioceseId(doc.personnes, dioceseId));
    paroisses.push(...withDioceseId(doc.paroisses, dioceseId));
    ensemblesParoissiaux.push(...withDioceseId(doc.ensembles, dioceseId));
    doyennes.push(...withDioceseId(doc.doyennes, dioceseId));
    lieuxSpeciaux.push(...withDioceseId(doc.lieux, dioceseId));
  }

  const banner = `// AUTO-GENERATED FILE — do not edit manually.
// Source: src/data/dioceses/*.yaml
// Regenerate with: node scripts/build-data.mjs
`;

  const body = `${banner}
import type {
  Diocese,
  Personne,
  Paroisse,
  EnsembleParoissial,
  Doyenne,
  LieuSpecial,
} from "./types";

export const dioceses: Diocese[] = ${JSON.stringify(dioceses, null, 2)};

export const personnes: Personne[] = ${JSON.stringify(personnes, null, 2)};

export const paroisses: Paroisse[] = ${JSON.stringify(paroisses, null, 2)};

export const ensemblesParoissiaux: EnsembleParoissial[] = ${JSON.stringify(ensemblesParoissiaux, null, 2)};

export const doyennes: Doyenne[] = ${JSON.stringify(doyennes, null, 2)};

export const lieuxSpeciaux: LieuSpecial[] = ${JSON.stringify(lieuxSpeciaux, null, 2)};
`;

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, body);

  console.log(
    `[build-data] ${files.length} diocese(s) → ${personnes.length} personnes, ${paroisses.length} paroisses, ${lieuxSpeciaux.length} lieux`
  );
}

main();
