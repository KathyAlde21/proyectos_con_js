console.log("probando");

document.addEventListener("DOMContentLoaded", () => {
  activarTogglePassword();
  inicializarRegistro();
  validarEmailExistenteEnRegistro();
  mostrarResumenRegistro();
  inicializarLogin();
  mostrarResumenIngreso();
});

const usuariosBase = [
  {
    nombre: "Kathy Alderete",
    email: "kathy@example.com",
    password: "1234",
  },
  {
    nombre: "Demo Usuario",
    email: "demo@example.com",
    password: "abcd",
  },
];

function activarTogglePassword() {
  const botonesToggle = document.querySelectorAll(".toggle-password");

  botonesToggle.forEach((boton) => {
    boton.addEventListener("click", () => {
      const inputId = boton.dataset.target;
      const input = document.getElementById(inputId);
      const icono = boton.querySelector("i");

      if (!input || !icono) return;

      const mostrar = input.type === "password";
      input.type = mostrar ? "text" : "password";

      icono.classList.toggle("bi-eye");
      icono.classList.toggle("bi-eye-slash");
    });
  });
}

function obtenerUsuariosDinamicos() {
  const usuariosGuardados = sessionStorage.getItem("usuariosDinamicos");

  if (!usuariosGuardados) {
    return [];
  }

  return JSON.parse(usuariosGuardados);
}

function guardarUsuariosDinamicos(usuarios) {
  sessionStorage.setItem("usuariosDinamicos", JSON.stringify(usuarios));
}

function obtenerTodosLosUsuarios() {
  const usuariosDinamicos = obtenerUsuariosDinamicos();
  return [...usuariosBase, ...usuariosDinamicos];
}

function existeEmail(email) {
  const emailNormalizado = email.trim().toLowerCase();

  return obtenerTodosLosUsuarios().some((usuario) => {
    return usuario.email.toLowerCase() === emailNormalizado;
  });
}

function inicializarRegistro() {
  const formRegistro = document.getElementById("formRegistroUsuario");

  if (!formRegistro) return;

  formRegistro.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombreRegistro").value.trim();
    const email = document
      .getElementById("emailRegistro")
      .value.trim()
      .toLowerCase();
    const password = document.getElementById("passwordRegistro").value.trim();

    limpiarMensajeRegistro();

    if (!nombre || !email || !password) {
      mostrarMensajeRegistro("Debes completar todos los campos.", false);
      return;
    }

    if (existeEmail(email)) {
      mostrarMensajeRegistro(
        "Según nuestros registros, ese correo ya está registrado. Prueba con otro o inicia sesión",
        false,
      );
      alert(
        "Según nuestros registros, ese usuario ya existe. Intenta iniciar sesión o usar otro correo.",
      );
      return;
    }

    const nuevoUsuario = {
      nombre,
      email,
      password,
    };

    const usuariosDinamicos = obtenerUsuariosDinamicos();
    usuariosDinamicos.push(nuevoUsuario);
    guardarUsuariosDinamicos(usuariosDinamicos);

    const usuarioTemporal = {
      nombre,
      email,
    };

    sessionStorage.setItem("usuarioTemporal", JSON.stringify(usuarioTemporal));
    window.location.href = "./pages/registrado.html";
  });
}

function validarEmailExistenteEnRegistro() {
  const inputEmail = document.getElementById("emailRegistro");

  if (!inputEmail) return;

  inputEmail.addEventListener("blur", () => {
    const emailIngresado = inputEmail.value.trim().toLowerCase();

    limpiarMensajeRegistro();

    if (!emailIngresado) return;

    if (existeEmail(emailIngresado)) {
      mostrarMensajeRegistro(
        "Ese correo ya pertenece a un usuario existente.",
        false,
      );
    }
  });
}

function mostrarMensajeRegistro(texto, esExito) {
  const mensaje = document.getElementById("mensajeRegistro");

  if (!mensaje) return;

  mensaje.textContent = texto;
  mensaje.className = esExito
    ? "mt-2 text-center text-success"
    : "mt-2 text-center text-danger";
}

function limpiarMensajeRegistro() {
  const mensaje = document.getElementById("mensajeRegistro");

  if (!mensaje) return;

  mensaje.textContent = "";
  mensaje.className = "mt-2 text-center";
}

function mostrarResumenRegistro() {
  const resumen = document.getElementById("resumenRegistro");

  if (!resumen) return;

  const usuarioGuardado = sessionStorage.getItem("usuarioTemporal");

  if (!usuarioGuardado) {
    resumen.textContent = "No se encontraron datos de registro en esta sesión.";
    return;
  }

  const usuario = JSON.parse(usuarioGuardado);
  resumen.textContent = `${usuario.nombre}, tu registro fue realizado correctamente. El correo ingresado fue: ${usuario.email}.`;
}

function inicializarLogin() {
  const formLogin = document.getElementById("formLoginUsuario");

  if (!formLogin) return;

  formLogin.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document
      .getElementById("emailLogin")
      .value.trim()
      .toLowerCase();
    const password = document.getElementById("passwordLogin").value.trim();

    if (!email || !password) {
      mostrarMensajeLogin("Debes completar email y contraseña.", false);
      return;
    }

    const usuarioEncontrado = obtenerTodosLosUsuarios().find((usuario) => {
      return (
        usuario.email.toLowerCase() === email && usuario.password === password
      );
    });

    if (!usuarioEncontrado) {
      mostrarMensajeLogin("Correo o contraseña incorrectos.", false);
      return;
    }

    const sesionActiva = {
      nombre: usuarioEncontrado.nombre,
      email: usuarioEncontrado.email,
    };

    sessionStorage.setItem("sesionActiva", JSON.stringify(sesionActiva));
    window.location.href = "./ingresado.html";
  });
}

function mostrarMensajeLogin(texto, esExito) {
  const mensaje = document.getElementById("mensajeLogin");

  if (!mensaje) return;

  mensaje.textContent = texto;
  mensaje.className = esExito
    ? "mt-2 mb-3 text-center text-success"
    : "mt-2 mb-3 text-center text-danger";
}

function mostrarResumenIngreso() {
  const resumen = document.getElementById("resumenIngreso");

  if (!resumen) return;

  const sesionGuardada = sessionStorage.getItem("sesionActiva");

  if (!sesionGuardada) {
    resumen.textContent = "No se detectó una sesión iniciada.";
    return;
  }

  const usuario = JSON.parse(sesionGuardada);
  resumen.textContent = `Bienvenido ${usuario.nombre}, has ingresado con el correo: ${usuario.email}.`;
}
