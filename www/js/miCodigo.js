// Constantes y Variables
const apiBaseURL = "https://calcount.develotion.com/";
var usuarioLogueado = null;
var alimentos = [];
var registros = [];
var registrosFiltrados = [];
// Asumo que el usuario está en ORT, luego si logro acceder a la ubicación del usuario, la actualizo.
var posicionUsuario = {
    latitude: -34.903816878014354,
    longitude: -56.19059048108193
};
var map = null;
var markerUsuario = null;
var posicionUsuarioIcon = L.icon({
    iconUrl: 'img/usuario.png',
    iconSize: [25, 25],
});
let posicionPaisIcon = L.icon({
    iconUrl: 'img/pais.png',
    iconSize: [25, 25],
});

// Componentes Ionic
const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const NAV = document.querySelector("#nav");

//Pantallas
const PANTALLA_HOME = document.querySelector("#pantalla-home");
const PANTALLA_LOGIN = document.querySelector("#pantalla-login");
const PANTALLA_REGISTRO = document.querySelector("#pantalla-registro");
const PANTALLA_ALTACOMIDA = document.querySelector("#pantalla-alta-comida");
const PANTALLA_LISTADOCOMIDAS = document.querySelector("#pantalla-listado-comidas");
const PANTALLA_INFORMECALORIAS = document.querySelector("#pantalla-informe-calorias");
const PANTALLA_MAPA = document.querySelector("#pantalla-mapa");

/* Inicializar */
inicializar();

function inicializar() {
    suscribirmeAEventos();
    cargarPosicionUsuario();
}

function suscribirmeAEventos() {
    // Login
    document.querySelector("#btnLoginIngresar").addEventListener("click", btnLoginIngresarHandler);
    // Registro
    document.querySelector("#btnRegistroRegistrarse").addEventListener("click", btnRegistroRegistrarseHandler);
    // Alta Comida Botón
    document.querySelector("#btnaltaComidaAlta").addEventListener("click", btnAltaComidaHandler);
    // Alta Comida Unidad Porción
    document.querySelector("#desplegableAltaComida").addEventListener("ionChange", actualizarUnidadPorcion);
    // Filtro Listado Alimentos
    document.querySelector("#btnComidasFiltrar").addEventListener("click", btnComidasFiltrarHandler);
    // Buscar Paises Usuarios
    document.querySelector("#btnPaisesUsuarios").addEventListener("click", btnPaisesUsuariosHandler);
    // Ruteo
    ROUTER.addEventListener("ionRouteDidChange", navegar);
}

function actualizarUsuarioLogueadoDesdeLocalStorage() {
    const usuarioGuardadoEnLocalStorage = localStorage.getItem("APPComidasCaloriasUsuarioLogueado");
    if (usuarioGuardadoEnLocalStorage) {
        usuarioLogueado = JSON.parse(usuarioGuardadoEnLocalStorage);
    } else {
        usuarioLogueado = null;
    }
}

function verificarInicio() {
    if (usuarioLogueado) {
        NAV.setRoot("page-listadoComidas");
        NAV.popToRoot();
    } else {
        NAV.setRoot("page-login");
        NAV.popToRoot();
    }
}

/* Ruteo Ionic */
function navegar(evt) {
    actualizarUsuarioLogueadoDesdeLocalStorage();
    actualizarMenu();
    ocultarPantallas();
    if (usuarioLogueado) {
        const pantallaDestino = evt.detail.to;
        switch(pantallaDestino) {
            case "/":
                verificarInicio();
                break;
            case "/listadocomidas":
                mostrarListadoComidas();
                break;
            case "/altacomida":
                mostrarAltaComida();
                break;
            case "/informecalorias":
                mostrarInformesCalorias();
                break;
            case "/mapa":
                mostrarMapa();
                break;
        }
    } else {
        const pantallaDestino = evt.detail.to;
        switch(pantallaDestino) {
            case "/":
                verificarInicio();
                break;
            case "/login":
                mostrarLogin();
                break;
            case "/registro":
                mostrarRegistro();
                break;
        }
    }
}

// Interfase Usuario
/* Menu Movil */
function ocultarOpcionesMenu() {
    document.querySelector("#btnMenuHome").style.display = "none";
    document.querySelector("#btnMenuLogin").style.display = "none";
    document.querySelector("#btnMenuRegistro").style.display = "none";
    document.querySelector("#btnMenuListadoComidas").style.display = "none";
    document.querySelector("#btnMenuAltaComida").style.display = "none";
    document.querySelector("#btnMenuInformeCalorias").style.display = "none";
    document.querySelector("#btnMenuMapa").style.display = "none";
    document.querySelector("#btnMenuCerrarSesion").style.display = "none";
}

