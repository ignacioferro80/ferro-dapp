"use client";

import React, { useState, useEffect } from "react";
import ferrotoken from "@/app/assets/ferrotoken.png";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import FullScreenSpinner from "@/app/components/FullScreenSpinner";
import mintNFT from "@/app/scripts/mintNFTTPI";

export default function EnviarNFTTPI() {
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [nfts, setNfts] = useState<any[]>([]);
  const [idsNfts, setIdsNfts] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const [fullScreenSpinner, setFullScreenSpinner] = useState(false);
  const router = useRouter();

  const checkNFTsValidos = async (address: string) => {
    setFullScreenSpinner(true);
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
        setFullScreenSpinner(false);
        if (nftsUNQ < 10) {
          alert("No tenés suficientes NFTs válidos para enviar");
          setFullScreenSpinner(false);
          router.push("/");
        }
      } else {
        alert("No se encontraron NFTs para el usuario");
        setFullScreenSpinner(false);
        router.push("/");
      }
    } catch (err) {
      alert("La dirección ingresada no es válida o no tiene NFTs asociados.");
      setFullScreenSpinner(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFullScreenSpinner(true);
    if (nombreAlumno.trim()) {
      const idsNaturales = idsNfts.map((id) => parseInt(id, 16));
      const stringIds = idsNaturales.join(",");
      await mintNFT(nombreAlumno, new Date().toLocaleDateString(), stringIds);
    }
    setFullScreenSpinner(false);
  };

  return (
    <main className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-800 to-[#a2c9f8] text-white">
      <button
        onClick={() => {router.push("/"); setFullScreenSpinner(true);}}
        className="absolute top-6 left-6 bg-gray-300 hover:bg-gray-300 cursor-pointer text-black  py-1 px-4 rounded shadow transition hover:scale-102 duration-300 tracking-widest"
      >
        Volver
      </button>
      <div className="shadow-lg backdrop-blur-md bg-white/20 border border-white/30 shadow-xl rounded-2xl p-6 max-w-md mx-auto mt-10 relative">
        {/* Imagen */}
        <img
          src={ferrotoken.src}
          alt="Logo NFT"
          className="w-16 h-16 absolute top-4 left-4"
        />

        {/* Título */}
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-200">
          NFT TPI
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
            className="border rounded-lg px-4 py-2 mb-4 w-full border-color-gray-200 shadow-inner text-white"
            required
            autoComplete="off"
          />

          <button
            type="submit"
            className="backdrop-blur-md bg-blue-200 border border-white/30 rounded-xl px-6 py-2 shadow-md hover:scale-105 transition-all duration-300 text-white px-6 py-2 rounded-lg cursor-pointer"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-800 font-semibold">
              🚀 Generar NFT TPI
            </span>
          </button>
        </form>
      </div>
      <FullScreenSpinner visible={fullScreenSpinner} />
    </main>
  );
}
