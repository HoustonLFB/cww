"use client";

import dynamic from "next/dynamic";

const DioceseMap = dynamic(() => import("@/components/DioceseMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-gray-400">
      Chargement de la carte...
    </div>
  ),
});

export default function Home() {
  return (
    <div className="h-[calc(100vh-120px)]">
      <DioceseMap />
    </div>
  );
}
