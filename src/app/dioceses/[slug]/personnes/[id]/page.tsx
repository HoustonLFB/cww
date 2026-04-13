import { getDiocese, getPersonne, roleLabels } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function PersonneDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const diocese = getDiocese(slug);
  const personne = getPersonne(id);
  if (!diocese || !personne) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">
        {personne.prenom} {personne.nom}
      </h1>
      <p className="text-sm text-primary font-medium mb-6">{roleLabels[personne.role]}</p>

      <div className="border rounded-xl p-5 bg-card-bg">
        <h2 className="text-lg font-semibold mb-3">Contact</h2>
        {personne.email && <p className="text-sm mb-1">✉️ {personne.email}</p>}
        {personne.telephone && <p className="text-sm mb-1">📞 {personne.telephone}</p>}
        {personne.notes && <p className="text-sm text-gray-500 mt-3">{personne.notes}</p>}
      </div>
    </div>
  );
}
