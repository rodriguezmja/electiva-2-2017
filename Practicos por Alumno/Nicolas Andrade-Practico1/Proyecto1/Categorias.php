<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->

<?php   include_once './DAO/DAL/Connection.php';
        include_once './DAO/DTO//Categoria.php';
        include_once './DAO/DTO//CategoriaJuego.php';
        include_once './DAO/BLL/CategoriaBLL.php';
        
        $categoriaBLL = new CategoriaBLL();
        
        function mostrarMensaje($mensaje) {
        
            echo "<script>alert('$mensaje')</script>";
        }
        
        if(isset($_REQUEST["tarea"])){
            $tarea = $_REQUEST["tarea"];
            
            switch ($tarea){
                case "insertar" :
                    if(!isset($_REQUEST["nombre"])){
                        mostrarMensaje("Error al insertar, faltan parametros.");
                        return;
                    }else{
                    $nombre = $_REQUEST["nombre"];
                    
                        
                    $padre = $_REQUEST["padre"];
                    if($padre == NULL){
                        $categoriaBLL->insert($nombre, NULL);
                    }else{
                        $categoriaBLL->insert($nombre, $padre);
                    }
                    
                    
                    }
                    
                    
                    
                    break;
                
                case "actualizar":
                    if(!isset($_REQUEST["nombre"]) || !isset($_REQUEST["padre"]) || !isset($_REQUEST["id"])){
                        mostrarMensaje("Error al actualizar, faltan parametros.");
                        return;
                    }else{
                    $id = $_REQUEST["id"];
                    $nombre = $_REQUEST["nombre"];
                    $padre = $_REQUEST["padre"];
                    
                    if($padre == null){
                    $categoriaBLL->update($nombre, NULL, $id);
                        
                    }else{
                    $categoriaBLL->update($nombre, $padre, $id);
                    }}
                    break;
                
                case "eliminar":
                    if(!isset($_REQUEST["id"])){
                        mostrarMensaje("Error al eliminar, faltan parametros.");
                        return;
                    }else{
                    $id = $_REQUEST["id"];
                    if($categoriaBLL->selectName($id) == NULL){
                    $categoriaBLL->delete($id);}else{
    echo "<script href='Categorias.php'>alert('No se puede eliminar')</script>";
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
        <title></title>
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    
                    <div class="well">
                        <a href="AgregarCategoria.php">Agregar</a>
                        <a href="index.php">Inicio</a>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NOMBRE</th>
                                <th>C. PADRE</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                    
                        </tbody>
                        <?php
                        $listaCategorias = $categoriaBLL->selectAll();

                        foreach ($listaCategorias as $objCategoria) {
                            ?>

                            <tr>
                                <td>
                                        <?php echo $objCategoria->getId() ?>
                                </td>
                                <td>
                                        <?php echo $objCategoria->getNombre() ?>
                                </td>
                                <td>
                                        <?php echo $objCategoria->getCategoriaPadre() ?>
                                </td>

                                <td>
                                    <a href="AgregarCategoria.php?id=<?php echo $objCategoria->getId();?>">Editar</a>
                                </td>

                                <td>
                                    <a href="Categorias.php?tarea=eliminar&id=<?php echo $objCategoria->getId();?>">Eliminar</a>
                                </td>
                            </tr>        

                            <?php
                        }
                    ?>
                    </table>
                </div>
            </div>
        </div>
        
    </body>
</html>
