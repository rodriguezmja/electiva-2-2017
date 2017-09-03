<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->

<?php   include_once './DAO/DAL/Connection.php';
        include_once './DAO/DTO/Juego.php';
        include_once './DAO/BLL/JuegoBLL.php';
        include_once './DAO/DTO/Categoria.php';
        include_once './DAO/BLL/CategoriaBLL.php';
        
        $juegoBLL = new JuegoBLL();
        $categoriaBLL = new CategoriaBLL();
        $id = 0;
        
        if(isset($_REQUEST["id"])){
            $id = $_REQUEST["id"];
        switch ($tarea){
                
                
            }
            
        }
        $objJuego = $juegoBLL->select($id);
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
                    <h2>Datos del Juego</h2>
        
                    <form action="index.php" method="GET">

                        <input type="hidden" value="<?php 
                        if($objJuego!=null){
                            echo "actualizar";
                        }else{
                            echo "insertar";
                        }
                        ?>" name="tarea"/>

                        <input type="hidden" value="<?php echo $id;?>" name="id"/>
                        <div class="form-group">
                            <label>Nombre : </label>
                        
                            <input class="form-control" required="required" type="text" name="nombre" value="<?php 
                            if($objJuego!=null)
                            {
                                echo $objJuego->getNombre();
                            }
                                ?>"/>
                        </div>
                        
                        <div class="form-group">
                            <label>Categoria Padre : </label>
                        
                            <select name="padre" class="form-control" required="required">
                                <option></option>
                                <?php
                        $listaCategorias = $categoriaBLL->selectAll();

                        foreach ($listaCategorias as $objCategoria) {
                            
                            ?>
                                <option selected="<?php echo $objCategoria->getId();?>">
                                    <?php
                                 echo $objCategoria->getId();
                                
                            
                                    ?>
                                </option>
                             <?php
                        }
                            ?>
                            </select>
                            
                        </div>

                        <div class="form-group">
                            <label>Precio : </label>
                        
                            <input class="form-control" required="required" type="text" name="precio" value="<?php 
                            if($objJuego!=null)
                            {
                                echo $objJuego->getPrecio();
                            }
                                ?>"/>
                        </div>

                        <div class="form-group">
                            <label>Descripcion : </label>
                        
                            <input maxlength="500" class="form-control" required="required" type="text" name="descripcion" value="<?php 
                            if($objJuego!=null)
                            {
                                echo $objJuego->getDescripcion();
                            }
                                ?>"/>
                        </div>

                        <div>
                            <input class="btn btn-primary" type="submit" value="Guardar"/>
                            <a class="btn btn-danger" href="index.php">Cancelar</a>
                        </div>

                    </form>
                </div>
            </div>
        </div>
        
        
    </body>
</html>
