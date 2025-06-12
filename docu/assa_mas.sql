-- phpMyAdmin SQL Dump
-- Base de datos: `assa_mas`

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET NAMES utf8mb4 */;

------------------------------
-- Estructura de la tabla `comments`
------------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `postId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `body` text DEFAULT NULL,
  `date` varchar(50) DEFAULT NULL,
  `likes` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `postId` (`postId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `comments` (`id`, `postId`, `userId`, `body`, `date`, `likes`) VALUES
(18, 28, 1, 'LOL', '10/6/2025, 10:40:17 a. m.', 0);

------------------------------
-- Estructura de la tabla `posts`
------------------------------
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text DEFAULT NULL,
  `date` varchar(50) DEFAULT NULL,
  `likes` int(11) DEFAULT 0,
  `commentsCount` int(11) DEFAULT 0,
  `spaceId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `posts_space_fk` (`spaceId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `posts` (`id`, `userId`, `title`, `body`, `date`, `likes`, `commentsCount`, `spaceId`) VALUES
(28, 1, '', 'Bienvenidos a Assaabloy !', '2025-06-10T15:40:11.268Z', 1, 0, NULL);

------------------------------
-- Estructura de la tabla `post_images`
------------------------------
DROP TABLE IF EXISTS `post_images`;
CREATE TABLE `post_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `postId` int(11) NOT NULL,
  `imagePath` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `postId` (`postId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `post_images` (`id`, `postId`, `imagePath`) VALUES
(45, 28, 'http://localhost:3001/assets/posts/1749570011260.jpg'),
(46, 28, 'http://localhost:3001/assets/posts/1749570011263.jpg');

------------------------------
-- Estructura de la tabla `spaces`
------------------------------
DROP TABLE IF EXISTS `spaces`;
CREATE TABLE `spaces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `spaces` (`id`, `name`, `description`, `userId`) VALUES
(1, 'Espacio IT', 'Espacio para compartir noticias y proyectos de IT', 1),
(2, 'Gestion Humana', 'Espacio para la gestión humana de la empresa', 2),
(3, 'Espacio Creativo', 'Espacio destinado a ideas y creatividad', 2);

------------------------------
-- Estructura de la tabla `users`
------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `points` int(11) DEFAULT NULL,
  `rol` enum('admin','empleado') NOT NULL DEFAULT 'empleado',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (
  `id`, `name`, `username`, `documento`, `email`, `fechaIngreso`, 
  `cargo`, `supervisor`, `area`, `country`, `direccionLaboral`, `phone`, 
  `age`, `language`, `celularCorporativo`, `fechaNacimiento`, `estadoCivil`, 
  `direccionPersonal`, `linkedIn`, `estado`, `ultimoLogin`, `profilePicture`, 
  `contrasena`, `points`, `rol`
) VALUES
(1, 'Mijail Serrano', 'mijser', 1, 'mijail.serranoparra@assaabloy.com', '2025-03-15', 'Analista', NULL, 'IT', 'Colombia', 'Calle 12# 115 D23', '+57 3203783898', 20, 'Spanish', '+57 313507736', '2006-01-11', 'Soltero', 'Calle 68# 113 D27', 'Linkedin', 'Activo', '2025-06-11 12:19:04', 'https://cdn.britannica.com/93/215393-050-E428CADE/Canadian-actor-musician-Ryan-Gosling-2016.jpg', '1', 50, 'admin'),
(2, 'Ioaira Vega', 'iovega', 2, '2@2', NULL, NULL, NULL, NULL, NULL, 'CLJ 69 # #112 D-22', '+57 3135207736', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-09 10:49:51', '\\assets\\people\\io.jpg', '2', 10, 'empleado');

COMMIT;

/*!40101 SET NAMES utf8mb4 */;
