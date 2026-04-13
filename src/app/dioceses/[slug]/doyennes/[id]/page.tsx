import Link from "next/link";
import { getDiocese, getDoyenne, getPersonne, getEnsembleParoissial, getParoisse } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function DoyenneDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const diocese = getDiocese(slug);
  const doyenne = getDoyenne(id);
  if (!diocese || !doyenne) notFound();

  const doyen = getPersonne(doyenne.doyen);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{doyenne.nom}</h1>
      {doyen && (
        <p className="text-gray-600 mb-6">
          Doyen :{" "}
          <Link href={`/dioceses/${slug}/personnes/${doyen.id}`} className="text-primary hover:underline">
            {doyen.prenom} {doyen.nom}
          </Link>
        </p>
      )}

      <h2 className="text-lg font-semibold mb-3">Ensembles paroissiaux</h2>
      <div className="grid gap-4">
        {doyenne.ensemblesParoissiaux.map((epId) => {
          const ep = getEnsembleParoissial(epId);
          if (!ep) return null;
          const moderateur = getPersonne(ep.cureModerateur);
          return (
            <div key={ep.id} className="border rounded-xl p-5 bg-card-bg">
              <h3 className="font-semibold text-primary">{ep.nom}</h3>
              {moderateur && (
                <p className="text-sm text-gray-600">
                  Curé modérateur :{" "}
                  <Link href={`/dioceses/${slug}/personnes/${moderateur.id}`} className="text-primary hover:underline">
                    {moderateur.prenom} {moderateur.nom}
                  </Link>
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {ep.paroisses.map((pId) => {
                  const p = getParoisse(pId);
                  if (!p) return null;
                  return (
                    <Link
                      key={p.id}
                      href={`/dioceses/${slug}/paroisses/${p.id}`}
                      className="text-xs bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
                    >
                      ⛪ {p.nom}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
