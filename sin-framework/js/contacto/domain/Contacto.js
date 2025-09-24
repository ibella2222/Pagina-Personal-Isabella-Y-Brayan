
class Contacto {
    constructor({
        id = null,
        nombre = '',
        email = '',
        telefono = '',
        motivo = '',
        mensaje = '',
        aceptaTerminos = false,
        preferenciaContacto = 'email',
        fechaCreacion = null,
        fechaActualizacion = null
    } = {}) {
        this.id = id || this.generateId();
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.motivo = motivo;
        this.mensaje = mensaje;
        this.aceptaTerminos = aceptaTerminos;
        this.preferencia = preferenciaContacto; // Mantener consistencia con el HTML
        this.fechaCreacion = fechaCreacion || new Date().toISOString();
        this.fechaActualizacion = fechaActualizacion || new Date().toISOString();
    }

    /**
     * Genera un ID único para el contacto
     * @returns {string} ID único
     */
    generateId() {
        return 'contact_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Valida si el contacto tiene todos los datos requeridos
     * @returns {object} Resultado de la validación
     */
    validar() {
        const errores = [];

        // Validar nombre
        if (!this.nombre || this.nombre.trim().length < 2) {
            errores.push('El nombre debe tener al menos 2 caracteres');
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(this.nombre.trim())) {
            errores.push('El nombre solo puede contener letras y espacios');
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email || !emailRegex.test(this.email.trim())) {
            errores.push('Debe proporcionar un email válido');
        }

        // Validar teléfono (opcional pero si está presente debe ser válido)
        if (this.telefono && !/^\+?[\d\s\-\(\)]{7,15}$/.test(this.telefono.trim())) {
            errores.push('El teléfono debe tener un formato válido');
        }

        // Validar motivo
        const motivosValidos = ['trabajo', 'proyecto', 'consultoria', 'otro'];
        if (!this.motivo || !motivosValidos.includes(this.motivo)) {
            errores.push('Debe seleccionar un motivo válido');
        }

        // Validar mensaje
        if (!this.mensaje || this.mensaje.trim().length < 10) {
            errores.push('El mensaje debe tener al menos 10 caracteres');
        }

        // Validar preferencia de contacto
        const preferenciasValidas = ['email', 'telefono', 'whatsapp'];
        if (!this.preferencia || !preferenciasValidas.includes(this.preferencia)) {
            errores.push('Debe seleccionar una preferencia de contacto válida');
        }

        // Validar términos y condiciones
        if (!this.aceptaTerminos) {
            errores.push('Debe aceptar los términos y condiciones');
        }

        return {
            esValido: errores.length === 0,
            errores: errores
        };
    }

    /**
     * Actualiza la fecha de actualización
     */
    actualizarFecha() {
        this.fechaActualizacion = new Date().toISOString();
    }

    /**
     * Convierte el objeto a JSON para almacenamiento
     * @returns {object} Objeto plano para serialización
     */
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre.trim(),
            email: this.email.trim().toLowerCase(),
            telefono: this.telefono.trim(),
            motivo: this.motivo,
            mensaje: this.mensaje.trim(),
            aceptaTerminos: this.aceptaTerminos,
            preferencia: this.preferencia,
            fechaCreacion: this.fechaCreacion,
            fechaActualizacion: this.fechaActualizacion
        };
    }

    /**
     * Crea una instancia de Contacto desde un objeto JSON
     * @param {object} data Datos del contacto
     * @returns {Contacto} Nueva instancia de Contacto
     */
    static fromJSON(data) {
        return new Contacto({
            id: data.id,
            nombre: data.nombre,
            email: data.email,
            telefono: data.telefono,
            motivo: data.motivo,
            mensaje: data.mensaje,
            aceptaTerminos: data.aceptaTerminos,
            preferenciaContacto: data.preferencia,
            fechaCreacion: data.fechaCreacion,
            fechaActualizacion: data.fechaActualizacion
        });
    }

    /**
     * Clona el contacto actual
     * @returns {Contacto} Nueva instancia clonada
     */
    clonar() {
        return Contacto.fromJSON(this.toJSON());
    }

    /**
     * Actualiza los datos del contacto
     * @param {object} nuevosDatos Nuevos datos para actualizar
     */
    actualizar(nuevosDatos) {
        if (nuevosDatos.nombre !== undefined) this.nombre = nuevosDatos.nombre;
        if (nuevosDatos.email !== undefined) this.email = nuevosDatos.email;
        if (nuevosDatos.telefono !== undefined) this.telefono = nuevosDatos.telefono;
        if (nuevosDatos.motivo !== undefined) this.motivo = nuevosDatos.motivo;
        if (nuevosDatos.mensaje !== undefined) this.mensaje = nuevosDatos.mensaje;
        if (nuevosDatos.aceptaTerminos !== undefined) this.aceptaTerminos = nuevosDatos.aceptaTerminos;
        if (nuevosDatos.preferencia !== undefined) this.preferencia = nuevosDatos.preferencia;
        
        this.actualizarFecha();
    }

    /**
     * Obtiene un resumen del contacto para mostrar en listas
     * @returns {object} Resumen del contacto
     */
    obtenerResumen() {
        return {
            id: this.id,
            nombre: this.nombre,
            email: this.email,
            motivo: this.motivo,
            fechaCreacion: this.fechaCreacion,
            mensajeCorto: this.mensaje.length > 50 ? 
                this.mensaje.substring(0, 50) + '...' : 
                this.mensaje
        };
    }

    /**
     * Compara si dos contactos son iguales (por email)
     * @param {Contacto} otroContacto Contacto a comparar
     * @returns {boolean} True si son iguales
     */
    esIgual(otroContacto) {
        return this.email.toLowerCase().trim() === otroContacto.email.toLowerCase().trim();
    }

    /**
     * Formatea la fecha de creación para mostrar
     * @returns {string} Fecha formateada
     */
    formatearFechaCreacion() {
        return new Date(this.fechaCreacion).toLocaleString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Formatea la fecha de actualización para mostrar
     * @returns {string} Fecha formateada
     */
    formatearFechaActualizacion() {
        return new Date(this.fechaActualizacion).toLocaleString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Obtiene el texto descriptivo del motivo
     * @returns {string} Descripción del motivo
     */
    obtenerTextoMotivo() {
        const motivos = {
            'trabajo': 'Oportunidad laboral',
            'proyecto': 'Colaboración en proyecto',
            'consultoria': 'Consultoría',
            'otro': 'Otro'
        };
        return motivos[this.motivo] || this.motivo;
    }

    /**
     * Obtiene el texto descriptivo de la preferencia
     * @returns {string} Descripción de la preferencia
     */
    obtenerTextoPreferencia() {
        const preferencias = {
            'email': 'Correo electrónico',
            'telefono': 'Teléfono',
            'whatsapp': 'WhatsApp'
        };
        return preferencias[this.preferencia] || this.preferencia;
    }

    /**
     * Convierte el contacto a string para debugging
     * @returns {string} Representación string del contacto
     */
    toString() {
        return `Contacto[${this.id}]: ${this.nombre} (${this.email}) - ${this.obtenerTextoMotivo()}`;
    }
}