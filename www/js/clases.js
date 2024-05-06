class UsuarioRegistro {
    constructor() {
        this.usuario = null;
        this.password = null;
        this.idPais = null;
        this.caloriasDiarias = null;
    }

    static parse(data) {
        let instancia = new UsuarioRegistro();

        if (data.nombreUsuario) {
            instancia.usuario = data.nombreUsuario;
        }
        if (data.password) {
            instancia.password = data.password;
        }
        if (data.idPais) {
            instancia.idPais = data.idPais;
        }
        if (data.caloriasDiarias) {
            instancia.caloriasDiarias = data.caloriasDiarias;
        }
        return instancia;
    }
}

class UsuarioLogin {
    constructor() {
        this.usuario = null;
        this.password = null;
    }

    static parse(data) {
        let instancia = new UsuarioLogin();
        if (data.nombreUsuario) {
            instancia.usuario = data.nombreUsuario;
        }
        if (data.password) {
            instancia.password = data.password;
        }
        return instancia;
    }
}

class UsuarioLogueado {
    constructor() {
        this.token = null;
        this.id = null;
        this.caloriasDiarias = null;
    }

    static parse(data) {
        let instancia = new UsuarioLogueado();
        if (data.apiKey) {
            instancia.token = data.apiKey;
        }
        if (data.id) {
            instancia.id = data.id;
        }
        if (data.caloriasDiarias) {
            instancia.caloriasDiarias = data.caloriasDiarias;
        }
        return instancia;
    }
}

class Pais {
    constructor() {
        this.id = null;
        this.nombre = null;
        this.latitude = null;
        this.longitude = null;
    }

    static parse(data) {
        let instancia = new Pais();
        if (data.id) {
            instancia.id = data.id;
        }
        if (data.name) {
            instancia.nombre = data.name;
        }
        if (data.latitude) {
            instancia.latitude = data.latitude;
        }
        if (data.longitude) {
            instancia.longitude = data.longitude;
        }
        return instancia;
    }
}

class usuarioPais {
    constructor() {
        this.id = null;
        this.nombre = null;
        this.cantidadDeUsuarios = null;
    }

    static parse(data) {
        let instancia = new usuarioPais();
        if (data.id) {
            instancia.id = data.id;
        }
        if (data.name) {
            instancia.nombre = data.name;
        }
        if (data.cantidadDeUsuarios) {
            instancia.cantidadDeUsuarios = data.cantidadDeUsuarios;
        }
        return instancia;
    }
}

class Alimento {
    constructor() {
        this.id = null;
        this.nombre = null;
        this.porcion = null;
        this.calorias = null;
        this.imagen = null;
    }

    static parse(data) {
        let instancia = new Alimento();
        if (data.id) {
            instancia.id = data.id;
        }
        if (data.nombre) {
            instancia.nombre = data.nombre;
        }
        if (data.porcion) {
            instancia.porcion = data.porcion;
        }
        if (data.calorias) {
            instancia.calorias = data.calorias;
        }
        if (data.imagen) {
            instancia.imagen = data.imagen;
        }
        return instancia;
    }
}

class Comida {
    constructor() {
        this.idAlimento = null;
        this.idUsuario = null;
        this.cantidad = null;
        this.fecha = null;
    }

    static parse(data) {
        let instancia = new Comida();
        if (data.IdAlimento) {
            instancia.idAlimento = data.IdAlimento;
        }
        if (data.IdUsuario) {
            instancia.idUsuario = data.IdUsuario;
        }
        if (data.cantidad) {
            instancia.cantidad = data.cantidad;
        }
        if (data.fecha) {
            instancia.fecha = data.fecha;
        }
        return instancia;
    }
}

class Registro {
    constructor() {
        this.id = null;
        this.nombre = null;
        this.calorias = null;
        this.fecha = null;
        this.imagen = null;
    }

    static parse(data) {
        let instancia = new Registro();
        if (data.id) {
            instancia.id = data.id;
        }
        if (data.nombre) {
            instancia.nombre = data.nombre;
        }
        if (data.calorias) {
            instancia.calorias = data.calorias;
        }
        if (data.fecha) {
            instancia.fecha = data.fecha;
        }
        if (data.imagen) {
            instancia.imagen = data.imagen;
        }
        return instancia;
    }

    obtenerURLImagen() {
        return "https://calcount.develotion.com/imgs/" + this.imagen + ".png";
    }
}

class usuarioPosicion {
    constructor() {
        this.latitude = null;
        this.longitude = null;
    }

    static parse(data) {
        let instancia = new usuarioPosicion();
        if (data.latitude) {
            instancia.latitude = data.latitude
        }
        if (data.longitude) {
            instancia.longitude = data.longitude;
        }
        return instancia;
    }
}