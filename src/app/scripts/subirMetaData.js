const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const { NFTStorage, File } = require("nft.storage");
const fs = require("fs");

// Inicializa el cliente con tu API Key
console.log("🔑 NFT_STORAGE_KEY:", process.env.NFT_STORAGE_KEY);
const client = new NFTStorage({ token: process.env.NFT_STORAGE_KEY });

export default async function subirMetadata(nombreAlumno, wallet, nftIds) {
  const fechaActual = new Date().toISOString().split("T")[0];

  // Ruta de la imagen
  try {
    console.log("📸 Subiendo imagen al NFT.Storage...");
    const imagePath = path.join(__dirname, '../assets/ferrotoken.png');
    const imageBuffer = await fs.promises.readFile(imagePath);

    // Metadata del NFT
    console.log("📝 Subiendo metadata al NFT.Storage...");
    const metadata = await client.store({
      name: "NFT TPI",
      description: "NFT del alumno generado dinámicamente",
      image: new File(
        [await fs.promises.readFile(imagePath)],
        "ferrotoken.png",
        { type: "image/png" }
      ),
      properties: {
        alumno: "Juan Pérez",
        fecha: new Date().toISOString(),
        address: "0xd614A872961Aa8213283464aFb00F9bfB938d7a1",
        nfts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    });

    console.log("✅ Metadata subida a IPFS!");
    console.log("📦 URI:", metadata.url);
    return metadata.url;
  } catch (error) {
    console.error("❌ Error al subir la metadata:");
    console.error("Mensaje:", error.message);
    console.error("Stack:", error.stack);
    throw error;
  }
}

// Ejecutá este bloque para probarlo directamente
if (require.main === module) {
  subirMetadata(
    "Juan Pérez",
    "0xd614A872961Aa8213283464aFb00F9bfB938d7a1",
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  );
}

module.exports = subirMetadata;
