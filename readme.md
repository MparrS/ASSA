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
│   │   ├── authController.js   // Controlador de autenticación
│   │   ├── postController.js   // Controlador de publicaciones
│   │   ├── userController.js   // Controlador de usuarios
│   │   └── commentController.js // Controlador de comentarios
│   ├── middleware/
│   │   └── authMiddleware.js   // Middleware de autenticación
│   ├── routes/
│   │   ├── authRoutes.js      // Rutas de autenticación
│   │   ├── postRoutes.js      // Rutas de publicaciones
│   │   ├── userRoutes.js      // Rutas de usuarios
│   │   └── commentRoutes.js   // Rutas de comentarios
│   ├── .env                   // Variables de entorno
│   ├── app.js                 // Archivo principal del servidor
│   ├── package.json           // Dependencias del backend
│   └── docu/                  // Documentación adicional
│       └── assa_mas.sql       // Script de la base de datos
│
├── frontend/
│   ├── src/
│   │   ├── assets/            // Recursos estáticos
│   │   │   ├── images/        // Imágenes del proyecto
│   │   │   └── icons/         // Iconos de la aplicación
│   │   ├── components/        // Componentes reutilizables
│   │   │   ├── navbar/        // Barra de navegación
│   │   │   ├── sidebar/       // Barra lateral
│   │   │   ├── post/          // Componente de publicaciones
│   │   │   └── shared/        // Componentes compartidos
│   │   ├── context/          // Contextos de React
│   │   │   ├── AuthContext.js // Contexto de autenticación
│   │   │   └── ThemeContext.js// Contexto de tema
│   │   ├── pages/            // Páginas principales
│   │   │   ├── home/         // Página principal
│   │   │   ├── profile/      // Perfil de usuario
│   │   │   └── admin/        // Panel de administración
│   │   ├── services/         // Servicios y APIs
│   │   └── styles/           // Estilos globales
│   ├── public/               // Archivos públicos
│   └── package.json          // Dependencias del frontend
│
└── README.md                 // Documentación 
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
