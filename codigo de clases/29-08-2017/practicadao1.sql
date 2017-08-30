-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-08-2017 a las 15:29:41
-- Versión del servidor: 10.1.9-MariaDB
-- Versión de PHP: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `practicadao1`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Persona_Delete` (IN `p_id` INT)  NO SQL
DELETE FROM Persona
            WHERE id = p_id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Persona_Insert` (IN `p_nombre` VARCHAR(200), IN `p_apellido` VARCHAR(200), IN `p_ciudad` VARCHAR(200), IN `p_edad` INT)  NO SQL
INSERT INTO Persona(nombre,apellido,ciudad,edad) 
            VALUES (p_nombre, p_apellido, p_ciudad, p_edad)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Persona_SelectAll` ()  NO SQL
SELECT id, nombre, apellido, ciudad, edad
                FROM Persona$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Persona_SelectById` (IN `p_id` INT)  NO SQL
SELECT id, nombre, apellido, ciudad, edad
                FROM Persona 
                WHERE id = p_id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Persona_Update` (IN `p_nombre` VARCHAR(200), IN `p_apellido` VARCHAR(200), IN `p_ciudad` VARCHAR(200), IN `p_edad` INT, IN `p_id` INT)  NO SQL
UPDATE Persona
            SET
                nombre = p_nombre,
                apellido = p_apellido,
                ciudad = p_ciudad,
                edad = p_edad
            WHERE
                id = p_id$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Persona`
--

CREATE TABLE `Persona` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `apellido` varchar(200) NOT NULL,
  `ciudad` varchar(200) NOT NULL,
  `edad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `Persona`
--

INSERT INTO `Persona` (`id`, `nombre`, `apellido`, `ciudad`, `edad`) VALUES
(3, 'Juan', 'Perez', 'SCZ', 20),
(5, 'Jose', 'Alvarez', 'Santa Cruz', 27),
(6, 'Ulises', 'Macedo', 'Santa Cruz', 22),
(7, 'Ulises', 'Macedo', 'Santa Cruz', 28),
(12, 'Juan', 'asd', 'asdas', 12),
(13, 'Juanito', 'Perezito', 'Santacruzito', 23);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Persona`
--
ALTER TABLE `Persona`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Persona`
--
ALTER TABLE `Persona`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
