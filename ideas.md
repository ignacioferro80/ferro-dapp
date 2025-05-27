# Anotaciones - TRABAJO FINAL - dApp funcinoal

### FLUJO 1:
##### Home page:
- La wallet del alumno se conecta a la dApp
- Se listan todos sus NFTs tipo 1155 que holdea
- Se podrán visualizar esos NFTs en detalle y sus variables de entorno (como hace la página al dia del 27/05)
- Debajo de la página habrá un botón que diga "Generar NFT de TP final"
- Se deben cumplir las siguientes condiciones:
  - Deben haber 10 NFTs de las distintas clases de la materia
  - Tienen que haber sido emitidos ANTES del 28/05/25
  - No deben haber sido retransferidos
##### Botón generación NFT:
- Si se cumplen las condiciones, el alumno podrá clickear el botón para generar ese NFT ya que cuenta con los criterios para aprobar la materia.
- Si no se cumplen, el alumno no podrá clickearlo y se verá con opacidad baja.
- Con el clickeo del botón, se generará un formulario para completar los datos del NFT a enviar.
- Los datos que tendrá el NFT serán:
  - Nombre alumno _(VARIABLE INTERNA)_
  - Fecha _(VARIABLE INTERNA)_
  - Adress _(VARIABLE INTERNA)_ (Automática obtenida al principio, no se puede cambiar)
  - Titulo: NFT TP FINAL _(META DATA)_
  - Datos de los 10 NFTs (Lista con los temas) _(META DATA)_
  - Imágen: Logo ferrocarril oeste
- Habrá finalmente un boton de enviar para enviar el NFT creado
- El NFT debe ser enviado solamente a los holders aclarados con sus direcciones de wallets (profesores)

### FLUJO 2:
- Solo los holders de ese NFT creado y enviado en el FLUJO 1 van a visualizar con opacidad y podrán presionar el botón "Promocionar"
- Ese botón generará la creacion de un nuevo NFT, con los datos
  - Título _(META DATA)_
  - Nombre _(VARIABLE INTERNA)_
  - Descripción _(VARIABLE INTERNA)_ 
- Habrá finalmente un boton de enviar para enviar el NFT creado
- El NFT debe ser enviado solamente al ÚNICO holder aclarado con su dirección de wallet (alumno)
