"use client";
import EnviarNFTPromocion from "@/paginas/EnviarNFTPromocion";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <EnviarNFTPromocion />;
    </Suspense>
  );
}
