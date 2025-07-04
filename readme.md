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
│   │   └── db.js                 // Configuración de la base de datos
│   ├── controllers/
│   │   ├── authController.js     // Controlador de autenticación
│   │   ├── postController.js     // Controlador de publicaciones
│   │   ├── userController.js     // Controlador de usuarios
│   │   └── commentController.js  // Controlador de comentarios
│   ├── middleware/
│   │   └── authMiddleware.js     // Middleware de autenticación
│   ├── routes/
│   │   ├── authRoutes.js         // Rutas de autenticación
│   │   ├── postRoutes.js         // Rutas de publicaciones
│   │   ├── userRoutes.js         // Rutas de usuarios
│   │   └── commentRoutes.js      // Rutas de comentarios
│   ├── .env                      // Variables de entorno
│   ├── app.js                    // Archivo principal del servidor
│   ├── package.json              // Dependencias del backend
│   ├── package-lock.json         // Versiones bloqueadas de dependencias
│   └── docu/
│       └── assa_mas.sql          // Script de la base de datos
│
├── frontend/
│   ├── src/
│   │   ├── assets/               // Recursos estáticos
│   │   │   ├── images/           // Imágenes del proyecto
│   │   │   └── icons/            // Íconos de la aplicación
│   │   ├── components/           // Componentes reutilizables
│   │   │   ├── feed/             // Muro de publicaciones
│   │   │   ├── leftbar/          // Barra lateral izquierda
│   │   │   ├── profileRightBar/  // Panel derecho en perfil
│   │   │   ├── rewards/          // Sección de recompensas
│   │   │   ├── rightbar/         // Barra lateral derecha
│   │   │   ├── rightbarhome/     // Panel derecho en inicio
│   │   │   ├── share/            // Compartir contenido
│   │   │   ├── sidebar/          // Navegación lateral
│   │   │   └── shared/           // Componentes compartidos
│   │   ├── context/              // Manejo de estado global con Context API
│   │   │   ├── AuthContext.js    // Contexto de autenticación
│   │   │   └── ThemeContext.js   // Contexto de tema visual
│   │   ├── pages/                // Páginas principales
│   │   │   ├── AdminPanel/       // Panel de administración
│   │   │   ├── editProfile/      // Edición de perfil
│   │   │   ├── home/             // Página principal
│   │   │   ├── login/            // Inicio de sesión
│   │   │   ├── profile/          // Perfil del usuario
│   │   │   └── register/         // Registro de usuarios
│   │   ├── services/             // Servicios de conexión y lógica externa
│   │   ├── style/                // Estilos personalizados
│   │   ├── App.js                // Componente raíz de la app
│   │   ├── firebase.js           // Configuración de Firebase
│   │   └── index.js              // Punto de entrada de React
│   ├── public/                   // Archivos públicos (favicon, index.html)
│   ├── package.json              // Dependencias del frontend
│   ├── package-lock.json         // Versiones bloqueadas de dependencias
│   ├── yarn.lock                 // Versiones de Yarn
│
├── README.md                     // Documentación principal del proyecto
├── readme.md                     // Documentación complementaria
├── .gitignore                    // Archivos ignorados por Git
├── .gitattributes                // Atributos de Git configurados
└── LICENSE                       // Licencia del proyecto

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
