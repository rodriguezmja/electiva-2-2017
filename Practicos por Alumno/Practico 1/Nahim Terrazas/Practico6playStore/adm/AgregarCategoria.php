<?php
include_once '../DAO/DAL/Connection.php';
include_once '../DAO/DTO/Juego.php';
include_once '../DAO/DTO/Categoria.php';
include_once '../DAO/BLL/JuegoBLL.php';
include_once '../DAO/BLL/CategoriaBLL.php';

$juegoBLL = new JuegoBLL();
$CategoriaBLL = new CategoriaBLL();
$id = 0;
$objjuego = null;

if (isset($_REQUEST["id"])) {
    $id = $_REQUEST["id"];
    $objjuego = $juegoBLL->select($id);
}
?>
<!DOCTYPE html>

<html>
    <head>
        <meta charset="UTF-8">
        <title>Datos del Juego</title>
        <link href="../bootstrap-3.3.7-dist/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="../bootstrap-3.3.7-dist/css/bootstrap-theme.min.css" rel="stylesheet" type="text/css"/>
        <script src="../bootstrap-3.3.7-dist/js/bootstrap.min.js" type="text/javascript"></script>
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h2>
                        Detalles del Juego
                    </h2>
                    <form action="index.php" method="POST" id="usrform">
                        <input type="hidden" value="<?php
                            echo "agregarCategoria";
//                            echo "insertar";
                        ?>" name="tarea"/>
                        <input type="hidden" value="<?php echo $id; ?>" name="id"/>
                        <div class="form-group">
                            <label>
                                Nombre:
                            </label>
                            <input class="form-control"  required="required" type="text" name="nombre" readonly value="<?php
                            if ($objjuego != null) {
                                echo $objjuego->getNombre();
                            }
                            ?>"/>
                        </div>
                        <div class="form-group">
                            <label>
                                Precio:
                            </label>
                            <input class="form-control"  required="required" type="text" readonly name="precio" value="<?php
                            if ($objjuego != null) {
                                echo $objjuego->getPrecio();
                            }
                            ?>"/>
                        </div>
                        <div class="form-group">
                            <label>
                                Categorias Del Juego:
                            </label>
                            <input class="form-control"  required="required" readonly type="text" name="precio" value="<?php
//                           For de categorias
                            $listaCategorias = $CategoriaBLL->selectCategoriasDeJuego($id);
                            foreach ($listaCategorias as $objCategoria) {
                                echo $objCategoria->getNombre() . ", ";
                            }
//                            $objCategoria
                            ?>"
                                   />
                        </div>
                        <BR>
                        <BR>
                        <BR>
`                       <div class="form-group">
                            <label>
                                Agregar Categoria:
                            </label>
                            <select class="form-control" required="required" name="categoria">

                                <?php
                                $listaCat = $CategoriaBLL->selectCategoriasNoEnJuego($id);
                                foreach ($listaCat as $objCategoria) {
                                    ?>
                                    <option value="<?php
//                           For de categorias
                                    echo $objCategoria->getId();
                                    ?>"
                                            ><?php echo $objCategoria->getNombre(); ?></option>
                                            <?php
                                        }
                                        ?>
                            </select> 
                        </div>

                        <div class="form-group">
                            <input class="btn btn-primary" type="submit" value="Agregar" />
                            <a href="index.php" class="btn btn-link">Cancelar</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </body>
</html>
