<?php

/**
 * Description of PersonaBLL
 *
 * @author jmacb
 */
class PersonaBLL {

    public function insert($nombre, $apellido, $ciudad, $edad) {
        $objConexion = new Connection();
        $objConexion->queryWithParams("INSERT INTO Persona(nombre,apellido,ciudad,edad) 
            VALUES (:pNombre,:pApellido,:pCiudad,:pEdad)", array(
            ":pNombre" => $nombre,
            ":pApellido" => $apellido,
            ":pCiudad" => $ciudad,
            ":pEdad" => $edad
        ));
    }

    public function update($nombre, $apellido, $ciudad, $edad, $id) {
        $objConexion = new Connection();
        $objConexion->queryWithParams("
            UPDATE Persona
            SET
                nombre = :pNombre,
                apellido = :pApellido,
                ciudad = :pCiudad,
                edad = :pEdad
            WHERE
                id = :pId", array(
            ":pNombre" => $nombre,
            ":pApellido" => $apellido,
            ":pCiudad" => $ciudad,
            ":pEdad" => $edad,
            ":pId" => $id
        ));
    }

    public function delete($id) {
        $objConexion = new Connection();
        $objConexion->queryWithParams("
            DELETE FROM Persona
            WHERE id = :pId", array(
            ":pId" => $id
        ));
    }

    public function selectAll() {
        $listaPersonas = array();
        $objConexion = new Connection();
        $res = $objConexion->query("
                SELECT id, nombre, apellido, ciudad, edad
                FROM Persona");
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            $objPersona = $this->rowToDto($row);
            $listaPersonas[] = $objPersona;
        }
        return $listaPersonas;
    }

    public function select($id) {
        $objConexion = new Connection();
        $res = $objConexion->queryWithParams("
                SELECT id, nombre, apellido, ciudad, edad
                FROM Persona 
                WHERE id = :pId", array(
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
