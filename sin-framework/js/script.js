// Variables globales para el carrusel
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');

// Inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carrusel
    initCarousel();
    
    // Inicializar formulario de contacto
    initContactForm();
    
    // Inicializar navegación suave
    initSmoothNavigation();
    
    // Inicializar efectos de scroll
    initScrollEffects();
    
    // Cargar y mostrar contactos guardados
    if (typeof contactFacade !== 'undefined') {
        displayContacts();
        
        // Inicializar características adicionales después de un pequeño delay
        setTimeout(() => {
            initContactSearch();
            displayContactStats();
        }, 500);
    }
});

// ===== FUNCIONES DEL CARRUSEL =====
function initCarousel() {
    // Auto-play del carrusel cada 5 segundos
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function changeSlide(direction) {
    // Ocultar slide actual
    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');
    
    // Calcular nuevo índice
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    // Mostrar nuevo slide
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

function currentSlide(index) {
    // Ocultar slide actual
    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');
    
    // Cambiar al slide seleccionado
    currentSlideIndex = index - 1;
    
    // Mostrar nuevo slide
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

// ===== FUNCIONES DEL FORMULARIO DE CONTACTO =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Event listeners para validación en tiempo real
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });
    
    // Event listener para el envío del formulario
    form.addEventListener('submit', handleFormSubmit);
}

function validateField(event) {
    const field = event.target;
    const fieldName = field.name;
    const value = field.value.trim();
    
    let isValid = true;
    let errorMessage = '';
    
    // Validaciones específicas por campo
    switch (fieldName) {
        case 'nombre':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'El nombre debe tener al menos 2 caracteres';
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'El nombre solo puede contener letras y espacios';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor ingrese un email válido';
            }
            break;
            
        case 'telefono':
            if (value && !/^\+?[\d\s\-\(\)]{7,15}$/.test(value)) {
                isValid = false;
                errorMessage = 'Por favor ingrese un teléfono válido';
            }
            break;
            
        case 'mensaje':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'El mensaje debe tener al menos 10 caracteres';
            }
            break;
            
        case 'motivo':
            if (!value) {
                isValid = false;
                errorMessage = 'Por favor seleccione un motivo';
            }
            break;
    }
    
    // Mostrar/ocultar error
    showFieldError(fieldName, errorMessage);
    
    // Aplicar estilos de validación
    if (isValid && value) {
        field.classList.add('valid');
        field.classList.remove('invalid');
    } else if (!isValid) {
        field.classList.add('invalid');
        field.classList.remove('valid');
    } else {
        field.classList.remove('valid', 'invalid');
    }
    
    return isValid;
}

function clearError(event) {
    const field = event.target;
    const fieldName = field.name;
    
    if (field.value.trim() === '') {
        showFieldError(fieldName, '');
        field.classList.remove('valid', 'invalid');
    }
}

function showFieldError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + '-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = message ? 'block' : 'none';
    }
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    let isValid = true;
    
    // Validar campos requeridos
    const requiredFields = ['nombre', 'email', 'mensaje', 'motivo'];
    requiredFields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        const value = formData.get(fieldName);
        
        if (!value || value.trim() === '') {
            showFieldError(fieldName, 'Este campo es obligatorio');
            field.classList.add('invalid');
            isValid = false;
        } else {
            // Validar cada campo específico
            const fieldEvent = { target: field };
            if (!validateField(fieldEvent)) {
                isValid = false;
            }
        }
    });
    
    // Validar checkbox de términos
    const terminos = form.querySelector('[name="terminos"]');
    if (!terminos.checked) {
        showFieldError('terminos', 'Debe aceptar los términos y condiciones');
        isValid = false;
    } else {
        showFieldError('terminos', '');
    }
    
    return isValid;
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const messageElement = document.getElementById('form-message');
    
    // Validar formulario
    if (!validateForm()) {
        showFormMessage('Por favor corrija los errores antes de enviar', 'error');
        return;
    }
    
    // Recopilar datos del formulario
    const form = event.target;
    const formData = new FormData(form);
    
    const contactoData = {
        nombre: formData.get('nombre').trim(),
        email: formData.get('email').trim(),
        telefono: formData.get('telefono').trim() || '',
        motivo: formData.get('motivo'),
        mensaje: formData.get('mensaje').trim(),
        preferencia: formData.get('preferencia'),
        aceptaTerminos: formData.get('terminos') ? true : false
    };
    
    try {
        // Usar la fachada para guardar el contacto
        if (typeof contactFacade !== 'undefined') {
            contactFacade.guardarContacto(contactoData);
            showFormMessage('¡Mensaje enviado correctamente! Gracias por contactarme.', 'success');
            form.reset();
            
            // Limpiar clases de validación
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.classList.remove('valid', 'invalid');
            });
            
            // Actualizar lista de contactos
            displayContacts();
        } else {
            // Fallback si no está disponible la fachada
            showFormMessage('Mensaje recibido correctamente (simulado)', 'success');
            form.reset();
        }
        
    } catch (error) {
        console.error('Error al guardar contacto:', error);
        showFormMessage('Error al enviar el mensaje. Por favor intente nuevamente.', 'error');
    }
}

