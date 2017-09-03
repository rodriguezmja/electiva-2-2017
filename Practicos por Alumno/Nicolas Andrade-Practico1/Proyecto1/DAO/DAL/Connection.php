<?php

/**
 * Description of Connection
 *
 * @author JM
 */
class Connection {

    private $server = "localhost";
    private $usr = "root";
    private $pass = "root";
    private $db = "juegos";
    private $port = "3307";
    private $connection;

    function getConnection() {
        if ($this->connection == null) {
            $this->connection = new PDO("mysql:host=$this->server;dbname=$this->db;port=$this->port", $this->usr, $this->pass);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        }
        return $this->connection;
    }

    function query($csql) {
        return $this->getConnection()->query($csql);
    }

    function queryWithParams($csql, $paramArray) {
        $q = $this->getConnection()->prepare($csql);
        $q->execute($paramArray);
        return $q;
    }

}
