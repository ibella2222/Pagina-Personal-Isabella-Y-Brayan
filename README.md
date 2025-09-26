🌐 Página Personal – Isabella & Brayan

Este proyecto consiste en una página web personal desarrollada con dos enfoques distintos:

Con Framework → Implementación basada en principios de Atomic Design (átomos, moléculas, organismos, plantillas y páginas).

Sin Framework → Implementación directa con HTML y CSS tradicional.

Su propósito es mostrar información personal, estudios, proyectos, hobbies y un formulario de contacto funcional de manera moderna, ordenada y responsiva.



✨ Características

🌍 Diseño responsivo: Adaptado a distintos tamaños de pantalla.

⚛️ Atomic Design en la versión con framework: arquitectura modular clara y escalable.

🧾 Secciones principales: Inicio, Estudios, Proyectos, Pasatiempos, Contacto.

📬 Formulario de contacto con validaciones en JavaScript.

🎨 Estilos personalizados en CSS para mejorar la experiencia de usuario.


🗂️ Dos versiones:

con-framework/ → arquitectura modular.

sin-framework/ → implementación clásica.


📂 Estructura del Proyecto
Pagina-Personal-Isabella-Y-Brayan/
│── con-framework/            
│   ├── components/
│   │   ├── atoms/            # Elementos básicos (botones, inputs, labels, etc.)
│   │   ├── molecules/        # Conjuntos de átomos (grupos de formularios, cards, etc.)
│   │   ├── organisms/        # Secciones completas (contacto, inicio, proyectos, etc.)
│   │   ├── pages/            # Página principal (index.html)
│   │   └── templates/        # Plantilla general de la web
│   ├── css/custom.css        # Estilos personalizados
│   └── js/                   # Scripts y lógica de negocio
│       ├── funciones.js
│       └── contacto/
│           ├── domain/       # Entidades del dominio
│           ├── facade/       # Fachada que expone la lógica
│           └── repository/   # Manejo de datos del contacto
│
│── sin-framework/            
│   ├── index.html            # Versión sencilla de la página
│   └── css/estilo.css        # Estilos de la versión sin framework
│
└── .git/                     # Configuración y control de versiones

⚙️ Tecnologías Usadas

HTML5 → Estructura semántica.

CSS3 → Estilos, layout y diseño responsivo.

JavaScript (ES6) → Validaciones, lógica de interacción y módulos.

Arquitectura Atomic Design → Modularidad y escalabilidad en la versión con framework.

Git → Control de versiones.

🚀 Instalación y Ejecución

Clonar el repositorio

git clone https://github.com/usuario/Pagina-Personal-Isabella-Y-Brayan.git


Abrir el proyecto en tu editor favorito

cd Pagina-Personal-Isabella-Y-Brayan


Ejecutar en un navegador

Versión modular (con framework):
con-framework/components/pages/index.html

Versión clásica (sin framework):
sin-framework/index.html

💡 También puedes usar una extensión como Live Server (VSCode) para visualizar en tiempo real.

📑 Secciones de la Página

Inicio → Presentación principal.

Estudios → Formación académica.

Proyectos → Trabajos destacados.

Pasatiempos → Intereses personales.

Contacto → Formulario validado con JavaScript.

Footer → Información final y enlaces.

🛠️ Arquitectura con Framework

El enfoque de Atomic Design divide la aplicación en:

Átomos → Inputs, labels, botones, párrafos, imágenes.

Moléculas → Grupos de formulario, tarjetas de proyecto, bloques de contenido.

Organismos → Secciones completas de la página (contacto, inicio, estudios).

Templates → Plantilla HTML que organiza los organismos.

Pages → Páginas finales renderizadas al usuario.

La lógica de Contacto se organiza en:

Domain → Define el modelo de datos (ej. mensaje de contacto).

Repository → Gestiona el almacenamiento.

Facade → Expone métodos simples para interactuar con el sistema.

🤝 Contribuciones

Si deseas contribuir:

Haz un fork del repositorio.

Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).

Realiza tus cambios y haz commit (git commit -m 'Agregada nueva funcionalidad').

Haz un push a tu rama (git push origin feature/nueva-funcionalidad).

Abre un Pull Request.

👨‍💻 Autores

Isabella Andrea Trochez Salazar

Brayan Meneses

📧 Para consultas, contáctanos a través del formulario en la página.

📜 Licencia

Este proyecto está bajo la licencia MIT – puedes usarlo, modificarlo y distribuirlo libremente, siempre citando a los autores originales.
