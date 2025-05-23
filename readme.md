# ASSA MAS

ASSA MAS es una plataforma interna de comunicación para los empleados de Yale Colombia. Permite a los empleados y administradores interactuar mediante publicaciones, puntos, incentivos y espacios temáticos.

---

## Objetivos del Proyecto

- Facilitar la comunicación interna entre colaboradores.
- Promover la interacción mediante publicaciones en espacios temáticos.
- Gestionar incentivos a través de un sistema de puntos.
- Permitir administración básica de usuarios, espacios y publicaciones.

---
## 🗂️ Estructura del Proyecto

```plaintext
ASSAA/
│
├── backend/
│   ├── config/
│   │   └── db.js               // Configuración de la base de datos
│   ├── controllers/
│   │   └── authController.js   // Lógica de autenticación
│   ├── middleware/
│   │   └── authMiddleware.js   // Middleware de autenticación
│   ├── models/
│   │   ├── empleados.js        // Modelo de empleados
│   │   ├── publicaciones.js    // Modelo de publicaciones
│   │   └── usuario.js          // Modelo de usuarios
│   ├── routes/
│   │   └── authRoutes.js       // Rutas de autenticación
│   ├── .env                    // Variables de entorno
│   ├── app.js                  // Archivo principal del servidor
│   ├── package.json            // Dependencias del backend
│   ├── package-lock.json
│   └── docu/                   // Documentación adicional
│
├── frontend/
│   ├── node_modules/
│   ├── src/
│   │   ├── assets/
│   │   │   └── yale.png         // Imagen/logo
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx // Componente de ruta protegida
│   │   │   └── Sidebar.jsx      // Barra lateral de navegación
│   │   ├── pages/
│   │   │   ├── dashboard.jsx    // Página principal (dashboard)
│   │   │   ├── home.jsx         // Página de inicio
│   │   │   ├── login.jsx        // Página de login
│   │   │   ├── Perfil.jsx       // Página de perfil de usuario
│   │   │   └── publicaciones.jsx // Página de publicaciones
│   │   ├── services/
│   │   │   └── api.js           // Configuración de llamadas API
│   │   ├── App.css              // Estilos principales
│   │   ├── App.jsx              // Componente raíz de la app
│   │   ├── main.jsx             // Entrada principal de React
│   ├── .gitignore               
│   ├── eslint.config.js         // Configuración de ESLint
│   ├── index.css                // Estilos globales
│   ├── index.html               // HTML principal
│   ├── package.json             // Dependencias del frontend
│   ├── package-lock.json
│   ├── postcss.config.js        // Configuración de PostCSS
│   ├── README.md                
│   ├── tailwind.config.js       // Configuración de TailwindCSS
│   ├── vite.config.js           // Configuración de Vite
│   ├── .gitattributes           
│   └── LICENSE                  
│
└── README.md                    // Documentación general
```
---

## Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución para JavaScript en servidor.
- **Express.js** - Framework minimalista para crear servidores HTTP.
- **MySQL** - Base de datos relacional.
- **bcryptjs** - Encriptación de contraseñas.
- **dotenv** - Gestión de variables de entorno.
- **cors** - Permitir solicitudes cross-origin.

### Frontend
- **React.js** - Librería para construir interfaces de usuario.
---

### Backend
```bash
npm install express mysql2 dotenv bcryptjs cors
```

### Frontend
```bash
npm install react
```

---

##  Cómo Iniciar el Proyecto

### Iniciar Backend

1. Ubicarse en la carpeta `cd backend`
2. Instalar dependencias:
    ```bash
    npm install
    ```
3. Ejecutar el servidor:
    ```bash
    node app
    ```

> Asegúrate que el servidor de base de datos (MySQL) esté activo y la base de datos `assa_mas` esté creada.

---

### Iniciar Frontend

1. Ubicarse en la carpeta `cd frontend`
2. Instalar dependencias:
    ```bash
    npm install
    ```
3. Ejecutar el proyecto:
    ```bash
    npm start
    ```

> El frontend esta corriendo en `http://localhost:3000/` y el backend en `http://localhost:3001/`.

---
