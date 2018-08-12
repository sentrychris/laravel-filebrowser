<?php

namespace Crowles\FileBrowser;

class FileBrowser
{
    /**
     * Scan for files.
     *
     * @param $dir
     * @return array
     */
    public function scan($dir)
    {
        $files = [];

        if (file_exists($dir)) {

            foreach (scandir($dir) as $f) {
                if (!$f || $f[0] == '.') {
                    continue; // ignore hidden files
                }

                if (is_dir($dir . '/' . $f)) {
                    // folder
                    $files[] = [
                        "name" => $f,
                        "type" => "folder",
                        "path" => $dir . '/' . $f,
                        "items" => $this->scan($dir . '/' . $f) // recursively get the contents of the folder
                    ];
                } else {
                    // file
                    $files[] = [
                        "name" => $f,
                        "type" => "file",
                        "path" => $dir . '/' . $f,
                        "size" => filesize($dir . '/' . $f)
                    ];
                }
            }

        }

        return $files;
    }
}
