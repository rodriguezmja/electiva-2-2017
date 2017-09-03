<?php
include_once './DAO/DAL/Connection.php';
include_once './DAO/DTO/Persona.php';
include_once './DAO/BLL/PersonaBLL.php';

$personaBLL = new PersonaBLL();

function mostrarMensaje($mensaje) {
    echo "<script type='text/javascript'>alert('$mensaje')</script>";
}

if (isset($_REQUEST["tarea"])) {
    $tarea = $_REQUEST["tarea"];
    switch ($tarea) {
        case "insertar":
            if (!isset($_REQUEST["nombre"]) || !isset($_REQUEST["apellido"]) || !isset($_REQUEST["ciudad"]) || !isset($_REQUEST["edad"])) {
                mostrarMensaje('Error al insertar, parámetros incompletos');
            } else {
                $nombre = $_REQUEST["nombre"];
                $apellido = $_REQUEST["apellido"];
                $ciudad = $_REQUEST["ciudad"];
                $edad = $_REQUEST["edad"];
                $personaBLL->insert($nombre, $apellido, $ciudad, $edad);
            }
            break;
        case "actualizar":
            if (!isset($_REQUEST["nombre"]) || !isset($_REQUEST["apellido"]) || !isset($_REQUEST["ciudad"]) || !isset($_REQUEST["edad"]) || !isset($_REQUEST["id"])) {
                mostrarMensaje('Error al actualizar, parámetros incompletos');
            } else {
                $id = $_REQUEST["id"];
                $nombre = $_REQUEST["nombre"];
                $apellido = $_REQUEST["apellido"];
                $ciudad = $_REQUEST["ciudad"];
                $edad = $_REQUEST["edad"];
                $personaBLL->update($nombre, $apellido, $ciudad, $edad, $id);
            }
            break;
        case "eliminar":
            if (!isset($_REQUEST["id"])) {
                mostrarMensaje('Error al actualizar, parámetros incompletos');
            } else {
                $id = $_REQUEST["id"];
                $personaBLL->delete($id);
            }
            break;
    }
}
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <link href="css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="css/bootstrap-theme.min.css" rel="stylesheet" type="text/css"/>
        <script src="js/bootstrap.min.js" type="text/javascript"></script>
        <title></title>
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="well" style="margin-top: 10px;">
                        <a class="btn btn-primary" href="AgregarPersona.php">Agregar persona</a>
                    </div>
                    <?php
//        $personaBLL->insert("Juan", "Perez", "SCZ", 20);
                    ?>
                    <table class="table">
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
                                    <td>
                                        <a href="AgregarPersona.php?id=<?php echo $objPersona->getId(); ?>">Editar</a>
                                    </td>
                                    <td>
                                        <a href="index.php?tarea=eliminar&id=<?php echo $objPersona->getId(); ?>">Eliminar</a>
                                    </td>
                                </tr>



                                <?php
                            }
                            ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </body>
</html>
