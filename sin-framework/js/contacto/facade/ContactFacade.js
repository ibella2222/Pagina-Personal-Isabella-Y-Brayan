// Fachada de Contactos
class ContactFacade {
    constructor() {
        this.repository = new ContactRepository();
    }

    guardarContacto(datosFormulario) {
        try {
            const contacto = new Contacto(
                datosFormulario.nombre,
                datosFormulario.email,
                datosFormulario.telefono,
                datosFormulario.motivo,
                datosFormulario.mensaje,
                datosFormulario.aceptaTerminos,
                datosFormulario.preferenciaContacto
            );
            
            const resultado = this.repository.add(contacto);
            if (resultado) {
                mostrarContactos();
                return { exito: true, mensaje: 'Contacto guardado exitosamente' };
            } else {
                return { exito: false, mensaje: 'Error al guardar el contacto' };
            }
        } catch (error) {
            console.error('Error en guardarContacto:', error);
            return { exito: false, mensaje: 'Error al procesar el contacto' };
        }
    }

    listarContactos() {
        return this.repository.getAll();
    }

    eliminarContacto(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
            const resultado = this.repository.remove(id);
            if (resultado) {
                mostrarContactos();
                return { exito: true, mensaje: 'Contacto eliminado exitosamente' };
            }
        }
        return { exito: false, mensaje: 'Error al eliminar el contacto' };
    }

    borrarTodo() {
        if (confirm('¿Estás seguro de que deseas eliminar todos los contactos?')) {
            const resultado = this.repository.clear();
            if (resultado) {
                mostrarContactos();
                return { exito: true, mensaje: 'Todos los contactos han sido eliminados' };
            }
        }
        return { exito: false, mensaje: 'Error al eliminar los contactos' };
    }
}

// Instancia global
const contactFacade = new ContactFacade();
