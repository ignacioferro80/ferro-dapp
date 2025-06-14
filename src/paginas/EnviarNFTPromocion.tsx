"use client";

import React, { useState, useEffect } from "react";
import aprobado from "@/app/assets/aprobado.png";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import mintNFTPromocion from "@/app/scripts/mintNFTPromocion";
import Router from "next/router";

export default function EnviarNFTPromocion() {
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nombreAlumno.trim() && descripcion.trim()) {
      mintNFTPromocion(
        nombreAlumno,
        new Date().toLocaleDateString(),
        descripcion
      );
    }
  };

  return (
    <main className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-600 to-purple-900 text-white">
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 bg-gray-300 hover:bg-gray-300 cursor-pointer text-black  py-1 px-4 rounded shadow transition hover:scale-102 duration-300 tracking-widest"
      >
        Volver
      </button>
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-md mx-auto mt-10 relative">
        {/* Imagen */}
        <img
          src={aprobado.src}
          alt="Logo NFT"
          className="w-18 h-16 absolute top-4 left-4"
        />

        {/* Título */}
        <h2 className="text-3xl font-bold text-center mb-6 text-black">
          NFT Promoción
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <label htmlFor="nombre" className="mb-2 font-medium text-gray-700">
            Nombre del alumno:
          </label>
          <input
            type="text"
            id="nombre"
            value={nombreAlumno}
            onChange={(e) => setNombreAlumno(e.target.value)}
            className="border rounded-lg px-4 py-2 mb-4 w-full border-color-blue-300 shadow-inner text-black"
            required
            autoComplete="off"
          />

          <label htmlFor="nombre" className="mb-2 font-medium text-gray-700">
            Descripción de la promoción:
          </label>
          <input
            type="text"
            id="nombre"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="border rounded-lg px-4 py-2 mb-4 w-full border-color-blue-300 shadow-inner text-black"
            required
            autoComplete="off"
          />

          <button
            type="submit"
            className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 hover:scale-102 transition duration-300 cursor-pointer"
          >
            Generar NFT Promoción
          </button>
        </form>
      </div>
    </main>
  );
}
