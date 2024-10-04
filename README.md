# **Energia Solar Canarias**

Este proyecto es una aplicación de **PWA (Progressive Web App)** desarrollada con **Next.js** y **Tailwind CSS**. El objetivo principal es proporcionar una plataforma para la empresa _Energia Solar Canarias_, que ofrece soluciones de energía solar en las Islas Canarias.

## 🛠 **Tecnologías Utilizadas**

- **Next.js**: Framework React para desarrollo web optimizado y rápido.
- **Tailwind CSS**: Framework CSS para un diseño responsivo y estilizado.
- **Framer Motion**: Librería para animaciones fluidas.
- **React Hook Form**: Para la validación y manejo de formularios de manera eficiente.

## 📋 **Índice**

1. [Cómo Empezar](#cómo-empezar)
2. [Estructura Detallada del Proyecto](#estructura-detallada-del-proyecto)
3. [Despliegue en AWS Amplify](#despliegue-en-aws-amplify)
4. [Características de la Aplicación](#características-de-la-aplicación)
5. [Licencia](#licencia)

## **Cómo Empezar**

### Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/energia-solar-canarias.git
cd energia-solar-canarias
```

### Instalar las dependencias

```bash
npm install
```

### Iniciar el servidor de desarrollo

```bash
npm run dev
```

Luego abre http://localhost:3000 en tu navegador para ver la aplicación en funcionamiento.

## Estructura Detallada del Proyecto

```bash
.
├── app                       # Carpeta que contiene las rutas y layouts globales de la aplicación Next.js/
│   ├── layout.js                # Layout global que envuelve todas las páginas, ideal para definir el diseño base de la aplicación (header, footer)
│   ├── page.js                  # Página principal de la aplicación, corresponde a la ruta raíz `/`
│   ├── global.css               # Archivo de estilos globales aplicados en toda la aplicación, contiene las reglas CSS que no cambian entre páginas
│   └── icon.png                 # Icono de la aplicación (favicon), utilizado en la pestaña del navegador y en la instalación de PWA
├── components                # Componentes reutilizables para las distintas partes de la aplicación (UI, funcionalidad)/
│   └── magicui                 # Carpeta que contiene componentes de UI personalizados o efectos visuales especiales que añaden interactividad o magia a la interfaz
├── hooks                     # Hooks personalizados para reutilizar lógica en varios componentes
├── lib                       # Biblioteca interna con utilidades o funciones compartidas a lo largo de la aplicación
├── public                    # Archivos estáticos como imágenes, videos y fuentes accesibles directamente desde la URL/
│   └── assets                  # Carpeta que contiene todos los recursos estáticos como imágenes, videos y fuentes utilizados en la aplicación/
│       ├── fonts             # Fuentes personalizadas utilizadas en la aplicación, como Adam Bold y Corbert
│       ├── img               # Imágenes como el logo y otras gráficas que se muestran en la interfaz de la aplicación
│       ├── vids              # Videos utilizados en la aplicación, como animaciones de fondo o elementos multimedia
│       └── icons             # Carpeta que contiene todos los íconos utilizados en la aplicación, como favicons, íconos de redes sociales etc
├── services                  # Servicios para la lógica de negocio, como llamadas a API o manejo de datos
├── store                     # Almacenamiento global de estado, configurado con Redux o cualquier otra solución de estado
├── components.json           # Archivo de configuración para componentes generado por magicui
├── jsconfig.json             # Archivo de configuración para el sistema de módulos de JavaScript, incluyendo alias de rutas
├── manifest.json             # Archivo de manifiesto PWA para definir la instalación y configuración de la aplicación en dispositivos
├── next.config.mjs           # Configuración de Next.js para gestionar opciones avanzadas como redirecciones, imágenes, etc.
├── package-lock.json         # Archivo que asegura las versiones exactas de las dependencias instaladas en el proyecto
├── package.json              # Archivo de configuración del proyecto que incluye las dependencias y scripts de npm
├── postcss.config.mjs        # Configuración de PostCSS, usado para el procesamiento de CSS en conjunto con Tailwind CSS
└── tailwind.config.mjs       # Configuración de Tailwind CSS para personalizar colores, fuentes, y otros estilos globales
```

## Despliegue en AWS Amplify

El proyecto está configurado para su despliegue en AWS Amplify. Si deseas acceder al panel de control de AWS Amplify, usa las siguientes credenciales:

Correo electrónico: soporte@galagaagency.com <br/>
Contraseña: Galagaagency2024\*

Pasos para el despliegue:

- Realiza el commit y push de tus cambios a la rama principal.
- AWS Amplify desplegará automáticamente la aplicación desde el repositorio conectado.

## Características de la Aplicación

- Formulario Flip: El formulario de inicio de sesión y registro usa un efecto de flip animado cuando cambias entre las dos vistas.
- Animación del Logo: El logo de la empresa aparece con una animación fluida que reduce su tamaño y se mueve a la esquina superior izquierda de la pantalla.
- Fondo con Video y Grid Retro: La app incluye un diseño de rejilla retro que añade un efecto visual elegante.

## Licencia

Este proyecto está bajo la licencia MIT.
