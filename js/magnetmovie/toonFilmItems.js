FilmItems = {
    toonFilms: function (data) {
        $.each(data, function (index, value) {
            if (!FilmItems.isFilmGetoond(index)) {
                $("#content").append(FilmItems.generateFilmItem(value));
            }
        });
        status = "klaar";
        app.loader(false);
    },
    isFilmGetoond: function (imdbID) {
        var aanwezig = false;
        if ($('a[data-imdbid="' + imdbID + '"]').length != 0) {
            aanwezig = true;
        }
        return aanwezig;
    },
    generateFilmItem: function (data) {
        //    var cssClass = '';
        cssClass = '';

        film = '<div class="' + cssClass + ' filmItemHouder small-6 medium-4 large-2 xlarge-2 columns"><a class="filmitem" href="#' + data.uitgebracht + '" data-imdbid="' + data.imdbID + '" data-dropdown="drop' + data.num + '" data-options="is_hover:true">';
        film += '<img width="100%" src="' + data.poster + '"/></a><h5>' + data.naam + '</h5><h6>' + data.uitgebracht + '';

        if (activateDownloads == "true") {
            film += '<br/>';
            if (data.magnetLink["720p"] != undefined) {
                film += ' <a href="' + data.magnetLink["720p"] + '">720p</a>';
            }
            if (data.magnetLink["1080p"] != undefined) {
                film += ' <a href="' + data.magnetLink["1080p"] + '">1080p</a>';
            }
            if (data.magnetLink["3D"] != undefined) {
                film += ' <a href="' + data.magnetLink["3D"] + '">3D</a>';
            }
        }
        film += '</h6></div> ';
        return film;
    }
}