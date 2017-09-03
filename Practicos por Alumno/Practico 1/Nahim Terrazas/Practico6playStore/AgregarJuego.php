<?php
include_once './DAO/DAL/Connection.php';
include_once './DAO/DTO/Persona.php';
include_once './DAO/BLL/PersonaBLL.php';

$personaBLL = new PersonaBLL();
$id = 0;
$objPersona = null;

if (isset($_REQUEST["id"])) {
    $id = $_REQUEST["id"];
    $objPersona = $personaBLL->select($id);
}
?>
<!DOCTYPE html>

<html>
    <head>
        <meta charset="UTF-8">
        <title>Datos de Persona</title>
        <link href="css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="css/bootstrap-theme.min.css" rel="stylesheet" type="text/css"/>
        <script src="js/bootstrap.min.js" type="text/javascript"></script>
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h2>
                        Datos de Persona
                    </h2>
                    <form action="index.php" method="POST">
                        <input type="hidden" value="<?php
                        if ($objPersona != null) {
                            echo "actualizar";
                        } else {
                            echo "insertar";
                        }
                        ?>" name="tarea"/>
                        <input type="hidden" value="<?php echo $id; ?>" name="id"/>
                        <div class="form-group">
                            <label>
                                Nombre:
                            </label>
                            <input class="form-control"  required="required" type="text" name="nombre" value="<?php
                            if ($objPersona != null) {
                                echo $objPersona->getNombre();
                            }
                            ?>"/>
                        </div>
                        <div class="form-group">
                            <label>
                                Apellido:
                            </label>
                            <input class="form-control"  required="required" type="text" name="apellido" value="<?php
                            if ($objPersona != null) {
                                echo $objPersona->getApellido();
                            }
                            ?>"/>
                        </div>
                        <div class="form-group">
                            <label>
                                Ciudad:
                            </label>
                            <input class="form-control" type="text" name="ciudad"  required="required" value="<?php
                            if ($objPersona != null) {
                                echo $objPersona->getCiudad();
                            }
                            ?>"/>
                        </div>
                        <div class="form-group">
                            <label>
                                Edad:
                            </label>
                            <input class="form-control" type="number" name="edad"  value="<?php
                            if ($objPersona != null) {
                                echo $objPersona->getEdad();
                            }
                            ?>"  required="required"/>
                        </div>
                        <div class="form-group">
                            <input class="btn btn-primary" type="submit" value="Guardar datos" />
                            <a href="index.php" class="btn btn-link">Cancelar</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </body>
</html>
