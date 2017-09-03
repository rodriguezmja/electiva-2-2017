<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->

<?php
include_once './DAO/DAL/Connection.php';
include_once './DAO/Model/Juego.php';
include_once './DAO/BLL/JuegoBLL.php';

$juegoBLL = new JuegoBLL();

function mostrarMensaje($mensaje) {

    echo "<script>alert('$mensaje')</script>";
}

if (isset($_REQUEST["tarea"])) {
    $tarea = $_REQUEST["tarea"];

    switch ($tarea) {
        case "insertar" :
            if (!isset($_REQUEST["nombre"]) || !isset($_REQUEST["precio"]) || !isset($_REQUEST["descripcion"])) {
                mostrarMensaje("Error al insertar, faltan parametros.");
                return;
            } else {


                $nombre = $_REQUEST["nombre"];
                $padre = $_REQUEST["padre"];
                $precio = $_REQUEST["precio"];
                $descripcion = $_REQUEST["descripcion"];


                $juegoBLL->insert($nombre, $precio, $padre, $descripcion);
            }
            break;

        case "actualizar":
            if (!isset($_REQUEST["nombre"]) || !isset($_REQUEST["padre"]) || !isset($_REQUEST["precio"]) || !isset($_REQUEST["descripcion"]) || !isset($_REQUEST["id"])) {
                mostrarMensaje("Error al actualizar, faltan parametros.");
                return;
            } else {
                $id = $_REQUEST["id"];
                $nombre = $_REQUEST["nombre"];
                $padre = $_REQUEST["padre"];
                $precio = $_REQUEST["precio"];
                $descripcion = $_REQUEST["descripcion"];
                $categoria = $_REQUEST["padre"];

                $juegoBLL->update($nombre, $precio, $categoria, $descripcion, $id);
            }
            break;

        case "eliminar":
            if (!isset($_REQUEST["id"])) {
                mostrarMensaje("Error al eliminar, faltan parametros.");
                return;
            } else {
                $id = $_REQUEST["id"];

                $juegoBLL->delete($id);
            }
            break;

        case "foto":
            if (!isset($_REQUEST["id"])) {
                mostrarMensaje("Error al cargar foto, faltan parametros.");
                return;
            } else {
                $id = $_REQUEST["id"];
                $dir_subida = 'img/';
                $fichero_subido = $dir_subida . $id . ".jpg";

                if (move_uploaded_file($_FILES['archivo']['tmp_name'], $fichero_subido)) {
                    
                } else {
                    
                }
            }
            break;
    }
}
?>
<html>
    <head>
        <meta charset="UTF-8">
        <link href="css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="css/bootstrap-theme.min.css" rel="stylesheet" type="text/css"/>
        <script src="js/bootstrap.min.js" type="text/javascript"></script>

        <link rel="stylesheet" type="text/css" href="css/style.css">
        <title>JUEGOS</title>
    </head>

    <header>

        <div class="titulo center-block">

        </div>

        <h1>Playstation</h1>
<nav>
                <ul>
        <?php
        $listaJuegos = $juegoBLL->selectAll();
        
        foreach ($listaJuegos as $objJuego) {
            ?>
            
                    <li><?php echo $objJuego->getNombre()?></li>
                    
               
            <?php
        }
        ?>
                     </ul>
            </nav>
        <h2>Juegos</h2>

    </header>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-md-12">

                    <div class="well">
                        <a href="AgregarJuego.php">Agregar</a>
                        <a href="Categorias.php">Categorias</a>
                    </div>

                    <div class="categorias col-md-2">
<nav>
                <ul>
        <?php
        $listaJuegos = $juegoBLL->selectAll();
        
        foreach ($listaJuegos as $objJuego) {
            ?>
            
                    <li><?php echo $objJuego->getNombre()?></li>
                    
               
            <?php
        }
        ?>
                     </ul>
            </nav>
                    </div>

                    <div class="filtros">

                    </div>
                    <div class="filtros2 col-md-10">

                        <?php
                        $listaJuegos = $juegoBLL->selectAll();

                        foreach ($listaJuegos as $objJuego) {
                            ?>
                            <div class="col-md-3 item center-block">
                                <img src="img/<?php echo $objJuego->getId() ?>.jpg" alt="" class="center-block img-responsive" id="img"/>
                                <h2><?php echo $objJuego->getNombre() ?></h2>
                                <label id="precio">Precio : <?php echo $objJuego->getPrecio() ?></label>
                                <a href="detalle.php?id=<?php echo $objJuego->getId(); ?>"><i class="glyphicon glyphicon-resize-full"></i></a>
                                <a href="AgregarJuego.php?id=<?php echo $objJuego->getId(); ?>"><i class="glyphicon glyphicon-edit"></i></a>
                                <a href="Foto.php?id=<?php echo $objJuego->getId(); ?>"><i class="glyphicon glyphicon-picture"></i></a>
                                <a href="index.php?tarea=eliminar&id=<?php echo $objJuego->getId(); ?>"><i class="glyphicon glyphicon-trash"></i></a>
                            </div>
                            <?php
                        }
                        ?>
                    </div>
                </div>
            </div>
        </div>

    </body>
</html>
