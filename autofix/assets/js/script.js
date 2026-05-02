document.addEventListener("DOMContentLoaded", () => {
  inicializarReserva();
  mostrarConfirmacionReserva();
});

const servicios = {
  aceite: {
    nombre: "Cambio de aceite",
    precio: 25000,
  },
  frenos: {
    nombre: "Revisión de frenos",
    precio: 27000,
  },
  electrico: {
    nombre: "Diagnóstico eléctrico",
    precio: 36000,
  },
};

function inicializarReserva() {
  const formReserva = document.getElementById("formReserva");
  if (!formReserva) return;

  formReserva.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombreCliente = document.getElementById("nombreCliente").value.trim();
    const tipoReparacion = document.getElementById("tipoReparacion").value;
    const descripcion = document
      .getElementById("descripcionReparacion")
      .value.trim();
    const fechaCita = document.getElementById("fechaCita").value;
    const numeroTarjeta = document.getElementById("numeroTarjeta").value.trim();
    const nombreTitular = document.getElementById("nombreTitular").value.trim();
    const cvvTarjeta = document.getElementById("cvvTarjeta").value.trim();
    const mensajeReserva = document.getElementById("mensajeReserva");

    mensajeReserva.textContent = "";
    mensajeReserva.className = "mt-2 mb-3 text-center";

    if (
      !nombreCliente ||
      !tipoReparacion ||
      !descripcion ||
      !fechaCita ||
      !numeroTarjeta ||
      !nombreTitular ||
      !cvvTarjeta
    ) {
      mensajeReserva.textContent = "Debes completar todos los campos.";
      mensajeReserva.classList.add("text-danger");
      return;
    }

    const servicioSeleccionado = servicios[tipoReparacion];

    if (!servicioSeleccionado) {
      mensajeReserva.textContent = "Debes seleccionar un servicio válido.";
      mensajeReserva.classList.add("text-danger");
      return;
    }

    const reserva = {
      cliente: nombreCliente,
      servicio: servicioSeleccionado.nombre,
      precio: servicioSeleccionado.precio,
      descripcion: descripcion,
      fecha: fechaCita,
      numeroSolicitud: generarNumeroSolicitud(),
      estadoPago: "Pago exitoso",
    };

    sessionStorage.setItem("reservaActual", JSON.stringify(reserva));
    window.location.href = "./pages/confirmacion.html";
  });
}

function generarNumeroSolicitud() {
  const numeroAleatorio = Math.floor(100000 + Math.random() * 900000);
  return `AF-${numeroAleatorio}`;
}

function mostrarConfirmacionReserva() {
  const detalleCliente = document.getElementById("detalleCliente");
  const detalleServicio = document.getElementById("detalleServicio");
  const detalleFecha = document.getElementById("detalleFecha");
  const detalleSolicitud = document.getElementById("detalleSolicitud");
  const detallePago = document.getElementById("detallePago");

  if (
    !detalleCliente ||
    !detalleServicio ||
    !detalleFecha ||
    !detalleSolicitud ||
    !detallePago
  ) {
    return;
  }

  const reservaGuardada = sessionStorage.getItem("reservaActual");

  if (!reservaGuardada) {
    detalleCliente.textContent =
      "No se encontró una reserva activa en esta sesión.";
    return;
  }

  const reserva = JSON.parse(reservaGuardada);

  detalleCliente.textContent = `Cliente: ${reserva.cliente}`;
  detalleServicio.textContent = `Servicio solicitado: ${reserva.servicio} - $${reserva.precio.toLocaleString("es-CL")}`;
  detalleFecha.textContent = `Fecha agendada: ${reserva.fecha}`;
  detalleSolicitud.textContent = `Número de solicitud: ${reserva.numeroSolicitud}`;
  detallePago.textContent = reserva.estadoPago;
}