function showFormMessage(message, type) {
    const messageElement = document.getElementById('form-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        messageElement.style.display = 'block';
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

// ===== FUNCIONES DE GESTIÓN DE CONTACTOS =====
function displayContacts() {
    const contactsList = document.getElementById('contacts-list');
    if (!contactsList || typeof contactFacade === 'undefined') return;
    
    const contactos = contactFacade.listarContactos({ ordenarPor: 'fechaCreacion', ascendente: false });
    
    if (contactos.length === 0) {
        contactsList.innerHTML = `
            <div class="empty-contacts">
                <div class="empty-icon">📬</div>
                <p>No hay contactos guardados</p>
                <small>Los mensajes enviados aparecerán aquí</small>
            </div>
        `;
        return;
    }
    
    // Generar HTML para cada contacto
    contactsList.innerHTML = contactos.map((contacto, index) => `
        <div class="contact-item fade-in-contact" data-id="${contacto.id}" style="animation-delay: ${index * 0.1}s">
            <div class="contact-header">
                <div class="contact-info">
                    <div class="contact-name-section">
                        <h4>${contacto.nombre}</h4>
                        <span class="contact-badge ${getBadgeClass(contacto.motivo)}">${getMotiveText(contacto.motivo)}</span>
                    </div>
                    <div class="contact-details">
                        <div class="contact-detail">
                            <span class="detail-icon">📧</span>
                            <span>${contacto.email}</span>
                        </div>
                        ${contacto.telefono ? `
                            <div class="contact-detail">
                                <span class="detail-icon">📞</span>
                                <span>${contacto.telefono}</span>
                            </div>
                        ` : ''}
                        <div class="contact-detail">
                            <span class="detail-icon">💬</span>
                            <span>Prefiere contacto por ${getPreferenceText(contacto.preferencia)}</span>
                        </div>
                    </div>
                </div>
                <div class="contact-actions">
                    <button class="action-btn edit-btn" onclick="editContact('${contacto.id}')" title="Editar contacto">
                        <span class="btn-icon">✏️</span>
                        <span class="btn-text">Editar</span>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteContact('${contacto.id}')" title="Eliminar contacto">
                        <span class="btn-icon">🗑️</span>
                        <span class="btn-text">Eliminar</span>
                    </button>
                </div>
            </div>
            <div class="contact-message">
                <div class="message-header">
                    <strong>💌 Mensaje:</strong>
                    <span class="message-length">${contacto.mensaje.length} caracteres</span>
                </div>
                <div class="message-content">
                    <p>${contacto.mensaje}</p>
                </div>
            </div>
            <div class="contact-dates">
                <div class="date-item">
                    <span class="date-icon">📅</span>
                    <span class="date-label">Creado:</span>
                    <span class="date-value">${formatDate(contacto.fechaCreacion)}</span>
                </div>
                ${contacto.fechaActualizacion !== contacto.fechaCreacion ? `
                    <div class="date-item updated">
                        <span class="date-icon">🔄</span>
                        <span class="date-label">Actualizado:</span>
                        <span class="date-value">${formatDate(contacto.fechaActualizacion)}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');

    // Actualizar el contador de contactos
    updateContactsCounter(contactos.length);
}

function getBadgeClass(motivo) {
    const classes = {
        'trabajo': 'badge-trabajo',
        'proyecto': 'badge-proyecto', 
        'consultoria': 'badge-consultoria',
        'otro': 'badge-otro'
    };
    return classes[motivo] || 'badge-otro';
}

function updateContactsCounter(count) {
    const header = document.querySelector('.contacts-header h3');
    if (header) {
        header.textContent = `Mensajes Recibidos (${count})`;
    }
}

function getMotiveText(motivo) {
    const motivos = {
        'trabajo': 'Oportunidad laboral',
        'proyecto': 'Colaboración en proyecto',
        'consultoria': 'Consultoría',
        'otro': 'Otro'
    };
    return motivos[motivo] || motivo;
}

function getPreferenceText(preferencia) {
    const preferencias = {
        'email': 'Email',
        'telefono': 'Teléfono',
        'whatsapp': 'WhatsApp'
    };
    return preferencias[preferencia] || preferencia;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function editContact(id) {
    if (typeof contactFacade === 'undefined') return;
    
    const contacto = contactFacade.listarContactos().find(c => c.id === id);
    if (!contacto) return;
    
    // Llenar el formulario con los datos del contacto
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.querySelector('[name="nombre"]').value = contacto.nombre;
    form.querySelector('[name="email"]').value = contacto.email;
    form.querySelector('[name="telefono"]').value = contacto.telefono || '';
    form.querySelector('[name="motivo"]').value = contacto.motivo;
    form.querySelector('[name="mensaje"]').value = contacto.mensaje;
    
    // Seleccionar radio button
    const radioPreferencia = form.querySelector(`[name="preferencia"][value="${contacto.preferencia}"]`);
    if (radioPreferencia) {
        radioPreferencia.checked = true;
    }
    
    // Marcar checkbox
    form.querySelector('[name="terminos"]').checked = contacto.aceptaTerminos;
    
    // Guardar el ID para la actualización
    form.dataset.editingId = id;
    
    // Cambiar texto del botón
    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.textContent = 'Actualizar Contacto';
    
    // Scroll al formulario
    form.scrollIntoView({ behavior: 'smooth' });
    
    showFormMessage('Editando contacto. Modifique los campos y envíe para actualizar.', 'success');
}

function deleteContact(id) {
    if (typeof contactFacade === 'undefined') return;
    
    if (confirm('¿Está seguro de que desea eliminar este contacto?')) {
        const resultado = contactFacade.eliminarContacto(id);
        if (resultado.exito) {
            displayContacts();
            showFormMessage('Contacto eliminado correctamente', 'success');
        } else {
            showFormMessage('Error al eliminar el contacto: ' + resultado.mensaje, 'error');
        }
    }
}

// Agregar funcionalidad de búsqueda en tiempo real
function initContactSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 Buscar contactos...';
    searchInput.className = 'contact-search-input';
    searchInput.id = 'contact-search';
    
    const contactsHeader = document.querySelector('.contacts-header');
    if (contactsHeader) {
        // Crear contenedor para búsqueda
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.appendChild(searchInput);
        
        // Insertar después del título
        contactsHeader.insertBefore(searchContainer, contactsHeader.querySelector('.clear-all-btn'));
        
        // Agregar event listener
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.trim();
            filterContacts(searchTerm);
        });
    }
}

function filterContacts(searchTerm = '') {
    const contactItems = document.querySelectorAll('.contact-item');
    let visibleCount = 0;
    
    contactItems.forEach(item => {
        if (searchTerm === '') {
            item.style.display = 'block';
            visibleCount++;
        } else {
            const content = item.textContent.toLowerCase();
            const matches = content.includes(searchTerm.toLowerCase());
            
            item.style.display = matches ? 'block' : 'none';
            if (matches) visibleCount++;
        }
    });
    
    // Actualizar contador
    updateContactsCounter(visibleCount);
    
    // Mostrar mensaje si no hay resultados
    const contactsList = document.getElementById('contacts-list');
    const existingNoResults = contactsList.querySelector('.no-results');
    
    if (visibleCount === 0 && searchTerm !== '' && contactItems.length > 0) {
        if (!existingNoResults) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = `
                <div class="empty-icon">🔍</div>
                <p>No se encontraron contactos</p>
                <small>Intenta con otros términos de búsqueda</small>
            `;
            contactsList.appendChild(noResultsDiv);
        }
    } else if (existingNoResults) {
        existingNoResults.remove();
    }
}