// Actualizar Menu privilegios logueado
function actualizarMenu() {
    ocultarOpcionesMenu();
    if (usuarioLogueado) {
        document.querySelector("#btnMenuListadoComidas").style.display = "block";
        document.querySelector("#btnMenuAltaComida").style.display = "block";
        document.querySelector("#btnMenuInformeCalorias").style.display = "block";
        document.querySelector("#btnMenuMapa").style.display = "block";
        document.querySelector("#btnMenuCerrarSesion").style.display = "block";
    } else {
        document.querySelector("#btnMenuLogin").style.display = "block";
        document.querySelector("#btnMenuRegistro").style.display = "block";
    }
}

// Interfase Usuario
/* Manejo Pantallas */
function ocultarPantallas() {
    PANTALLA_HOME.style.display = "none";
    PANTALLA_LOGIN.style.display = "none";
    PANTALLA_REGISTRO.style.display = "none";
    PANTALLA_LISTADOCOMIDAS.style.display = "none";
    PANTALLA_ALTACOMIDA.style.display = "none";
    PANTALLA_INFORMECALORIAS.style.display = "none";
    PANTALLA_MAPA.style.display = "none";
}

function mostrarLogin() {
    PANTALLA_LOGIN.style.display = "block";
}

function mostrarRegistro() {
    vaciarDesplegableRegistroPaises();
    buscarPaisesRegistro();
    PANTALLA_REGISTRO.style.display = "block";
}

function mostrarListadoComidas() {
    buscarRegistrosUsuario();
    PANTALLA_LISTADOCOMIDAS.style.display = "block";
}

function mostrarAltaComida() {
    vaciarDesplegableAlimentosAltaComida();
    recargarAlimentos();
    PANTALLA_ALTACOMIDA.style.display = "block";
}

function mostrarInformesCalorias() {
    buscarRegistrosUsuario();
    calcularInformesCalorias();
    PANTALLA_INFORMECALORIAS.style.display = "block"; 
}

function mostrarMapa() {
    PANTALLA_MAPA.style.display = "block";
    inicializarMapa();
}

/* Cerrar Menu Ionic */
function cerrarMenu() {
    MENU.close();
}

/* Cerrar Sesion LocalStorage */
function cerrarSesion() {
    cerrarMenu();
    localStorage.clear();
    usuarioLogueado = null;
    NAV.setRoot("page-login");
    NAV.popToRoot();
}

function cerrarSesionFaltaTokenLS() {
    mostrarToast('ERROR', 'No esta autorizado para este contenido', 'Se ha cerrado sesión por motivos de seguridad');
    cerrarSesion();
}

function validarPermisosUsuario() {
    actualizarUsuarioLogueadoDesdeLocalStorage();
    if (!usuarioLogueado) {
        cerrarSesionFaltaTokenLS();
    }
}

function btnLoginIngresarHandler() {
    const nombreUsuarioIngresado = document.querySelector("#txtLoginNombreUsuario").value;
    const passwordIngresado = document.querySelector("#txtLoginPassword").value;
    // nombreUsuarioIngresado != undefined
    // nombreUsuarioIngresado != null
    // nombreUsuarioIngresado != 0
    // nombreUsuarioIngresado != ""
    // nombreUsuarioIngresado != false
    // passwordIngresado != undefined
    // passwordIngresado != null
    // passwordIngresado != 0
    // passwordIngresado != ""
    // passwordIngresado != false
    if (nombreUsuarioIngresado && passwordIngresado) {
        // ToDo: Validar que el password tenga al menos 8 caracteres.
        // ToDo: Validar formato del correo electrónico.
        if (nombreUsuarioIngresado.length < 8) {
            mostrarToast('ERROR', 'Error', 'Password debe tener al menos 8 Caracteres');
            return;
        }
        const url = apiBaseURL + '/login.php';
        const data = {
            "nombreUsuario": nombreUsuarioIngresado,
            "password": passwordIngresado
        };
        const dataFinal = UsuarioLogin.parse(data);
        console.log(dataFinal);
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataFinal)
        })
        .then((response) => {
            console.log(response);
            if (response.status === 200) {
                console.log("respuesta exitosa");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (data.error) {
                mostrarToast('ERROR', 'Error', data.error);
            } else if (data.codigo === 409) {
                mostrarToast('ERROR', 'Error', data.mensaje);
            } else {
                vaciarCamposLogin();
                const usuarioLogueadoAPI = UsuarioLogueado.parse(data);
                localStorage.setItem("APPComidasCaloriasUsuarioLogueado", JSON.stringify(usuarioLogueadoAPI));
                mostrarToast('SUCCESS', 'Ingreso exitoso', 'Se ha iniciado sesión.');
                NAV.setRoot("page-listadoComidas");
                NAV.popToRoot();
            }
        })
        .catch((error) => {
            console.log(error);
            mostrarToast('ERROR', 'Error', 'Por favor, intente nuevamente.');
        });
    } else {
        mostrarToast('ERROR', 'Error', 'Tanto Nombre Usuario como password son Obligatorios');
    }
}

