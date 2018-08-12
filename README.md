# Laravel File Browser

This package provides a lightweight file explorer that can be easily customised and integrated into your laravel 5.* applications.

![File Browser Screenshot](https://rowles.ch/img/lfb.png)

## Installation
Install with  Composer:
```sh
composer require crowles/laravel-filebrowser
```

## Getting Started

First you'll need to add the Service Provider to your ```config/app.php```:
```php
Crowles\FileBrowser\FileBrowserServiceProvider::class,
```

### Publishing Assets
Then publish the vendor assets:

#### Views:
```sh
php artisan vendor:publish --provider="Crowles\FileBrowser\FileBrowserServiceProvider" --tag views
```
#### Assets:
```sh
php artisan vendor:publish --provider="Crowles\FileBrowser\FileBrowserServiceProvider" --tag assets
```
#### Config:
```sh
php artisan vendor:publish --provider="Crowles\FileBrowser\FileBrowserServiceProvider" --tag config
```

## Configuration
You'll now need to add the path to the root directory you want the file browser to access, do this by changing the following values in ```config/filebrowser.php```:
```php
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
    'root' => env('FILEBROWSER_ROOT', ''),,
```
### Default Routes
The following default routes are configured by default with prefix ```filebrowser/```:
```php
$router->get('/', '\Crowles\FileBrowser\FileBrowserController@index');
$router->get('/scan', '\Crowles\FileBrowser\FileBrowserController@scan');
```

To access the file browser, you can navigate to http://yoursite.local/filebrowser.

## Advanced

Documentation on how to override default views coming soon.

## License

Laravel File Browser is open-sourced software licensed under the MIT license.
