<?php
/**
 * Description of Juego
 *
 * @author Nikolas-PC
 */
class Juego {
    private $codigo_id;
    private $nombre;
    private $precio;
    private $descripcion;
    
//    function __construct($codigo_id, $nombre, $precio, $descripcion) {
//        $this->codigo_id = $codigo_id;
//        $this->nombre = $nombre;
//        $this->precio = $precio;
//        $this->descripcion = $descripcion;
//    }
    
    function getCodigo_id() {
        return $this->codigo_id;
    }

    function getNombre() {
        return $this->nombre;
    }

    function getPrecio() {
        return $this->precio;
    }

    function getDescripcion() {
        return $this->descripcion;
    }

    function setCodigo_id($codigo_id) {
        $this->codigo_id = $codigo_id;
    }

    function setNombre($nombre) {
        $this->nombre = $nombre;
    }

    function setPrecio($precio) {
        $this->precio = $precio;
    }

    function setDescripcion($descripcion) {
        $this->descripcion = $descripcion;
    }



}
