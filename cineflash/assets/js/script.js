document.addEventListener("DOMContentLoaded", () => {
  inicializarSeleccionPelicula();
  cargarPeliculaSeleccionada();
  inicializarReservaCine();
  mostrarReservaGuardada();
});

function inicializarSeleccionPelicula() {
  const botonesReserva = document.querySelectorAll(".btn-reservar");

  if (!botonesReserva.length) return;

  botonesReserva.forEach((boton) => {
    boton.addEventListener("click", () => {
      const pelicula = boton.dataset.pelicula;
      const precio = Number(boton.dataset.precio);

      const seleccion = {
        pelicula,
        precio,
      };

      sessionStorage.setItem("peliculaSeleccionada", JSON.stringify(seleccion));
    });
  });
}

function cargarPeliculaSeleccionada() {
  const textoPelicula = document.getElementById("peliculaSeleccionada");
  const totalReserva = document.getElementById("totalReserva");

  if (!textoPelicula) return;

  const seleccionGuardada = sessionStorage.getItem("peliculaSeleccionada");

  if (!seleccionGuardada) {
    textoPelicula.textContent =
      "No se seleccionó una película. Vuelve al catálogo para comenzar.";
    return;
  }

  const seleccion = JSON.parse(seleccionGuardada);
  textoPelicula.textContent = `Película seleccionada: ${seleccion.pelicula}`;
  totalReserva.textContent = `Valor por ticket: $${seleccion.precio.toLocaleString("es-CL")}`;
}

function inicializarReservaCine() {
  const formReserva = document.getElementById("formReservaCine");
  if (!formReserva) return;

  const cantidadTickets = document.getElementById("cantidadTickets");

  cantidadTickets.addEventListener("change", actualizarTotalReserva);

  formReserva.addEventListener("submit", (event) => {
    event.preventDefault();

    const seleccionGuardada = sessionStorage.getItem("peliculaSeleccionada");
    const mensajeReserva = document.getElementById("mensajeReserva");
    const fechaFuncion = document.getElementById("fechaFuncion").value;
    const cantidad = Number(document.getElementById("cantidadTickets").value);

    mensajeReserva.textContent = "";
    mensajeReserva.className = "mt-2 mb-3 text-center";

    if (!seleccionGuardada) {
      mensajeReserva.textContent = "No hay una película seleccionada.";
      mensajeReserva.classList.add("text-danger");
      return;
    }

    if (!fechaFuncion || !cantidad) {
      mensajeReserva.textContent =
        "Debes completar la fecha y la cantidad de tickets.";
      mensajeReserva.classList.add("text-danger");
      return;
    }

    const seleccion = JSON.parse(seleccionGuardada);
    const total = seleccion.precio * cantidad;

    const reserva = {
      pelicula: seleccion.pelicula,
      fecha: fechaFuncion,
      cantidad,
      precioUnitario: seleccion.precio,
      total,
      codigo: generarCodigoReserva(),
    };

    sessionStorage.setItem("reservaCine", JSON.stringify(reserva));
    mostrarConfirmacion(reserva);
  });
}

function actualizarTotalReserva() {
  const seleccionGuardada = sessionStorage.getItem("peliculaSeleccionada");
  const cantidad = Number(document.getElementById("cantidadTickets").value);
  const totalReserva = document.getElementById("totalReserva");

  if (!seleccionGuardada || !cantidad || !totalReserva) return;

  const seleccion = JSON.parse(seleccionGuardada);
  const total = seleccion.precio * cantidad;

  totalReserva.textContent = `Total estimado: $${total.toLocaleString("es-CL")}`;
}

function generarCodigoReserva() {
  const numero = Math.floor(100000 + Math.random() * 900000);
  return `CF-${numero}`;
}

function mostrarConfirmacion(reserva) {
  const formulario = document.getElementById("formularioReserva");
  const confirmacion = document.getElementById("confirmacionReserva");

  if (!formulario || !confirmacion) return;

  document.getElementById("detallePelicula").textContent =
    `Película: ${reserva.pelicula}`;
  document.getElementById("detalleFecha").textContent =
    `Fecha: ${reserva.fecha}`;
  document.getElementById("detalleCantidad").textContent =
    `Cantidad de tickets: ${reserva.cantidad}`;
  document.getElementById("detalleTotal").textContent =
    `Total: $${reserva.total.toLocaleString("es-CL")}`;
  document.getElementById("codigoReserva").textContent =
    `Código de reserva: ${reserva.codigo}`;

  formulario.classList.add("d-none");
  confirmacion.classList.remove("d-none");
}

function mostrarReservaGuardada() {
  const reservaGuardada = sessionStorage.getItem("reservaCine");
  const confirmacion = document.getElementById("confirmacionReserva");
  const formulario = document.getElementById("formularioReserva");

  if (!reservaGuardada || !confirmacion || !formulario) return;

  const reserva = JSON.parse(reservaGuardada);
  mostrarConfirmacion(reserva);
}
