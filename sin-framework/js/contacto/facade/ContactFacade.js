
class ContactFacade {
    constructor() {
        this.repository = new ContactRepository();
        this.validationEnabled = true;
        this.notificationCallbacks = [];
    }

    /**
     * Guarda un nuevo contacto desde los datos del formulario
     * @param {object} datosFormulario Datos del formulario
     * @returns {object} Resultado de la operación
     */
    guardarContacto(datosFormulario) {
        try {
            // Crear instancia de Contacto
            const contacto = new Contacto({
                nombre: datosFormulario.nombre,
                email: datosFormulario.email,
                telefono: datosFormulario.telefono || '',
                motivo: datosFormulario.motivo,
                mensaje: datosFormulario.mensaje,
                aceptaTerminos: datosFormulario.aceptaTerminos,
                preferenciaContacto: datosFormulario.preferencia
            });

            // Validar si está habilitado
            if (this.validationEnabled) {
                const validacion = contacto.validar();
                if (!validacion.esValido) {
                    return {
                        exito: false,
                        mensaje: 'Datos inválidos: ' + validacion.errores.join(', '),
                        errores: validacion.errores
                    };
                }
            }

            // Guardar en el repositorio
            const guardado = this.repository.add(contacto);
            
            if (guardado) {
                this.notificar('contacto_guardado', contacto);
                return {
                    exito: true,
                    mensaje: 'Contacto guardado exitosamente',
                    contacto: contacto.toJSON()
                };
            } else {
                return {
                    exito: false,
                    mensaje: 'Error al guardar el contacto'
                };
            }

        } catch (error) {
            console.error('Error en guardarContacto:', error);
            return {
                exito: false,
                mensaje: 'Error interno: ' + error.message,
                error: error
            };
        }
    }

    /**
     * Actualiza un contacto existente
     * @param {string} id ID del contacto
     * @param {object} nuevosDatos Nuevos datos
     * @returns {object} Resultado de la operación
     */
    actualizarContacto(id, nuevosDatos) {
        try {
            const contactoExistente = this.repository.getById(id);
            
            if (!contactoExistente) {
                return {
                    exito: false,
                    mensaje: 'Contacto no encontrado'
                };
            }

            // Actualizar datos
            contactoExistente.actualizar(nuevosDatos);

            // Validar si está habilitado
            if (this.validationEnabled) {
                const validacion = contactoExistente.validar();
                if (!validacion.esValido) {
                    return {
                        exito: false,
                        mensaje: 'Datos inválidos: ' + validacion.errores.join(', '),
                        errores: validacion.errores
                    };
                }
            }

            // Guardar cambios
            const actualizado = this.repository.update(contactoExistente);
            
            if (actualizado) {
                this.notificar('contacto_actualizado', contactoExistente);
                return {
                    exito: true,
                    mensaje: 'Contacto actualizado exitosamente',
                    contacto: contactoExistente.toJSON()
                };
            } else {
                return {
                    exito: false,
                    mensaje: 'Error al actualizar el contacto'
                };
            }

        } catch (error) {
            console.error('Error en actualizarContacto:', error);
            return {
                exito: false,
                mensaje: 'Error interno: ' + error.message,
                error: error
            };
        }
    }

    /**
     * Lista todos los contactos
     * @param {object} opciones Opciones de filtrado y ordenamiento
     * @returns {Contacto[]} Array de contactos
     */
    listarContactos(opciones = {}) {
        try {
            let contactos = this.repository.getAll();

            // Aplicar filtros
            if (opciones.motivo) {
                contactos = contactos.filter(c => c.motivo === opciones.motivo);
            }

            if (opciones.preferencia) {
                contactos = contactos.filter(c => c.preferencia === opciones.preferencia);
            }

            if (opciones.busqueda) {
                const busqueda = opciones.busqueda.toLowerCase();
                contactos = contactos.filter(c => 
                    c.nombre.toLowerCase().includes(busqueda) ||
                    c.email.toLowerCase().includes(busqueda) ||
                    c.mensaje.toLowerCase().includes(busqueda)
                );
            }

            // Aplicar ordenamiento
            const ordenPor = opciones.ordenarPor || 'fechaCreacion';
            const ascendente = opciones.ascendente !== false; // Por defecto descendente para fechas

            contactos.sort((a, b) => {
                let valorA, valorB;

                switch (ordenPor) {
                    case 'nombre':
                        valorA = a.nombre.toLowerCase();
                        valorB = b.nombre.toLowerCase();
                        break;
                    case 'email':
                        valorA = a.email.toLowerCase();
                        valorB = b.email.toLowerCase();
                        break;
                    case 'fechaCreacion':
                        valorA = new Date(a.fechaCreacion);
                        valorB = new Date(b.fechaCreacion);
                        break;
                    case 'fechaActualizacion':
                        valorA = new Date(a.fechaActualizacion);
                        valorB = new Date(b.fechaActualizacion);
                        break;
                    default:
                        valorA = a[ordenPor];
                        valorB = b[ordenPor];
                }

                if (valorA < valorB) return ascendente ? -1 : 1;
                if (valorA > valorB) return ascendente ? 1 : -1;
                return 0;
            });

            // Aplicar paginación si se especifica
            if (opciones.pagina && opciones.limite) {
                const inicio = (opciones.pagina - 1) * opciones.limite;
                const fin = inicio + opciones.limite;
                contactos = contactos.slice(inicio, fin);
            }

            return contactos;

        } catch (error) {
            console.error('Error en listarContactos:', error);
            return [];
        }
    }

