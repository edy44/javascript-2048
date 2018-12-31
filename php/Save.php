<?php

header('Content-Type: application/json');

require_once("Model.php");

$dbb = new Model();

extract($_POST);

$array = serialize($save);
$data = compact('turn', 'score', 'array');

echo $dbb->insert($data);
