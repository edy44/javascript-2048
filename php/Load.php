<?php

header('Content-Type: application/json');

require_once("Model.php");

$dbb = new Model();

$data = $dbb->find_all();
if (!empty($data))
{
    $size = count($data);
    for ($i = 0 ; $i < $size ; $i++)
    {
        $data[$i]['array'] = unserialize($data[$i]['array']);
    }
}

echo json_encode($data);