    /**
     * Obtiene un contacto por ID
     * @param {string} id ID del contacto
     * @returns {Contacto|null} Contacto encontrado o null
     */
    obtenerContacto(id) {
        try {
            return this.repository.getById(id);
        } catch (error) {
            console.error('Error en obtenerContacto:', error);
            return null;
        }
    }

    /**
     * Elimina un contacto por ID
     * @param {string} id ID del contacto a eliminar
     * @returns {object} Resultado de la operación
     */
    eliminarContacto(id) {
        try {
            const contactoExistente = this.repository.getById(id);
            
            if (!contactoExistente) {
                return {
                    exito: false,
                    mensaje: 'Contacto no encontrado'
                };
            }

            const eliminado = this.repository.remove(id);
            
            if (eliminado) {
                this.notificar('contacto_eliminado', contactoExistente);
                return {
                    exito: true,
                    mensaje: 'Contacto eliminado exitosamente'
                };
            } else {
                return {
                    exito: false,
                    mensaje: 'Error al eliminar el contacto'
                };
            }

        } catch (error) {
            console.error('Error en eliminarContacto:', error);
            return {
                exito: false,
                mensaje: 'Error interno: ' + error.message,
                error: error
            };
        }
    }

    /**
     * Elimina todos los contactos
     * @returns {object} Resultado de la operación
     */
    borrarTodo() {
        try {
            // Confirmar operación
            if (!confirm('¿Está seguro de que desea eliminar todos los contactos? Esta acción no se puede deshacer.')) {
                return {
                    exito: false,
                    mensaje: 'Operación cancelada por el usuario'
                };
            }

            const totalAntes = this.repository.count();
            const eliminado = this.repository.clear();
            
            if (eliminado) {
                this.notificar('todos_contactos_eliminados', { total: totalAntes });
                return {
                    exito: true,
                    mensaje: `Todos los contactos (${totalAntes}) fueron eliminados exitosamente`
                };
            } else {
                return {
                    exito: false,
                    mensaje: 'Error al eliminar los contactos'
                };
            }

        } catch (error) {
            console.error('Error en borrarTodo:', error);
            return {
                exito: false,
                mensaje: 'Error interno: ' + error.message,
                error: error
            };
        }
    }

    /**
     * Busca contactos por diferentes criterios
     * @param {string} termino Término de búsqueda
     * @param {string} campo Campo específico a buscar ('nombre', 'email', 'mensaje', 'todos')
     * @returns {Contacto[]} Array de contactos encontrados
     */
    buscarContactos(termino, campo = 'todos') {
        try {
            if (!termino || termino.trim() === '') {
                return [];
            }

            const contactos = this.repository.getAll();
            const terminoBusqueda = termino.toLowerCase().trim();

            return contactos.filter(contacto => {
                switch (campo) {
                    case 'nombre':
                        return contacto.nombre.toLowerCase().includes(terminoBusqueda);
                    case 'email':
                        return contacto.email.toLowerCase().includes(terminoBusqueda);
                    case 'mensaje':
                        return contacto.mensaje.toLowerCase().includes(terminoBusqueda);
                    case 'telefono':
                        return contacto.telefono.includes(terminoBusqueda);
                    case 'todos':
                    default:
                        return contacto.nombre.toLowerCase().includes(terminoBusqueda) ||
                               contacto.email.toLowerCase().includes(terminoBusqueda) ||
                               contacto.mensaje.toLowerCase().includes(terminoBusqueda) ||
                               contacto.telefono.includes(terminoBusqueda);
                }
            });

        } catch (error) {
            console.error('Error en buscarContactos:', error);
            return [];
        }
    }

