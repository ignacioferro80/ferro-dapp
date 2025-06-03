# Anotaciones - TRABAJO FINAL - dApp funcinoal

### FLUJO 1:

#### Home page:
- La wallet del cliente se conecta a la dApp
- Se listan todos sus NFTs tipo ERC-1155 que holdea
- Se podrán visualizar esos NFTs en detalle y sus variables de entorno (como hace la página actualmente)
- Debajo de la página habrá un botón que diga "Generar NFT de TP final PRUEBA"

Validaciones necesarias:
_a. Verificar que sean 10 NFTs distintos:_ 
  Usar ID/tokenURI o metadata.
_b. Validar que fueron emitidos antes del 28/05/25_:
  Acceder a la fecha de minteo: normalmente no está en el NFT directamente, pero se puede obtener:
    Con historial de eventos del contrato (mint) vía Alchemy o Etherscan.
    O si vos minteás con una fecha como atributo del metadata en el pasado.
_c. Verificar que no fueron transferidos:_
  Requiere consultar el historial de transferencias por token ID.
  Alchemy o Etherscan API → buscar si el token ID tuvo más de una transferencia (de la address del contrato a otra = mint, de ahí en adelante = retransferencia).

  🔧 Pseudocódigo resumido – tareas críticas

🟥 PSEUDOCÓDIGO: Validar si el usuario tiene los 10 NFTs de UNQ, emitidos antes del 28/05/25, sin transferencias

Para cada NFT en wallet del usuario {

- if token.contractAddress == dirección del contrato de UNQ:

  - fetch metadata del token (puede incluir tema)

  - fetch eventos de Transfer del token ID usando Etherscan o Alchemy

    - si hay solo un evento (mint) → ok

    - si hay más de uno → fue transferido → descartar

  - fetch fecha del evento de mint (timestamp del bloque)

    - if timestamp < 28/05/2025 → ok

    - else → descartar

if cantidad de NFTs válidos == 10:
→ mostrar botón de “Generar NFT TP FINAL PRUEBA”
else:
→ mostrar botón deshabilitado con opacidad

}

Si todas las condiciones se cumplen:
El botón “Generar NFT de TP final PRUEBA” se habilita visualmente (activo y sin opacidad).

#### Botón generación NFT:
- Si se cumplen las condiciones, el cliente podrá clickear el botón para generar ese NFT ya que cuenta con los criterios para aprobar la materia.
- Si no se cumplen, el cliente no podrá clickearlo y se verá con opacidad baja.
- Con el clickeo del botón, se generará un formulario para completar los datos del NFT a enviar.

- Los datos que tendrá el NFT serán:
  - Nombre cliente _(META DATA)_ → Input del cliente
  - Fecha _(VARIABLE INTERNA)_ → autogenerada en el momento de la creación del NFT.
  - Adress _(VARIABLE INTERNA)_  → se usa la que se conectó con la wallet
  - Titulo: NFT TP FINAL PRUEBA _(META DATA)_
  - Datos de los 10 NFTs (Tema y ID de cada NFT) _(META DATA)_ → se extraen de los 10 NFTs validados.
  - Imágen: Logo ferrocarril oeste _(META DATA)_
- Habrá finalmente un boton de enviar para enviar el NFT creado
Al presionar el botón de “Enviar”:

### Se ejecuta la lógica para mintear el nuevo NFT con los metadatos definidos

#### _Solución técnica:_

- Crear un contrato con función de mint que permita emitir NFTs desde frontend.

- Conexión del frontend a contrato: usar ethers.js
_Ethers.js: "Te permite conectar la wallet del usuario (MetaMask) y llamar funciones del contrato desde el frontend"._


Los NFTs “nuevos” a crear no implican desplegar nuevos contratos cada vez. Lo que se hace es:

- Usar un contrato ERC-1155 ya desplegado que soporte minting

- Desde el frontend (con ethers.js), llamar a la función mint() o mintBatch() del contrato

- Pasar los parámetros del NFT: to, tokenId, cantidad, y el URI con la metadata


🟥 PSEUDOCÓDIGO: Minteo de un NFT desde la página con ethers.js

{
  conectar con MetaMask:
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  definir instancia del contrato:
  const contract = new ethers.Contract(contractAddress, contractABI, signer)

  armar metadata del NFT (título, ID previos, imagen...):
  const metadata = {
    name: "TP FINAL PRUEBA",
    attributes: [...],
    image: "ipfs://...",
  }

  subir metadata a IPFS (opcional):
  const metadataURI = await subirAIPFS(metadata)

  llamar a función mint del contrato:
  await contract.mint(toAddress, tokenId, amount, metadataURI)
}

El NFT se emite directamente a la wallet address del usuario conectado (caso de prueba).
_Luego se modificará esto para que se le envie el NFT a quien defina el desarrollado_

Se podría guardar un registro interno si fuese necesario (off-chain o en una base).

### FLUJO 2:
- Solo los holders de ese NFT creado y enviado en el FLUJO 1 van a visualizar con opacidad y podrán presionar el botón "Promocionar"
_Esto se hace filtrando los NFTs actuales con ese título o id_

🟥 PSEUDOCÓDIGO: Verificar si el usuario posee el NFT TP FINAL PRUEBA (para habilitar botón Promocionar)

{
  conectar wallet y obtener address

  llamar a contract.balanceOf(address, idTPFinal)

  if balance > 0:
  → mostrar botón "Promocionar"
  else:
  → ocultar o deshabilitar botón
}

- Ese botón generará la creacion de un nuevo NFT, con los datos
  - Título _(VARIABLE INTERNA)_ → Llamado NFT PROMOCIÓN PRUEBA
  - Nombre _(VARIABLE INTERNA)_ → En base a la wallet se define el nombre del cliente (al saber de quien se trata segun la wallet)
  - Descripción _(META DATA)_ → A desarrollar por el cliente que lo genera

### _Soluciones técnicas_:

- Reutilizar el contrato del paso anterior.

- Volver a generar y subir la metadata.

- Habrá finalmente un boton de enviar para enviar el NFT creado
- El NFT debe ser enviado solamente al ÚNICO holder aclarado con su dirección de wallet (cliente)
_Luego se modificará esto para que se le envie el NFT a quien defina el desarrollado_

#
🧩 Resumen de prioridades (por importancia funcional y técnica)

🔺 CRÍTICAS (bloqueantes):

Validar 10 NFTs + unicidad + fechas de minteo + no retransferidos (flujo 1)

Contrato de minteo desde frontend (flujo 1 y 2)

Verificación de tenencia del NFT TP FINAL PRUEBA (flujo 2)

🔸 MEDIAS:

Formularios frontend

Generación de metadata

UI de botones y condiciones

🔹 BAJAS:

Estética final

Guardado en BD de eventos

Feedback visual de éxito
