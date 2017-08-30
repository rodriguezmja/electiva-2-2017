<?php
include_once './DAO/DAL/Connection.php';
include_once './DAO/DTO/Persona.php';
include_once './DAO/BLL/PersonaBLL.php';

$personaBLL = new PersonaBLL();
?>
<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <body>
        <?php
        $listaPersonas = $personaBLL->selectAll();
        ?>
        <select>
            <option>Categoria 1</option>
        </select>
        <select>
            <?php
            foreach ($listaPersonas as $objPersona) {
                ?>

            <option value="<?php echo $objPersona->getId();?>"><?php echo $objPersona->getNombre() . " " . $objPersona->getApellido(); ?></option>

                <?php
            }
            ?>
        </select>
        <div class="form-group">
            <input class="btn btn-primary" type="submit" value="Subir Foto"/>
            <a href="index.php" class="btn btn-link">Cancelar</a>
        </div>
    </body>
</html>
