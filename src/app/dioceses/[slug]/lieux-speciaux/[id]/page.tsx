import Link from "next/link";
import { getDiocese, getLieuSpecial, getPersonne, typeLieuLabels, typeLieuIcons, roleLabels } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function LieuSpecialDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const diocese = getDiocese(slug);
  const lieu = getLieuSpecial(id);
  if (!diocese || !lieu) notFound();

  const personnes = lieu.personnes.map(getPersonne).filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">
        {typeLieuIcons[lieu.type] || "📍"} {lieu.nom}
      </h1>
      <p className="text-sm text-gray-500 mb-6">{typeLieuLabels[lieu.type]}</p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-xl p-5 bg-card-bg">
          <h2 className="text-lg font-semibold mb-3">Informations</h2>
          {lieu.adresse && <p className="text-sm mb-1">📍 {lieu.adresse}</p>}
          {lieu.telephone && <p className="text-sm mb-1">📞 {lieu.telephone}</p>}
          {lieu.email && <p className="text-sm mb-1">✉️ {lieu.email}</p>}
          {lieu.siteWeb && (
            <p className="text-sm mb-1">
              🌐{" "}
              <a href={lieu.siteWeb} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {lieu.siteWeb}
              </a>
            </p>
          )}
          {lieu.description && <p className="text-sm text-gray-600 mt-3">{lieu.description}</p>}
        </div>

        {personnes.length > 0 && (
          <div className="border rounded-xl p-5 bg-card-bg">
            <h2 className="text-lg font-semibold mb-3">Personnes</h2>
            {personnes.map(
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
        )}
      </div>
    </div>
  );
}
