<?php

/**
 * Description of Categoria
 *
 * @author Nikolas-PC
 */
class Categoria {
    private $codigo_id;
    private $nombre;
    private $id_categoriaPadre;
    
    function __construct($codigo_id, $nombre, $id_categoriaPadre) {
        $this->codigo_id = $codigo_id;
        $this->nombre = $nombre;
        $this->id_categoriaPadre = $id_categoriaPadre;
    }
    
    function getCodigo_id() {
        return $this->codigo_id;
    }

    function getNombre() {
        return $this->nombre;
    }

    function getId_categoriaPadre() {
        return $this->id_categoriaPadre;
    }

    function setCodigo_id($codigo_id) {
        $this->codigo_id = $codigo_id;
    }

    function setNombre($nombre) {
        $this->nombre = $nombre;
    }

    function setId_categoriaPadre($id_categoriaPadre) {
        $this->id_categoriaPadre = $id_categoriaPadre;
    }
}
