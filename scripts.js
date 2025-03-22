const palabras = ["PAN", "SOL", "LUNA", "NUBE"];
const filas = 10;
const columnas = 12;
let seleccionadas = [];
let tablero;
let encontradas = [];

function generarTablero() {
    tablero = Array.from({ length: filas }, () => Array(columnas).fill(''));
    function colocarPalabra(palabra) {
        const direcciones = [[1, 0], [0, 1], [1, 1], [-1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1]];
        let colocado = false;
        while (!colocado) {
            const direccion = direcciones[Math.floor(Math.random() * direcciones.length)];
            let x = Math.floor(Math.random() * columnas);
            let y = Math.floor(Math.random() * filas);
            let dx = direccion[0], dy = direccion[1];
            let valido = true;
            for (let i = 0; i < palabra.length; i++) {
                if (x < 0 || y < 0 || x >= columnas || y >= filas || (tablero[y][x] && tablero[y][x] !== palabra[i])) {
                    valido = false;
                    break;
                }
                x += dx;
                y += dy;
            }
            if (valido) {
                x -= dx * palabra.length;
                y -= dy * palabra.length;
                for (let i = 0; i < palabra.length; i++) {
                    tablero[y][x] = palabra[i];
                    x += dx;
                    y += dy;
                }
                colocado = true;
            }
        }
    }
    palabras.forEach(palabra => colocarPalabra(palabra));
    for (let y = 0; y < filas; y++) {
        for (let x = 0; x < columnas; x++) {
            if (!tablero[y][x]) {
                tablero[y][x] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }
}

function renderizarTablero() {
    generarTablero();
    const contenedor = document.getElementById("juego-container");
    contenedor.innerHTML = "";
    tablero.forEach((fila, y) => {
        fila.forEach((letra, x) => {
            const celda = document.createElement("div");
            celda.classList.add("celda");
            celda.textContent = letra;
            celda.dataset.x = x;
            celda.dataset.y = y;
            celda.addEventListener("click", () => seleccionarCelda(celda));
            contenedor.appendChild(celda);
        });
    });
    mostrarListaPalabras();
}

function mostrarListaPalabras() {
    const lista = document.getElementById("palabras");
    lista.innerHTML = palabras.map(p => `<div id="palabra-${p}">${p}</div>`).join("<br>");
}

function seleccionarCelda(celda) {
    celda.classList.toggle("seleccionada");
    const coords = `${celda.dataset.x},${celda.dataset.y}`;
    if (seleccionadas.includes(coords)) {
        seleccionadas = seleccionadas.filter(c => c !== coords);
    } else {
        seleccionadas.push(coords);
    }
}

function verificarPalabra() {
    let palabraSeleccionada = seleccionadas.map(coords => {
        const [x, y] = coords.split(',').map(Number);
        return tablero[y][x];
    }).join('');
    let esCorrecta = palabras.includes(palabraSeleccionada) || palabras.includes(palabraSeleccionada.split('').reverse().join(''));
    document.querySelectorAll(".celda.seleccionada").forEach(celda => {
        celda.classList.remove("seleccionada");
        celda.classList.add(esCorrecta ? "correcta" : "incorrecta");
    });
    if (esCorrecta) {
        encontradas.push(palabraSeleccionada);
        document.getElementById(`palabra-${palabraSeleccionada}`).classList.add("encontrar");
        if (encontradas.length === palabras.length) {
            document.getElementById("mensaje-ganador").style.display = "block";
        }
    }
seleccionadas = [];
}

function reiniciarJuego() {
    seleccionadas = [];
    encontradas = [];
    document.getElementById("mensaje-ganador").style.display = "none";
    renderizarTablero();
}

renderizarTablero();