// Agregar estadísticas de contactos
function displayContactStats() {
    if (typeof contactFacade === 'undefined') return;
    
    const stats = contactFacade.obtenerEstadisticas();
    const statsContainer = document.createElement('div');
    statsContainer.className = 'contact-stats';
    statsContainer.innerHTML = `
        <div class="stat-item">
            <span class="stat-number">${stats.total}</span>
            <span class="stat-label">Total</span>
        </div>
        <div class="stat-item">
            <span class="stat-number">${stats.porMotivo.trabajo || 0}</span>
            <span class="stat-label">Trabajo</span>
        </div>
        <div class="stat-item">
            <span class="stat-number">${stats.porMotivo.proyecto || 0}</span>
            <span class="stat-label">Proyectos</span>
        </div>
        <div class="stat-item">
            <span class="stat-number">${stats.porMotivo.consultoria || 0}</span>
            <span class="stat-label">Consultas</span>
        </div>
    `;
    
    const contactsHeader = document.querySelector('.contacts-header');
    if (contactsHeader && !document.querySelector('.contact-stats')) {
        contactsHeader.insertAdjacentElement('afterend', statsContainer);
    }
}

// Modificar handleFormSubmit para manejar ediciones
const originalHandleFormSubmit = handleFormSubmit;
handleFormSubmit = function(event) {
    event.preventDefault();
    
    const form = event.target;
    const editingId = form.dataset.editingId;
    
    if (editingId) {
        // Modo edición
        if (!validateForm()) {
            showFormMessage('Por favor corrija los errores antes de actualizar', 'error');
            return;
        }
        
        const formData = new FormData(form);
        const contactoData = {
            id: editingId,
            nombre: formData.get('nombre').trim(),
            email: formData.get('email').trim(),
            telefono: formData.get('telefono').trim() || '',
            motivo: formData.get('motivo'),
            mensaje: formData.get('mensaje').trim(),
            preferencia: formData.get('preferencia'),
            aceptaTerminos: formData.get('terminos') ? true : false
        };
        
        try {
            // Actualizar usando la fachada
            const contactos = contactFacade.listarContactos();
            const contactoExistente = contactos.find(c => c.id === editingId);
            
            if (contactoExistente) {
                const contactoActualizado = {
                    ...contactoExistente,
                    ...contactoData,
                    fechaActualizacion: new Date().toISOString()
                };
                
                // Usar el repositorio directamente para actualizar
                if (typeof ContactRepository !== 'undefined') {
                    const repository = new ContactRepository();
                    repository.update(contactoActualizado);
                }
                
                showFormMessage('¡Contacto actualizado correctamente!', 'success');
                form.reset();
                
                // Limpiar modo edición
                delete form.dataset.editingId;
                form.querySelector('.submit-btn').textContent = 'Enviar Mensaje';
                
                // Limpiar clases de validación
                const inputs = form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.classList.remove('valid', 'invalid');
                });
                
                displayContacts();
            }
            
        } catch (error) {
            console.error('Error al actualizar contacto:', error);
            showFormMessage('Error al actualizar el contacto. Por favor intente nuevamente.', 'error');
        }
        
    } else {
        // Modo creación
        originalHandleFormSubmit.call(this, event);
    }
};

// ===== NAVEGACIÓN SUAVE =====
function initSmoothNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== EFECTOS DE SCROLL =====
function initScrollEffects() {
    // Cambiar navbar al hacer scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 29, 57, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(0, 29, 57, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
    
    // Intersection Observer para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos animables
    const animatedElements = document.querySelectorAll('.project-card, .studies-table, .contact-form-container, .contacts-list-container');
    animatedElements.forEach(el => observer.observe(el));
}

// ===== FUNCIONES DE UTILIDAD =====
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función para manejar errores globales
window.addEventListener('error', function(event) {
    console.error('Error en la aplicación:', event.error);
});

// Función para debug (remover en producción)
function debugContactos() {
    if (typeof contactFacade !== 'undefined') {
        console.log('Contactos guardados:', contactFacade.listarContactos());
    }
}