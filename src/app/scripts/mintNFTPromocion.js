import { ethers } from "ethers";
import promocionAbi from "../utils/promocionAbi.json";
import { useRouter } from "next/navigation";

export default async function mintNFT(nombre, fechaString, descripcion) {
  try {
    if (!window.ethereum) {
      alert("Necesitás MetaMask");
      return;
    }

    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_NFT_PROMOCION_CONTRACT_ADDRESS,
      promocionAbi,
      signer
    );

    const tx = await contract.mintNFT(`${nombre}`, fechaString, descripcion);

    await tx.wait();

    alert("NFT minteado con éxito ✅");
  } catch (err) {

    const message = err?.info?.error?.message || err?.message || "";

    if (message.includes("No posees un NFT del contrato TPI")) {
      alert(
        "⛔ No podés mintear un NFT de promoción porque no poseés el NFT del TPI."
      );
    } else {
      alert("❌ Ocurrió un error inesperado al mintear el NFT.");
    }
  }
}
