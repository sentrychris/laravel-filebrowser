jQ(function($){

    let filemanager = $('.filemanager'),
        breadcrumbs = $('.breadcrumbs'),
        fileList = filemanager.find('.data');

    // Start by fetching the file data from the route with an AJAX request
    $.get('/filebrowser/scan', function(data) {

        let response = [data],
            currentPath = '',
            breadcrumbsUrls = [];

        let folders = [],
            files = [];

        // Monitor changes on the URL.
        $(window).on('hashchange', function(){
            goto(window.location.hash);
        }).trigger('hashchange');

        // Search
        filemanager.find('.search').click(function(){

            let search = $(this);

            search.find('span').hide();
            search.find('input[type=search]').show().focus();

        });

        filemanager.find('input').on('input', function(e){

            folders = [];
            files = [];

            let value = this.value.trim();

            if(value.length) {

                filemanager.addClass('searching');

                // Update the hash on every key stroke
                window.location.hash = 'search=' + value.trim();

            }

            else {

                filemanager.removeClass('searching');
                window.location.hash = encodeURIComponent(currentPath);

            }

        }).on('keyup', function(e){

            let search = $(this);

            if(e.keyCode == 27) {

                search.trigger('focusout');

            }

        }).focusout(function(e){

            // Cancel search
            let search = $(this);

            if(!search.val().trim().length) {

                window.location.hash = encodeURIComponent(currentPath);
                search.hide();
                search.parent().find('span').show();

            }

        });

        fileList.on('click', 'li.folders', function(e){
            e.preventDefault();

            let nextDir = $(this).find('a.folders').attr('href');

            if(filemanager.hasClass('searching')) {

                // Build the breadcrumbs
                breadcrumbsUrls = generateBreadcrumbs(nextDir);

                filemanager.removeClass('searching');
                filemanager.find('input[type=search]').val('').hide();
                filemanager.find('span').show();
            }
            else {
                breadcrumbsUrls.push(nextDir);
            }

            window.location.hash = encodeURIComponent(nextDir);
            currentPath = nextDir;
        });

        breadcrumbs.on('click', 'a', function(e){
            e.preventDefault();

            let index = breadcrumbs.find('a').index($(this)),
                nextDir = breadcrumbsUrls[index];

            breadcrumbsUrls.length = Number(index);

            window.location.hash = encodeURIComponent(nextDir);

        });

        // Navigates to the given hash (path)
        function goto(hash) {

            hash = decodeURIComponent(hash).slice(1).split('=');

            if (hash.length) {
                let rendered = '';

                // if hash has search in it
                if (hash[0] === 'search') {

                    filemanager.addClass('searching');
                    rendered = searchData(response, hash[1].toLowerCase());

                    if (rendered.length) {
                        currentPath = hash[0];
                        render(rendered);
                    }
                    else {
                        render(rendered);
                    }

                }

                // if hash is some path
                else if (hash[0].trim().length) {

                    rendered = searchByPath(hash[0]);

                    if (rendered.length) {

                        currentPath = hash[0];
                        breadcrumbsUrls = generateBreadcrumbs(hash[0]);
                        render(rendered);

                    }
                    else {
                        currentPath = hash[0];
                        breadcrumbsUrls = generateBreadcrumbs(hash[0]);
                        render(rendered);
                    }

                }

                // if there is no hash
                else {
                    currentPath = data.path;
                    breadcrumbsUrls.push(data.path);
                    render(searchByPath(data.path));
                }
            }
        }

        // Splits a file path and turns it into clickable breadcrumbs
        function generateBreadcrumbs(nextDir){
            let path = nextDir.split('/').slice(0);
            for(let i=1;i<path.length;i++){
                path[i] = path[i-1]+ '/' +path[i];
            }
            return path;
        }

        // Locates a file by path
        function searchByPath(dir) {
            let path = dir.split('/'),
                demo = response,
                flag = 0;

            for(let i=0;i<path.length;i++){
                for(let j=0;j<demo.length;j++){
                    if(demo[j].name === path[i]){
                        flag = 1;
                        demo = demo[j].items;
                        break;
                    }
                }
            }

            demo = flag ? demo : [];
            return demo;
        }

        // Recursively search through the file tree
        function searchData(data, searchTerms) {

            data.forEach(function(d){
                if(d.type === 'folder') {

                    searchData(d.items,searchTerms);

                    if(d.name.toLowerCase().match(searchTerms)) {
                        folders.push(d);
                    }
                }
                else if(d.type === 'file') {
                    if(d.name.toLowerCase().match(searchTerms)) {
                        files.push(d);
                    }
                }
            });
            return {folders: folders, files: files};
        }

        // Render the HTML for the file manager
        function render(data) {

            let scannedFolders = [],
                scannedFiles = [];

            if(Array.isArray(data)) {
                data.forEach(function (d) {

                    if (d.type === 'folder') {
                        scannedFolders.push(d);
                    }
                    else if (d.type === 'file') {
                        scannedFiles.push(d);
                    }

                });

            }
            else if(typeof data === 'object') {
                scannedFolders = data.folders;
                scannedFiles = data.files;
            }

            // Empty the old result and make the new one
            fileList.empty().hide();

            if(!scannedFolders.length && !scannedFiles.length) {
                filemanager.find('.nothingfound').show();
            }
            else {
                filemanager.find('.nothingfound').hide();
            }

            if(scannedFolders.length) {
                scannedFolders.forEach(function(f) {

                    let itemsLength = f.items.length,
                        name = escapeHTML(f.name),
                        icon = '<span class="icon folder"></span>';

                    if(itemsLength) {
                        icon = '<span class="icon folder full"></span>';
                    }

                    if(itemsLength == 1) {
                        itemsLength += ' item';
                    }
                    else if(itemsLength > 1) {
                        itemsLength += ' items';
                    }
                    else {
                        itemsLength = 'Empty';
                    }

                    let folder = $('<li class="folders"><a href="'+ f.path +'" title="'+ f.path +'" class="folders">'+icon+'<span class="name">' + name + '</span> <span class="details">' + itemsLength + '</span></a></li>');
                    folder.appendTo(fileList);
                });
            }

            if(scannedFiles.length) {
                scannedFiles.forEach(function(f) {

                    let fileSize = bytesToSize(f.size),
                        name = escapeHTML(f.name),
                        fileType = name.split('.'),
                        icon = '<span class="icon file"></span>';

                    fileType = fileType[fileType.length-1];

                    icon = '<span class="icon file f-'+fileType+'">.'+fileType+'</span>';

                    let file = $(
                        '<li class="files">' +
                        '<a href="/editor/?path='+encodeURIComponent(f.path)+'" title="'+ f.path +'" class="files">'+icon+'<span class="name">'+ name +
                        '</span> <span class="details">'+fileSize+'</span></a></li>'
                    );
                    file.appendTo(fileList);
                });
            }

            // Generate the breadcrumbs
            let url = '';

            if(filemanager.hasClass('searching')){

                url = '<span>Search results: </span>';
                fileList.removeClass('animated');

            }
            else {

                fileList.addClass('animated');

                breadcrumbsUrls.forEach(function (u, i) {

                    let name = u.split('/');

                    if (i !== breadcrumbsUrls.length - 1) {
                        url += '<a href="'+u+'"><span class="folderName">' + name[name.length-1] + '</span></a> <span class="arrow">/</span> ';
                    }
                    else {
                        url += '<span class="folderName">' + name[name.length-1] + '</span>';
                    }

                });

            }

            breadcrumbs.text('').append(url);

            // Show the generated elements
            fileList.animate({'display':'inline-block'});
        }

        // Escape special html characters in names
        function escapeHTML(text) {
            return text.replace(/\&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
        }

        // Convert file sizes from bytes to human readable units
        function bytesToSize(bytes) {
            let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return '0 Bytes';
            let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        }

    });
});