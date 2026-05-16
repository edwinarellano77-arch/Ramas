// Arreglo global donde se guardan los comandos
let comandos = [];

// Comandos iniciales (los que tenías hardcodeados antes)
comandos.push({
    nombre: "git init",
    descripcion: "Inicializa un nuevo repositorio local en la carpeta actual."
});
comandos.push({
    nombre: "git clone",
    descripcion: "Descarga una copia exacta de un repositorio remoto."
});
comandos.push({
    nombre: "git add",
    descripcion: "Prepara los cambios (staging) para ser incluidos en el próximo commit."
});

// Función que se ejecuta cuando se hace clic en "Agregar"
function agregarComando() {
    // 1. Leer los inputs
    let nombre = document.getElementById("inputComando").value;
    let descripcion = document.getElementById("inputDescripcion").value;

    // 2. Validar que no estén vacíos
    if (nombre === "" || descripcion === "") {
        alert("Debes llenar ambos campos");
        return;
    }

    // 3. Crear el objeto comando
    let comando = {
        nombre: nombre,
        descripcion: descripcion
    };

    // 4. Agregarlo al arreglo
    comandos.push(comando);

    // 5. Limpiar inputs
    document.getElementById("inputComando").value = "";
    document.getElementById("inputDescripcion").value = "";

    // 6. Repintar la lista
    pintarComandos();
}

// Función que dibuja todos los comandos en el contenedor
function pintarComandos() {
    let html = "";

    for (let i = 0; i < comandos.length; i++) {
        html = html + "<section class='comando'>" +
            "<h2>" + comandos[i].nombre + "</h2>" +
            "<p>" + comandos[i].descripcion + "</p>" +
            "</section>";
    }

    document.getElementById("contenedor").innerHTML = html;
}

// Pintar la lista inicial al cargar la página
pintarComandos();