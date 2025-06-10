import { ethers } from "ethers";
import abi from "../utils/abi.json"; // Asegúrate de que la ruta sea correcta

const contractAddress = "0x73f8Fb7869FC20bBC328436B9798B8EE92B19bD8";

export default async function mintNFT(nombre) {
	console.log("Minting NFT with name:", nombre);
  try {
    // Conectarse a MetaMask
    if (!window.ethereum) {
      alert("Necesitás MetaMask");
      return;
    }

    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Llamamos a mintNFT con cualquier dato simple
    const tx = await contract.mintNFT(
      `${nombre}`,
      "10/06/2025",
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // Ejemplo de array fijo
    );

    document.getElementById("status").innerText = "Minteando... Esperá";

    await tx.wait(); // Esperar confirmación

    document.getElementById("status").innerText = "NFT minteado con éxito ✅";
  } catch (err) {
    console.error(err);
	err.stack && console.error(err.stack);
	console.log(err.message);
    document.getElementById("status").innerText = "Error al mintear ❌";
  }
};