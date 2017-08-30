<?php

/**
 * Description of PersonaBLL
 *
 * @author jmacb
 */
class PersonaBLL {

    public function insert($nombre, $apellido, $ciudad, $edad) {
        $objConexion = new Connection();
        $objConexion->queryWithParams("CALL sp_Persona_Insert(:pNombre,:pApellido,:pCiudad,:pEdad)", array(
            ":pNombre" => $nombre,
            ":pApellido" => $apellido,
            ":pCiudad" => $ciudad,
            ":pEdad" => $edad
        ));
    }

    public function update($nombre, $apellido, $ciudad, $edad, $id) {
        $objConexion = new Connection();
        $objConexion->queryWithParams("
            CALL sp_Persona_Update(:pNombre, :pApellido, :pCiudad, :pEdad, :pId)", array(
            ":pNombre" => $nombre,
            ":pApellido" => $apellido,
            ":pCiudad" => $ciudad,
            ":pEdad" => $edad,
            ":pId" => $id
        ));
    }

    public function delete($id) {
        $objConexion = new Connection();
        $objConexion->queryWithParams("CALL sp_Persona_Delete(:pId)", array(
            ":pId" => $id
        ));
    }

    public function selectAll() {
        $listaPersonas = array();
        $objConexion = new Connection();
        $res = $objConexion->query("CALL sp_Persona_SelectAll()");
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            $objPersona = $this->rowToDto($row);
            $listaPersonas[] = $objPersona;
        }
        return $listaPersonas;
    }

    public function select($id) {
        $objConexion = new Connection();
        $res = $objConexion->queryWithParams("CALL sp_Persona_SelectById(:pId)", array(
            ":pId" => $id
        ));
        if ($res->rowCount() == 0) {
            return null;
        }
        $row = $res->fetch(PDO::FETCH_ASSOC);
        return $this->rowToDto($row);
    }

    function rowToDto($row) {
        $objPersona = new Persona();
        $objPersona->setId($row["id"]);
        $objPersona->setNombre($row["nombre"]);
        $objPersona->setApellido($row["apellido"]);
        $objPersona->setCiudad($row["ciudad"]);
        $objPersona->setEdad($row["edad"]);
        return $objPersona;
    }

}
