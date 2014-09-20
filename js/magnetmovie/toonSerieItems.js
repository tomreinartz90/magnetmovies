serieItems = {
    toonSerie: function (data) {
        var serie = {};
        //    var cssClass = '';
        cssClass = '';

        serie = '<div class="' + cssClass + ' filmItemHouder small-6 medium-4 large-2 xlarge-2 columns"><a class="filmitem" href="#' + data.uitgebracht + '" data-imdbid="' + data.imdbID + '" data-dropdown="drop' + data.num + '" data-options="is_hover:true">';
        serie += '<img width="100%" src="' + data.poster + '"/></a><h5>' + data.naam + '</h5><h6>' + data.uitgebracht + '';
        serie += '</h6></div> ';
        return serie;
    },
    tooonSeries: function (data) {
        $.each(data, function (index, value) {
            if (!serieItems.isSerieGetoond(index)) {
                $("#content").append(serieItems.toonSerie(value));
            }
        });
        status = "klaar";
        app.loader(false);
    },
    isSerieGetoond: function (imdbID) {
        var aanwezig = false;
        if ($('a[data-imdbid="' + imdbID + '"]').length != 0) {
            aanwezig = true;
        }
        return aanwezig;
    }
}