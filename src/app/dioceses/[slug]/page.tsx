"use client";

import { use } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  getDiocese,
  getPersonne,
  getParoissesByDiocese,
  getDoyennesByDiocese,
  getEnsemblesByDiocese,
  getLieuxByDiocese,
  getPersonnesByDiocese,
  roleLabels,
} from "@/lib/data";

const DioceseMap = dynamic(() => import("@/components/DioceseMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-gray-400">
      Chargement de la carte...
    </div>
  ),
});

export default function DiocesePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const diocese = getDiocese(slug);
  if (!diocese) return null;

  const eveque = getPersonne(diocese.eveque);
  const auxiliaires = (diocese.evequesAuxiliaires || []).map(getPersonne).filter(Boolean);
  const vicaires = diocese.vicairesGeneraux.map(getPersonne).filter(Boolean);
  const nbParoisses = getParoissesByDiocese(diocese.id).length;
  const nbDoyennes = getDoyennesByDiocese(diocese.id).length;
  const nbEnsembles = getEnsemblesByDiocese(diocese.id).length;
  const nbLieux = getLieuxByDiocese(diocese.id).length;
  const nbPersonnes = getPersonnesByDiocese(diocese.id).length;

  return (
    <div>
      {/* Map */}
      <div className="h-[50vh]">
        <DioceseMap dioceseId={diocese.id} />
      </div>

      {/* Info */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{diocese.nom}</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Responsables */}
          <div className="border rounded-xl p-5 bg-card-bg">
            <h2 className="text-lg font-semibold mb-3">Responsables</h2>
            {eveque && (
              <p className="text-sm mb-1">
                <span className="text-gray-500">{roleLabels[eveque.role]} :</span>{" "}
                <Link href={`/dioceses/${slug}/personnes/${eveque.id}`} className="text-primary font-medium hover:underline">
                  {eveque.prenom} {eveque.nom}
                </Link>
              </p>
            )}
            {auxiliaires.map(
              (a) =>
                a && (
                  <p key={a.id} className="text-sm mb-1">
                    <span className="text-gray-500">{roleLabels[a.role]} :</span>{" "}
                    <Link href={`/dioceses/${slug}/personnes/${a.id}`} className="text-primary font-medium hover:underline">
                      {a.prenom} {a.nom}
                    </Link>
                  </p>
                )
            )}
            {vicaires.map(
              (v) =>
                v && (
                  <p key={v.id} className="text-sm mb-1">
                    <span className="text-gray-500">{roleLabels[v.role]} :</span>{" "}
                    <Link href={`/dioceses/${slug}/personnes/${v.id}`} className="text-primary font-medium hover:underline">
                      {v.prenom} {v.nom}
                    </Link>
                  </p>
                )
            )}
          </div>

          {/* Contact */}
          <div className="border rounded-xl p-5 bg-card-bg">
            <h2 className="text-lg font-semibold mb-3">Contact</h2>
            {diocese.adresse && <p className="text-sm mb-1">📍 {diocese.adresse}</p>}
            {diocese.telephone && <p className="text-sm mb-1">📞 {diocese.telephone}</p>}
            {diocese.email && <p className="text-sm mb-1">✉️ {diocese.email}</p>}
            {diocese.siteWeb && (
              <p className="text-sm mb-1">
                🌐{" "}
                <a href={diocese.siteWeb} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {diocese.siteWeb}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          {[
            { label: "Doyennés", count: nbDoyennes, href: `${slug}/doyennes` },
            { label: "Ensembles", count: nbEnsembles, href: null },
            { label: "Paroisses", count: nbParoisses, href: `${slug}/paroisses` },
            { label: "Personnes", count: nbPersonnes, href: `${slug}/personnes` },
            { label: "Lieux spéciaux", count: nbLieux, href: `${slug}/lieux-speciaux` },
          ].map((s) => (
            <div key={s.label} className="border rounded-lg p-4 text-center bg-card-bg">
              <p className="text-2xl font-bold text-primary">{s.count}</p>
              {s.href ? (
                <Link href={`/dioceses/${s.href}`} className="text-xs text-gray-500 hover:underline">
                  {s.label}
                </Link>
              ) : (
                <p className="text-xs text-gray-500">{s.label}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
