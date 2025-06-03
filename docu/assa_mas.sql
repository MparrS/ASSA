-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-06-2025 a las 03:44:14
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
-- Estructura de tabla para la tabla `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `body` text DEFAULT NULL,
  `date` varchar(50) DEFAULT NULL,
  `likes` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comments`
--

INSERT INTO `comments` (`id`, `postId`, `userId`, `body`, `date`, `likes`) VALUES
(1, 1, 1, '¡Bienvenidos!', '2/6/2025, 7:22:12 p. m.', 1),
(2, 1, 3, 'Que buena noticia', '2/6/2025, 7:22:12 p. m.', 0),
(3, 1, 3, 'genial', '2/6/2025, 7:29:16 p. m.', 0),
(4, 1, 3, 'bien', '2/6/2025, 7:30:04 p. m.', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text DEFAULT NULL,
  `date` varchar(50) DEFAULT NULL,
  `likes` int(11) DEFAULT 0,
  `commentsCount` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `posts`
--

INSERT INTO `posts` (`id`, `userId`, `title`, `body`, `date`, `likes`, `commentsCount`) VALUES
(1, 2, 'Nuevos Ingresos', '💫Bienvenido(s) a nuestra comunidad ASSA ABLOY COLOMBIA. Aprovechamos este espacio para darle la bienvenida a todos los nuevos miembros que se unen a nuestra familia empresarial. Esperamos que disfruten de una experiencia enriquecedora y productiva aquí. 🌐¡Esperamos que se sientan bienvenidos y que tengan una gran experiencia en nuestra empresa! 🌐', '5 mins ago', 13, 2),
(2, 2, 'Evento Corporativo', 'Únete a nuestro próximo evento corporativo donde compartiremos novedades y oportunidades.', '10 mins ago', 5, 1),
(3, 1, 'Anuncio Importante', 'Se actualizan nuestras políticas internas, por favor revisa los detalles en nuestro portal.', '15 mins ago', 2, 0),
(4, 1, 'Celebración de Logros', 'Celebramos nuestros logros y reconocemos el esfuerzo de todo el equipo. ¡Felicitaciones a todos!', '20 mins ago', 8, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `post_images`
--

CREATE TABLE `post_images` (
  `id` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  `imagePath` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `post_images`
--

INSERT INTO `post_images` (`id`, `postId`, `imagePath`) VALUES
(1, 1, '/assets/posts/post1.jpg'),
(2, 1, '/assets/posts/post2.jpg'),
(3, 2, '/assets/posts/post3.jpg'),
(4, 2, '/assets/posts/post4.jpg'),
(5, 3, '/assets/posts/post5.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `documento` bigint(20) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `fechaIngreso` date DEFAULT NULL,
  `cargo` varchar(255) DEFAULT NULL,
  `supervisor` int(11) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `direccionLaboral` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `language` varchar(50) DEFAULT NULL,
  `celularCorporativo` varchar(50) DEFAULT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `estadoCivil` varchar(50) DEFAULT NULL,
  `direccionPersonal` varchar(255) DEFAULT NULL,
  `linkedIn` varchar(255) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `ultimoLogin` datetime DEFAULT NULL,
  `profilePicture` varchar(255) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `points` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `documento`, `email`, `fechaIngreso`, `cargo`, `supervisor`, `area`, `country`, `direccionLaboral`, `phone`, `age`, `language`, `celularCorporativo`, `fechaNacimiento`, `estadoCivil`, `direccionPersonal`, `linkedIn`, `estado`, `ultimoLogin`, `profilePicture`, `contrasena`, `points`) VALUES
(1, 'Mijail Serrano', 'mijser', 1, '1@1', NULL, 'Analista', NULL, 'IT', NULL, NULL, NULL, 20, 'Spanish', NULL, NULL, 'Soltero', NULL, NULL, NULL, '2025-06-02 20:42:40', 'https://cdn.britannica.com/93/215393-050-E428CADE/Canadian-actor-musician-Ryan-Gosling-2016.jpg', '1', NULL),
(2, 'Ioaira Vega', 'iovega', 2, '2@2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-02 18:45:25', '/assets/people/io.jpg', '2', NULL),
(3, 'Luis Aponte', 'lucho', 3, '3@3', NULL, NULL, NULL, 'IT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-02 19:29:59', '/assets/people/lucho.png', '3', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `postId` (`postId`),
  ADD KEY `userId` (`userId`);

--
-- Indices de la tabla `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indices de la tabla `post_images`
--
ALTER TABLE `post_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `postId` (`postId`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `post_images`
--
ALTER TABLE `post_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `post_images`
--
ALTER TABLE `post_images`
  ADD CONSTRAINT `post_images_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