function vaciarCamposLogin() {
    document.querySelector("#txtLoginNombreUsuario").value = "";
    document.querySelector("#txtLoginPassword").value = "";
}

function buscarPaisesRegistro() {
    const url = apiBaseURL + '/paises.php';
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => {
        console.log(response);
        if (response.status === 200) {
            console.log("respuesta exitosa");
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        if (data.error) {
            mostrarToast('ERROR', 'Error', data.error);
        } else {
            const listaPaises = data.paises;
            const listaPaisesFinal = [];
            for (let i = 0; i < listaPaises.length; i++) {
                const unPais = listaPaises[i];
                const unPaisNuevo = Pais.parse(unPais);
                listaPaisesFinal.push(unPaisNuevo);
            }
            cargarPaisesDesplegable(listaPaisesFinal);
        }
    })
    .catch((error) => {
        console.log(error);
        mostrarToast('ERROR', 'Error', 'Por favor, intente nuevamente.');
    });
}

function cargarPaisesDesplegable(listaPaises) {
    vaciarDesplegableRegistroPaises();
    const desplegablePaisesRegistro = document.querySelector("#desplegablePaises");
    for (let i = 0; i < listaPaises.length; i++) {
        const unPaisCargar = listaPaises[i];
        const nuevaOpcion = document.createElement("ion-select-option");
        nuevaOpcion.value = unPaisCargar.id;
        nuevaOpcion.innerHTML = unPaisCargar.nombre;
        desplegablePaisesRegistro.appendChild(nuevaOpcion);
    }
}

function btnRegistroRegistrarseHandler() {
    const nombreUsuarioIngresado = document.querySelector("#txtRegistroNombreUsuario").value;
    const passwordIngresado = document.querySelector("#txtRegistroPassword").value;
    const caloriasDiariasIngresadas = document.querySelector("#registroCaloriasDiarias").value;
    const IdPaisIngresado = document.querySelector("#desplegablePaises").value;
    if (nombreUsuarioIngresado && passwordIngresado &&
        caloriasDiariasIngresadas && IdPaisIngresado) {
        if (caloriasDiariasIngresadas <= 0) {
            mostrarToast('ERROR', 'Error', "Calorias debe ser natural mayor a 0");
            return;
        }
        const url = apiBaseURL + '/usuarios.php';
        const data = {
            "nombreUsuario": nombreUsuarioIngresado,
            "password": passwordIngresado,
            "idPais": IdPaisIngresado,
            "caloriasDiarias": caloriasDiariasIngresadas
        };
        const dataFinal = UsuarioRegistro.parse(data);
        console.log(dataFinal);
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataFinal)
        })
        .then((response) => {
            console.log(response);
            if (response.status === 200) {
                console.log("respuesta exitosa");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (data.error) {
                mostrarToast('ERROR', 'Error', data.error);
            } else {
                vaciarCamposRegistro();
                const usuarioLogueadoAPI = UsuarioLogueado.parse(data);
                localStorage.setItem("APPComidasCaloriasUsuarioLogueado", JSON.stringify(usuarioLogueadoAPI));
                mostrarToast('SUCCESS', 'Registro exitoso', 'Se ha iniciado sesión.');
                NAV.setRoot("page-listadoComidas");
                NAV.popToRoot();
            }
        })
        .catch((error) => {
            console.log(error);
            mostrarToast('ERROR', 'Error', 'Por favor, intente nuevamente.');
        });
    } else {
        mostrarToast('ERROR', 'Error', 'Todos los campos son obligatorios.');
    }
}

