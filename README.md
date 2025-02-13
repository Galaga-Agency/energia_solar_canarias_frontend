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
│   ├── layout.js            # Layout global que envuelve todas las páginas, ideal para definir el diseño base de la aplicación (header, footer)
│   ├── page.js              # Página principal de la aplicación, corresponde a la ruta raíz `/`
│   ├── global.css           # Archivo de estilos globales aplicados en toda la aplicación, contiene las reglas CSS que no cambian entre páginas
│   └── icon.png             # Icono de la aplicación (favicon), utilizado en la pestaña del navegador y en la instalación de PWA
├── components              # Componentes reutilizables
├── hooks                   # Hooks personalizados de React
├── data                    # Datos estáticos y configuraciones
├── lib                     # Utilidades y funciones compartidas
├── locales                 # Archivos de internacionalización
├── public/                 # Archivos estáticos
│   └── assets/            # Recursos estáticos
│       ├── fonts          # Fuentes tipográficas
│       ├── img            # Imágenes y recursos
│       └── icons          # Iconos y SVGs
├── services               # Servicios y llamadas a API
├── store/                 # Gestión del estado con Redux
│   ├── slices            # Redux Toolkit slices
│   └── store.js          # Configuración del store
├── utils                  # Funciones auxiliares
├── components.json        # Configuración de componentes
├── jsconfig.json         # Configuración de JavaScript
├── manifest.json         # Manifiesto PWA
├── next.config.mjs       # Configuración de Next.js
├── package-lock.json     # Lock file de dependencias
├── package.json          # Configuración del proyecto
├── postcss.config.mjs    # Configuración de PostCSS
├── tailwind.config.js    # Configuración de Tailwind
├── amplify.yml           # Configuración de AWS Amplify
├── .eslintrc.json       # Configuración de ESLint
└── .gitignore           # Archivos ignorados por Git
```

### Explicación de los Directorios Principales

#### `/app`

El directorio principal que utiliza el App Router de Next.js 14. Next.js implementa un sistema de rutas basado en el sistema de archivos, donde cada carpeta representa un segmento de ruta.

##### Estructura Base

- **layout.js**: Define el layout global que envuelve todas las páginas
- **page.js**: La página principal de la aplicación
- **global.css**: Estilos CSS globales incluyendo configuraciones de Tailwind
- **not-found.js**: Página personalizada para rutas no encontradas
- **Otras carpetas**: Código organizado por rutas según la convención de Next.js

##### Como funciona el enrutamiento

El principio es muy sencillo, cualquier carpeta en /app es una ruta. Luego se pueden anidar rutas dentro de cada carpeta, incluso rutas dinámicas

```
app/
├── layout.js                # Define el layout global que envuelve todas las páginas
├── page.js                  # La página principal de la aplicación '/'
├── dashboard/[userId]       # Ruta: /dashboard/[userId], passing a dynamic value for the userId
│   ├── page.js               # Página principal del dashboard/[userId],
│   ├── users/               # Ruta: /dashboard/[userId]/users,
│        └── page.js          # Página de users
```

##### Rutas Dinámicas

Las rutas dinámicas se crean usando corchetes `[]`:

- **[id]**: Ruta dinámica simple
  ```plaintext
  app/users/[id]/page.js     # Coincide con /users/1, /users/2, etc.
  ```

#### `/components`

El directorio de componentes está organizado por aspectos específicos y proveedores, permitiendo una clara separación de responsabilidades y mejor mantenibilidad del código.

```plaintext
components/
├── alerts/                # Componentes relacionados con el flujo y página de alertas
├── goodwe/                # Componentes específicos para integración con GoodWe
├── solaredge/             # Componentes específicos para SolarEdge
├── victronenergy/         # Componentes para integración Victron Energy
├── loadingSkeletons/      # Esqueletos de carga para diferentes secciones
└── ui/                    # Componentes UI personalizados para consistencia en la app, incl. inputs, checkboxes, modals etc.

