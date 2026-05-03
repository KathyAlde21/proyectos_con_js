document.addEventListener("DOMContentLoaded", () => {
  inicializarFormularioVuelos();
  configurarTipoViaje();
  establecerFechaMinima();
});

function inicializarFormularioVuelos() {
  const formulario = document.getElementById("formBusquedaVuelos");
  if (!formulario) return;

  formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    const tipoViaje = document.getElementById("tipoViaje").value;
    const cabina = document.getElementById("cabina").value;
    const pasajeros = Number(
      document.getElementById("cantidadPasajeros").value,
    );
    const origen = document.getElementById("origenVuelo").value.trim();
    const destino = document.getElementById("destinoVuelo").value.trim();
    const fechaIda = document.getElementById("fechaIda").value;
    const fechaVuelta = document.getElementById("fechaVuelta").value;
    const mensaje = document.getElementById("mensajeBusqueda");

    limpiarMensajeBusqueda();

    if (!origen || !destino || !fechaIda) {
      mostrarMensajeBusqueda(
        "Debes completar origen, destino y fecha de ida.",
        false,
      );
      return;
    }

    if (origen.toLowerCase() === destino.toLowerCase()) {
      mostrarMensajeBusqueda(
        "El origen y el destino no pueden ser iguales.",
        false,
      );
      return;
    }

    if (tipoViaje === "ida-vuelta") {
      if (!fechaVuelta) {
        mostrarMensajeBusqueda("Debes seleccionar la fecha de vuelta.", false);
        return;
      }

      if (fechaVuelta < fechaIda) {
        mostrarMensajeBusqueda(
          "La fecha de vuelta no puede ser anterior a la ida.",
          false,
        );
        return;
      }
    }

    const busqueda = {
      tipoViaje,
      cabina,
      pasajeros,
      origen,
      destino,
      fechaIda,
      fechaVuelta: tipoViaje === "ida-vuelta" ? fechaVuelta : null,
    };

    mostrarResumenBusqueda(busqueda);
    mostrarResultadosVuelos(busqueda);
  });
}

function configurarTipoViaje() {
  const tipoViaje = document.getElementById("tipoViaje");
  const fechaVuelta = document.getElementById("fechaVuelta");

  if (!tipoViaje || !fechaVuelta) return;

  tipoViaje.addEventListener("change", () => {
    if (tipoViaje.value === "solo-ida") {
      fechaVuelta.value = "";
      fechaVuelta.disabled = true;
    } else {
      fechaVuelta.disabled = false;
    }
  });
}

function establecerFechaMinima() {
  const hoy = new Date().toISOString().split("T")[0];
  const fechaIda = document.getElementById("fechaIda");
  const fechaVuelta = document.getElementById("fechaVuelta");

  if (fechaIda) fechaIda.min = hoy;
  if (fechaVuelta) fechaVuelta.min = hoy;
}

function mostrarMensajeBusqueda(texto, esExito) {
  const mensaje = document.getElementById("mensajeBusqueda");
  if (!mensaje) return;

  mensaje.textContent = texto;
  mensaje.className = esExito
    ? "mt-3 text-center text-success"
    : "mt-3 text-center text-danger";
}

function limpiarMensajeBusqueda() {
  const mensaje = document.getElementById("mensajeBusqueda");
  if (!mensaje) return;

  mensaje.textContent = "";
  mensaje.className = "mt-3 text-center";
}

function mostrarResumenBusqueda(busqueda) {
  const contenedor = document.getElementById("resumenBusqueda");
  if (!contenedor) return;

  const cabinaTexto =
    busqueda.cabina === "economy" ? "Economy" : "Premium Economy";
  const tipoTexto =
    busqueda.tipoViaje === "ida-vuelta" ? "Ida y vuelta" : "Solo ida";

  contenedor.classList.remove("d-none");
  contenedor.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-body">
                <h3 class="card-title mb-3">Resumen de búsqueda</h3>
                <p class="mb-2"><strong>Ruta:</strong> ${busqueda.origen} → ${busqueda.destino}</p>
                <p class="mb-2"><strong>Tipo de viaje:</strong> ${tipoTexto}</p>
                <p class="mb-2"><strong>Cabina:</strong> ${cabinaTexto}</p>
                <p class="mb-2"><strong>Pasajeros:</strong> ${busqueda.pasajeros}</p>
                <p class="mb-2"><strong>Fecha ida:</strong> ${busqueda.fechaIda}</p>
                ${
                  busqueda.fechaVuelta
                    ? `<p class="mb-0"><strong>Fecha vuelta:</strong> ${busqueda.fechaVuelta}</p>`
                    : ""
                }
            </div>
        </div>
    `;
}

function mostrarResultadosVuelos(busqueda) {
  const contenedor = document.getElementById("resultadosVuelos");
  if (!contenedor) return;

  const vuelos = generarVuelosSimulados(busqueda);

  contenedor.innerHTML = vuelos
    .map(
      (vuelo) => `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h4 class="card-title">${vuelo.ruta}</h4>
                    <p class="mb-2"><strong>Salida:</strong> ${vuelo.salida}</p>
                    <p class="mb-2"><strong>Llegada:</strong> ${vuelo.llegada}</p>
                    <p class="mb-2"><strong>Cabina:</strong> ${vuelo.cabina}</p>
                    <p class="mb-2"><strong>Pasajeros:</strong> ${vuelo.pasajeros}</p>
                    <p class="fw-bold mb-0">Desde $${vuelo.total.toLocaleString("es-CL")}</p>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

function generarVuelosSimulados(busqueda) {
  const base = busqueda.cabina === "economy" ? 45000 : 72000;
  const multiplicadorViaje = busqueda.tipoViaje === "ida-vuelta" ? 2 : 1;

  return [
    {
      ruta: `${busqueda.origen} → ${busqueda.destino}`,
      salida: "08:15",
      llegada: "10:05",
      cabina: busqueda.cabina === "economy" ? "Economy" : "Premium Economy",
      pasajeros: busqueda.pasajeros,
      total: base * multiplicadorViaje * busqueda.pasajeros,
    },
    {
      ruta: `${busqueda.origen} → ${busqueda.destino}`,
      salida: "13:40",
      llegada: "15:30",
      cabina: busqueda.cabina === "economy" ? "Economy" : "Premium Economy",
      pasajeros: busqueda.pasajeros,
      total: Math.round(base * 1.12) * multiplicadorViaje * busqueda.pasajeros,
    },
    {
      ruta: `${busqueda.origen} → ${busqueda.destino}`,
      salida: "19:20",
      llegada: "21:10",
      cabina: busqueda.cabina === "economy" ? "Economy" : "Premium Economy",
      pasajeros: busqueda.pasajeros,
      total: Math.round(base * 1.25) * multiplicadorViaje * busqueda.pasajeros,
    },
  ];
}