function vaciarCamposRegistro() {
    document.querySelector("#txtRegistroNombreUsuario").value = "";
    document.querySelector("#txtRegistroPassword").value = "";
    document.querySelector("#registroCaloriasDiarias").value = "";
    document.querySelector("#desplegablePaises").value = "";
    vaciarDesplegableRegistroPaises();
}

function vaciarDesplegableRegistroPaises() {
    const desplegablePaisesRegistro = document.querySelector("#desplegablePaises");
    desplegablePaisesRegistro.innerHTML = "";
}

function btnAltaComidaHandler() {
    const nombreAlimento = document.querySelector("#desplegableAltaComida").value;
    const altaComidaCantidad = document.querySelector("#altaComidaCantidad").value;
    const altaComidaFecha = document.querySelector("#altaComidaFecha").value;
    console.log(altaComidaFecha);
    if (nombreAlimento && altaComidaCantidad 
        && altaComidaFecha) {
        if (altaComidaCantidad <= 0) {
            mostrarToast('ERROR', 'Error', "Cantidad debe ser natural mayor a 0");
            return;
        }
        console.log(altaComidaFecha);
        // ToDo: Validar que fecha ingresada sea igual o anterior a fecha actual
        if (altaComidaFecha > fechaHoyString()) {
            mostrarToast('ERROR', 'Error', "Fecha de Ingreso no puede ser posterior al dia de hoy");
            return;
        }
        const url = apiBaseURL + '/registros.php';
        data = {
            "IdAlimento": nombreAlimento,
            "IdUsuario": usuarioLogueado.id,
            "cantidad": altaComidaCantidad,
            "fecha": altaComidaFecha
        };
        const dataFinal = Comida.parse(data);
        console.log(dataFinal);
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": usuarioLogueado.token,
                "iduser": usuarioLogueado.id
            },
            body: JSON.stringify(dataFinal)
        })
        .then((response) => {
            console.log(response);
            if (response.status === 200) {
                console.log("respuesta exitosa");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (data.error) {
                mostrarToast('ERROR', 'Error', data.error);
            } else if (data.codigo === 401) {
                mostrarToast('ERROR', 'Error', data.mensaje);
            } else {
                vaciarCamposAltaComida();
                mostrarToast('SUCCESS', 'Ingreso Registro Exitoso', 'Se ha insertado registro comida');
                NAV.setRoot("page-listadoComidas");
                NAV.popToRoot();
            }
        })
        .catch((error) => {
            console.log(error);
            mostrarToast('ERROR', 'Error', 'Por favor, intente nuevamente.');
        });
    } else {
        mostrarToast('ERROR', 'Error', 'Tanto Alimento, Cantidad y Fecha son Obligatorios');
    }
}

function fechaHoyString() {
    const fechaHoy = new Date();
    const año = fechaHoy.getFullYear();
    const mes = ('0' + (fechaHoy.getMonth() + 1)).slice(-2);
    const dia = ('0' + (fechaHoy.getDate())).slice(-2);
    return `${año}-${mes}-${dia}`;
}

function vaciarCamposAltaComida() {
    document.querySelector("#altaComidaCantidad").value = "";
    document.querySelector("#altaComidaFecha").value = "";
    vaciarDesplegableAlimentosAltaComida();
}

function recargarAlimentos() {
    const url = apiBaseURL + '/alimentos.php';
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "apikey": usuarioLogueado.token,
            "iduser": usuarioLogueado.id
        }
    })
    .then((response) => {
        console.log(response);
        if (response.status === 200) {
            console.log("respuesta exitosa");
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        if (data.error) {
            mostrarToast('ERROR', 'Error', data.error);
        } else if (data.codigo === 401) {
            mostrarToast('ERROR', 'Error', data.mensaje);
        } else {
            const listaAlimentos = data.alimentos;
            alimentos = [];
            for (let i = 0; i < listaAlimentos.length; i++) {
                const unAlimento = listaAlimentos[i];
                const unAlimentoNuevo = Alimento.parse(unAlimento);
                alimentos.push(unAlimentoNuevo);
            }
            cargarAlimentosAltaComidaDesplegable();
        }
    })
    .catch((error) => {
        console.log(error);
        mostrarToast('ERROR', 'Error', 'Por favor, intente nuevamente.');
    });
}

