<?php
    include_once './DAO/DAL/Connection.php';
        include_once './DAO/DTO/Juego.php';
        include_once './DAO/BLL/JuegoBLL.php';
        include_once './DAO/DTO/Categoria.php';
        include_once './DAO/BLL/CategoriaBLL.php';
        
        $juegoBLL = new JuegoBLL();
        $categoriaBLL = new CategoriaBLL();
        $id = 0;
        
        if(isset($_REQUEST["id"])){
            $id = $_REQUEST["id"];
        
            
        }
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
        <link href="css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="css/bootstrap-theme.min.css" rel="stylesheet" type="text/css"/>
        <script src="js/bootstrap.min.js" type="text/javascript"></script>
        <link href="css/style.css" rel="stylesheet" type="text/css"/>
        <title></title>
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <form enctype="multipart/form-data" method="POST" action="index.php">
                        <input class="form-group" type="file" name="archivo" required="required"/>
                        <img src="img/<?php echo $id?>.jpg" alt="" class="img-responsive" id="img"/>
                        <input type="hidden" value="foto" name="tarea"/>                        
                        <input type="hidden" value="<?php echo $id;?>" name="id"/>

                        <input class="btn btn-primary"type="submit" value="Subir Foto"/>
                        <a class="btn btn-danger" href="index.php">Cancelar</a>

                    </form>
                    
                </div>
            </div>
        </div>
    </body>
</html>
