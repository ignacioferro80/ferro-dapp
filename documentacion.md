# 🎓 Proyecto TPI - Tokens NFT en Blockchain

## Ignacio Ferro - Introducción a Blockchain - 2025s1

---

Este proyecto tiene como objetivo diseñar y desarrollar una aplicación descentralizada (dApp) que permita a los usuarios obtener, visualizar e interactuar con **NFTs académicos** obtenidos por cumplir con condiciones específicas en la materia.

---

## 🛠️ Stack Tecnológico

|      Herramienta        | Uso |
|-------------------------|-----|
| **Solidity**            | Contratos inteligentes (ERC-1155) |
| **Hardhat**             | Testing y despliegue |
| **IPFS (NFT.Storage)**  | Almacenamiento de metadata e imágenes |
| **Next.js**             | Frontend web (React) |
| **Alchemy**             | Infraestructura blockchain (API de NFTs) |
| **Ethers.js**           | Interacción con contratos desde el frontend |

---

## 🧠 FLUJO 1. NFT TPI

### 🏠 Home Page:

La wallet del usuario se conecta automáticamente a la dApp.

Se listan todos los NFTs ERC-1155 que el usuario posee.

### ✅ Validaciones para activar el botón "Enviar NFT TPI":

El botón inferior de la página está habilitado solo si se cumplen las siguientes condiciones:

- El usuario posee **10 NFTs diferentes** representando cursadas de la materia.

- Dichos NFTs fueron emitidos **antes del 28/05/2025** (fecha de la última clase antes del TPI).

- Los NFTs **no fueron transferidos**.

### ✅ Lógica de validación:

Para esta validación se optó por realizar una consulta a la API de **Alchemy** creada especificamente para este proyecto, en donde se pueden realizar consultar pasando como parámetro una wallet.
La consulta que se reliza para obtener los datos de todas las transferencias de una wallet es la siguiente:
`https://eth-sepolia.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getNFTs?owner=${address}`
Donde **ALCHEMY_API_KEY** es la clave privada del proyecto alchemy creado.

