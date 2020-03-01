$(function() {

    let filemanager = $('.filemanager'),
        breadcrumbs = $('.breadcrumbs'),
        fileList = filemanager.find('.data');

    /**
     * Generate the file tree and render the browser.
     */
    $.get('/filebrowser/scan', function(data) {
        let response = [data],
            currentPath = '',
            breadcrumbsUrls = [];

        $(window).on('hashchange', function() {
            navigate(window.location.hash);
        }).trigger('hashchange');

        fileList.on('click', 'li.folders', function(e) {
            e.preventDefault();

            let nextDir = $(this).find('a.folders').attr('href');

            breadcrumbsUrls.push(nextDir);

            window.location.hash = encodeURIComponent(nextDir);
            currentPath = nextDir;
        });

        breadcrumbs.on('click', 'a', function(e) {
            e.preventDefault();

            let index = breadcrumbs.find('a').index($(this)),
                nextDir = breadcrumbsUrls[index];

            breadcrumbsUrls.length = Number(index);
            window.location.hash = encodeURIComponent(nextDir);
        });

        /**
         * Navigate files
         *
         * @param hash
         */
        function navigate(hash)
        {
            hash = decodeURIComponent(hash).slice(1).split('=');
            if (hash.length) {
                let rendered = '';
                if (hash[0].trim().length) {
                    rendered = searchByPath(hash[0]);
                    if (rendered.length) {
                        currentPath = hash[0];
                        breadcrumbsUrls = generateBreadcrumbs(hash[0]);
                        render(rendered);
                    } else {
                        currentPath = hash[0];
                        breadcrumbsUrls = generateBreadcrumbs(hash[0]);
                        render(rendered);
                    }
                } else {
                    currentPath = data.path;
                    breadcrumbsUrls.push(data.path);
                    render(searchByPath(data.path));
                }
            }
        }

        /**
         * Generate breadcrumbs
         *
         * @param nextDir
         * @returns {T[]}
         */
        function generateBreadcrumbs(nextDir)
        {
            let path = nextDir.split('/').slice(0);
            for(let i=1;i<path.length;i++){
                path[i] = path[i-1]+ '/' +path[i];
            }
            return path;
        }

        /**
         * Locate by path
         *
         * @param dir
         * @returns {*|[*]}
         */
        function searchByPath(dir)
        {
            let path = dir.split('/'),
                obj = response,
                flag = 0;

            for(let i=0;i<path.length;i++){
                for(let j=0;j<obj.length;j++){
                    if(obj[j].name === path[i]){
                        flag = 1;
                        obj = obj[j].items;
                        break;
                    }
                }
            }

            obj = flag ? obj : [];
            return obj;
        }

        /**
         * Render file manager
         *
         * @param data
         */
        function render(data)
        {
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
            } else if(typeof data === 'object') {
                scannedFolders = data.folders;
                scannedFiles = data.files;
            }

            fileList.empty().hide();

            if(!scannedFolders.length && !scannedFiles.length) {
                filemanager.find('.nothingfound').show();
            } else {
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
                    } else if(itemsLength > 1) {
                        itemsLength += ' items';
                    } else {
                        itemsLength = 'Empty';
                    }

                    let folder = $('<li class="folders"><a href="'+ f.path +'" title="'+ f.path +'" class="folders">'+
                        icon+'<span class="name">' + name + '</span> <span class="details">' + itemsLength +
                        '</span></a></li>'
                    );
                    folder.appendTo(fileList);
                });
            }

            if(scannedFiles.length) {
                scannedFiles.forEach(function(f) {
                    let fileSize = filesize(f.size),
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

            let url = '';

            fileList.show();
            breadcrumbsUrls.forEach(function (u, i) {
                let name = u.split('/');
                if (i !== breadcrumbsUrls.length - 1) {
                    url += '<a href="'+u+'"><span class="folderName">' + name[name.length-1] + '</span></a> <span class="arrow">/</span> ';
                } else {
                    url += '<span class="folderName">' + name[name.length-1] + '</span>';
                }
            });

            breadcrumbs.text('').append(url);
            fileList.animate({'display':'inline-block'});
        }

        /**
         * Escape special html characters
         *
         * @param text
         * @returns {string}
         */
        function escapeHTML(text)
        {
            return text.replace(/\&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
        }

        /**
         * Convert file size to human readable units
         *
         * @param bytes
         * @returns {string}
         */
        function filesize(bytes)
        {
            let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return '0 Bytes';
            let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        }
    });
});
