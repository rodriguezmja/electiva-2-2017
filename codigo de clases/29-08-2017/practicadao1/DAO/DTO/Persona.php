<?php

/**
 * Description of Persona
 *
 * @author jmacb
 */
class Persona {
    private $id;
    private $nombre;
    private $apellido;
    private $ciudad;
    private $edad;
    
    function getId() {
        return $this->id;
    }

    function getNombre() {
        return $this->nombre;
    }

    function getApellido() {
        return $this->apellido;
    }

    function getCiudad() {
        return $this->ciudad;
    }

    function getEdad() {
        return $this->edad;
    }

    function setId($id) {
        $this->id = $id;
    }

    function setNombre($nombre) {
        $this->nombre = $nombre;
    }

    function setApellido($apellido) {
        $this->apellido = $apellido;
    }

    function setCiudad($ciudad) {
        $this->ciudad = $ciudad;
    }

    function setEdad($edad) {
        $this->edad = $edad;
    }


}
