"use client";

import { useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";

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
  const [nftVariables, setNftVariables] = useState<any>({});

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setWalletAddress(account);
        setInputAddress(account);
        fetchNFTs(account);
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
        `https://eth-sepolia.g.alchemy.com/nft/v2/Nlzylkya5AxqJTje7TUxxLwLeJbF5Ed6/getNFTs?owner=${address}`
      );
      const data = await response.json();
      setNfts(data.ownedNfts || []);
    } catch (err) {
      console.error("Error al obtener NFTs:", err);
    }
  };

  const handleSearch = () => {
    try {
      fetchNFTs(inputAddress);
    } catch (err) {
      console.error("Error al buscar NFTs:", err);
    }
  };

  const selectNFT = async (nft: any) => {
    setSelectedNFT(nft);
    // Conectarse a Sepolia
    const provider = new ethers.JsonRpcProvider(
      "https://eth-sepolia.g.alchemy.com/v2/Nlzylkya5AxqJTje7TUxxLwLeJbF5Ed6"
    );

    // Dirección del contrato
    const contractAddress = nft.contract.address;

    // ABI mínimo necesario para ERC-1155
    const abi = [
      // ABI solo con la función que necesitás
      {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "datosDeClases",
        outputs: [
          { internalType: "uint256", name: "clase", type: "uint256" },
          { internalType: "string", name: "tema", type: "string" },
          { internalType: "address", name: "alumno", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

    // Instancia del contrato
    const contract = new ethers.Contract(contractAddress, abi, provider);
    // Llamar al URI
    const tokenId = nft.id.tokenId;

    const result = await contract.datosDeClases(tokenId);

    setNftVariables({
      clase: Number(result.clase),
      tema: result.tema,
      alumno: result.alumno,
    });
  };

  return (
    <main className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-600 to-purple-900 text-white">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 drop-shadow-lg">
        Buscador de NFTs
      </h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
        <button
          onClick={connectWallet}
          className="px-6 py-3 bg-white text-blue-800 font-semibold rounded-xl shadow-md hover:scale-105 hover:bg-blue-100 transition-all duration-300"
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
            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all"
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
            className="cursor-pointer bg-white text-black rounded-xl p-4 shadow-lg hover:scale-105 transition-transform duration-300"
          >
            {nft.media && nft.media[0]?.gateway ? (
              <Image
                src={nft.media[0].gateway}
                alt={nft.title || "NFT"}
                width={300}
                height={300}
                className="rounded-lg object-cover w-full h-auto"
              />
            ) : (
              <p>Sin imagen</p>
            )}
            <p className="mt-2 text-sm font-medium text-center">
              {nft.title || "NFT"}
            </p>
          </div>
        ))}
      </div>

      {selectedNFT && (
        <div className="mt-10 bg-white text-black rounded-xl p-6 shadow-xl max-w-3xl mx-auto">
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

          <div className="mt-4 space-y-2 text-sm">
            <p>
              <strong>Descripción:</strong>{" "}
              {selectedNFT.description || "Sin descripción"}
            </p>
            <p>
              <strong>Token ID:</strong> {Number(selectedNFT.id?.tokenId) || "N/A"}
            </p>
            <p>
              <strong>Contrato:</strong> {selectedNFT.contract?.address}
            </p>

            <p>
              <strong>Tema:</strong> {nftVariables.tema || "N/A"}
            </p>

            <p>
              <strong>Clase:</strong> {nftVariables.clase || "N/A"}
            </p>

            <p>
              <strong>Alumno:</strong> {nftVariables.alumno || "N/A"}
            </p>

          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setSelectedNFT(null)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
