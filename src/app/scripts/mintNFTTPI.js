import { ethers } from "ethers";
import tpiAbi from "../utils/tpiAbi.json";

export default async function mintNFT(nombre, fechaString, arrayString) {
  try {
    if (!window.ethereum) {
      alert("Necesitás MetaMask");
      return;
    }

    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_NFT_TPI_CONTRACT_ADDRESS, tpiAbi, signer);

    const addressPablo = "0x96664195a728321F0F672B3BA29639eD727CE7a1";
    const addressDaniel = "0x81Bce31CaB4F37DdC8561550Ee7eaa859ca50581";
    const addressNacho = "0xd614a872961aa8213283464afb00f9bfb938d7a1";
    const addressGuido = "0xdC9a1c08BF68571eD4990eC7B6De0A8fe77f09C6";
    const addressJoaco = "0xb3e143114D4de641A66C7df96B358E7944090628";

    const tx = await contract.mintNFT(
      addressGuido,
      `${nombre}`,
      fechaString,
      arrayString
    );

    await tx.wait();

    const tx2 = await contract.mintNFT(
      addressJoaco,
      `${nombre}`,
      fechaString,
      arrayString
    );

    await tx2.wait();

    alert("NFTs minteados con éxito ✅");


  } catch (err) {
    console.error(err);
	err.stack && console.error(err.stack);
	console.log(err.message);
    console.log("Error al mintear ❌");
  }
};