<?php

namespace Crowles\FileBrowser;

use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;

class FileBrowserServiceProvider extends ServiceProvider
{
    /**
     * Indicates if loading of the provider is deferred.
     *
     * @var bool
     */
    protected $defer = false;

    /**
     * Bootstrap the application events.
     *
     * @param Router $router
     * @return void
     */
    public function boot(Router $router)
    {
        if (method_exists($this, 'package')) {
            $this->package('crowles/laravel-filebrowser', 'laravel-filebrowser', __DIR__ . '/../laravel-filebrowser/');
        }

        if (method_exists($this, 'loadViewsFrom')) {
            $this->loadViewsFrom(__DIR__.'/resources/views', 'laravel-filebrowser');
        }

        if (method_exists($this, 'publishes')) {
            $this->publishes([
                __DIR__.'/resources/views' => base_path('/resources/views/vendor/laravel-filebrowser'),
            ], 'views');

            $this->publishes([
                __DIR__.'/resources/assets' => public_path('/vendor/laravel-filebrowser'),
            ], 'assets');

            $this->publishes([
                __DIR__.'/config/filebrowser.php' => $this->config_path('filebrowser.php'),
            ], 'config');
        }

        $config = $this->app['config']->get('filebrowser.route', []);
        $router->group($config, function($router)
        {
            $router->get('/', '\Crowles\FileBrowser\FileBrowserController@index');
            $router->get('/scan', '\Crowles\FileBrowser\FileBrowserController@scan');
        });
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {}

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return array();
    }

    /**
     * Get the configuration path.
     *
     * @param  string $path
     * @return string
     */
    private function config_path($path = '')
    {
        return function_exists('config_path') ? config_path($path) : $this->app->basePath() . DIRECTORY_SEPARATOR
            . 'config' . ($path ? DIRECTORY_SEPARATOR . $path : $path);
    }

}