function cargarAlimentosAltaComidaDesplegable() {
    vaciarDesplegableAlimentosAltaComida();
    const desplegableAlimentosAltaComida = document.querySelector("#desplegableAltaComida");
    for (let i = 0; i < alimentos.length; i++) {
        const unAlimentoCargar = alimentos[i];
        const nuevaOpcion = document.createElement("ion-select-option");
        nuevaOpcion.value = unAlimentoCargar.id;
        nuevaOpcion.innerHTML = unAlimentoCargar.nombre;
        desplegableAlimentosAltaComida.appendChild(nuevaOpcion);
    }
}

function vaciarDesplegableAlimentosAltaComida() {
    const desplegableAlimentosAltaComida = document.querySelector("#desplegableAltaComida");
    desplegableAlimentosAltaComida.innerHTML = "";
}

function actualizarUnidadPorcion() {
    const unidadPorcion = document.querySelector("#altaComidaAlimentoUnidad");
    const valorDesplegableAlimentos = document.querySelector("#desplegableAltaComida").value;
    console.log(valorDesplegableAlimentos);
    const alimentoSeleccionado = buscarAlimentoPorId(valorDesplegableAlimentos);
    const unidadLetra = alimentoSeleccionado.porcion.substr(-1);
    let unidadFinal;
    switch (unidadLetra) {
        case "g":
            unidadFinal = "Gramos";
            break;
        case "u":
            unidadFinal = "Unidades";
            break;
        case "m":
            unidadFinal = "Mililitros";
            break;
    }
    unidadPorcion.value = unidadLetra + ": " + unidadFinal;
}

function buscarAlimentoPorId(idAlimentoBuscar) {
    let alimentoEncontrado = null;
    let contador = 0;
    while (!alimentoEncontrado && contador < alimentos.length) {
        const unAlimento = alimentos[contador];
        if (unAlimento.id === idAlimentoBuscar) {
            alimentoEncontrado = unAlimento;
            break;
        }
        contador++;
    }
    return alimentoEncontrado;
}

function btnComidasFiltrarHandler() {
    const primeraFechaFiltro = document.querySelector("#primeraFechaFiltro").value;
    const segundaFechaFiltro = document.querySelector("#segundoFechaFiltro").value;
    if (!primeraFechaFiltro && !segundaFechaFiltro) {
        buscarRegistrosUsuario();
        return;
    }
    if (primeraFechaFiltro && segundaFechaFiltro) {
        if (primeraFechaFiltro > segundaFechaFiltro) {
            mostrarToast('ERROR', 'Error', 'Segunda Fecha debe ser igual o posterior a la Primera');
            return;
        }
        registrosFiltrados = [];
        registros.forEach((registro) => {
            if (registro.fecha >= primeraFechaFiltro &&
                registro.fecha <= segundaFechaFiltro) {
                    registrosFiltrados.push(registro);
            }
        });
        cargarComboBoxRegistrosFiltrados(registrosFiltrados);
    } else {
        mostrarToast('ERROR', 'Error', 'Si primera o segunda fecha tiene valor, la otra también debe tenerlo');
    }
}

function cargarComboBoxRegistrosFiltrados() {
    vaciarComboBoxListadoRegistros();
    let listadoRegistrosFil = '<ion-list>';
    for (let i = 0; i < registrosFiltrados.length; i++) {
        const unRegistroFil = registrosFiltrados[i];
        listadoRegistrosFil += `
            <ion-item class="ion-item-registro" registro-id="${unRegistroFil.id}">
                <ion-thumbnail slot="start">
                    <img src="${unRegistroFil.obtenerURLImagen()}" width="100"/>
                </ion-thumbnail>
                <ion-label>
                    <h2>${unRegistroFil.nombre}</h2>
                    <h3>${unRegistroFil.calorias} calorias</h3>
                    <h4>${unRegistroFil.fecha}</h4>
                </ion-label>
                <ion-button color="danger" shape="round" onclick="borrarRegistroHandler(${unRegistroFil.id})">
                Delete
                </ion-button>
            </ion-item>
        `;
    }
    listadoRegistrosFil += '</ion-list>';
    if (registrosFiltrados.length === 0) {
        listadoRegistrosFil = "El Usuario no tiene registros ingresados o no tiene registros entre fechas ingresadas";
    }
    document.querySelector("#divComidas").innerHTML = listadoRegistrosFil;
}

