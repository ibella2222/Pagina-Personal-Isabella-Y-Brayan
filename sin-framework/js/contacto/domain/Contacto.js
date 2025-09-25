// Clase Contacto
class Contacto {
    constructor(nombre, email, telefono, motivo, mensaje, aceptaTerminos, preferenciaContacto) {
        this.id = Date.now().toString();
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono || '';
        this.motivo = motivo || '';
        this.mensaje = mensaje;
        this.aceptaTerminos = aceptaTerminos;
        this.preferenciaContacto = preferenciaContacto;
        this.fechaCreacion = new Date().toISOString();
        this.fechaActualizacion = new Date().toISOString();
    }
}