    /**
     * Obtiene estadísticas generales
     * @returns {object} Objeto con estadísticas
     */
    obtenerEstadisticas() {
        try {
            const stats = this.repository.getStats();
            
            // Agregar estadísticas adicionales calculadas por la fachada
            stats.promedioMensajePorDia = this.calcularPromedioMensajesPorDia();
            stats.motivoMasComun = this.obtenerMotivoMasComun(stats.porMotivo);
            stats.preferenciaMasComun = this.obtenerPreferenciaMasComun(stats.porPreferencia);
            
            return stats;

        } catch (error) {
            console.error('Error en obtenerEstadisticas:', error);
            return {};
        }
    }

    /**
     * Exporta contactos en diferentes formatos
     * @param {string} formato Formato de exportación ('json', 'csv')
     * @returns {object} Resultado de la exportación
     */
    exportarContactos(formato = 'json') {
        try {
            const contactos = this.repository.getAll();
            
            if (contactos.length === 0) {
                return {
                    exito: false,
                    mensaje: 'No hay contactos para exportar'
                };
            }

            let contenido, mimeType, extension;

            switch (formato.toLowerCase()) {
                case 'json':
                    contenido = this.repository.exportToJSON();
                    mimeType = 'application/json';
                    extension = 'json';
                    break;
                    
                case 'csv':
                    contenido = this.exportarCSV(contactos);
                    mimeType = 'text/csv';
                    extension = 'csv';
                    break;
                    
                default:
                    return {
                        exito: false,
                        mensaje: 'Formato no soportado'
                    };
            }

            // Crear blob y URL para descarga
            const blob = new Blob([contenido], { type: mimeType });
            const url = URL.createObjectURL(blob);
            
            return {
                exito: true,
                mensaje: `Contactos exportados en formato ${formato.toUpperCase()}`,
                url: url,
                filename: `contactos_${new Date().toISOString().split('T')[0]}.${extension}`,
                total: contactos.length
            };

        } catch (error) {
            console.error('Error en exportarContactos:', error);
            return {
                exito: false,
                mensaje: 'Error al exportar contactos: ' + error.message
            };
        }
    }

    /**
     * Importa contactos desde un archivo
     * @param {string} contenido Contenido del archivo
     * @param {string} formato Formato del archivo ('json', 'csv')
     * @param {boolean} reemplazar True para reemplazar todos los contactos
     * @returns {object} Resultado de la importación
     */
    importarContactos(contenido, formato = 'json', reemplazar = false) {
        try {
            let resultado;

            switch (formato.toLowerCase()) {
                case 'json':
                    resultado = this.repository.importFromJSON(contenido, reemplazar);
                    break;
                    
                case 'csv':
                    resultado = this.importarCSV(contenido, reemplazar);
                    break;
                    
                default:
                    return {
                        exito: false,
                        mensaje: 'Formato no soportado'
                    };
            }

            if (resultado.exito) {
                this.notificar('contactos_importados', resultado);
            }

            return resultado;

        } catch (error) {
            console.error('Error en importarContactos:', error);
            return {
                exito: false,
                mensaje: 'Error al importar contactos: ' + error.message
            };
        }
    }

    /**
     * Valida y limpia la base de datos de contactos
     * @returns {object} Resultado de la operación
     */
    limpiarBaseDatos() {
        try {
            const totalAntes = this.repository.count();
            const limpiado = this.repository.cleanup();
            const totalDespues = this.repository.count();
            
            if (limpiado) {
                const eliminados = totalAntes - totalDespues;
                return {
                    exito: true,
                    mensaje: `Base de datos limpiada. ${eliminados} duplicados eliminados.`,
                    contactosEliminados: eliminados,
                    contactosRestantes: totalDespues
                };
            } else {
                return {
                    exito: false,
                    mensaje: 'Error al limpiar la base de datos'
                };
            }

        } catch (error) {
            console.error('Error en limpiarBaseDatos:', error);
            return {
                exito: false,
                mensaje: 'Error interno: ' + error.message
            };
        }
    }

    /**
     * Registra un callback para notificaciones de eventos
     * @param {function} callback Función a llamar cuando ocurra un evento
     */
    suscribirNotificaciones(callback) {
        if (typeof callback === 'function') {
            this.notificationCallbacks.push(callback);
        }
    }

    /**
     * Desregistra un callback de notificaciones
     * @param {function} callback Función a remover
     */
    desuscribirNotificaciones(callback) {
        const index = this.notificationCallbacks.indexOf(callback);
        if (index > -1) {
            this.notificationCallbacks.splice(index, 1);
        }
    }

    // === MÉTODOS PRIVADOS ===

    /**
     * Notifica a todos los callbacks suscritos
     * @private
     */
    notificar(evento, datos = null) {
        this.notificationCallbacks.forEach(callback => {
            try {
                callback(evento, datos);
            } catch (error) {
                console.error('Error en callback de notificación:', error);
            }
        });
    }

