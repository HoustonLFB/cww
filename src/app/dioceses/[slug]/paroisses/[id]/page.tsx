import Link from "next/link";
import { getDiocese, getParoisse, getPersonne, getEnsembleParoissial, typeParoisseLabels, roleLabels } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function ParoisseDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const diocese = getDiocese(slug);
  const paroisse = getParoisse(id);
  if (!diocese || !paroisse) notFound();

  const ensemble = paroisse.ensembleParoissialId ? getEnsembleParoissial(paroisse.ensembleParoissialId) : undefined;
  const pretres = paroisse.pretres.map(getPersonne).filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">⛪ {paroisse.nom}</h1>
      <p className="text-sm text-gray-500 mb-6">{typeParoisseLabels[paroisse.type]}</p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact */}
        <div className="border rounded-xl p-5 bg-card-bg">
          <h2 className="text-lg font-semibold mb-3">Informations</h2>
          {paroisse.adresse && <p className="text-sm mb-1">📍 {paroisse.adresse}</p>}
          {paroisse.telephone && <p className="text-sm mb-1">📞 {paroisse.telephone}</p>}
          {paroisse.email && <p className="text-sm mb-1">✉️ {paroisse.email}</p>}
          {paroisse.siteWeb && (
            <p className="text-sm mb-1">
              🌐{" "}
              <a href={paroisse.siteWeb} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {paroisse.siteWeb}
              </a>
            </p>
          )}
          {ensemble && (
            <p className="text-sm mt-3">
              Ensemble paroissial :{" "}
              <span className="font-medium">{ensemble.nom}</span>
            </p>
          )}
        </div>

        {/* Prêtres */}
        <div className="border rounded-xl p-5 bg-card-bg">
          <h2 className="text-lg font-semibold mb-3">Clergé</h2>
          {pretres.length === 0 && <p className="text-sm text-gray-400">Aucun prêtre assigné</p>}
          {pretres.map(
            (p) =>
              p && (
                <Link
                  key={p.id}
                  href={`/dioceses/${slug}/personnes/${p.id}`}
                  className="block text-sm mb-2 text-primary hover:underline"
                >
                  {p.prenom} {p.nom} — {roleLabels[p.role]}
                </Link>
              )
          )}
        </div>
      </div>

      {/* Églises */}
      {paroisse.eglises.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Églises et chapelles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {paroisse.eglises.map((e) => (
              <div key={e.id} className="border rounded-xl p-4 bg-card-bg">
                <h3 className="font-semibold">{e.nom}</h3>
                <p className="text-xs text-gray-400 capitalize">{e.type}</p>
                {e.adresse && <p className="text-sm text-gray-500 mt-1">📍 {e.adresse}</p>}
                {e.horaires && <p className="text-sm text-gray-600 mt-1">🕐 {e.horaires}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
