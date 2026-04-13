import Link from "next/link";
import { getDiocese, getLieuxByDiocese, getPersonne, typeLieuLabels, typeLieuIcons } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function LieuxSpeciauxPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const diocese = getDiocese(slug);
  if (!diocese) notFound();

  const lieuxList = getLieuxByDiocese(diocese.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Lieux spéciaux — {diocese.nom}</h1>
      <p className="text-gray-500 mb-6">{lieuxList.length} lieu(x)</p>

      <div className="grid gap-4 md:grid-cols-2">
        {lieuxList.map((l) => (
          <Link
            key={l.id}
            href={`/dioceses/${slug}/lieux-speciaux/${l.id}`}
            className="block border rounded-xl p-5 hover:shadow-md transition-shadow bg-card-bg"
          >
            <h2 className="text-lg font-semibold text-primary">
              {typeLieuIcons[l.type] || "📍"} {l.nom}
            </h2>
            <p className="text-xs text-gray-400">{typeLieuLabels[l.type]}</p>
            {l.adresse && <p className="text-sm text-gray-500 mt-1">📍 {l.adresse}</p>}
            {l.description && <p className="text-sm text-gray-600 mt-1">{l.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