    /**
     * Calcula el promedio de mensajes por día
     * @private
     */
    calcularPromedioMensajesPorDia() {
        try {
            const contactos = this.repository.getAll();
            
            if (contactos.length === 0) return 0;

            const fechas = contactos.map(c => new Date(c.fechaCreacion).toDateString());
            const fechasUnicas = [...new Set(fechas)];
            
            return Math.round((contactos.length / fechasUnicas.length) * 100) / 100;

        } catch (error) {
            return 0;
        }
    }

    /**
     * Obtiene el motivo más común
     * @private
     */
    obtenerMotivoMasComun(porMotivo) {
        try {
            let maxCount = 0;
            let motivoMasComun = null;

            for (const [motivo, count] of Object.entries(porMotivo)) {
                if (count > maxCount) {
                    maxCount = count;
                    motivoMasComun = motivo;
                }
            }

            return motivoMasComun;
        } catch (error) {
            return null;
        }
    }

    /**
     * Obtiene la preferencia más común
     * @private
     */
    obtenerPreferenciaMasComun(porPreferencia) {
        try {
            let maxCount = 0;
            let preferenciaMasComun = null;

            for (const [preferencia, count] of Object.entries(porPreferencia)) {
                if (count > maxCount) {
                    maxCount = count;
                    preferenciaMasComun = preferencia;
                }
            }

            return preferenciaMasComun;
        } catch (error) {
            return null;
        }
    }

    /**
     * Exporta contactos a formato CSV
     * @private
     */
    exportarCSV(contactos) {
        const headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'Motivo', 'Mensaje', 'Preferencia', 'Acepta Términos', 'Fecha Creación', 'Fecha Actualización'];
        const csvContent = [headers.join(',')];

        contactos.forEach(contacto => {
            const row = [
                contacto.id,
                `"${contacto.nombre}"`,
                contacto.email,
                contacto.telefono,
                contacto.motivo,
                `"${contacto.mensaje.replace(/"/g, '""')}"`,
                contacto.preferencia,
                contacto.aceptaTerminos ? 'Sí' : 'No',
                contacto.fechaCreacion,
                contacto.fechaActualizacion
            ];
            csvContent.push(row.join(','));
        });

        return csvContent.join('\n');
    }

    /**
     * Importa contactos desde formato CSV
     * @private
     */
    importarCSV(contenido, reemplazar) {
        try {
            const lines = contenido.split('\n').filter(line => line.trim());
            if (lines.length < 2) {
                throw new Error('El archivo CSV debe tener al menos una línea de encabezados y una de datos');
            }

            const contactosImportados = [];
            const errores = [];

            // Saltar la primera línea (encabezados)
            for (let i = 1; i < lines.length; i++) {
                try {
                    const campos = this.parseCSVLine(lines[i]);
                    
                    if (campos.length >= 6) { // Mínimo campos requeridos
                        const contactoData = {
                            nombre: campos[1]?.replace(/"/g, '') || '',
                            email: campos[2] || '',
                            telefono: campos[3] || '',
                            motivo: campos[4] || 'otro',
                            mensaje: campos[5]?.replace(/"/g, '').replace(/""/g, '"') || '',
                            preferencia: campos[6] || 'email',
                            aceptaTerminos: campos[7]?.toLowerCase() === 'sí' || campos[7]?.toLowerCase() === 'true'
                        };

                        contactosImportados.push(contactoData);
                    }
                } catch (error) {
                    errores.push(`Línea ${i + 1}: ${error.message}`);
                }
            }

            // Convertir a JSON y usar el método de importación JSON
            const jsonData = JSON.stringify(contactosImportados);
            return this.repository.importFromJSON(jsonData, reemplazar);

        } catch (error) {
            return {
                exito: false,
                importadosExitosos: 0,
                totalProcesados: 0,
                errores: [error.message]
            };
        }
    }

    /**
     * Parsea una línea CSV simple
     * @private
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current);
        return result;
    }

    /**
     * Habilita o deshabilita la validación automática
     * @param {boolean} enabled True para habilitar validación
     */
    configurarValidacion(enabled) {
        this.validationEnabled = enabled;
    }

    /**
     * Obtiene información del sistema
     * @returns {object} Información del sistema
     */
    obtenerInfoSistema() {
        return {
            totalContactos: this.repository.count(),
            usoMemoria: this.repository.useMemoryStorage || false,
            validacionHabilitada: this.validationEnabled,
            version: '1.0.0',
            ultimaActualizacion: new Date().toISOString()
        };
    }
}

// Crear instancia global de la fachada
const contactFacade = new ContactFacade();