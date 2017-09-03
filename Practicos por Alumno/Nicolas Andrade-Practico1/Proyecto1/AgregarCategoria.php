<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->

<?php   include_once './DAO/DAL/Connection.php';
        include_once './DAO/DTO//Categoria.php';
        include_once './DAO/BLL/CategoriaBLL.php';
        
        $categoriaBLL = new CategoriaBLL();
        $id = 0;
        
        if(isset($_REQUEST["id"])){
            $id = $_REQUEST["id"];
        
            
        }
        $objCategoria = $categoriaBLL->select($id);
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
                <div class="col-md-6">
                    <h2>Datos de la Categoria</h2>
        
                    <form action="Categorias.php" method="GET">

                        <input type="hidden" value="<?php 
                        if($objCategoria!=null){
                            echo "actualizar";
                        }else{
                            echo "insertar";
                        }
                        ?>" name="tarea"/>

                        <input type="hidden" value="<?php echo $id;?>" name="id"/>
                        <div class="form-group">
                            <label>Nombre : </label>
                        
                            <input class="form-control" required="required" type="text" name="nombre" value="<?php 
                            if($objCategoria!=null)
                            {
                                echo $objCategoria->getNombre();
                            }
                                ?>"/>
                        </div>

                        <div class="form-group">
                            <label>Categoria Padre : </label>
                        
                            <select name="padre" class="form-control">
                                <option></option>
                                <?php
                        $listaCategorias = $categoriaBLL->selectAll();

                        foreach ($listaCategorias as $objCategoria) {
                            
                            ?>
                                <option>
                                    <?php
                                        
                                echo $objCategoria->getId();
                            
                                    ?>
                                </option>
                             <?php
                        }
                            ?>
                            </select>
                            
                        </div>

                        <div>
                            <input class="btn btn-primary" type="submit" value="Guardar"/>
                            <a class="btn btn-danger" href="Categorias.php">Cancelar</a>
                        </div>

                    </form>
                </div>
            </div>
        </div>
        
        
    </body>
</html>
