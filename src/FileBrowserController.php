<?php

namespace Crowles\FileBrowser;

use Illuminate\Routing\Controller;

class FileBrowserController extends Controller
{
    /**
     * @var string
     */
    protected $package = 'laravel-filebrowser';

    /**
     * @var
     */
    private $explorer;

    /**
     * FileBrowserController constructor.
     */
    public function __construct()
    {
        $this->explorer = new FileBrowser();
    }

    /**
     * Display file browser homepage.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        return app('view')->make($this->package . '::filebrowser')->with($this->assets());
    }

    /**
     * Scan for files and folders.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function scan()
    {
        $dir   = config('filebrowser.path') . config('filebrowser.root');
        $items = $this->explorer->scan($dir);

        return response()->json([
            "name"  => "app",
            "type"  => "folder",
            "path"  => $dir,
            "items" => $items
        ]);
    }

    /**
     * Load package assets.
     *
     * @return array
     */
    protected function assets()
    {
        $path = '/vendor/laravel-filebrowser';
        return compact('path');
    }
}