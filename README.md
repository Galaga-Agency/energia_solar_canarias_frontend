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

   - Clonar el Repositorio
   - Instalar Dependencias
   - Iniciar el Servidor de Desarrollo

2. [Estructura Detallada del Proyecto](#estructura-detallada-del-proyecto)

   - `/app` - Sistema de Rutas y Layouts
   - `/components` - Componentes por Proveedor y UI
   - `/hooks` - Hooks Personalizados
   - `/data` - Datos Estáticos
   - `/locales` - Internacionalización
   - `/services` - Llamadas a API
   - `/store` - Gestión de Estado
   - `/utils` - Funciones de Utilidad

3. [Despliegue en AWS Amplify](#despliegue-en-aws-amplify)

   - Configuración
   - Pasos para el Despliegue

4. [Gestión del Estado con Redux Toolkit](#gestión-del-estado-con-redux-toolkit)

   - Store Configuration
   - Slices y Reducers
   - Thunks y Acciones Asíncronas
   - Selectores
   - Persistencia de Estado

5. [Estilos y Tema con Tailwind CSS](#estilos-y-tema-con-tailwind-css)

   - Configuración Base
   - Tema Personalizado
   - Sistema de Colores
   - Sistema de Animaciones
   - Plugins y Utilidades

6. [Animaciones con Framer Motion](#animaciones-con-framer-motion)

   - Animaciones de Página
   - Animaciones de Componentes
   - Transiciones entre Estados
   - Gestos e Interacciones
   - AnimatePresence

7. [Licencia](#licencia)
   - MIT License

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

La configuración maneja dos idiomas (español e inglés) mediante un TranslationProvider separado. Este enfoque es necesario debido a las limitaciones de Next.js 14 con los Server Components: el archivo layout.js se renderiza en el servidor y no puede utilizar hooks de React (como useEffect o useState) directamente. Al crear un Cliente Component separado (TranslationProvider), podemos inicializar i18next y manejar el estado de la traducción del lado del cliente, donde sí podemos usar hooks.

#### `/services`

Esta carpeta contiene toda la lógica de comunicación con la API, organizada estratégicamente para separar las llamadas genéricas de las específicas por proveedor. Para proteger datos sensibles y mantener la seguridad de la aplicación, se utilizan variables de entorno almacenadas en el archivo .env en lugar de hardcodear estos valores directamente en el código:

```javascript
// Variables de entorno utilizadas en cada archivo de servicio
// Evitamos exponer datos sensibles directamente en el código del cliente
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const USUARIO = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// De esta manera, en el código compilado solo se ven las referencias
// y no los valores reales de las credenciales
```

Estructura de archivos:

```plaintext
services/
├── shared-api.js          # Funciones API genéricas (auth, usuarios, alertas)
├── goodwe-api.js          # Llamadas específicas para GoodWe
├── solaredge-api.js       # Llamadas específicas para SolarEdge
└── victron-api.js         # Llamadas específicas para Victron
```

##### Organización y Propósito

1. **shared-api.js**

   - Contiene todas las llamadas API que no son específicas de ningún proveedor
   - Maneja funcionalidades comunes como:
     - Autenticación
     - Gestión de usuarios
     - Sistema de alertas
     - Otras funcionalidades compartidas

2. **APIs por Proveedor**
   - Cada proveedor tiene su propio archivo
   - Contiene solo las llamadas específicas para ese proveedor
   - Facilita:
     - Mantenimiento por proveedor
     - Escalabilidad (fácil añadir nuevos proveedores)
     - Separación clara de responsabilidades

Esta estructura permite escalar la aplicación fácilmente al añadir nuevos proveedores sin afectar la lógica compartida, manteniendo el código organizado y fácil de mantener.

#### `/store`

Esta carpeta maneja todo el estado global de la aplicación usando Redux Toolkit:

```plaintext
store/
├── slices/                  # Reducers y acciones separados por funcionalidad
│   ├── userSlice.js        # Estado del usuario y autenticación
│   ├── plantsSlice.js      # Estado de las plantas solares
│   ├── themeSlice.js       # Configuración del tema (dark/light)
│   ├── notificationsSlice.js # Sistema de notificaciones
│   └── ...                 # Otros slices
└── store.js                # Configuración central de Redux y persistencia
```

#### `/utils`

Esta carpeta contiene funciones de utilidad puras de JavaScript que no dependen de React y pueden ser reutilizadas en cualquier parte de la aplicación. A diferencia de los hooks, estas funciones no manejan estado ni efectos secundarios.

```plaintext
utils/
├── date-range-utils.js     # Utilidades para manejo de rangos de fechas
├── roundNumbers.js         # Funciones para redondeo de números
└── ... otros archivos
```

##### Ejemplo de Utilidad: date-range-utils.js

```javascript
// Función pura que recibe parámetros y devuelve un resultado
export const getDateRangeParams = (rangeType, { isMobile = false } = {}) => {
  switch (rangeType) {
    case "last7days":
      return { interval: "days", type: "live_feed" };
    case "last30days":
      return { interval: "days", type: "live_feed" };
    // ... más casos
  }
};

// Puede ser usada en cualquier lugar sin preocuparse por el estado de React
const params = getDateRangeParams("last7days");
```

##### ¿Por qué las Utilizamos?

1. **Separación de Lógica**

   - Mantiene la lógica de negocio separada de los componentes
   - Código más limpio y mantenible
   - Facilita las pruebas unitarias

2. **Reusabilidad**

   - Las mismas funciones pueden usarse en:
     - Componentes React
     - Hooks personalizados
     - Otros archivos de utilidades
     - Backend (si es código isomórfico)

3. **Performance**
   - No hay overhead de React
   - No causan re-renders
   - Pueden ser fácilmente memoizadas

##### Diferencia con Hooks

```javascript
// Hook - Maneja estado y efectos de React
const useDeviceType = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    // Lógica con efectos secundarios
  }, []);
  return isMobile;
};

// Utilidad - Función pura sin estado
const formatDate = (timestamp, rangeType) => {
  const date = new Date(timestamp);
  return format(date, "dd MMM");
};
```

##### Anatomía de un Slice

Tomando `userSlice.js` como ejemplo:

```javascript
// 1. Thunks (Acciones Asíncronas)
export const authenticateUser = createAsyncThunk(
  "user/authenticateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await loginRequestAPI(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Estado Inicial
const initialState = {
  user: null,
  loading: false,
  error: null,
};

// 3. Selectores
const selectUserState = (state) => state.user;

export const selectUser = createSelector(
  [selectUserState],
  (userState) => userState?.user
);

export const selectIsAdmin = createSelector(
  [selectUserState],
  (userState) => userState?.isAdmin
);

// 4. Slice con Reducers
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});
```

##### Uso en Componentes

```javascript
const UserProfile = () => {
  const dispatch = useDispatch();
  // Usando selectores para acceder al estado
  const currentUser = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);

  const handleLogin = () => {
    dispatch(authenticateUser(userData));
  };
};
```

##### Persistencia (store.js)

```javascript
// 1. Configuración de persistencia
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "theme"], // Solo estos estados persisten
  transforms: [cleanDataTransform], // Limpia estados temporales
};

// 2. Estados volátiles que no deben persistir
const volatileStates = {
  plants: ["loading", "error"],
  notifications: ["loading", "error"],
};
```

##### Beneficios de Esta Estructura

1. **Organización y Mantenibilidad**

   - Código organizado por funcionalidad
   - Selectores memoizados para mejor performance
   - Persistencia selectiva de datos importantes

2. **Performance**

   - Memoización de selectores evita recálculos
   - Limpieza automática de estados temporales
   - Persistencia solo de datos necesarios

3. **Desarrollo Eficiente**
   - Acciones asíncronas con thunks
   - Estados de loading/error automáticos
   - Selectores reutilizables

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
    y más ...
```

### ¿Cómo Funciona Redux Toolkit en la Aplicación?

- Store Global: La configuración del store global se encuentra en el archivo /store/store.js. Este archivo combina todos los slices (fragmentos de estado) y los registra en un solo almacenamiento centralizado. Tambien se configura ahi lo que debe persistir en la app ya que si no configuramos nada, los estados pueden perderse entre paginas o sesiones.
- Slices: Cada aspecto del estado que queremos manejar tiene un slice específico. En este caso, tenemos por ejemplo el userSlice.js para manejar la autenticación del usuario, o notificationsSlice para manejar todo lo de las alertas.
- Reducers: Son funciones que manejan cómo se actualiza el estado cuando se disparan ciertas acciones.
- Selectors: son funciones que extraen y memoizan datos específicos del estado global, evitando recálculos innecesarios y mejorando el rendimiento al asegurar que los componentes solo se re-rendericen cuando los datos que realmente utilizan han cambiado.
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

### Animaciones con Framer Motion

Framer Motion se utiliza añadiendo el prefijo motion. a cualquier elemento HTML (como motion.div, motion.p, motion.button), lo que permite agregar propiedades de animación como initial, animate, transition y whileHover a ese elemento; por ejemplo, <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}> creará un div que aparece con un fade in.
La aplicación utiliza Framer Motion para crear animaciones fluidas y mejorar la experiencia de usuario. Algunos ejemplos de implementación:

#### 1. Animaciones de Entrada

```javascript
// Animación del título principal
<motion.div
  className="flex items-center my-6"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.8, duration: 0.5 }}
>
  <Image src={companyIcon} alt="Company Icon" className="w-12 h-12 mr-2" />
  <h2 className="text-4xl">{t("usersList")}</h2>
</motion.div>
```

#### 2. Animaciones de Botones

```javascript
// Botón flotante de añadir usuario
<motion.button
  onClick={() => setIsFormOpen(true)}
  className="fixed bottom-20 right-4 button-shadow"
  initial={{ opacity: 0, scale: 0 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 1.6, duration: 0.3 }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <motion.div
    whileHover={{ rotateY: 360, scale: 1.1 }}
    transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
  >
    <RiUserAddLine className="text-2xl" />
  </motion.div>
</motion.button>
```

#### 3. Transiciones entre Estados

```javascript
<AnimatePresence mode="wait">
  {isLoading ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3 }}
    >
      <UsersListView isLoading={true} users={[]} />
    </motion.div>
  ) : !users || filteredUsers.length === 0 ? (
    <motion.div
      className="flex flex-col justify-center items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
    >
      <FaUserAltSlash className="text-9xl" />
      <p className="text-center">{t("noUsersFound")}</p>
    </motion.div>
  ) : (
    // Contenido principal
  )}
</AnimatePresence>
```

#### 4. Controles de Tema y Lenguaje

```javascript
<motion.div
  className="fixed top-4 right-4 flex items-center gap-2 z-50"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.8, duration: 0.5 }}
