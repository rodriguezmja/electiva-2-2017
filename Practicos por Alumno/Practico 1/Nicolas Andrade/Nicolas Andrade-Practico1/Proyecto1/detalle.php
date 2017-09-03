<?php
include_once './DAO/DAL/Connection.php';
include_once './DAO/DTO/Juego.php';
include_once './DAO/BLL/JuegoBLL.php';
include_once './DAO/DTO/Categoria.php';
include_once './DAO/BLL/CategoriaBLL.php';

$juegoBLL = new JuegoBLL();
$categoriaBLL = new CategoriaBLL();
$id = 0;

if (isset($_REQUEST["id"])) {
    $id = $_REQUEST["id"];
}
?>
<!DOCTYPE html>
<html lang="es">
    <head>
        <link href="css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="css/bootstrap-theme.min.css" rel="stylesheet" type="text/css"/>
        <script src="js/bootstrap.min.js" type="text/javascript"></script>
        <link href="css/style.css" rel="stylesheet" type="text/css"/>

        <meta charset="utf-8">
        <title></title>
    </head>

    <body>
        <div class="container">
            <div class="row ">
                <input type="hidden" value="foto" name="tarea"/>                        
                <input type="hidden" value="<?php echo $id; ?>" name="id"/>
                <div class="imagen" style=" background-image: url('img/<?php echo $id ?>.jpg');">
                    
                    

                
            </div>
                <img src="img/<?php echo $id ?>.jpg" alt="" class="img-responsive" id="img2" >
                <div class="detalle col-lg-12 form-group">
                    <label><?php echo $juegoBLL->select($id)->getNombre(); ?></label>
                    <label contenteditable="false" class="col-md-12"><?php echo $juegoBLL->select($id)->getDescripcion(); ?></label>


                </div>
        </div>
    </body>
</html>