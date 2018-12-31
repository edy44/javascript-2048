<?php

/**
 * Class AppModel
 * Gère la connexion à la base de données
 */
class Model
{

    /**
     * Paramètres de connexion à la base de données pour l'objet PDO
     */
    const DB_HOST = 'localhost';
    const DB_USERNAME = 'root';
    const DB_PASSWORD = 'ha3085';
    const DB_PORT = 80;
    const DB_NAME = 'jquery_rush';

    /**
     * @var PDO
     */
    private $pdo;
    /**
     * @var string
     */
    private $table;

    /**
     * AppModel constructor.
     */
    public function __construct()
    {
        if (is_null($this->pdo))
        {
            $this->pdo = $this->connect_db(self::DB_HOST,
                self::DB_USERNAME,
                self::DB_PASSWORD,
                self::DB_PORT,
                self::DB_NAME);
        }
        $this->table = "game";
    }

    /**
     * Permet de créer un enregistrement dans la table
     * Le tableau data contient en clé le nom des paramètres et en valeur leur valeur
     * @param array $data
     * @return bool
     */
    public function insert(array $data): bool
    {
        $vars = [];
        $sql = 'INSERT INTO '.$this->table.' SET ';
        foreach ($data as $key => $value)
        {
            $sql .= $key.'=:'.$key.', ';
            $vars[':'.$key] = $value;
        }
        $sql = trim($sql, ', ');
        $sql .= ';';
        $req = $this->pdo->prepare($sql);
        return $req->execute($vars);
    }

    /**
     * Retourne l'ensemble des enregistrements d'une partie
     * @return array
     */
    public function find_all(): array
    {
        $sql = 'SELECT turn, array, score FROM '.$this->table.';';
        $req = $this->pdo->prepare($sql);
        $req->execute();
        return $req->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Permet de supprimer tous les enregistrements
     * @return bool
     */
    public function delete($turn = NULL): bool
    {
        $sql = 'DELETE FROM '.$this->table;
        if (!is_null($turn))
        {
            $sql .= ' WHERE turn>:turn';
        }
        $sql .= ';';
        $req = $this->pdo->prepare($sql);
        return $req->execute([':turn' => $turn]);
    }

    /**
     * Permet de se connecter à la base de données
     * Renvoie un objet de type PDO
     * @param $host
     * @param $username
     * @param $password
     * @param $port
     * @param $db
     * @return PDO
     */
    private function connect_db(string $host, string $username, string $password, int $port, string $db): PDO
    {
        try
        {
            $pdo = new PDO('mysql:dbname='.$db.';host=' .$host.';port='.$port, $username, $password);
            return $pdo;
        }
        catch (PDOException $pdoException)
        {
            $message = "Erreur de connection à la base de données\n";
            echo $message;
            die;
        }
    }

}