De esta forma obtenemos los NFTs _"holdeados"_ por la wallet **address**, y asi por cada NFT hacer la segunda consulta de tipo `POST https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, donde pasamos como parámetros los datos de los NFT de la UNQ, los cuales son:
`params: [
    {
      fromBlock: "0x0",
      toBlock: "latest",
      toAddress: address,
      contractAddresses: [UNQ_CONTRACT_ADDRESS],
      category: ["erc1155"],
      withMetadata: true,
      excludeZeroValue: false,
    },
]`
Asi es como obtenemos los datos de transferencia de cada NFT, para verificar que sea **"TransferSingle"** y que haya sido minteado antes de **"1748380800"**, el cual es valor en digitos para la fecha "28/05/25"

### 🖱 Interacción del Usuario:

- Si se cumplen las condiciones, el cliente podrá clickear el botón para generar ese NFT ya que cuenta con los criterios para aprobar la materia.
- Si no se cumplen, el cliente no podrá clickearlo y se verá con opacidad baja.

_💡 Sugerencia!: Hacer la validación **en el mismo contrato** de minteo del NFT TPI. Es mucho **más facil** acceder a la wallet del cliente mediante el "minteo" de un NFT antes que hacer consultas a una API directamente desde el apartado **Front** de la dApp_

### 📝 Página de Mint del NFT TPI

- Con el clickeo del botón, se **redireccionará** al cliente a una nueva página para generar un **NFT del TPI**.
- La página contiene un formulario con un solo campo, donde se le pide el nombre al alumno que busca **entregar** su NFT y un botón para **mintear** el mismo.
- Al clickear el botón, se continuará la transferencia en la pestaña 🦊 **Metamask** del cliente y así enviar el NFT TPI a los profesores de la materia.

_💡 Bonus: Esta página contiene la misma validación de NFTs que se realiza en la Home page, y se ejecuta obteniendo la dirección de la wallet del cliente obtenida en el "path" de la URL. Por lo tanto, si un usuario sin NFTs válidos de la UNQ, fuerza la URL introduciendo su wallet en la misma, será automáticamente redirigido a la Home page_

#### 🧾 Los datos que contiene el NFT TPI minteado son:
  - **Titulo**: NFT TPI _(META DATA)_
  - **Imágen**: _(META DATA)_
  - **Nombre**: _(VARIABLE INTERNA)_ → Input del cliente
  - **Fecha**: _(VARIABLE INTERNA)_ → autogenerada en el momento de la creación del NFT.
  - **IDs de los 10 NFTs**: _(VARIABLE INTERNA)_ → se extraen de los 10 NFTs validados.

### 🔍 _Solución técnica:_

- Desde el **frontend** (con ethers.js), se llama a la función **mintNFTPI()** que recibe los parametros:
- `nombre` → Input del alumno que minteo el NFT
- `fechaString` → Fecha actual pasado a string para pasar al contrato
- `arrayString` → El array con los IDs de los NFTs de la materia hecho string

La función **mintNFTPI()** contiene el **_ABI_** del contrato que mintea el NFT, e importa **ethers** para asi junto con el ABI y el provider de ethers obtener el contrato para mintear el NFT ejecutando la función mintNFT() dentro del mismo.

---

## 🧠 FLUJO 2. NFT Promoción
Desde la **Home page** se puede visualizar un segundo botón para generar un **NFT de promoción**.

### 📝 Página de Mint de NFT Promoción
Al **clickear** el botón, el cliente es redirigido a una página similar a la del flujo 1, donde es capaz de **mintear** un NFT para promocionar a un alumno en particular. 

La página cuenta con un formulario con **dos** campos: El **nombre** del alumno a promocionar y una **descripción** para informar sobre la cursada o dejar un mensaje de aprobación.

#### 🧾 Los datos que contiene el NFT Promocion son:
  - **Título**: _(META DATA)_
  - **Imágen**: _(META DATA)_
  - **Nombre**: _(VARIABLE INTERNA)_ → Input del cliente que promociona escribiendo el nombre del alumno
  - **Descripción**: _(VARIABLE INTERNA)_ → Input desarrollar por el cliente que lo genera

Al clickear el botón para generar el NFT Promoción, se continuará la transferencia en la pestaña 🦊 **Metamask** del cliente y así enviar el NFT a al alumno promocionado.

### 🔍 _Soluciones técnicas_:

- 💡 **Validación** desde el contrato:
-      A diferencia del flujo anterior, en este caso la validación ocurre **dentro del contrato**, que verifica que la wallet del usuario sea **owner** de un NFT TPI, lo cual prueba que el cliente **recibió** el NFT del trabajo integrador.

- 💡 **Reutilizar** el contrato del paso anterior:
-     El contrato del minteo de este NFT está inspirado en el contrato del NFT TPI, pero con el extra de **validar** en el mismo minteo que la wallet ingresada es **holder** del NFT TPI para proceder con el minteo. La decision de validar de esta forma fue aprendida por el **gran esfuerzo** que tomó realizar validaciones en el mismo Front-End de la página web.

- La página funciona de la misma manera que la página del flujo 1. Se llama a una función `mintNFTPromocion` La cual pasa como parámetros `nombre`, `fechaString` y `descripción`. 

- La función utiliza el **ABI** del NFT Promocion y el `provider` de **ethers** para llamar al contrato del NFT y asi **validar y mintear** el NFT al alumno.

_💡 Importante!: El contrato del NFT tiene una práctica no recomendable, la cual es introducir la wallet a mintear en el mismo contrato. ¿Qué es lo más recomendable? Incluir un parámetro extra como se realiza en el flujo 1 para introducir la dirección a la que se busca mintear._

---

## 🎉 Resultado final:

Una vez minteado, el NFT de Promoción es enviado a la wallet del alumno como validación de su promoción en la materia.
