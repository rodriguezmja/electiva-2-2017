<?php
include_once './DAO/DAL/Connection.php';
include_once './DAO/DTO/Persona.php';
include_once './DAO/BLL/PersonaBLL.php';

$personaBLL = new PersonaBLL();
$id = 0;
$objPersona = null;

if (isset($_REQUEST["id"])) {
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
        <title>Foto de Perfil</title>
        <link href="css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="css/bootstrap-theme.min.css" rel="stylesheet" type="text/css"/>
        <script src="js/bootstrap.min.js" type="text/javascript"></script>
    </head>
    <body>
        <div class="container" style="margin-top:10px;">
            <div class="row">
                <div class="col-md-6">
                    <div class="panel panel-primary">
                        <div class="panel-heading">
                            Agregar foto de perfil
                        </div>
                        <div class="panel-body">
                            <form action="index.php" enctype="multipart/form-data" method="POST">
                                <input type="hidden" value="fotoperfil" name="tarea"/>
                                <input type="hidden" value="<?php echo $id; ?>" name="id"/>
                                <div class="form-group">
                                    <input type="file" name="archivo" required="required"/>
                                    <img class="img-responsive" style="max-width: 100px" src="img/<?php echo $id ?>.jpg" />
                                </div>
                                <div class="form-group">
                                    <input class="btn btn-primary" type="submit" value="Subir Foto"/>
                                    <a href="index.php" class="btn btn-link">Cancelar</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
