/**
 * ContactRepository
 * Implementa el patrón Repository para la gestión de contactos
 * Maneja la persistencia en localStorage
 */
class ContactRepository {
    constructor() {
        this.storageKey = 'contactos';
        this.validateLocalStorage();
    }

    /**
     * Valida que localStorage esté disponible
     */
    validateLocalStorage() {
        try {
            const testKey = '__localStorage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
        } catch (error) {
            console.warn('localStorage no está disponible, usando memoria temporal');
            this.useMemoryStorage = true;
            this.memoryStorage = [];
        }
    }

    /**
     * Obtiene todos los contactos
     * @returns {Contacto[]} Array de contactos
     */
    getAll() {
        try {
            if (this.useMemoryStorage) {
                return this.memoryStorage.map(data => Contacto.fromJSON(data));
            }

            const data = localStorage.getItem(this.storageKey);
            if (!data) {
                return [];
            }

            const contactosData = JSON.parse(data);
            if (!Array.isArray(contactosData)) {
                console.warn('Datos de contactos corruptos, inicializando array vacío');
                return [];
            }

            return contactosData.map(contactoData => Contacto.fromJSON(contactoData));
        } catch (error) {
            console.error('Error al obtener contactos:', error);
            return [];
        }
    }

    /**
     * Obtiene un contacto por ID
     * @param {string} id ID del contacto
     * @returns {Contacto|null} Contacto encontrado o null
     */
    getById(id) {
        try {
            const contactos = this.getAll();
            const contacto = contactos.find(c => c.id === id);
            return contacto || null;
        } catch (error) {
            console.error('Error al obtener contacto por ID:', error);
            return null;
        }
    }

    /**
     * Busca contactos por email
     * @param {string} email Email a buscar
     * @returns {Contacto[]} Array de contactos encontrados
     */
    findByEmail(email) {
        try {
            const contactos = this.getAll();
            return contactos.filter(c => 
                c.email.toLowerCase().trim() === email.toLowerCase().trim()
            );
        } catch (error) {
            console.error('Error al buscar contacto por email:', error);
            return [];
        }
    }

    /**
     * Busca contactos por motivo
     * @param {string} motivo Motivo a buscar
     * @returns {Contacto[]} Array de contactos encontrados
     */
    findByMotivo(motivo) {
        try {
            const contactos = this.getAll();
            return contactos.filter(c => c.motivo === motivo);
        } catch (error) {
            console.error('Error al buscar contactos por motivo:', error);
            return [];
        }
    }

    /**
     * Agrega un nuevo contacto
     * @param {Contacto} contacto Contacto a agregar
     * @returns {boolean} True si se agregó correctamente
     */
    add(contacto) {
        try {
            if (!(contacto instanceof Contacto)) {
                throw new Error('El parámetro debe ser una instancia de Contacto');
            }

            // Validar el contacto antes de agregarlo
            const validacion = contacto.validar();
            if (!validacion.esValido) {
                throw new Error('Contacto inválido: ' + validacion.errores.join(', '));
            }

            const contactos = this.getAll();
            
            // Verificar si ya existe un contacto con el mismo ID
            const existeId = contactos.some(c => c.id === contacto.id);
            if (existeId) {
                throw new Error('Ya existe un contacto con el mismo ID');
            }

            // Verificar duplicados por email (opcional, comentado para permitir múltiples contactos del mismo email)
            // const existeEmail = contactos.some(c => c.esIgual(contacto));
            // if (existeEmail) {
            //     throw new Error('Ya existe un contacto con el mismo email');
            // }

            contactos.push(contacto);
            return this.saveAll(contactos);
        } catch (error) {
            console.error('Error al agregar contacto:', error);
            throw error;
        }
    }

    /**
     * Actualiza un contacto existente
     * @param {Contacto} contacto Contacto a actualizar
     * @returns {boolean} True si se actualizó correctamente
     */
    update(contacto) {
        try {
            if (!(contacto instanceof Contacto)) {
                throw new Error('El parámetro debe ser una instancia de Contacto');
            }

            // Validar el contacto antes de actualizarlo
            const validacion = contacto.validar();
            if (!validacion.esValido) {
                throw new Error('Contacto inválido: ' + validacion.errores.join(', '));
            }

            const contactos = this.getAll();
            const index = contactos.findIndex(c => c.id === contacto.id);
            
            if (index === -1) {
                throw new Error('Contacto no encontrado');
            }

            // Actualizar fecha de modificación
            contacto.actualizarFecha();
            
            contactos[index] = contacto;
            return this.saveAll(contactos);
        } catch (error) {
            console.error('Error al actualizar contacto:', error);
            throw error;
        }
    }

    /**
     * Elimina un contacto por ID
     * @param {string} id ID del contacto a eliminar
     * @returns {boolean} True si se eliminó correctamente
     */
    remove(id) {
        try {
            const contactos = this.getAll();
            const index = contactos.findIndex(c => c.id === id);
            
            if (index === -1) {
                throw new Error('Contacto no encontrado');
            }

            contactos.splice(index, 1);
            return this.saveAll(contactos);
        } catch (error) {
            console.error('Error al eliminar contacto:', error);
            throw error;
        }
    }

    /**
     * Elimina todos los contactos
     * @returns {boolean} True si se eliminaron correctamente
     */
    clear() {
        try {
            if (this.useMemoryStorage) {
                this.memoryStorage = [];
                return true;
            }

            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error al limpiar contactos:', error);
            return false;
        }
    }

