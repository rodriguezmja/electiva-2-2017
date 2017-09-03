<?php
include_once './DAO/DAL/Connection.php';
include_once './DAO/DTO/Persona.php';
include_once './DAO/BLL/PersonaBLL.php';
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <body>
        <?php
        $personaBLL = new PersonaBLL();
//        $personaBLL->insert("Juan", "Perez", "SCZ", 20);
        ?>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Ciudad</th>
                    <th>Edad</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $listaPersonas = $personaBLL->selectAll();

                foreach ($listaPersonas as $objPersona) {
                    ?>


                    <tr>
                        <td>
                            <?php echo $objPersona->getId(); ?>
                        </td>
                        <td>
                            <?php echo $objPersona->getNombre(); ?>
                        </td>
                         <td>
                            <?php echo $objPersona->getApellido(); ?>
                        </td>
                         <td>
                            <?php echo $objPersona->getCiudad(); ?>
                        </td>
                         <td>
                            <?php echo $objPersona->getEdad(); ?>
                        </td>
                    </tr>



                    <?php
                }
                ?>
            </tbody>
        </table>
    </body>
</html>
