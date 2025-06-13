export const validarNFTTPI = async (address: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://eth-sepolia.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTs?owner=${address}`
    );
    const data = await response.json();
    const nfts = data.ownedNfts || [];

    const nftsTpi = nfts.filter(
      (nft: any) =>
        nft.contract.address.toLowerCase() ===
        process.env.NEXT_PUBLIC_NFT_TPI_CONTRACT_ADDRESS!.toLowerCase()
    );

    for (const nft of nftsTpi) {
      const tokenIdHex = nft.id.tokenId;
      const tokenId = BigInt(tokenIdHex).toString();

      const transfersResponse = await fetch(
        `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "alchemy_getAssetTransfers",
            params: [
              {
                fromBlock: "0x0",
                toBlock: "latest",
                toAddress: address,
                contractAddresses: [process.env.NEXT_PUBLIC_UNQ_CONTRACT_ADDRESS],
                category: ["erc1155"],
                withMetadata: true,
                excludeZeroValue: false,
              },
            ],
          }),
        }
      );


      const transfersData = await transfersResponse.json();
      const transfers = transfersData.result.transfers || [];

      // Filtrar transferencias solo de este tokenId
      const transfersDeEsteNFT = transfers.filter((t: any) => {
        const from = t.from;
        const to = t.to;
        const id = tokenId;


        return (
          from === "0x0000000000000000000000000000000000000000" &&
          to?.toLowerCase() === address.toLowerCase() &&
          id?.toString() === tokenId &&
          t.rawContract?.address?.toLowerCase() ===
            process.env.NEXT_PUBLIC_UNQ_CONTRACT_ADDRESS!.toLowerCase()
        );
      });


      // Verificar que fue mint (from === 0x0)
      const primerEvento = transfersDeEsteNFT[0];
      if (transfersDeEsteNFT.length === 0) return false;

      if (primerEvento.from !== "0x0000000000000000000000000000000000000000")
        return false;

      // Verificar que no fue retransferido
      const fueTransferido = transfersDeEsteNFT.some(
        (t: any, index: number) =>
          index > 0 && t.from?.toLowerCase() === address.toLowerCase()
      );
      if (fueTransferido) {
        return false;
      }


      // Verificar que fue minteado despues del 04/06/25
      const timestamp = Math.floor(
        new Date(primerEvento.metadata.blockTimestamp).getTime() / 1000
      );

      if (timestamp >= 1748995200) return false;


      return true;
    }
  } catch (err) {
    console.error("Error al validar NFTs UNQ:", err);
    return false;
  }
  return false;
};
