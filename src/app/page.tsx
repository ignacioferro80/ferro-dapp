"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { validarNFTsUNQ } from "@/app/scripts/validarNFTsUNQ";
import unqAbi from "@/app/utils/unqAbi.json";
import tpiAbi from "./utils/tpiAbi.json";
import promocionAbi from "./utils/promocionAbi.json";

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
          let uriHttp = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
          const imageUrl = uriHttp.replace(/\/[^/]+\.json$/, "/");
          console.log(tokenId)
          console.log("Image URL:", uri);
          console.log(imageUrl);

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
          let uriHttp = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
          const imageUrl = uriHttp.replace(/\/[^/]+\.json$/, "/");

          nft.media = [{ gateway: imageUrl }];
          nft.title = "NFT Promoción";
        }
      }
      setNfts(data.ownedNfts || []);
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
    <main className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-600 to-purple-900 text-white">
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
            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 cursor-pointer transition-all"
          >
            Buscar NFTs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nfts.map((nft, index) => (
          <div
            key={index}
            onClick={() => selectNFT(nft)}
            className="cursor-pointer bg-white text-black rounded-xl p-4 shadow-lg hover:scale-102 transition-transform duration-300"
          >
            {nft.media && nft.media[0]?.gateway ? (
              <Image
                src={nft.media[0].gateway}
                alt={nft.title || "NFT"}
                width={300}
                height={300}
                className="rounded-lg object-cover w-full h-auto mx-auto"
              />
            ) : (
              <p className="text-gray-500">Sin imagen disponible</p>
            )}
            <p className="mt-2 text-sm font-medium text-center">
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
            ? "text-green-800 hover:scale-101 bg-green-100 hover:bg-green-200 transition-all duration-600"
            : "bg-gray-200 text-gray-500"
        }`}
            disabled={!nftsValidos}
            onClick={() => {
              router.push(`envio-nft?address=${walletAddress}`);
            }}
          >
            Enviar NFT TP Integrador
          </button>

          <button
            className={`w-70 gap-4 mb-6 px-6 py-3 m-10 font-semibold rounded-xl shadow-md cursor-pointer text-white hover:scale-101 bg-violet-500 hover:bg-violet-400 transition-all duration-600`}
            onClick={() => {
              router.push(`envio-nft-promocion?address=${walletAddress}`);
            }}
          >
            Enviar NFT Promoción
          </button>
        </div>
      )}

      {selectedNFT && (
        <div className="mt-10 bg-white text-black rounded-xl p-6 shadow-xl max-w-3xl mx-auto">
          <div className="mt-4 space-y-2 text-sm">
            {selectedNFT.contract.address.toLowerCase() ===
            process.env.NEXT_PUBLIC_UNQ_CONTRACT_ADDRESS!.toLowerCase() ? (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-center">
                  {selectedNFT.title || "NFT seleccionado"}
                </h2>
                {selectedNFT.media?.[0]?.gateway && (
                  <Image
                    src={selectedNFT.media[0].gateway}
                    alt={selectedNFT.title}
                    width={400}
                    height={400}
                    className="rounded-xl mx-auto"
                  />
                )}
                <p>
                  <strong>Descripción:</strong>{" "}
                  {selectedNFT.description || "Sin descripción"}
                </p>
                <p>
                  <strong>Clase:</strong> {nftUNQVariables.clase || "N/A"}
                </p>
                <p>
                  <strong>Tema:</strong> {nftUNQVariables.tema || "N/A"}
                </p>
                <p>
                  <strong>Alumno:</strong> {nftUNQVariables.alumno || "N/A"}
                </p>
              </div>
            ) : selectedNFT.contract.address.toLowerCase() ===
              process.env.NEXT_PUBLIC_NFT_TPI_CONTRACT_ADDRESS!.toLowerCase() ? (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-center">
                  {selectedNFT.contractMetadata.name || "NFT seleccionado"}
                </h2>
                <Image
                  src={selectedNFT.media[0].gateway}
                  alt={"NFT TPI"}
                  width={400}
                  height={400}
                  className="rounded-xl mx-auto"
                />
                <p>
                  <strong>Nombre del alumno:</strong>{" "}
                  {nftTPIVariables.nombre || "N/A"}
                </p>
                <p>
                  <strong>Fecha de entrega:</strong>{" "}
                  {nftTPIVariables.fecha || "N/A"}
                </p>
                <p>
                  <strong>IDs de tokens de clases:</strong>{" "}
                  {nftTPIVariables.idsVerificados || "N/A"}
                </p>
              </div>
            ) : selectedNFT.contract.address.toLowerCase() ===
              process.env.NEXT_PUBLIC_NFT_PROMOCION_CONTRACT_ADDRESS!.toLowerCase() ? (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-center">
                  {selectedNFT.title || "NFT seleccionado"}
                </h2>
                <Image
                  src={selectedNFT.media[0].gateway}
                  alt={"NFT Promoción"}
                  width={400}
                  height={400}
                  className="rounded-xl mx-auto"
                />
                <p>
                  <strong>Nombre del alumno:</strong>{" "}
                  {nftPromocionVariables.nombre || "N/A"}
                </p>
                <p>
                  <strong>Fecha de emisión:</strong>{" "}
                  {nftPromocionVariables.fecha || "N/A"}
                </p>
                <p>
                  <strong>Descripción:</strong>{" "}
                  {nftPromocionVariables.descripcion || "N/A"}
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-center">
                  {selectedNFT.title || "NFT seleccionado"}
                </h2>
                <p>
                  <strong>Token ID:</strong>{" "}
                  {Number(selectedNFT.id?.tokenId) || "N/A"}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                setSelectedNFT(null);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
