import { ethers } from "ethers";
import promocionAbi from "../utils/promocionAbi.json";

export default async function mintNFT(nombre, fechaString, descripcion) {
  try {
    if (!window.ethereum) {
      alert("Necesitás MetaMask");
      return;
    }

    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_NFT_PROMOCION_CONTRACT_ADDRESS, promocionAbi, signer);

    const tx = await contract.mintNFT(
      `${nombre}`,
      fechaString,
      descripcion
    );

    await tx.wait();

    alert("NFT minteado con éxito ✅");

  } catch (err) {
    console.error(err);
	err.stack && console.error(err.stack);
	console.log(err.message);
    console.log("Error al mintear ❌");
  }
};