>
  <ThemeToggle />
  <LanguageSelector />
</motion.div>
```

#### 5. Sidebar Mobile/Tablet

```javascript
<AnimatePresence>
  {(isMobile || isTablet) && isSidebarOpen && (
    <UsersSidebar
      filters={filters}
      onFilterChange={setFilters}
      isOpen={isSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
    />
  )}
</AnimatePresence>
```

#### Características Principales:

1. **AnimatePresence**

   - Maneja animaciones de montaje/desmontaje de componentes
   - Ideal para modales, sidebars y transiciones de página

2. **Variants**

   - Permite definir estados de animación reutilizables
   - Facilita la coordinación de animaciones múltiples

3. **Gestos**

   - `whileHover` y `whileTap` para interacciones
   - Mejora el feedback visual para el usuario

4. **Transiciones**
   - Delays escalonados para crear secuencias de animación
   - Diferentes tipos de easing para movimientos naturales

Las animaciones se usan estratégicamente para:

- Mejorar el feedback visual
- Guiar la atención del usuario
- Crear transiciones suaves entre estados
- Hacer la interfaz más dinámica y atractiva

### Estilos y Tema con Tailwind CSS

La aplicación utiliza Tailwind CSS con una configuración personalizada extensa que incluye animaciones, colores personalizados y extensiones del tema base. Se ha optado por centralizar la mayor parte de la lógica de estilos en el archivo `tailwind.config.js` en lugar de utilizar `global.css`, lo que nos proporciona varias ventajas:

- Una única fuente de verdad para los estilos
- Mejor mantenibilidad al tener todo en un solo lugar
- Prevención de problemas de especificidad de CSS
- `global.css` se mantiene limpio y mínimo
- Mejor optimización mediante tree-shaking

De esta manera, `global.css` solo se utiliza para:

- CSS Reset
- Variables root
- Estilos que absolutamente no se pueden lograr a través de Tailwind

#### Configuración Base

```javascript
const { heroui } = require("@heroui/theme");

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // ...
};
```

#### Personalización del Tema

1. **Fuentes Personalizadas**

   ```javascript
   fontFamily: {
     primary: ['"Adam Bold"', "sans-serif"],
     secondary: ['"Corbert"', "sans-serif"],
   }
   ```

2. **Colores de Marca**

   ```javascript
   colors: {
     "custom-yellow": "rgb(255, 213, 122)",
     "custom-dark-blue": "rgb(0, 44, 63)",
     "custom-light-gray": "rgb(201, 202, 202)",
     "custom-dark-gray": "rgb(161, 161, 170)",
   }
   ```

3. **Sistema de Sombras**
   ```javascript
   boxShadow: {
     "dark-shadow": "rgba(0, 0, 0, 1) 0px 0px 8px",
     "white-shadow": "rgba(255, 255, 255, 1) 0px 0px 8px",
     "hover-white-shadow": "rgba(255, 255, 255, 0.8) 0px 0px 32px",
     "hover-dark-shadow": "rgba(0, 0, 0, 0.8) 0px 0px 32px",
   }
   ```

#### Sistema de Animaciones

La configuración incluye un extenso sistema de animaciones para mejorar la experiencia de usuario:

1. **Animaciones de UI**

   ```javascript
   animation: {
     slideDown: "slideDown 600ms ease-in-out",
     slideUp: "slideUp 600ms ease-in-out",
     shimmer: "shimmer 2s infinite",
     fade: "fadeIn 0.5s ease-in-out",
   }
   ```

2. **Animaciones Temáticas**

   ```javascript
   animation: {
     "rise-sun": "riseSun 4s ease-in-out infinite",
     "rain-drop": "rainDrop 1.5s ease-in-out infinite",
     "energy-flow": "energyFlow 2s ease-in-out infinite",
   }
   ```

3. **Animaciones de Carga y Estado**
   ```javascript
   animation: {
     "spin-slow": "spin 3s linear infinite",
     "double-blink": "doubleBlink 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
   }
   ```

#### Plugins y Utilidades

```javascript
plugins: [
  require("tailwindcss-animate"),
  heroui(),
  // Utilidad para eliminar el highlight en dispositivos táctiles
  function ({ addUtilities }) {
    addUtilities({
      ".no-tap-highlight": {
        "-webkit-tap-highlight-color": "transparent",
      },
    });
  },
];
```

#### Uso en Componentes

```jsx
// Ejemplo de uso de clases personalizadas
<div className="font-primary text-custom-yellow bg-custom-dark-blue
                shadow-dark-shadow hover:shadow-hover-dark-shadow
                animate-fade-in-up">
  Contenido
</div>

// Ejemplo de animaciones
<div className="animate-rise-sun">
  <SunIcon />
</div>
```

La configuración está diseñada para:

- Mantener consistencia visual en toda la aplicación
- Proporcionar animaciones fluidas y significativas
- Soportar modo oscuro/claro
- Optimizar la experiencia en dispositivos móviles

## Licencia

Este proyecto está bajo la licencia MIT.
