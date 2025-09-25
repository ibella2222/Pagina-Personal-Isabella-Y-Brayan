// Validación del formulario
function validarFormulario(form) {
    let esValido = true;
    const campos = form.querySelectorAll('[required]');

    campos.forEach(campo => {
        if (!campo.value.trim()) {
            campo.classList.add('is-invalid');
            esValido = false;
        } else {
            campo.classList.remove('is-invalid');
            campo.classList.add('is-valid');
        }
    });

    // Validar email
    const email = form.querySelector('#email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailRegex.test(email.value)) {
        email.classList.add('is-invalid');
        esValido = false;
    }

    return esValido;
}

// Mostrar mensaje
function mostrarMensaje(mensaje, tipo) {
    const div = document.getElementById('mensajeRespuesta');
    div.className = `alert alert-${tipo}`;
    div.textContent = mensaje;
    div.style.display = 'block';
    
    setTimeout(() => {
        div.style.display = 'none';
    }, 5000);
}

// Mostrar contactos
function mostrarContactos() {
    const lista = document.getElementById('listaContactos');
    const contactos = contactFacade.listarContactos();

    if (contactos.length === 0) {
        lista.innerHTML = '<p class="text-white-50">No hay contactos guardados.</p>';
        return;
    }

    lista.innerHTML = contactos.map(contacto => `
        <div class="contact-item">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h6 class="text-white mb-0">${contacto.nombre}</h6>
                <button class="btn btn-danger btn-sm" onclick="contactFacade.eliminarContacto('${contacto.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <p class="text-white-75 mb-1"><i class="fas fa-envelope me-1"></i>${contacto.email}</p>
            ${contacto.telefono ? `<p class="text-white-75 mb-1"><i class="fas fa-phone me-1"></i>${contacto.telefono}</p>` : ''}
            ${contacto.motivo ? `<p class="text-white-75 mb-1"><i class="fas fa-tag me-1"></i>${contacto.motivo}</p>` : ''}
            <p class="text-white-60 mb-1">${contacto.mensaje.substring(0, 100)}${contacto.mensaje.length > 100 ? '...' : ''}</p>
            <small class="text-white-50">Creado: ${new Date(contacto.fechaCreacion).toLocaleString()}</small>
        </div>
    `).join('');
}

// Formulario
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validarFormulario(this)) {
        mostrarMensaje('Por favor completa todos los campos requeridos correctamente.', 'danger');
        return;
    }

    const datosFormulario = {
        nombre: document.getElementById('nombre').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        motivo: document.getElementById('motivo').value,
        mensaje: document.getElementById('mensaje').value.trim(),
        aceptaTerminos: document.getElementById('terminos').checked,
        preferenciaContacto: document.querySelector('input[name="preferencia"]:checked').value
    };

    const resultado = contactFacade.guardarContacto(datosFormulario);
    
    if (resultado.exito) {
        mostrarMensaje(resultado.mensaje, 'success');
        this.reset();
        this.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
    } else {
        mostrarMensaje(resultado.mensaje, 'danger');
    }
});

// Animaciones scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    const windowHeight = window.innerHeight;

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}

// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Eventos
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', () => {
    animateOnScroll();
    mostrarContactos();
});

// Validación en tiempo real
document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea').forEach(field => {
    field.addEventListener('blur', function() {
        if (this.hasAttribute('required')) {
            if (!this.value.trim()) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        }

        if (this.type === 'email' && this.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(this.value)) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            }
        }
    });
});