function buscarRegistrosUsuario() {
    const url = apiBaseURL + '/registros.php?idUsuario=' + usuarioLogueado.id;
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "apikey": usuarioLogueado.token,
            "iduser": usuarioLogueado.id
        }
    })
    .then((response) => {
        console.log(response);
        if (response.status === 200) {
            console.log("respuesta exitosa");
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        if (data.error) {
            mostrarToast('ERROR', 'Error', data.error);
        } else if (data.codigo === 401) {
            mostrarToast('ERROR', 'Error', data.mensaje); 
        } else {
            const listaRegistros = data.registros;
            console.log(listaRegistros);
            const urlAlimentos = apiBaseURL + '/alimentos.php';
            fetch(urlAlimentos, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": usuarioLogueado.token,
                    "iduser": usuarioLogueado.id
                }
            })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    console.log("respuesta exitosa");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (data.error) {
                    mostrarToast('ERROR', 'Error', data.error);
                } else if (data.codigo === 401) {
                    mostrarToast('ERROR', 'Error', data.mensaje);
                } else {
                    const listaAlimentos = data.alimentos;
                    alimentos = [];
                    for (let i = 0; i < listaAlimentos.length; i++) {
                        const unAlimento = listaAlimentos[i];
                        const unAlimentoNuevo = Alimento.parse(unAlimento);
                        alimentos.push(unAlimentoNuevo);
                    }
                    cargarRegistrosUsuario(listaRegistros);
                }
            })
            .catch((error) => {
                console.log(error);
                mostrarToast('ERROR', 'Error', 'Por favor, intente nuevamente.');
            });
        }
    })
    .catch((error) => {
        console.log(error);
        mostrarToast('ERROR', 'Error', 'Por favor, intente nuevamente.');
    });
}

function obtenerCaloriasPorUnidadAlimento(alimento) {
    const cantidadTotalPorcion = Number(alimento.porcion.substr(0, alimento.porcion.length - 1));
    const caloriasTotalPorcion = alimento.calorias;
    return caloriasTotalPorcion / cantidadTotalPorcion;
}

function cargarRegistrosUsuario(listaRegistros) {
    registros = [];
    for (let i = 0; i < listaRegistros.length; i++) {
        let data = {};
        const unRegistro = listaRegistros[i];
        data.id = unRegistro.id;
        data.fecha = unRegistro.fecha;
        const alimentoRegistro = buscarAlimentoPorId(unRegistro.idAlimento);
        data.nombre = alimentoRegistro.nombre;
        const caloriasUnidadCantidad = obtenerCaloriasPorUnidadAlimento(alimentoRegistro)
        data.calorias = caloriasUnidadCantidad * unRegistro.cantidad;
        data.imagen = alimentoRegistro.imagen;
        const unRegistroFinal = Registro.parse(data);
        registros.push(unRegistroFinal);
    }
    cargarRegistrosComboBox();
}

function cargarRegistrosComboBox() {
    vaciarComboBoxListadoRegistros();
    let listadoRegistros = '<ion-list>';
    for (let i = 0; i < registros.length; i++) {
        const unRegistro = registros[i];
        listadoRegistros += `
            <ion-item class="ion-item-registro" registro-id="${unRegistro.id}">
                <ion-thumbnail slot="start">
                    <img src="${unRegistro.obtenerURLImagen()}" width="100"/>
                </ion-thumbnail>
                <ion-label>
                    <h2>${unRegistro.nombre}</h2>
                    <h3>${unRegistro.calorias} calorias</h3>
                    <h4>${unRegistro.fecha}</h4>
                </ion-label>
                <ion-button color="danger" shape="round" onclick="borrarRegistroHandler(${unRegistro.id})">
                Delete
                </ion-button>
            </ion-item>
        `;
    }
    listadoRegistros += '</ion-list>';
    if (registros.length === 0) {
        listadoRegistros = "El Usuario no tiene registros ingresados";
    }
    document.querySelector("#divComidas").innerHTML = listadoRegistros;
}

function vaciarComboBoxListadoRegistros() {
    const comboBoxListadoRegistros = document.querySelector("#divComidas");
    comboBoxListadoRegistros.innerHTML = "";
}

