<?php

header('Content-Type: application/json');

require_once("Model.php");

$dbb = new Model();

if (isset($_POST['turn']))
{
    $dbb->delete($_POST['turn']);
}
else
{
    $dbb->delete();
}
