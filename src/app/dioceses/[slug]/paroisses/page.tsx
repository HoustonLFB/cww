import Link from "next/link";
import { getDiocese, getParoissesByDiocese, getPersonne, getEnsembleParoissial, typeParoisseLabels } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function ParoissesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const diocese = getDiocese(slug);
  if (!diocese) notFound();

  const paroissesList = getParoissesByDiocese(diocese.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Paroisses — {diocese.nom}</h1>
      <p className="text-gray-500 mb-6">{paroissesList.length} paroisse(s)</p>

      <div className="grid gap-4 md:grid-cols-2">
        {paroissesList.map((p) => {
          const pretres = p.pretres.map(getPersonne).filter(Boolean);
          return (
            <Link
              key={p.id}
              href={`/dioceses/${slug}/paroisses/${p.id}`}
              className="block border rounded-xl p-5 hover:shadow-md transition-shadow bg-card-bg"
            >
              <h2 className="text-lg font-semibold text-primary">⛪ {p.nom}</h2>
              <p className="text-xs text-gray-400">{typeParoisseLabels[p.type]}</p>
              {p.adresse && <p className="text-sm text-gray-500 mt-1">📍 {p.adresse}</p>}
              {pretres.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  👤 {pretres.map((pr) => `${pr!.prenom} ${pr!.nom}`).join(", ")}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
