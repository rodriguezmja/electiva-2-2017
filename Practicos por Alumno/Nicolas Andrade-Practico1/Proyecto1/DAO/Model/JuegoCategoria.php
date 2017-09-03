<?php

/**
 * Description of JuegoCategoria
 *
 * @author Nikolas-PC
 */
class JuegoCategoria {
    private $juego_id;
    private $categoria_id;
    
    function __construct($juego_id, $categoria_id) {
        $this->juego_id = $juego_id;
        $this->categoria_id = $categoria_id;
    }

    function getJuego_id() {
        return $this->juego_id;
    }

    function getCategoria_id() {
        return $this->categoria_id;
    }

    function setJuego_id($juego_id) {
        $this->juego_id = $juego_id;
    }

    function setCategoria_id($categoria_id) {
        $this->categoria_id = $categoria_id;
    }


}
