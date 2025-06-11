import { ethers } from "ethers";
import abi from "../utils/abi.json";

export default async function mintNFT(nombre, fechaString, arrayString) {
  try {
    if (!window.ethereum) {
      alert("Necesitás MetaMask");
      return;
    }

    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_NFT_TPI_CONTRACT_ADDRESS, abi, signer);

    const address1 = "0x96664195a728321F0F672B3BA29639eD727CE7a1"; //Address Pablo
    const address2 = "0x81Bce31CaB4F37DdC8561550Ee7eaa859ca50581"; //Address Daniel

    const tx = await contract.mintNFT(
      address1,
      `${nombre}`,
      fechaString,
      arrayString
    );

    await tx.wait();

    const tx2 = await contract.mintNFT(
      address2,
      `${nombre}`,
      fechaString,
      arrayString
    );

    await tx2.wait();

  } catch (err) {
    console.error(err);
	err.stack && console.error(err.stack);
	console.log(err.message);
    console.log("Error al mintear ❌");
  }
};