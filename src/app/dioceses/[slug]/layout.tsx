import Link from "next/link";
import { getDiocese } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function DioceseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const diocese = getDiocese(slug);
  if (!diocese) notFound();

  const base = `/dioceses/${slug}`;

  const links = [
    { href: base, label: "Vue d'ensemble" },
    { href: `${base}/doyennes`, label: "Doyennés" },
    { href: `${base}/paroisses`, label: "Paroisses" },
    { href: `${base}/personnes`, label: "Personnes" },
    { href: `${base}/lieux-speciaux`, label: "Lieux spéciaux" },
  ];

  return (
    <div>
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 py-2 text-sm text-gray-500">
            <Link href="/dioceses" className="hover:underline">Diocèses</Link>
            <span>/</span>
            <span className="font-medium text-gray-900">{diocese.nom}</span>
          </div>
          <nav className="flex gap-1 overflow-x-auto pb-0">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-2 text-sm rounded-t-lg hover:bg-gray-100 whitespace-nowrap border-b-2 border-transparent hover:border-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
