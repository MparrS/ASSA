-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-05-2025 a las 18:16:42
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `assa_mas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `id` int(11) NOT NULL,
  `publicacion_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `contenido` text NOT NULL,
  `es_destacado` tinyint(1) DEFAULT 0,
  `estado` enum('activo','eliminado') DEFAULT 'activo',
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `fecha_modificacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comentarios`
--

INSERT INTO `comentarios` (`id`, `publicacion_id`, `usuario_id`, `contenido`, `es_destacado`, `estado`, `fecha_creacion`, `fecha_modificacion`) VALUES
(1, 5, 1, '¡Excelente publicación! Muy útil la información.', 0, 'activo', '2025-05-23 13:02:13', '2025-05-23 13:02:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contenidos`
--

CREATE TABLE `contenidos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `tipo` enum('imagen','video','documento','enlace') NOT NULL,
  `url_contenido` text NOT NULL,
  `espacio_id` int(11) DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `contenidos`
--

INSERT INTO `contenidos` (`id`, `titulo`, `descripcion`, `tipo`, `url_contenido`, `espacio_id`, `creado_por`, `fecha_creacion`) VALUES
(1, 'Video de Seguridad', 'Instrucciones sobre uso seguro de herramientas', 'video', 'https://www.youtube.com/watch?v=abc123', 1, 1, '2025-05-19 17:01:52'),
(2, 'Manual de Bienvenida', 'Documento PDF para nuevos empleados', 'documento', 'https://empresa.com/manual.pdf', 1, 1, '2025-05-19 17:01:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dashboard_metricas`
--

CREATE TABLE `dashboard_metricas` (
  `id` int(11) NOT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  `valor` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `dashboard_metricas`
--

INSERT INTO `dashboard_metricas` (`id`, `tipo`, `valor`, `descripcion`, `fecha_registro`) VALUES
(1, 'publicaciones_mes', 12, 'Cantidad de publicaciones creadas este mes', '2025-05-19 17:01:52'),
(2, 'usuarios_activos', 45, 'Usuarios que iniciaron sesión en el último mes', '2025-05-19 17:01:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `espacios`
--

CREATE TABLE `espacios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `icono` varchar(100) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `orden` int(11) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `espacios`
--

INSERT INTO `espacios` (`id`, `nombre`, `descripcion`, `icono`, `color`, `orden`, `activo`) VALUES
(1, 'Reconocimientos', 'Espacio para destacar logros', NULL, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `premios`
--

CREATE TABLE `premios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `puntos_requeridos` int(11) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `premios`
--

INSERT INTO `premios` (`id`, `nombre`, `descripcion`, `imagen`, `puntos_requeridos`, `stock`, `activo`, `fecha_creacion`) VALUES
(1, 'Camiseta Corporativa', 'Camiseta oficial de la empresa', 'camiseta.jpg', 200, 10, 1, '2025-05-19 17:01:52'),
(2, 'Termo Yale', 'Termo metálico con logo', 'termo.jpg', 150, 15, 1, '2025-05-19 17:01:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones`
--

CREATE TABLE `publicaciones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `espacio_id` int(11) DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `contenido` text DEFAULT NULL,
  `fecha_publicacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `media_url` varchar(255) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT 'normal',
  `destacado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `publicaciones`
--

INSERT INTO `publicaciones` (`id`, `usuario_id`, `espacio_id`, `titulo`, `contenido`, `fecha_publicacion`, `media_url`, `tipo`, `destacado`) VALUES
(5, 1, 1, 'Publicación demo', 'Contenido de prueba para verificar visualización', '2025-05-19 15:56:35', NULL, 'normal', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reacciones`
--

CREATE TABLE `reacciones` (
  `id` int(11) NOT NULL,
  `publicacion_id` int(11) DEFAULT NULL,
  `comentario_id` int(11) DEFAULT NULL,
  `usuario_id` int(11) NOT NULL,
  `tipo_reaccion` enum('me_gusta','me_encanta','me_divierte','me_asombra','me_entristece','me_enfada') NOT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `redenciones`
--

CREATE TABLE `redenciones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `premio_id` int(11) DEFAULT NULL,
  `fecha_redencion` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('pendiente','aprobado','rechazado') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `redenciones`
--

INSERT INTO `redenciones` (`id`, `usuario_id`, `premio_id`, `fecha_redencion`, `estado`) VALUES
(1, 1, 1, '2025-05-19 17:01:52', 'aprobado'),
(2, 1, 2, '2025-05-19 17:01:52', 'pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `documento` int(15) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('empleado','administrador') DEFAULT 'empleado',
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `foto_perfil` varchar(255) DEFAULT NULL,
  `cargo` varchar(100) DEFAULT NULL,
  `area` varchar(100) DEFAULT NULL,
  `ubicacion` varchar(100) DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `ultimo_login` datetime DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `imagen_perfil` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `documento`, `nombre`, `apellido`, `email`, `contrasena`, `rol`, `estado`, `foto_perfil`, `cargo`, `area`, `ubicacion`, `fecha_ingreso`, `ultimo_login`, `fecha_creacion`, `imagen_perfil`) VALUES
(1, 1, 'Mijail', 'Serrano', '1@1.com', '1', 'administrador', 'activo', 'https://media.glamour.mx/photos/64b985264b0bc56740ccc42d/1:1/w_2000,h_2000,c_limit/ryan-gosling-quien-es.jpg', NULL, NULL, NULL, NULL, '2025-05-29 09:28:18', '2025-05-09 12:49:07', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `yalepuntos`
--

CREATE TABLE `yalepuntos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `puntos` int(11) NOT NULL,
  `motivo` text DEFAULT NULL,
  `fecha_asignacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `asignado_por` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `yalepuntos`
--

INSERT INTO `yalepuntos` (`id`, `usuario_id`, `puntos`, `motivo`, `fecha_asignacion`, `asignado_por`) VALUES
(1, 1, 100, 'Participación destacada en campaña de seguridad', '2025-05-19 17:01:52', 1),
(2, 1, 50, 'Cumplimiento de metas trimestrales', '2025-05-19 17:01:52', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `publicacion_id` (`publicacion_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `contenidos`
--
ALTER TABLE `contenidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `espacio_id` (`espacio_id`),
  ADD KEY `creado_por` (`creado_por`);

--
-- Indices de la tabla `dashboard_metricas`
--
ALTER TABLE `dashboard_metricas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `espacios`
--
ALTER TABLE `espacios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `premios`
--
ALTER TABLE `premios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `espacio_id` (`espacio_id`);

--
-- Indices de la tabla `reacciones`
--
ALTER TABLE `reacciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unica_reaccion` (`usuario_id`,`publicacion_id`,`comentario_id`),
  ADD KEY `publicacion_id` (`publicacion_id`),
  ADD KEY `comentario_id` (`comentario_id`);

--
-- Indices de la tabla `redenciones`
--
ALTER TABLE `redenciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `premio_id` (`premio_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `yalepuntos`
--
ALTER TABLE `yalepuntos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `asignado_por` (`asignado_por`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `contenidos`
--
ALTER TABLE `contenidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `dashboard_metricas`
--
ALTER TABLE `dashboard_metricas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `espacios`
--
ALTER TABLE `espacios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `premios`
--
ALTER TABLE `premios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `reacciones`
--
ALTER TABLE `reacciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `redenciones`
--
ALTER TABLE `redenciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `yalepuntos`
--
ALTER TABLE `yalepuntos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`publicacion_id`) REFERENCES `publicaciones` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `contenidos`
--
ALTER TABLE `contenidos`
  ADD CONSTRAINT `contenidos_ibfk_1` FOREIGN KEY (`espacio_id`) REFERENCES `espacios` (`id`),
  ADD CONSTRAINT `contenidos_ibfk_2` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD CONSTRAINT `publicaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `publicaciones_ibfk_2` FOREIGN KEY (`espacio_id`) REFERENCES `espacios` (`id`);

--
-- Filtros para la tabla `reacciones`
--
ALTER TABLE `reacciones`
  ADD CONSTRAINT `reacciones_ibfk_1` FOREIGN KEY (`publicacion_id`) REFERENCES `publicaciones` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reacciones_ibfk_2` FOREIGN KEY (`comentario_id`) REFERENCES `comentarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reacciones_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `redenciones`
--
ALTER TABLE `redenciones`
  ADD CONSTRAINT `redenciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `redenciones_ibfk_2` FOREIGN KEY (`premio_id`) REFERENCES `premios` (`id`);

--
-- Filtros para la tabla `yalepuntos`
--
ALTER TABLE `yalepuntos`
  ADD CONSTRAINT `yalepuntos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `yalepuntos_ibfk_2` FOREIGN KEY (`asignado_por`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