function borrarRegistroHandler(registroId) {
    const url = apiBaseURL + '/registros.php?idRegistro=' + registroId;
    fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "apikey": usuarioLogueado.token,
            "iduser": usuarioLogueado.id
        }
    })
    .then((response) => {
        console.log(response);
        if (response.status === 200) {
            console.log("respuesta exitosa");
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        if (data.error) {
            mostrarToast('ERROR', 'Error', data.error);
        } else if (data.codigo === 401) {
            mostrarToast('ERROR', 'Error', data.mensaje); 
        } else {
            mostrarToast('SUCCESS', 'Registro Eliminado', data.mensaje);
            buscarRegistrosUsuario();
        }
    })
    .catch((error) => {
        console.log(error);
        mostrarToast('ERROR', 'Error', 'Por favor, intente nuevamente.');
    });
}

function buscarRegistroPorId(idRegistroBuscar) {
    let registroEncontrado = null;
    let contador = 0;
    while (!registroEncontrado && contador < registros.length) {
        const unRegistro = registros[contador];
        if (unRegistro.id === idRegistroBuscar) {
            registroEncontrado = unRegistro;
            break;
        }
        contador++;
    }
    return registroEncontrado;
}

function calcularInformesCalorias() {
    informeCaloriasDiarias();
    informeCaloriasTotales();
}

function informeCaloriasDiarias() {
    let caloriasDiarias = 0;
    for (let i = 0; i < registros.length; i++) {
        const unRegistro = registros[i];
        if (unRegistro.fecha === fechaHoyString()) {
            caloriasDiarias += unRegistro.calorias;
        }
    }
    cargarCaloriasDiariasInformeCalorias(caloriasDiarias);
}

function informeCaloriasTotales() {
    let caloriasTotales = 0;
    for (let i = 0; i < registros.length; i++) {
        const unRegistro = registros[i];
        caloriasTotales += unRegistro.calorias;
    }
    cargarCaloriasTotalesInformeCalorias(caloriasTotales);
}

function cargarCaloriasTotalesInformeCalorias(calTotales) {
    const badgeCaloriasTotales = document.querySelector("#badgeCaloriasTotales");
    badgeCaloriasTotales.innerHTML = calTotales;
}

function cargarCaloriasDiariasInformeCalorias(calDiarias) {
    const badgeCaloriasDiarias = document.querySelector("#badgeCaloriasHoy");
    badgeCaloriasDiarias.innerHTML = calDiarias;
    const calDiarias10Porcentaje = usuarioLogueado.caloriasDiarias * 0.10;
    let colorInforme;
    if (calDiarias > usuarioLogueado.caloriasDiarias) {
        colorInforme = "danger";
    } else if (calDiarias >= usuarioLogueado.caloriasDiarias - calDiarias10Porcentaje) {
        colorInforme = "warning";
    } else {
        colorInforme = "success";
    }
    badgeCaloriasDiarias.setAttribute("color", colorInforme);
}

function btnPaisesUsuariosHandler() {
    const cantidadUsuarios = document.querySelector("#mapaCantidadUsuarios").value;
    if (cantidadUsuarios) {
        if (cantidadUsuarios <= 0) {
            mostrarToast('ERROR', 'Error', "Cantidad Usuarios debe ser natural mayor a 0");
            return;
        }
        BuscarUsuarioPorPaises(cantidadUsuarios);
    } else {
        mostrarToast('ERROR', 'Error', "Se debe ingresar una cantidad de Usuarios");
    }
}

function BuscarUsuarioPorPaises(cantidadUsuarios) {
    const url = apiBaseURL + '/usuariosPorPais.php';
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "apikey": usuarioLogueado.token,
            "iduser": usuarioLogueado.id
        }
    })
    .then((response) => {
        console.log(response);
        if (response.status === 200) {
            console.log("respuesta exitosa");
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        if (data.error) {
            mostrarToast('ERROR', 'Error', data.error);
        } else if (data.codigo === 401) {
            mostrarToast('ERROR', 'Error', data.mensaje); 
        } else {
            const listaPaisesCantidadUsuarios = data.paises;
            const listaPaisesCantFinal = [];
            for (let i = 0; i < listaPaisesCantidadUsuarios.length; i++) {
                const paisCantidadUsuarios = listaPaisesCantidadUsuarios[i];
                listaPaisesCantFinal.push(usuarioPais.parse(paisCantidadUsuarios));
            }
            buscarPaisesconMasUsuarios(cantidadUsuarios, listaPaisesCantFinal);
        }
    })
    .catch((error) => {
        console.log(error);
        mostrarToast('ERROR', 'Error', 'Por favor, intente nuevamente.');
    });
}

