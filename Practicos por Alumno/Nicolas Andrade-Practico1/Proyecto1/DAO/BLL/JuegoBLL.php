<?php

/**
 * Description of JuegoBLL
 *
 * @author Nikolas-PC
 */
class JuegoBLL {
    
    public function insert($nombre, $precio, $descripcion){
        $objConexion = new Connection();
        $objConexion->queryWithParams("CALL mk_tblJuegos(:pNombre, :pPrecio, :pDescripcion)", array(
           "pNombre"=>$nombre,
           "pPrecio"=>$precio,
           "pDescripcion"=>$descripcion
        ));
    }
    
    public function update($id, $nombre, $precio, $descripcion){
        $objConexion = new Connection();
        $objConexion->queryWithParams("CALL up_tblJuegos(:pCodigo_id, :pNombre, :pPrecio, :pDescripcion)", array(
           "pCodigo_id"=>$id,
           "pNombre"=>$nombre,
           "pPrecio"=>$precio,
           "pDescripcion"=>$descripcion
        ));
    }
    
    public function delete($id) {
        $objConexion = new Connection();
        $objConexion->queryWithParams("CALL del_tblJuegos(:pCodigo_id)", array(
            ":pCodigo_id" => $id
        ));
    }
    
    public function selectAll() {
        $listaJuegos = array();
        $objConexion = new Connection();
        $res = $objConexion->query("CALL get_tblJuegos()");
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            $objJuego = $this->rowToDto($row);
            $listaJuegos[] = $objJuego;
        }
        return $listaJuegos;
    }
    
    public function select($id) {
        $objConexion = new Connection();
        $res = $objConexion->queryWithParams("CALL get_tblJuegosById(:id)", array(
            ":id" => $id
        ));
        if ($res->rowCount() == 0) {
            return null;
        }
        $row = $res->fetch(PDO::FETCH_ASSOC);
        return $this->rowToDto($row);
    }
    
    function rowToDto($row) {
        $objJuego = new Juego();
        $objJuego->setCodigo_id("codig_id");
        $objJuego->setNombre("nombre");
        $objJuego->setPrecio("precio");
        $objJuego->setDescripcion("descripcion");
        return $objJuego;
    }
}
