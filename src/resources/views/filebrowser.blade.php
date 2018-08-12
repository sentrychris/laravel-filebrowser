<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
          crossorigin="anonymous">
    <link href="{{ asset($path.'/css/filebrowser.css') }}" rel="stylesheet">
</head>

<body id="">

<div class="container-fluid">

    <div class="row">

        <div class="col-md-12">

            <div class="filemanager">

                <div class="search">
                    <input type="search" placeholder="Find a file.."/>
                </div>

                <div class="breadcrumbs"></div>

                <ul class="data"></ul>

                <div class="nothingfound">
                    <div class="nofiles"></div>
                    <span>No files here.</span>
                </div>

            </div>

        </div>

    </div>

</div>
<script src="https://code.jquery.com/jquery-1.11.0.min.js"></script>
<script>jQ = jQuery.noConflict(true);</script>
<script src="{{ asset($path.'/js/filebrowser.js') }}"></script>
</body>
</html>
