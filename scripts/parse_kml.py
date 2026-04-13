#!/usr/bin/env python3
"""Parse KML file and generate TypeScript parish data with geozones.

Merges KML polygon data with existing parishes in data.ts.
Existing parishes keep their detailed info + gain a zone.
New parishes from KML get minimal entries with zone.
"""

import xml.etree.ElementTree as ET
import re

KML_FILE = "/home/wlefebvre/cww/@@adel_get_kml_all"
DATA_TS = "/home/wlefebvre/cww/src/lib/data.ts"
OUTPUT_FILE = "/home/wlefebvre/cww/src/lib/data.ts"

# KML name -> existing data.ts id (manual mapping)
KML_TO_EXISTING = {
    "Paroisse Saint-Sernin": "tls-par-001",
    "Paroisse Saint-Étienne": "tls-par-002",
    "Paroisse de Notre-Dame de la Dalbade": "tls-par-003",
    "Paroisse de Notre-Dame-du-Taur": "tls-par-004",
    # tls-par-005 = Communauté Ukrainienne — no KML match
    "Paroisse Saint-Nicolas": "tls-par-010",
    # tls-par-011 = Saint-Cyprien — no direct match in KML
    "Paroisse de Blagnac": "tls-par-020",
    "Paroisse de Colomiers": "tls-par-030",
    "Paroisse de Balma": "tls-par-035",
    "Paroisse de Ramonville-Saint-Agne": "tls-par-036",
    "Paroisse d'Aspet": "tls-par-040",
}


def parse_coordinates(coord_text):
    """Parse KML coordinate string into [lat, lng] pairs."""
    coords = []
    for part in coord_text.strip().split():
        values = part.split(",")
        if len(values) >= 2:
            lng = float(values[0])
            lat = float(values[1])
            coords.append((lat, lng))
    return coords


def compute_centroid(coords):
    if not coords:
        return (0, 0)
    lats = [c[0] for c in coords]
    lngs = [c[1] for c in coords]
    return (round(sum(lats) / len(lats), 6), round(sum(lngs) / len(lngs), 6))


def fmt(val):
    """Format coordinate to 6dp, strip trailing zeros."""
    return f"{val:.6f}".rstrip("0").rstrip(".")


def format_zone(coords):
    """Format a list of (lat,lng) tuples as TypeScript zone literal."""
    parts = [f"[{fmt(lat)}, {fmt(lng)}]" for lat, lng in coords]
    return "[" + ", ".join(parts) + "]"


def main():
    ns = {"kml": "http://earth.google.com/kml/2.2"}
    tree = ET.parse(KML_FILE)
    root = tree.getroot()
    placemarks = root.findall(".//kml:Placemark", ns)

    # Parse all KML parishes
    kml_parishes = {}
    for pm in placemarks:
        name_el = pm.find("kml:name", ns)
        if name_el is None:
            continue
        name = name_el.text.strip()
        coord_el = pm.find(".//kml:coordinates", ns)
        if coord_el is None:
            continue
        coords = parse_coordinates(coord_el.text)
        if not coords:
            continue
        kml_parishes[name] = {
            "coords": coords,
            "centroid": compute_centroid(coords),
        }

    print(f"Parsed {len(kml_parishes)} parishes from KML")

    # Read existing data.ts
    with open(DATA_TS, "r", encoding="utf-8") as f:
        data_ts = f.read()

    # ── Step 1: Add zone to existing parishes that have a KML match ──
    matched_kml_names = set()
    for kml_name, existing_id in KML_TO_EXISTING.items():
        if kml_name not in kml_parishes:
            print(f"  WARNING: KML name '{kml_name}' not found")
            continue
        zone = format_zone(kml_parishes[kml_name]["coords"])
        # Find the existing parish line by its id and add zone before the closing }
        pattern = re.compile(
            r'(\{[^}]*id:\s*"' + re.escape(existing_id) + r'"[^}]*)(})',
            re.DOTALL,
        )
        match = pattern.search(data_ts)
        if match:
            if "zone:" not in match.group(1):
                data_ts = data_ts[: match.end(1)] + f", zone: {zone} " + data_ts[match.start(2):]
                print(f"  ✓ Added zone to {existing_id} ({kml_name})")
            else:
                print(f"  ⊘ {existing_id} already has zone")
        else:
            print(f"  WARNING: Could not find {existing_id} in data.ts")
        matched_kml_names.add(kml_name)

    # ── Step 2: Generate new parishes for unmatched KML entries ──
    new_names = sorted(set(kml_parishes.keys()) - matched_kml_names)
    print(f"\nGenerating {len(new_names)} new parishes...")

    new_lines = []
    for i, name in enumerate(new_names):
        pid = f"tls-par-kml-{i + 1:03d}"
        p = kml_parishes[name]
        lat = fmt(p["centroid"][0])
        lng = fmt(p["centroid"][1])
        zone = format_zone(p["coords"])
        # Escape quotes in name for TS string
        safe_name = name.replace('"', '\\"').replace("'", "\\'")
        line = (
            f'  {{ id: "{pid}", dioceseId: TLS, '
            f'nom: "{safe_name}", type: "territoriale" as const, '
            f"coordonnees: {{ lat: {lat}, lng: {lng} }}, "
            f"eglises: [], pretres: [], "
            f"zone: {zone} }},"
        )
        new_lines.append(line)

    new_block = "\n".join(new_lines)

    # ── Step 3: Insert new parishes into paroissesToulouse array ──
    # Find the end of the existing paroissesToulouse array and append before ];
    marker = "];\n\nconst ensemblesToulouse"
    if marker in data_ts:
        # Find the last entry in paroissesToulouse (before the ];)
        idx = data_ts.index(marker)
        # Insert new parishes before the ];
        insert = (
            "\n  // --- Paroisses importées du KML (geozones) ---\n"
            + new_block
            + "\n"
        )
        data_ts = data_ts[:idx] + insert + data_ts[idx:]
        print(f"  Inserted {len(new_names)} new parishes into paroissesToulouse")
    else:
        print("  ERROR: Could not find insertion point in data.ts")
        return

    # ── Write output ──
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(data_ts)

    print(f"\nDone! Updated {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
