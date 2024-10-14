# **Energia Solar Canarias**

Este proyecto es una aplicación de **PWA (Progressive Web App)** desarrollada con **Next.js** y **Tailwind CSS**. El objetivo principal es proporcionar una plataforma para la empresa _Energia Solar Canarias_, que ofrece soluciones de energía solar en las Islas Canarias.

## 🛠 **Tecnologías Utilizadas**

- **Next.js**: Framework React para desarrollo web optimizado y rápido.
- **Tailwind CSS**: Framework CSS para un diseño responsivo y estilizado.
- **Framer Motion**: Librería para animaciones fluidas.
- **React Hook Form**: Para la validación y manejo de formularios de manera eficiente.
- **Redux Toolkit**: Para la gestión del estado global de la aplicación de manera eficiente y escalable.

## 📋 **Índice**

1. [Cómo Empezar](#cómo-empezar)
2. [Estructura Detallada del Proyecto](#estructura-detallada-del-proyecto)
3. [Despliegue en AWS Amplify](#despliegue-en-aws-amplify)
4. [Características de la Aplicación](#características-de-la-aplicación)
5. [Gestión del Estado con Redux Toolkit](#gestión-del-estado-con-redux-toolkit)
6. [Licencia](#licencia)

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

El proyecto está configurado para su despliegue en AWS Amplify. Si deseas acceder al panel de control de AWS Amplify, pide los credenciales al equipo:

Pasos para el despliegue:

- Realiza el commit y push de tus cambios a la rama principal.
- AWS Amplify desplegará automáticamente la aplicación desde el repositorio conectado.

## Características de la Aplicación

- Formulario Flip: El formulario de inicio de sesión y registro usa un efecto de flip animado cuando cambias entre las dos vistas.
- Animación del Logo: El logo de la empresa aparece con una animación fluida que reduce su tamaño y se mueve a la esquina superior izquierda de la pantalla.
- Fondo con Video y Grid Retro: La app incluye un diseño de rejilla retro que añade un efecto visual elegante.

## Gestión del Estado con Redux Toolkit

En la aplicación de Energia Solar Canarias, utilizamos Redux Toolkit para gestionar el estado global de la aplicación, especialmente para el manejo de la autenticación del usuario. Esto nos permite centralizar y controlar la información en un solo lugar, haciendo que la gestión del estado sea más predecible y sencilla de escalar.

### ¿Por qué Redux?

Redux es una herramienta para manejar el estado global de las aplicaciones de React. En lugar de que cada componente maneje su propio estado de manera aislada, Redux nos permite mantener un almacenamiento centralizado que todos los componentes de la aplicación pueden utilizar. Esto es especialmente útil para:

- Autenticación del usuario: Cuando un usuario inicia sesión, otros componentes de la aplicación pueden necesitar saber si el usuario está autenticado o no.
- Estado compartido: Datos como el carrito de compras, la información del perfil del usuario o las preferencias de idioma son accesibles desde cualquier componente.
- Predecibilidad: Al centralizar el estado, cada actualización del mismo sigue un flujo claro y predecible (acción -> reducer -> estado actualizado).

### Estructura de la Carpeta /store

En este proyecto, la estructura de Redux Toolkit se encuentra en la carpeta /store y está organizada de la siguiente manera:

```bash
/store
│
├── store.js          # Configuración del store de Redux
└── slices
    └── userSlice.js  # Manejo del estado del usuario (autenticación, registro)
```

### ¿Cómo Funciona Redux Toolkit en la Aplicación?

- Store Global: La configuración del store global se encuentra en el archivo /store/store.js. Este archivo combina todos los slices (fragmentos de estado) y los registra en un solo almacenamiento centralizado.
- Slices: Cada aspecto del estado que queremos manejar tiene un slice específico. En este caso, comenzamos con el userSlice.js para manejar la autenticación del usuario.
- Reducers: Son funciones que manejan cómo se actualiza el estado cuando se disparan ciertas acciones.
- Async Thunks: Redux Toolkit proporciona una manera sencilla de manejar llamadas asíncronas (por ejemplo, llamadas a la API para iniciar sesión) con createAsyncThunk.

### Ejemplo de userSlice.js

El userSlice.js contiene el estado y las acciones relacionadas con el usuario. Aquí se define cómo se maneja el inicio de sesión y el cierre de sesión, así como la estructura del estado del usuario:

```bash
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserAPI, logoutUserAPI } from "@/services/api";

// Estado inicial del usuario
const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Acción asíncrona para iniciar sesión
export const loginUserThunk = createAsyncThunk(
  "user/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await loginUserAPI(payload.email, payload.password);
      return response.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Acción asíncrona para cerrar sesión
export const logoutUserThunk = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUserAPI();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Definición del slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
```

### ¿Cómo Usar Redux en los Componentes?

Para utilizar el estado y las acciones de Redux en tus componentes, sigue estos pasos:

- Importar useSelector y useDispatch: useSelector se usa para acceder a los datos del estado global. useDispatch se usa para disparar acciones (por ejemplo, iniciar sesión o cerrar sesión).
  Ejemplo de Uso en un Componente de Autenticación:

```bash
import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk, selectUser, selectLoading, selectError } from "@/store/slices/userSlice";

// Dentro de tu componente
const dispatch = useDispatch();
const user = useSelector(selectUser);
const loading = useSelector(selectLoading);
const error = useSelector(selectError);

// Función para manejar el inicio de sesión
const handleLogin = (email, password) => {
  dispatch(loginUserThunk({ email, password }));
};
```

### Ventajas de Usar Redux en la Aplicación

- Consistencia: Todos los componentes que requieren acceder al estado del usuario lo hacen de manera consistente a través del store.
- Escalabilidad: A medida que la aplicación crece, es fácil agregar nuevos slices para manejar otros aspectos del estado (por ejemplo, productos, carrito de compras, preferencias del usuario, etc.).
- Depuración: Con herramientas como Redux DevTools, es fácil ver el flujo de acciones y cómo cambia el estado de la aplicación en cada paso, lo que facilita la depuración y el mantenimiento.
  <br/><br/>Con este enfoque, Energia Solar Canarias garantiza una gestión de estado sólida y escalable que permite manejar eficientemente el flujo de datos y la lógica de negocio en toda la aplicación.

## Licencia

Este proyecto está bajo la licencia MIT.
