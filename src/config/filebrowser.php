<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Path
    |--------------------------------------------------------------------------
    |
    | The path to scan for files and folders.
    |
    | You must use an absolute path.
    |
    */
    'path' => env('FILEBROWSER_PATH', ''),

    /*
    |--------------------------------------------------------------------------
    | Root
    |--------------------------------------------------------------------------
    |
    | The root diectory where you want to initialise the file browser
    |
    */
    'root' => env('FILEBROWSER_ROOT', ''),

    /*
    |--------------------------------------------------------------------------
    | Route
    |--------------------------------------------------------------------------
    |
    | The default route configuration
    |
    */
    'route' => [
        'prefix' => 'filebrowser',
        'middleware' => null, // Use auth middleware to prevent exposing your files
    ],
];