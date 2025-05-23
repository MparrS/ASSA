-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-04-2025 a las 04:32:17
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
-- Estructura de tabla para la tabla `canjes`
--

CREATE TABLE `canjes` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `premio_id` int(11) DEFAULT NULL,
  `fecha_canje` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `espacios`
--

CREATE TABLE `espacios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `color` varchar(20) DEFAULT '#CCCCCC'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `espacios`
--

INSERT INTO `espacios` (`id`, `nombre`, `descripcion`, `color`) VALUES
(1, 'Espacio de Administración', NULL, '#CCCCCC'),
(2, 'Espacio de Ventas', NULL, '#CCCCCC');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `premios`
--

CREATE TABLE `premios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `puntos_necesarios` int(11) NOT NULL,
  `stock` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones`
--

CREATE TABLE `publicaciones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `espacio_id` int(11) DEFAULT NULL,
  `contenido` text NOT NULL,
  `fecha_publicacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `publicaciones`
--

INSERT INTO `publicaciones` (`id`, `usuario_id`, `espacio_id`, `contenido`, `fecha_publicacion`) VALUES
(1, 1, 1, 'Este es el contenido de la primera publicación. Esta publicación fue realizada por el administrador en el espacio de administración.', '2025-04-28 02:22:23'),
(2, 2, 2, 'Contenido de la publicación de Alexander. Es un ejemplo para la prueba de la aplicación.', '2025-04-28 02:22:23'),
(3, 1, 1, 'Segunda publicación del administrador en el espacio de administración.', '2025-04-28 02:22:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `documento` int(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `cargo` varchar(100) DEFAULT NULL,
  `supervisor` varchar(100) DEFAULT NULL,
  `area` varchar(100) DEFAULT NULL,
  `pais` varchar(50) DEFAULT NULL,
  `direccion_laboral` varchar(255) DEFAULT NULL,
  `celular_personal` bigint(20) DEFAULT NULL,
  `celular_corporativo` bigint(20) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('Femenino','Masculino') DEFAULT NULL,
  `estado_civil` enum('Soltero','Casado','Unión Libre') DEFAULT NULL,
  `direccion_personal` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `grupo` enum('OPERATIVO','ADMINISTRATIVO','JEFE','DIRECTOR','GERENTE') DEFAULT NULL,
  `estado` enum('Activo','Inactivo') DEFAULT 'Activo',
  `ultimo_login` datetime DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('EMPLEADO','ADMINISTRADOR') DEFAULT 'EMPLEADO',
  `puntos` int(11) DEFAULT 0,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `documento`, `nombre`, `apellido`, `correo`, `fecha_ingreso`, `cargo`, `supervisor`, `area`, `pais`, `direccion_laboral`, `celular_personal`, `celular_corporativo`, `fecha_nacimiento`, `genero`, `estado_civil`, `direccion_personal`, `linkedin`, `grupo`, `estado`, `ultimo_login`, `foto`, `contrasena`, `rol`, `puntos`, `fecha_registro`) VALUES
(1, 1, 'Mijail', 'Serrano', '1@1', NULL, 'administrador', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Activo', NULL, NULL, '1', 'ADMINISTRADOR', 0, '2025-04-26 17:21:24'),
(2, 2, 'Alexander', 'Parra', '2@2', NULL, 'Analista', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Activo', NULL, NULL, '2', 'EMPLEADO', 0, '2025-04-26 22:25:03');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `canjes`
--
ALTER TABLE `canjes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `premio_id` (`premio_id`);

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
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `documento` (`documento`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `canjes`
--
ALTER TABLE `canjes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `espacios`
--
ALTER TABLE `espacios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `premios`
--
ALTER TABLE `premios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `canjes`
--
ALTER TABLE `canjes`
  ADD CONSTRAINT `canjes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `canjes_ibfk_2` FOREIGN KEY (`premio_id`) REFERENCES `premios` (`id`);

--
-- Filtros para la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD CONSTRAINT `publicaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `publicaciones_ibfk_2` FOREIGN KEY (`espacio_id`) REFERENCES `espacios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
