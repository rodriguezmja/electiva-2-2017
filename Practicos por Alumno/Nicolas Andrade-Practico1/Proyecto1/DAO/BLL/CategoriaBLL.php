<?php
/**
 * Description of CategoriaBLL
 * 
 * @author Nikolas-PC
 */
class CategoriaBLL {
    
    public function insert($nombre, $catPadre){
        $objConexion = new Connection();
        $objConexion->queryWithParams("CALL mk_tblCategorias(:pNombre, :pCatPadre)", array(
           "pNombre"=>$nombre,
           "pCatPadre"=>$catPadre
        ));
    }
    
    public function update($id, $nombre, $catPadre){
        $objConexion = new Connection();
        $objConexion->queryWithParams("CALL up_tblCategorias(:pCodigo_id, :pNombre, :pCatPadre)", array(
           "pCodigo_id"=>$id,
           "pNombre"=>$nombre,
           "pCatPadre"=>$catPadre
        ));
    }
    
    public function delete($id) {
        $objConexion = new Connection();
        $objConexion->queryWithParams("CALL del_tblCategorias(:pCodigo_id)", array(
            ":pCodigo_id" => $id
        ));
    }
    
    public function selectAll() {
        $listaCategorias = array();
        $objConexion = new Connection();
        $res = $objConexion->query("CALL get_tblCategorias");
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            $objJuego = $this->rowToDto($row);
            $listaCategorias[] = $objJuego;
        }
        return $listaCategorias;
    }
    
    public function select($id) {
        $objConexion = new Connection();
        $res = $objConexion->queryWithParams("CALL get_tblCategoriasById(:id)", array(
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
        $objJuego->setPrecio("id_categoriaPadre");
    }
    
}
