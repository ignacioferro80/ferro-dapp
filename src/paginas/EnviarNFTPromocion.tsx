"use client";

import React, { useState, useEffect } from "react";
import aprobado from "@/app/assets/aprobado.png";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import FullScreenSpinner from "@/app/components/FullScreenSpinner";
import mintNFTPromocion from "@/app/scripts/mintNFTPromocion";
import Router from "next/router";

export default function EnviarNFTPromocion() {
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fullScreenSpinner, setFullScreenSpinner] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFullScreenSpinner(true);
    if (nombreAlumno.trim() && descripcion.trim()) {
      await mintNFTPromocion(
        nombreAlumno,
        new Date().toLocaleDateString(),
        descripcion
      );
    }
    setFullScreenSpinner(false);
  };

  return (
    <main className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-800 to-[#a2c9f8] text-white">
      <button
        onClick={()=> {router.push("/"); setFullScreenSpinner(true);}}
        className="absolute top-6 left-6 bg-gray-300 hover:bg-gray-300 cursor-pointer text-black  py-1 px-4 rounded shadow transition hover:scale-102 duration-300 tracking-widest"
      >
        Volver
      </button>
      <div className="shadow-lg backdrop-blur-md bg-white/20 border border-white/30 shadow-xl rounded-2xl p-6 max-w-md mx-auto mt-10 relative">
        {/* Imagen */}
        <img
          src={aprobado.src}
          alt="Logo NFT"
          className="w-18 h-16 absolute top-4 left-4"
        />

        {/* Título */}
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-200">
          NFT Promoción
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <label htmlFor="nombre" className="mb-2 font-medium text-gray-200">
            Nombre del alumno:
          </label>
          <input
            type="text"
            id="nombre"
            value={nombreAlumno}
            onChange={(e) => setNombreAlumno(e.target.value)}
            className="border rounded-lg px-4 py-2 mb-4 w-full border-color-blue-300 shadow-inner text-gray-200"
            required
            autoComplete="off"
          />

          <label htmlFor="nombre" className="mb-2 font-medium text-gray-200">
            Descripción de la promoción:
          </label>
          <input
            type="text"
            id="nombre"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="border rounded-lg px-4 py-2 mb-4 w-full border-color-blue-300 shadow-inner text-gray200"
            required
            autoComplete="off"
          />

          <button
            type="submit"
            className="backdrop-blur-md bg-blue-200 border border-white/30 rounded-xl px-6 py-2 shadow-md hover:scale-105 transition-all duration-300 text-white px-6 py-2 rounded-lg cursor-pointer"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-800 font-semibold">
              ⭐ Generar NFT Promoción
            </span>
          </button>
        </form>
      </div>
      <FullScreenSpinner visible={fullScreenSpinner} />
    </main>
  );
}
