"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { validarNFTsUNQ } from "@/app/scripts/validarNFTsUNQ";
import FullScreenSpinner from "./components/FullScreenSpinner";
import unqAbi from "@/app/utils/unqAbi.json";
import tpiAbi from "./utils/tpiAbi.json";
import promocionAbi from "./utils/promocionAbi.json";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [inputAddress, setInputAddress] = useState<string>("");
  const [nfts, setNfts] = useState<any[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<any | null>(null);
  const [nftUNQVariables, setNftUNQVariables] = useState<any>({});
  const [nftTPIVariables, setNftTPIVariables] = useState<any>({});
  const [nftPromocionVariables, setNftPromocionVariables] = useState<any>({});
  const [nftsValidos, setNftsValidos] = useState(false);
  const [fullScreenSpinner, setFullScreenSpinner] = useState(false);

  const router = useRouter();

  const provider = new ethers.providers.JsonRpcProvider(
    `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
  );
  const unqContract = new ethers.Contract(
    process.env.NEXT_PUBLIC_UNQ_CONTRACT_ADDRESS!,
    unqAbi,
    provider
  );

  useEffect(() => {
    if (walletAddress && window.ethereum) {
      (async () => {
        setInputAddress(walletAddress);
        fetchNFTs(walletAddress);
        const validos = await validarNFTsUNQ(walletAddress);
        setNftsValidos(validos);
      })();
    }
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setWalletAddress(account);
      } catch (err) {
        console.error("Error al conectar con MetaMask:", err);
      }
    } else {
      alert("Necesitás MetaMask para usar esta dApp");
    }
  };

  const fetchNFTs = async (address: string) => {
    setFullScreenSpinner(true);
    try {
      const response = await fetch(
        `https://eth-sepolia.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTs?owner=${address}`
      );
      const data = await response.json();
      for (const nft of data.ownedNfts) {
        if (
          nft.contract.address.toLowerCase() ===
          process.env.NEXT_PUBLIC_NFT_TPI_CONTRACT_ADDRESS!.toLowerCase()
        ) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contrato = new ethers.Contract(
            process.env.NEXT_PUBLIC_NFT_TPI_CONTRACT_ADDRESS!,
            tpiAbi,
            provider
          );

          const tokenId = nft.id.tokenId;

          let uri = await contrato.uri(tokenId);
          let uriHttp = uri.replace("ipfs://", "https://nftstorage.link/ipfs/");
          const imageUrl = uriHttp.replace(/\/[^/]+\.json$/, "/");

          nft.media = [{ gateway: imageUrl }];
          nft.title = "NFT TPI";
        } else if (
          nft.contract.address.toLowerCase() ===
          process.env.NEXT_PUBLIC_NFT_PROMOCION_CONTRACT_ADDRESS!.toLowerCase()
        ) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contrato = new ethers.Contract(
            process.env.NEXT_PUBLIC_NFT_PROMOCION_CONTRACT_ADDRESS!,
            promocionAbi,
            provider
          );

          const tokenId = nft.id.tokenId;

          let uri = await contrato.uri(tokenId);
          let uriHttp = uri.replace("ipfs://", "https://nftstorage.link/ipfs/");
          const imageUrl = uriHttp.replace(/\/[^/]+\.json$/, "/");

          nft.media = [{ gateway: imageUrl }];
          nft.title = "NFT Promoción";
        }
      }
      setNfts(data.ownedNfts || []);
      setFullScreenSpinner(false);
    } catch (err) {
      console.error("Error al obtener NFTs:", err);
    }
  };

  const handleSearch = () => {
    try {
      setWalletAddress(inputAddress);
    } catch (err) {
      console.error("Error al buscar NFTs:", err);
    }
  };

  const selectNFT = async (nft: any) => {
    setSelectedNFT(nft);
    if (
      nft.contract.address.toLowerCase() ===
      process.env.NEXT_PUBLIC_UNQ_CONTRACT_ADDRESS!.toLowerCase()
    ) {
      // Llamar al URI
      const tokenId = nft.id.tokenId;

      if (!unqContract) {
        console.error("El contrato no está inicializado.");
        return;
      }

      const result = await unqContract.datosDeClases(tokenId);

      setNftUNQVariables({
        clase: Number(result.clase),
        tema: result.tema,
        alumno: result.alumno,
      });
    } else if (
      nft.contract.address.toLowerCase() ===
      process.env.NEXT_PUBLIC_NFT_TPI_CONTRACT_ADDRESS!.toLowerCase()
    ) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contrato = new ethers.Contract(
        process.env.NEXT_PUBLIC_NFT_TPI_CONTRACT_ADDRESS!,
        tpiAbi,
        provider
      );

      const tokenId = nft.id.tokenId;
      const metadata = await contrato.metadatas(tokenId);

      setNftTPIVariables({
        nombre: metadata.nombreAlumno,
        fecha: metadata.fecha,
        idsVerificados: metadata.idsVerificados,
      });
    } else if (
      nft.contract.address.toLowerCase() ===
      process.env.NEXT_PUBLIC_NFT_PROMOCION_CONTRACT_ADDRESS!.toLowerCase()
    ) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contrato = new ethers.Contract(
        process.env.NEXT_PUBLIC_NFT_PROMOCION_CONTRACT_ADDRESS!,
        promocionAbi,
        provider
      );

      const tokenId = nft.id.tokenId;
      const metadata = await contrato.metadatas(tokenId);

      setNftPromocionVariables({
        nombre: metadata.nombre,
        fecha: metadata.fecha,
        descripcion: metadata.descripcion,
      });
    }
  };

  return (
    <main className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-800 to-[#a2c9f8] text-white">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 drop-shadow-lg">
        Buscador de NFTs
      </h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
        <button
          onClick={connectWallet}
          className="px-6 py-3 bg-white text-blue-800 font-semibold rounded-xl shadow-md hover:scale-102 cursor-pointer hover:bg-blue-100 transition-all duration-300"
        >
          Conectar con MetaMask
        </button>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            placeholder="Pegá una dirección de wallet"
            className="px-4 py-2 rounded-xl text-black w-72 shadow-inner bg-white border-color-blue-300"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 via-green-600 to-green-800 text-white rounded-xl hover:scale-102 cursor-pointer transition-all duration-300"
          >
            Buscar NFTs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-x-8 gap-y-6 justify-center">
        {walletAddress && nfts.length === 0 && (
          <p className="col-span-full text-center text-gray-200">
            No se encontraron NFTs para esta dirección.
          </p>
        )}
        {nfts.map((nft, index) => (
          <div
            key={index}
            onClick={() => selectNFT(nft)}
            className="cursor-pointer w-[280px] h-[200px] rounded-2xl p-4 flex flex-col justify-between items-center text-center shadow-lg backdrop-blur-md bg-white/20 border border-white/30 hover:scale-105 transition-transform duration-300"
          >
            {nft.media && nft.media[0]?.gateway ? (
              <img
                src={nft.media[0].gateway}
                alt={nft.title || "NFT"}
                width={300}
                height={300}
                className="w-full h-[120px] object-contain mb-2"
              />
            ) : (
              <p className="w-full h-[120px] flex items-center justify-center text-gray-200 text-sm italic mb-2">
                Sin imagen disponible
              </p>
            )}
            <p className="text-sm font-semibold text-white drop-shadow">
              {nft.title || "NFT"}
            </p>
          </div>
        ))}
      </div>

      {walletAddress && (
        <div
          className={`flex flex-col md:flex-row justify-center items-center
        }`}
        >
          <button
            className={`w-70 gap-4 mb-6 px-6 py-3 m-10 font-semibold rounded-xl shadow-md cursor-pointer
        ${
          nftsValidos
            ? "backdrop-blur-md bg-blue-200 border border-white/30 rounded-xl px-6 py-2 shadow-md hover:scale-105 transition-all duration-300"
            : "bg-gray-200 text-gray-500"
        }`}
            disabled={!nftsValidos}
            onClick={() => {
              router.push(`envio-nft?address=${walletAddress}`);
              setFullScreenSpinner(true);
            }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-800 font-semibold">
              🚀 Enviar NFT TPI Integrador
            </span>
          </button>

          <button
            className={`w-70 gap-4 mb-6 px-6 py-3 m-10 font-semibold rounded-xl shadow-md cursor-pointer backdrop-blur-md bg-blue-200 border border-white/30 rounded-xl px-6 py-2 shadow-md hover:scale-105 transition-all duration-300`}
            onClick={() => {
              router.push(`envio-nft-promocion?address=${walletAddress}`);
              setFullScreenSpinner(true);
            }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-800 font-semibold">
              ⭐ Enviar NFT TPI Promoción
            </span>
          </button>
        </div>
      )}

      <AnimatePresence>
        {selectedNFT && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-white/30 backdrop-blur-xl p-6 shadow-2xl z-50"
            >
              <button
                onClick={() => setSelectedNFT(null)}
                className="absolute top-4 left-4 text-white text-xl hover:text-red-400 transition cursor-pointer"
              >
                ✕
              </button>

              {selectedNFT.contract.address.toLowerCase() ===
              process.env.NEXT_PUBLIC_UNQ_CONTRACT_ADDRESS!.toLowerCase() ? (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    {selectedNFT.title || "NFT seleccionado"}
                  </h2>
                  {selectedNFT.media?.[0]?.gateway && (
                    <img
                      src={selectedNFT.media[0].gateway}
                      alt={selectedNFT.title}
                      width={400}
                      height={400}
                      className="rounded-xl mx-auto"
                    />
                  )}
                  <div className="m-6 space-y-4 text-sm text-white text-opacity-90 leading-relaxed font-light">
                    <p>
                      <strong>📝 Descripción:</strong>{" "}
                      {selectedNFT.description || "Sin descripción"}
                    </p>
                    <p>
                      <strong>🧐 Clase:</strong>{" "}
                      {nftUNQVariables.clase || "N/A"}
                    </p>
                    <p>
                      <strong>✏ Tema:</strong> {nftUNQVariables.tema || "N/A"}
                    </p>
                    <p>
                      <strong>🧑 Alumno:</strong>{" "}
                      {nftUNQVariables.alumno || "N/A"}
                    </p>
                  </div>
                </div>
              ) : selectedNFT.contract.address.toLowerCase() ===
                process.env.NEXT_PUBLIC_NFT_TPI_CONTRACT_ADDRESS!.toLowerCase() ? (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    {selectedNFT.contractMetadata.name || "NFT seleccionado"}
                  </h2>
                  <img
                    src={selectedNFT.media[0].gateway}
                    alt={"NFT TPI"}
                    width={400}
                    height={400}
                    className="rounded-xl mx-auto"
                  />
                  <div className="m-6 space-y-4 text-sm text-white text-opacity-90 leading-relaxed font-light">
                    <p>
                      <strong>🧑 Nombre del alumno:</strong>{" "}
                      {nftTPIVariables.nombre || "N/A"}
                    </p>
                    <p>
                      <strong>📅 Fecha de entrega:</strong>{" "}
                      {nftTPIVariables.fecha || "N/A"}
                    </p>
                    <p>
                      <strong>🔖 IDs de tokens de clases:</strong>{" "}
                      {nftTPIVariables.idsVerificados || "N/A"}
                    </p>
                  </div>
                </div>
              ) : selectedNFT.contract.address.toLowerCase() ===
                process.env.NEXT_PUBLIC_NFT_PROMOCION_CONTRACT_ADDRESS!.toLowerCase() ? (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    {selectedNFT.title || "NFT seleccionado"}
                  </h2>
                  <img
                    src={selectedNFT.media[0].gateway}
                    alt={"NFT Promoción"}
                    width={400}
                    height={400}
                    className="rounded-xl mx-auto"
                  />
                  <div className="m-6 space-y-4 text-sm text-white text-opacity-90 leading-relaxed font-light">
                    <p>
                      <strong>🧑 Nombre del alumno:</strong>{" "}
                      {nftPromocionVariables.nombre || "N/A"}
                    </p>
                    <p>
                      <strong>📅 Fecha de emisión:</strong>{" "}
                      {nftPromocionVariables.fecha || "N/A"}
                    </p>
                    <p>
                      <strong>📝 Descripción:</strong>{" "}
                      {nftPromocionVariables.descripcion || "N/A"}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    {selectedNFT.title || "NFT seleccionado"}
                  </h2>
                  <div className="m-6 space-y-4 text-sm text-white text-opacity-90 leading-relaxed font-light">
                    <p>
                      <strong>🔖 Token ID:</strong>{" "}
                      {Number(selectedNFT.id?.tokenId) || "N/A"}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <FullScreenSpinner visible={fullScreenSpinner} />
    </main>
  );
}