function buscarPaisesconMasUsuarios(cantidadUsuariosP, listaPaisesCantFinal) {
    let paisesConMasUsuarios = [];
    for (let i = 0; i < listaPaisesCantFinal.length; i++) {
        const unPaisUsuarios = listaPaisesCantFinal[i];
        if (unPaisUsuarios.cantidadDeUsuarios > cantidadUsuariosP) {
            paisesConMasUsuarios.push(unPaisUsuarios);
        }
    }
    buscarCoordenadasPaises(paisesConMasUsuarios);
}

function buscarCoordenadasPaises(paisesConMasUsuarios) {
    const url = apiBaseURL + '/paises.php';
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => {
        console.log(response);
        if (response.status === 200) {
            console.log("respuesta exitosa");
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        if (data.error) {
            mostrarToast('ERROR', 'Error', data.error);
        } else {
            const listaPaises = data.paises;
            const listaPaisesFinal = [];
            for (let i = 0; i < listaPaises.length; i++) {
                const unPais = listaPaises[i];
                const unPaisNuevo = Pais.parse(unPais);
                listaPaisesFinal.push(unPaisNuevo);
            }
            let paisesMasUsuariosCoord = [];
            for (let i = 0; i < paisesConMasUsuarios.length; i++) {
                const unPaisMasUsuarios = paisesConMasUsuarios[i];
                for (let j = 0; j < listaPaisesFinal.length; j++) {
                    const unPaisFinal = listaPaisesFinal[j];
                    if (unPaisFinal.id === unPaisMasUsuarios.id) {
                        paisesMasUsuariosCoord.push(unPaisFinal);
                    }
                }
            }
            cargarMarkersPaisesUsuarios(paisesMasUsuariosCoord);
        }
    })
    .catch((error) => {
        console.log(error);
        mostrarToast('ERROR', 'Error', 'Por favor, intente nuevamente.');
    });
}

function cargarMarkersPaisesUsuarios(paisesMasUsuarios) {
    for (let i = 0; i < paisesMasUsuarios.length; i++) {
        const unPaisMasUsuariosFinal = paisesMasUsuarios[i];
        const posicionPais = {
            latitude: unPaisMasUsuariosFinal.latitude,
            longitude: unPaisMasUsuariosFinal.longitude
        };
        markerPais = L.marker([posicionPais.latitude, posicionPais.longitude], {icon: posicionPaisIcon}).addTo(map).bindPopup(unPaisMasUsuariosFinal.nombre);
    }
}

function inicializarMapa() {
    if (!map) {
        map = L.map('mapaUsuario').setView([posicionUsuario.latitude, posicionUsuario.longitude], 16);
        let miCapaBase = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
        miCapaBase.addTo(map);
        markerUsuario = L.marker([posicionUsuario.latitude, posicionUsuario.longitude], {icon: posicionUsuarioIcon}).addTo(map).bindPopup("Aca esta el Usuario");
    }
}

function cargarPosicionUsuario() {
    if (Capacitor.isNativePlatform()) {
        // Cargo la posición del usuario desde el dispositivo.
        const loadCurrentPosition = async () => {
            const resultado = await Capacitor.Plugins.Geolocation.getCurrentPosition({ timeout: 3000 });
            if (resultado.coords && resultado.coords.latitude) {
                data = {
                    latitude: resultado.coords.latitude,
                    longitude: resultado.coords.longitude
                }
                posicionUsuario = usuarioPosicion.parse(data);
            }
        };
        loadCurrentPosition();
    } else {
        // Cargo la posición del usuario desde el navegador web.
        window.navigator.geolocation.getCurrentPosition(
        // Callback de éxito.
        function (pos) {
            console.log(pos);
            if (pos && pos.coords && pos.coords.latitude) {
                data = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                };
                posicionUsuario = usuarioPosicion.parse(data);
            }
        },
        // Callback de error.
        function () {
            console.log("Se usa ubicacion de ORT porque no se pudo obtener ubicación usuario");
        });
    }
}

/* Mensajes */
async function mostrarToast(tipo, titulo, mensaje) {
    const toast = document.createElement('ion-toast');
    toast.header = titulo;
    toast.message = mensaje;
    toast.position = 'bottom';
    toast.duration = 2000;
    switch(tipo) {
        case "ERROR":
            toast.color = "danger";
            break;
        case "SUCCESS":
            toast.color = "success";
            break;
        case "WARNING":
            toast.color = "warning";
            break;
    }
    document.body.appendChild(toast);
    return toast.present();
}