Los otros componentes no apartenen a ninguna categoria o no tienen proveedor especifico
```

##### Organización y Propósito

1. **Componentes por Proveedor/Aspecto**

   - Cada proveedor (GoodWe, SolarEdge, Victron) tiene su propia carpeta
   - Facilita la gestión de integraciones específicas
   - Mantiene el código relacionado agrupado lógicamente

2. **Sistema de Alertas**

   - Carpeta `alerts/` dedicada al flujo completo de alertas
   - Componentes específicos para la visualización y gestión de alertas
   - Mantiene toda la lógica de alertas centralizada

3. **Loading States**

   - Carpeta `loadingSkeletons/` para estados de carga
   - Esqueletos específicos para diferentes tipos de contenido
   - Asegura una experiencia de carga consistente

4. **Componentes UI Base**
   - Carpeta `ui/` para elementos de interfaz reutilizables
   - Asegura consistencia visual en toda la aplicación
   - Incluye:
     - Inputs personalizados
     - Sistema de modales
     - Botones y controles
     - Otros elementos UI comunes

##### Ventajas de esta Estructura

1. **Organización Clara**

   - Fácil encontrar componentes relacionados
   - Separación lógica por funcionalidad
   - Código más mantenible

2. **Consistencia**

   - UI consistente gracias a componentes base reutilizables
   - Experiencia de usuario coherente
   - Facilita cambios globales de diseño

3. **Escalabilidad**
   - Fácil añadir nuevos proveedores
   - Simple extender funcionalidades existentes
   - Estructura preparada para crecer

#### `/hooks`

Esta carpeta contiene los hooks personalizados de React que manejan la lógica reutilizable de la aplicación. A diferencia de las funciones de utilidad, estos hooks se utilizan específicamente cuando necesitamos mantener y reaccionar a estados (useState) o efectos secundarios (useEffect) en el ciclo de vida de los componentes, como la detección de cambios en el dispositivo, el estado de autenticación o la gestión de la PWA por ejemplo. Esos custom hooks incluyen hooks para:

- Manejo de autenticación y gestión de sesiones
- Diagnóstico y configuración de la PWA
- Detección de dispositivos y características del navegador
- Exportación de datos y formateo de fechas
- Adaptación responsive y detección de dispositivos táctiles
- ..y más...

Al centralizar estas funcionalidades en hooks personalizados, conseguimos:

- Reducir la duplicación de código
- Mantener la lógica de negocio separada de los componentes
- Facilitar el mantenimiento y las actualizaciones
- Asegurar un comportamiento consistente en toda la aplicación

#### `/data`

Esta carpeta almacena datos estáticos y configuraciones que no cambian durante la ejecución de la aplicación, evitando así llamadas innecesarias a la API y mejorando el rendimiento.

```plaintext
data/
├── providers/              # Información estática de proveedores
```

Ejemplo de datos guardados aqui:

```plaintext
export const providers = [
  {
    name: "Goodwe",
    imgLight: "/assets/logos/GOODWE.png",
    imgDark: "/assets/logos/GOODWE.png",
    isReady: true,
  },...
  ]
```

El propósito principal es:

- Mantener datos constantes que no requieren ser dinámicos
- Reducir llamadas innecesarias a la API
- Garantizar acceso inmediato a información básica de proveedores
- Mejorar el rendimiento al tener datos pre-cargados

Por ejemplo, en lugar de hacer una llamada a la API para obtener el logo de GoodWe cada vez, lo mantenemos como dato estático ya que esta información nunca cambia.

#### `/locales`

Esta carpeta maneja la internacionalización de la aplicación con una estructura simple pero efectiva:

```plaintext
locales/
├── en.json             # Traducciones en inglés
├── es.json             # Traducciones en español
└── TranslationProvider.js    # Configuración de i18next
```

El sistema de internacionalización se implementa mediante:

1. **Archivos de Traducción**

   - `en.json` y `es.json` contienen los pares clave-valor de las traducciones
   - Español configurado como idioma predeterminado

2. **TranslationProvider**
   - Wrapper que inicializa i18next
   - Configuración básica:
     ```javascript
     i18n.init({
       resources: {
         en: { translation: enTranslation },
         es: { translation: esTranslation },
       },
       lng: "es",
       fallbackLng: "es",
     });
     ```
   - Se usa envolviendo el layout principal:
     ```javascript
     // app/layout.js
     <TranslationProvider>{children}</TranslationProvider>
     ```

La configuración está simplificada para manejar solo dos idiomas, lo cual es suficiente para las necesidades actuales de la aplicación.

#### `/services`

Servicios y llamadas a API:

- Configuración de axios
- Servicios por entidad
- Interceptores
- Manejo de errores

#### `/store`

Gestión del estado con Redux Toolkit:

- **slices/**: Reducers y acciones por feature
- **store.js**: Configuración central de Redux

## Despliegue en AWS Amplify

El proyecto está configurado para su despliegue en AWS Amplify. Si deseas acceder al panel de control de AWS Amplify, pide los credenciales al equipo

#### Configuración del Despliegue

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
```

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
