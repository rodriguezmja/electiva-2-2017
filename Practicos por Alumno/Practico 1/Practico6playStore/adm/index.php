<?php
include_once '../DAO/DAL/Connection.php';
include_once '../DAO/DTO/Juego.php';
include_once '../DAO/DTO/Categoria.php';
include_once '../DAO/BLL/JuegoBLL.php';
include_once '../DAO/BLL/CategoriaBLL.php';

$juegoBLL = new JuegoBLL();
$CategoriaBLL = new CategoriaBLL();

function mostrarMensaje($mensaje) {
    echo "<script type='text/javascript'>alert('$mensaje')</script>";
}

if (isset($_REQUEST["tarea"])) {
    $tarea = $_REQUEST["tarea"];
    switch ($tarea) {
        case "insertar":
            if (!isset($_REQUEST["nombre"]) || !isset($_REQUEST["precio"]) || !isset($_REQUEST["descripcion"])) {
                mostrarMensaje('Error al insertar, parámetros incompletos');
            } else {
                $nombre = $_REQUEST["nombre"];
                $precio = $_REQUEST["precio"];
                $descripcion = $_REQUEST["descripcion"];
                $juegoBLL->insert($nombre, $precio, $descripcion);
            }
            break;
        case "actualizar":
            if (!isset($_REQUEST["nombre"]) || !isset($_REQUEST["precio"]) || !isset($_REQUEST["descripcion"])) {
                mostrarMensaje('Error al actualizar, parámetros incompletos');
            } else {
                $nombre = $_REQUEST["nombre"];
                $precio = $_REQUEST["precio"];
                $descripcion = $_REQUEST["descripcion"];
                $id = $_REQUEST["id"];
                $juegoBLL->update($id, $nombre, $precio, $descripcion);
            } break;
        case "eliminar":
            if (!isset($_REQUEST["id"])) {
                mostrarMensaje('Error al eliminar, parámetros incompletos');
            } else {
                $id = $_REQUEST["id"];
                $juegoBLL->delete($id);
            }
            break;
        case "agregarCategoria":
            if (!isset($_REQUEST["id"])) {
                mostrarMensaje('Error al eliminar, parámetros incompletos');
            } else {
                $idJuego = $_REQUEST["id"];
                $idCategoria = $_REQUEST["categoria"];
                $CategoriaBLL->insertCategoriaAjuego($idCategoria, $idJuego);
//                mostrarMensaje($_REQUEST["categoria"]);
//                insertCategoriaAjuego
            }
            break;

        case "fotoperfil":
            if (!isset($_REQUEST["id"])) {
                mostrarMensaje('Error al agregar foto de perfil, parámetros incompletos');
            } else {
                $id = $_REQUEST["id"];

                $dir_subida = '../img/juegos/';

                $fichero_subido = $dir_subida . $id . ".jpg";
                echo ($_FILES['archivo']['tmp_name']);
                if (move_uploaded_file($_FILES['archivo']['tmp_name'], $fichero_subido)) {
                    echo "El fichero es válido y se subió con éxito.\n";
                } else {
                    echo "¡Posible ataque de subida de ficheros!\n";
                }
            }
            break;
    }
}
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <link href="../bootstrap-3.3.7-dist/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="../bootstrap-3.3.7-dist/css/bootstrap-theme.min.css" rel="stylesheet" type="text/css"/>
        <script src="../bootstrap-3.3.7-dist/js/bootstrap.min.js" type="text/javascript"></script>
        <title></title>
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="well"  style="margin-top: 10px;">
                        <a class="btn btn-primary" href="AgregarJuego.php"><i class="glyphicon glyphicon-plus"></i> Agregar Juego</a>
                    </div>
                    <?php
//        $personaBLL->insert("Juan", "Perez", "SCZ", 20);
                    ?>
                    <table class="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $listaPersonas = $juegoBLL->selectAll();

                            foreach ($listaPersonas as $objPersona) {
                                ?>


                                <tr>
                                    <td>
                                        <img alt="<?php echo $objPersona->getNombre(); ?>" class="img-responsive" style="max-width: 100px" src="../<?php echo $objPersona->getImagen(); ?>" />
                                    </td>
                                    <td>
                                        <?php echo $objPersona->getId(); ?>
                                    </td>
                                    <td>
                                        <?php echo $objPersona->getNombre(); ?>
                                    </td>
                                    <td>
                                        <?php echo $objPersona->getPrecio(); ?>
                                    </td>
                                    <td>
                                        <a href="FotoDePerfil.php?id=<?php echo $objPersona->getId(); ?>"><i class="glyphicon glyphicon-picture"></i> Subir Foto</a>
                                    </td>
                                    <td>
                                        <a href="AgregarJuego.php?id=<?php echo $objPersona->getId(); ?>"><i class="glyphicon glyphicon-edit"></i> Editar</a>
                                    </td>
                                    <td>
                                        <a href="index.php?tarea=eliminar&id=<?php echo $objPersona->getId(); ?>"><i class="glyphicon glyphicon-trash"></i> Eliminar</a>
                                    </td>
                                    <td>
                                        <a href="AgregarCategoria.php?id=<?php echo $objPersona->getId(); ?>"><i class="glyphicon glyphicon-plus"></i> Agregar Categoria</a>
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
