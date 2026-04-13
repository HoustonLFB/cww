import Link from "next/link";
import { dioceses, getPersonne, getParoissesByDiocese, getDoyennesByDiocese, roleLabels } from "@/lib/data";

export default function DiocesesListPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Diocèses de France</h1>
      <p className="text-gray-500 mb-8">{dioceses.length} diocèse(s) référencé(s)</p>

      <div className="grid gap-6 md:grid-cols-2">
        {dioceses.map((d) => {
          const eveque = getPersonne(d.eveque);
          const nbParoisses = getParoissesByDiocese(d.id).length;
          const nbDoyennes = getDoyennesByDiocese(d.id).length;

          return (
            <Link
              key={d.id}
              href={`/dioceses/${d.slug}`}
              className="block border rounded-xl p-6 hover:shadow-lg transition-shadow bg-card-bg"
            >
              <h2 className="text-xl font-bold text-primary mb-1">{d.nom}</h2>
              {eveque && (
                <p className="text-sm text-gray-600 mb-2">
                  {roleLabels[eveque.role] || eveque.role} : {eveque.prenom} {eveque.nom}
                </p>
              )}
              <div className="flex gap-4 text-xs text-gray-500 mt-3">
                <span>⛪ {nbParoisses} paroisse(s)</span>
                <span>📋 {nbDoyennes} doyenné(s)</span>
              </div>
              {d.adresse && <p className="text-xs text-gray-400 mt-2">📍 {d.adresse}</p>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
