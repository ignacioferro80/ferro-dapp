import { ethers } from "ethers";
import abi from "../utils/abi.json";

export default async function mintNFT(nombre, fechaString, arrayString) {
	console.log("Minteando NFT con nombre:", nombre + ", fecha:", fechaString + ", array:", arrayString);
  try {
    if (!window.ethereum) {
      alert("Necesitás MetaMask");
      return;
    }

    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_NFT_TPI_CONTRACT_ADDRESS, abi, signer);

    const tx = await contract.mintNFT(
      `${nombre}`,
      fechaString,
      arrayString
    );

    await tx.wait(); // Esperar confirmación

    console.log("NFT minteado con éxito ✅");
  } catch (err) {
    console.error(err);
	err.stack && console.error(err.stack);
	console.log(err.message);
    console.log("Error al mintear ❌");
  }
};