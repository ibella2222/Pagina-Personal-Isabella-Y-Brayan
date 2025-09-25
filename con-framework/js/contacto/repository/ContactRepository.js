// Repositorio de Contactos
class ContactRepository {
    constructor() {
        this.storageKey = 'contactos';
    }

    getAll() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al obtener contactos:', error);
            return [];
        }
    }

    getById(id) {
        const contactos = this.getAll();
        return contactos.find(contacto => contacto.id === id);
    }

    add(contacto) {
        try {
            const contactos = this.getAll();
            contactos.push(contacto);
            localStorage.setItem(this.storageKey, JSON.stringify(contactos));
            return true;
        } catch (error) {
            console.error('Error al agregar contacto:', error);
            return false;
        }
    }

    update(contactoActualizado) {
        try {
            const contactos = this.getAll();
            const index = contactos.findIndex(c => c.id === contactoActualizado.id);
            if (index !== -1) {
                contactoActualizado.fechaActualizacion = new Date().toISOString();
                contactos[index] = contactoActualizado;
                localStorage.setItem(this.storageKey, JSON.stringify(contactos));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al actualizar contacto:', error);
            return false;
        }
    }

    remove(id) {
        try {
            const contactos = this.getAll();
            const nuevosContactos = contactos.filter(c => c.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(nuevosContactos));
            return true;
        } catch (error) {
            console.error('Error al eliminar contacto:', error);
            return false;
        }
    }

    clear() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error al limpiar contactos:', error);
            return false;
        }
    }
}
