import Link from "next/link";
import { getDiocese, getPersonnesByDiocese, roleLabels } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function PersonnesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const diocese = getDiocese(slug);
  if (!diocese) notFound();

  const personnesList = getPersonnesByDiocese(diocese.id);

  // Group by role
  const byRole = new Map<string, typeof personnesList>();
  personnesList.forEach((p) => {
    const list = byRole.get(p.role) || [];
    list.push(p);
    byRole.set(p.role, list);
  });

  const roleOrder = ["eveque", "eveque-auxiliaire", "vicaire-general", "doyen", "cure", "vicaire", "diacre", "aumonier", "superieur", "seminariste"];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Personnes — {diocese.nom}</h1>
      <p className="text-gray-500 mb-6">{personnesList.length} personne(s)</p>

      {roleOrder.map((role) => {
        const group = byRole.get(role);
        if (!group || group.length === 0) return null;
        return (
          <div key={role} className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-primary">{roleLabels[role] || role}s</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {group.map((p) => (
                <Link
                  key={p.id}
                  href={`/dioceses/${slug}/personnes/${p.id}`}
                  className="block border rounded-lg p-4 hover:shadow-md transition-shadow bg-card-bg"
                >
                  <p className="font-medium">{p.prenom} {p.nom}</p>
                  <p className="text-xs text-gray-400">{roleLabels[p.role]}</p>
                  {p.email && <p className="text-xs text-gray-500 mt-1">✉️ {p.email}</p>}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
