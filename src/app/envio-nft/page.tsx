"use client";
import EnviarNFTTPI from "@/paginas/EnviarNFTTPI";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <EnviarNFTTPI />
    </Suspense>
  );
}
