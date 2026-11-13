// ======================================================================
// CATÁLOGO DE CURSOS
// Los datos se cargan desde un archivo JSON con fetch, async y await,
// se muestran como tarjetas y se pueden filtrar por texto y por turno.
// ======================================================================


// ---------- 1. Elementos de la página ----------
const busqueda = document.getElementById("busqueda");
const turno = document.getElementById("turno");
const recargar = document.getElementById("recargar");
const estado = document.getElementById("estado");
const catalogo = document.getElementById("catalogo");


// ---------- 2. Datos ----------
// Aquí se guardan los cursos una vez que llegan del archivo.
// Se declara con let porque, al recargar, se reemplaza por los datos nuevos.
let cursos = [];


// ---------- 3. Mostrar una lista de cursos como tarjetas ----------
// Recibe un array de objetos (los cursos a mostrar) y crea una tarjeta por cada uno.
function mostrarCursos(lista) {
    // Se vacía el contenedor antes de volver a dibujar.
    catalogo.innerHTML = "";

    if (lista.length === 0) {
        estado.textContent = "No hay cursos que coincidan con la búsqueda.";
    } else {
        estado.textContent = "Se muestran " + lista.length + " de " + cursos.length + " cursos.";
    }

    for (const curso of lista) {
        // Cada tarjeta es un elemento <article> con tres partes.
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta");

        // Título: el nombre del curso.
        const titulo = document.createElement("h2");
        titulo.textContent = curso.nombre;

        // Datos: área, turno y cupos (las propiedades del objeto se leen con un punto).
        const datos = document.createElement("p");
        datos.classList.add("datos");
        datos.textContent = curso.area + " · Turno " + curso.turno.toLowerCase() + " · " + curso.cupos + " cupos";

        // Descripción del curso.
        const descripcion = document.createElement("p");
        descripcion.textContent = curso.descripcion;

        // Se arma la tarjeta y se agrega al catálogo.
        tarjeta.appendChild(titulo);
        tarjeta.appendChild(datos);
        tarjeta.appendChild(descripcion);
        catalogo.appendChild(tarjeta);
    }
}


// ---------- 4. Filtrar los cursos ----------
// Arma un array nuevo solo con los cursos que cumplen los dos filtros.
function filtrarCursos() {
    // toLowerCase() pasa el texto a minúsculas, para que "redes" encuentre "Redes".
    const texto = busqueda.value.toLowerCase();
    const turnoElegido = turno.value;
    const resultado = [];

    for (const curso of cursos) {
        // El texto puede estar en el nombre O (||) en el área.
        const coincideTexto = curso.nombre.toLowerCase().includes(texto) ||
                              curso.area.toLowerCase().includes(texto);

        // Si no se eligió turno (""), se aceptan todos; si no, debe ser el mismo.
        const coincideTurno = turnoElegido === "" || curso.turno === turnoElegido;

        // Se agrega solo si cumple los dos filtros (&&).
        if (coincideTexto && coincideTurno) {
            resultado.push(curso);
        }
    }

    mostrarCursos(resultado);
}


// ---------- 5. Cargar los datos del archivo JSON ----------
// "async" indica que la función contiene operaciones que llevan tiempo.
// Dentro de ella, "await" espera el resultado de cada operación antes de seguir.
async function cargarCursos() {
    estado.textContent = "Cargando cursos...";
    catalogo.innerHTML = "";

    // try: se intenta ejecutar el bloque.
    // catch: si algo falla (el archivo no existe, el JSON está mal escrito, etc.),
    // se ejecuta este bloque en lugar de que la página deje de funcionar.
    try {
        // fetch pide el archivo. Devuelve una "respuesta" con información del pedido.
        const respuesta = await fetch("datos/cursos.json");

        // respuesta.ok es true si el pedido salió bien (código 200).
        // Si el archivo no existe (código 404), se genera un error con throw.
        if (!respuesta.ok) {
            throw new Error("No se encontró el archivo de datos (código " + respuesta.status + ").");
        }

        // respuesta.json() lee el contenido y lo convierte en un array de objetos.
        // También lleva tiempo, por eso se usa await.
        cursos = await respuesta.json();

        // Con los datos ya cargados, se muestran aplicando los filtros actuales.
        filtrarCursos();
    } catch (error) {
        // error.message contiene la descripción de lo que falló.
        estado.textContent = error.message;
    }
}


// ---------- 6. Eventos ----------
// Mientras se escribe en la búsqueda, se filtra (evento input).
busqueda.addEventListener("input", filtrarCursos);

// Al cambiar el turno, se filtra (evento change).
turno.addEventListener("change", filtrarCursos);

// El botón vuelve a pedir los datos al archivo.
recargar.addEventListener("click", cargarCursos);


// ---------- 7. Al abrir la página ----------
// Se cargan los datos por primera vez.
cargarCursos();