    /**
     * Guarda todos los contactos en el almacenamiento
     * @param {Contacto[]} contactos Array de contactos a guardar
     * @returns {boolean} True si se guardó correctamente
     */
    saveAll(contactos) {
        try {
            const contactosData = contactos.map(contacto => contacto.toJSON());
            
            if (this.useMemoryStorage) {
                this.memoryStorage = contactosData;
                return true;
            }

            localStorage.setItem(this.storageKey, JSON.stringify(contactosData));
            return true;
        } catch (error) {
            console.error('Error al guardar contactos:', error);
            return false;
        }
    }

    /**
     * Cuenta el total de contactos
     * @returns {number} Número total de contactos
     */
    count() {
        try {
            const contactos = this.getAll();
            return contactos.length;
        } catch (error) {
            console.error('Error al contar contactos:', error);
            return 0;
        }
    }

    /**
     * Verifica si existe un contacto con el ID dado
     * @param {string} id ID a verificar
     * @returns {boolean} True si existe
     */
    exists(id) {
        try {
            return this.getById(id) !== null;
        } catch (error) {
            console.error('Error al verificar existencia de contacto:', error);
            return false;
        }
    }

    /**
     * Obtiene contactos ordenados por fecha de creación
     * @param {boolean} ascendente True para orden ascendente, false para descendente
     * @returns {Contacto[]} Array de contactos ordenados
     */
    getAllOrderedByDate(ascendente = false) {
        try {
            const contactos = this.getAll();
            return contactos.sort((a, b) => {
                const fechaA = new Date(a.fechaCreacion);
                const fechaB = new Date(b.fechaCreacion);
                return ascendente ? fechaA - fechaB : fechaB - fechaA;
            });
        } catch (error) {
            console.error('Error al ordenar contactos:', error);
            return [];
        }
    }

    /**
     * Obtiene estadísticas de los contactos
     * @returns {object} Objeto con estadísticas
     */
    getStats() {
        try {
            const contactos = this.getAll();
            const stats = {
                total: contactos.length,
                porMotivo: {},
                porPreferencia: {},
                fechaUltimoContacto: null,
                fechaPrimerContacto: null
            };

            contactos.forEach(contacto => {
                // Contar por motivo
                stats.porMotivo[contacto.motivo] = (stats.porMotivo[contacto.motivo] || 0) + 1;
                
                // Contar por preferencia
                stats.porPreferencia[contacto.preferencia] = (stats.porPreferencia[contacto.preferencia] || 0) + 1;
                
                // Fechas
                const fecha = new Date(contacto.fechaCreacion);
                if (!stats.fechaUltimoContacto || fecha > new Date(stats.fechaUltimoContacto)) {
                    stats.fechaUltimoContacto = contacto.fechaCreacion;
                }
                if (!stats.fechaPrimerContacto || fecha < new Date(stats.fechaPrimerContacto)) {
                    stats.fechaPrimerContacto = contacto.fechaCreacion;
                }
            });

            return stats;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            return {
                total: 0,
                porMotivo: {},
                porPreferencia: {},
                fechaUltimoContacto: null,
                fechaPrimerContacto: null
            };
        }
    }

    /**
     * Exporta todos los contactos a JSON
     * @returns {string} JSON string con todos los contactos
     */
    exportToJSON() {
        try {
            const contactos = this.getAll();
            return JSON.stringify(contactos.map(c => c.toJSON()), null, 2);
        } catch (error) {
            console.error('Error al exportar contactos:', error);
            return '[]';
        }
    }

    /**
     * Importa contactos desde JSON
     * @param {string} jsonData Datos JSON a importar
     * @param {boolean} reemplazar True para reemplazar todos, false para agregar
     * @returns {object} Resultado de la importación
     */
    importFromJSON(jsonData, reemplazar = false) {
        try {
            const datosImportados = JSON.parse(jsonData);
            
            if (!Array.isArray(datosImportados)) {
                throw new Error('Los datos deben ser un array');
            }

            let contactosActuales = reemplazar ? [] : this.getAll();
            let importadosExitosos = 0;
            let errores = [];

            datosImportados.forEach((data, index) => {
                try {
                    const contacto = Contacto.fromJSON(data);
                    const validacion = contacto.validar();
                    
                    if (validacion.esValido) {
                        contactosActuales.push(contacto);
                        importadosExitosos++;
                    } else {
                        errores.push(`Contacto ${index + 1}: ${validacion.errores.join(', ')}`);
                    }
                } catch (error) {
                    errores.push(`Contacto ${index + 1}: Error de formato - ${error.message}`);
                }
            });

            if (importadosExitosos > 0) {
                this.saveAll(contactosActuales);
            }

            return {
                exito: importadosExitosos > 0,
                importadosExitosos,
                totalProcesados: datosImportados.length,
                errores
            };
        } catch (error) {
            console.error('Error al importar contactos:', error);
            return {
                exito: false,
                importadosExitosos: 0,
                totalProcesados: 0,
                errores: [error.message]
            };
        }
    }

    /**
     * Limpia y optimiza el almacenamiento
     * @returns {boolean} True si la limpieza fue exitosa
     */
    cleanup() {
        try {
            const contactos = this.getAll();
            // Eliminar duplicados por email (mantener el más reciente)
            const contactosUnicos = new Map();
            
            contactos.forEach(contacto => {
                const email = contacto.email.toLowerCase().trim();
                const existente = contactosUnicos.get(email);
                
                if (!existente || new Date(contacto.fechaCreacion) > new Date(existente.fechaCreacion)) {
                    contactosUnicos.set(email, contacto);
                }
            });

            const contactosLimpios = Array.from(contactosUnicos.values());
            return this.saveAll(contactosLimpios);
        } catch (error) {
            console.error('Error al limpiar contactos:', error);
            return false;
        }
    }
}