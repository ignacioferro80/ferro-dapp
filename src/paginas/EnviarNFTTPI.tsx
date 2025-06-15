"use client";

import React, { useState, useEffect } from "react";
import ferrotoken from "@/app/assets/ferrotoken.png";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import mintNFT from "@/app/scripts/mintNFTTPI";

export default function EnviarNFTTPI() {
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [nfts, setNfts] = useState<any[]>([]);
  const [idsNfts, setIdsNfts] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const router = useRouter();

  const checkNFTsValidos = async (address: string) => {
    try {
      const response = await fetch(
        `https://eth-sepolia.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTs?owner=${address}`
      );
      const data = await response.json();
      setNfts(data.ownedNfts || []);
      if (data.ownedNfts.length > 0) {
        let nftsUNQ = 0;
        let nuevosIds: string[] = [];
        for (const nft of data.ownedNfts) {
          if (
            nft.contract.address.toLowerCase() ===
            process.env.NEXT_PUBLIC_UNQ_CONTRACT_ADDRESS!.toLowerCase()
          ) {
            nftsUNQ++;
            nuevosIds.push(nft.id.tokenId);
          }
        }
        setIdsNfts((prev) => [...prev, ...nuevosIds]);
        if (nftsUNQ < 10) {
          alert("No tenés suficientes NFTs válidos para enviar");
          router.push("/");
        }
      } else {
        alert("No se encontraron NFTs para el usuario");
        router.push("/");
      }
    } catch (err) {
      alert("La dirección ingresada no es válida o no tiene NFTs asociados.");
      router.push("/");
    }
  };

  useEffect(() => {
    if (address) {
      checkNFTsValidos(address);
    } else {
      alert("No se proporcionó una dirección válida.");
      router.push("/");
    }
  }, [address]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nombreAlumno.trim()) {
      const idsNaturales = idsNfts.map((id) => parseInt(id, 16));
      const stringIds = idsNaturales.join(",");
      mintNFT(nombreAlumno, new Date().toLocaleDateString(), stringIds);
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
          src={ferrotoken.src}
          alt="Logo NFT"
          className="w-16 h-16 absolute top-4 left-4"
        />

        {/* Título */}
        <h2 className="text-3xl font-bold text-center mb-6 text-black">
          NFT TPI
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

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 hover:scale-102 transition duration-300 cursor-pointer"
          >
            Generar NFT
          </button>
        </form>
      </div>
    </main>
  );
}
