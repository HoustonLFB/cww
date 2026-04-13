import Link from "next/link";
import { getDiocese, getDoyennesByDiocese, getPersonne, getEnsembleParoissial } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function DoyennesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const diocese = getDiocese(slug);
  if (!diocese) notFound();

  const doyennesList = getDoyennesByDiocese(diocese.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Doyennés — {diocese.nom}</h1>
      <div className="grid gap-4">
        {doyennesList.map((d) => {
          const doyen = getPersonne(d.doyen);
          return (
            <Link
              key={d.id}
              href={`/dioceses/${slug}/doyennes/${d.id}`}
              className="block border rounded-xl p-5 hover:shadow-md transition-shadow bg-card-bg"
            >
              <h2 className="text-lg font-semibold text-primary">{d.nom}</h2>
              {doyen && <p className="text-sm text-gray-600">Doyen : {doyen.prenom} {doyen.nom}</p>}
              <p className="text-xs text-gray-400 mt-1">{d.ensemblesParoissiaux.length} ensemble(s) paroissial(aux)</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
