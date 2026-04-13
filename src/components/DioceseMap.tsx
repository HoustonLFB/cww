"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  dioceses,
  paroisses,
  lieuxSpeciaux,
  ensemblesParoissiaux,
  doyennes,
  getPersonne,
  getDiocese,
  getParoissesByDiocese,
  getLieuxByDiocese,
  getEnsemblesByDiocese,
  getDoyennesByDiocese,
  typeLieuIcons,
  typeLieuLabels,
  typeParoisseLabels,
  roleLabels,
} from "@/lib/data";
import { siteConfig } from "@/lib/config";

const churchIcon = L.divIcon({
  html: '<span style="font-size:1.6rem">⛪</span>',
  className: "custom-marker-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

function lieuIcon(type: string) {
  const emoji = typeLieuIcons[type] || "📍";
  return L.divIcon({
    html: `<span style="font-size:1.4rem">${emoji}</span>`,
    className: "custom-marker-icon",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

const dioceseIcon = L.divIcon({
  html: '<span style="font-size:2rem">🏛️</span>',
  className: "custom-marker-icon",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

type FilterType = "all" | "paroisses" | "lieux";
type ZoneLevel = "off" | "doyennes" | "ensembles" | "paroisses";

interface DioceseMapProps {
  dioceseId?: string; // If provided, show only this diocese's data; otherwise show France overview
}

export default function DioceseMap({ dioceseId }: DioceseMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [zoneLevel, setZoneLevel] = useState<ZoneLevel>("ensembles");
  const layersRef = useRef<{
    paroisses: L.LayerGroup;
    lieux: L.LayerGroup;
    zonesDoyennes: L.LayerGroup;
    zonesEnsembles: L.LayerGroup;
    zonesParoisses: L.LayerGroup;
  }>({
    paroisses: L.layerGroup(),
    lieux: L.layerGroup(),
    zonesDoyennes: L.layerGroup(),
    zonesEnsembles: L.layerGroup(),
    zonesParoisses: L.layerGroup(),
  });

  const isFranceView = !dioceseId;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // If diocese-specific, center on that diocese; else France
    const diocese = dioceseId ? getDiocese(dioceseId) : null;
    const center: [number, number] = diocese
      ? [diocese.coordonnees.lat, diocese.coordonnees.lng]
      : [siteConfig.centreCarte.lat, siteConfig.centreCarte.lng];
    const zoom = diocese ? 11 : siteConfig.zoomCarte;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    if (isFranceView) {
      // === FRANCE VIEW: show diocese markers ===
      const dioceseLayer = L.layerGroup();
      dioceses.forEach((d) => {
        const eveque = getPersonne(d.eveque);
        const marker = L.marker([d.coordonnees.lat, d.coordonnees.lng], {
          icon: dioceseIcon,
          title: d.nom,
        });
        marker.bindPopup(`
          <div style="min-width: 200px">
            <strong style="font-size: 14px">${d.nom}</strong>
            ${eveque ? `<br/><span style="font-size: 12px">${roleLabels[eveque.role] || eveque.role} : ${eveque.prenom} ${eveque.nom}</span>` : ""}
            <br/><a href="/dioceses/${d.slug}" style="color: ${siteConfig.couleurPrimaire}; font-size: 12px; font-weight: 600">Voir le diocèse →</a>
          </div>
        `);
        dioceseLayer.addLayer(marker);
      });
      dioceseLayer.addTo(map);
    } else {
      // === DIOCESE VIEW: show parishes, lieux, zones ===
      const filteredParoisses = getParoissesByDiocese(dioceseId);
      const filteredLieux = getLieuxByDiocese(dioceseId);
      const filteredEnsembles = getEnsemblesByDiocese(dioceseId);
      const filteredDoyennes = getDoyennesByDiocese(dioceseId);

      // Zones: Doyennés
      const zonesDoyennesLayer = L.layerGroup();
      filteredDoyennes.forEach((d) => {
        if (!d.zone) return;
        const polygon = L.polygon(d.zone, {
          color: d.couleur || "#6d2077",
          weight: 3,
          opacity: 0.7,
          fillOpacity: 0.08,
          dashArray: "8, 6",
        });
        const doyen = getPersonne(d.doyen);
        polygon.bindPopup(`
          <div style="min-width: 160px">
            <strong style="font-size: 14px">${d.nom}</strong>
            ${doyen ? `<br/><span style="font-size: 12px">Doyen : ${doyen.prenom} ${doyen.nom}</span>` : ""}
            <br/><span style="font-size: 12px; color: #888">${d.ensemblesParoissiaux.length} ensemble(s) paroissial(aux)</span>
            <br/><a href="/dioceses/${diocese?.slug}/doyennes/${d.id}" style="color: ${siteConfig.couleurPrimaire}; font-size: 12px; font-weight: 600">Voir le doyenné →</a>
          </div>
        `);
        polygon.bindTooltip(d.nom, { permanent: false, direction: "center", className: "zone-tooltip" });
        zonesDoyennesLayer.addLayer(polygon);
      });

      // Zones: Ensembles paroissiaux
      const zonesEnsemblesLayer = L.layerGroup();
      filteredEnsembles.forEach((ep) => {
        if (!ep.zone) return;
        const polygon = L.polygon(ep.zone, {
          color: ep.couleur || "#1565c0",
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.12,
        });
        const moderateur = getPersonne(ep.cureModerateur);
        polygon.bindPopup(`
          <div style="min-width: 160px">
            <strong style="font-size: 14px">${ep.nom}</strong>
            ${moderateur ? `<br/><span style="font-size: 12px">Curé modérateur : ${moderateur.prenom} ${moderateur.nom}</span>` : ""}
            <br/><span style="font-size: 12px; color: #888">${ep.paroisses.length} paroisse(s)</span>
          </div>
        `);
        polygon.bindTooltip(ep.nom, { permanent: false, direction: "center", className: "zone-tooltip" });
        zonesEnsemblesLayer.addLayer(polygon);
      });

      // Zones: Paroisses
      const zonesParoissesLayer = L.layerGroup();
      filteredParoisses.forEach((p) => {
        if (!p.zone) return;
        const polygon = L.polygon(p.zone, {
          color: "#e65100",
          weight: 1,
          opacity: 0.7,
          fillOpacity: 0.15,
        });
        polygon.bindPopup(`
          <div style="min-width: 160px">
            <strong style="font-size: 14px">${p.nom}</strong>
            <br/><span style="color: #666; font-size: 12px">${typeParoisseLabels[p.type]}</span>
            <br/><a href="/dioceses/${diocese?.slug}/paroisses/${p.id}" style="color: ${siteConfig.couleurPrimaire}; font-size: 12px; font-weight: 600">Voir la fiche →</a>
          </div>
        `);
        polygon.bindTooltip(p.nom, { permanent: false, direction: "center", className: "zone-tooltip" });
        zonesParoissesLayer.addLayer(polygon);
      });

      // Markers: Paroisses
      const paroissesLayer = L.layerGroup();
      filteredParoisses.forEach((p) => {
        const pretresHtml = p.pretres
          .map((id) => {
            const pers = getPersonne(id);
            return pers ? `${pers.prenom} ${pers.nom}` : "";
          })
          .filter(Boolean)
          .join(", ");

        const marker = L.marker([p.coordonnees.lat, p.coordonnees.lng], {
          icon: churchIcon,
          title: p.nom,
        });

        marker.bindPopup(`
          <div style="min-width: 180px">
            <strong style="font-size: 14px">${p.nom}</strong><br/>
            <span style="color: #666; font-size: 12px">${typeParoisseLabels[p.type]}</span>
            ${p.adresse ? `<br/><span style="font-size: 12px">📍 ${p.adresse}</span>` : ""}
            ${pretresHtml ? `<br/><span style="font-size: 12px">👤 ${pretresHtml}</span>` : ""}
            <br/><a href="/dioceses/${diocese?.slug}/paroisses/${p.id}" style="color: ${siteConfig.couleurPrimaire}; font-size: 12px; font-weight: 600">Voir la fiche →</a>
          </div>
        `);

        paroissesLayer.addLayer(marker);
      });

      // Markers: Lieux spéciaux
      const lieuxLayer = L.layerGroup();
      filteredLieux.forEach((l) => {
        const marker = L.marker([l.coordonnees.lat, l.coordonnees.lng], {
          icon: lieuIcon(l.type),
          title: l.nom,
        });

        marker.bindPopup(`
          <div style="min-width: 180px">
            <strong style="font-size: 14px">${l.nom}</strong><br/>
            <span style="color: #666; font-size: 12px">${typeLieuLabels[l.type]}</span>
            ${l.adresse ? `<br/><span style="font-size: 12px">📍 ${l.adresse}</span>` : ""}
            ${l.description ? `<br/><span style="font-size: 11px; color: #888">${l.description}</span>` : ""}
            <br/><a href="/dioceses/${diocese?.slug}/lieux-speciaux/${l.id}" style="color: ${siteConfig.couleurPrimaire}; font-size: 12px; font-weight: 600">Voir la fiche →</a>
          </div>
        `);

        lieuxLayer.addLayer(marker);
      });

      // Add default layers
      paroissesLayer.addTo(map);
      lieuxLayer.addTo(map);
      zonesEnsemblesLayer.addTo(map);

      layersRef.current = {
        paroisses: paroissesLayer,
        lieux: lieuxLayer,
        zonesDoyennes: zonesDoyennesLayer,
        zonesEnsembles: zonesEnsemblesLayer,
        zonesParoisses: zonesParoissesLayer,
      };
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [dioceseId]);

  // Filter markers (diocese view only)
  useEffect(() => {
    if (isFranceView) return;
    const map = mapRef.current;
    if (!map) return;
    const { paroisses: pLayer, lieux: lLayer } = layersRef.current;

    if (filter === "all" || filter === "paroisses") {
      pLayer.addTo(map);
    } else {
      map.removeLayer(pLayer);
    }

    if (filter === "all" || filter === "lieux") {
      lLayer.addTo(map);
    } else {
      map.removeLayer(lLayer);
    }
  }, [filter, isFranceView]);

  // Zone level toggle (diocese view only)
  useEffect(() => {
    if (isFranceView) return;
    const map = mapRef.current;
    if (!map) return;
    const { zonesDoyennes, zonesEnsembles, zonesParoisses } = layersRef.current;

    map.removeLayer(zonesDoyennes);
    map.removeLayer(zonesEnsembles);
    map.removeLayer(zonesParoisses);

    if (zoneLevel === "doyennes") {
      zonesDoyennes.addTo(map);
    } else if (zoneLevel === "ensembles") {
      zonesEnsembles.addTo(map);
    } else if (zoneLevel === "paroisses") {
      zonesParoisses.addTo(map);
    }
  }, [zoneLevel, isFranceView]);

  return (
    <div className="relative h-full">
      {/* Filter controls — diocese view only */}
      {!isFranceView && (
        <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
          <div className="bg-card-bg rounded-lg shadow-md p-2 flex gap-1 text-sm">
            <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded ${filter === "all" ? "bg-primary text-white" : "hover:bg-gray-100"}`}>Tout</button>
            <button onClick={() => setFilter("paroisses")} className={`px-3 py-1 rounded ${filter === "paroisses" ? "bg-primary text-white" : "hover:bg-gray-100"}`}>⛪ Paroisses</button>
            <button onClick={() => setFilter("lieux")} className={`px-3 py-1 rounded ${filter === "lieux" ? "bg-primary text-white" : "hover:bg-gray-100"}`}>📍 Lieux</button>
          </div>
          <div className="bg-card-bg rounded-lg shadow-md p-2 flex gap-1 text-sm">
            <span className="px-2 py-1 text-gray-500 text-xs self-center">Zones :</span>
            <button onClick={() => setZoneLevel("off")} className={`px-3 py-1 rounded ${zoneLevel === "off" ? "bg-primary text-white" : "hover:bg-gray-100"}`}>Aucune</button>
            <button onClick={() => setZoneLevel("doyennes")} className={`px-3 py-1 rounded ${zoneLevel === "doyennes" ? "bg-primary text-white" : "hover:bg-gray-100"}`}>Doyennés</button>
            <button onClick={() => setZoneLevel("ensembles")} className={`px-3 py-1 rounded ${zoneLevel === "ensembles" ? "bg-primary text-white" : "hover:bg-gray-100"}`}>Ensembles</button>
            <button onClick={() => setZoneLevel("paroisses")} className={`px-3 py-1 rounded ${zoneLevel === "paroisses" ? "bg-primary text-white" : "hover:bg-gray-100"}`}>Paroisses</button>
          </div>
        </div>
      )}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
