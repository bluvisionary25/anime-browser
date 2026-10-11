<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Force connection close to fix Windows PHP Built-in Server deadlock bug
header('Connection: close');
file_put_contents(__DIR__.'/../storage/logs/laravel.log', "HIT INDEX.PHP " . $_SERVER['REQUEST_URI'] . "\n", FILE_APPEND);

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
