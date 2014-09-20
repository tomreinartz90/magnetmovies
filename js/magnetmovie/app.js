var dev = true;

//log function when development mode is on
function log(data) {
    if (dev) {
        console.log(data)
    }
}

// functions



//@prepros-prepend movieDBprovider.js
//@prepros-prepend movieprovider.js
//@prepros-prepend serieprovider.js
//@prepros-prepend generateMovielist.js
//@prepros-prepend toonFilmItems.js
//@prepros-prepend toonSerieItems.js
//@prepros-prepend xbmc_socket.js
//@prepros-prepend translate.js
//@prepros-prepend modal.js

//variables
var filmlijst = {};
var aantalFilms = 0;
var serieslijst = {};
var status = 'wachten';
var activateDownloads = localStorage.getItem("activateDownloads");
//activateDownloads = true;
if (activateDownloads == "true") {
    log('downloads activated')
}

function activateDownload() {
    localStorage.setItem("activateDownloads", true)
}



var app = {
    mode: 'movies',

    run: function () {
        log(app.mode);
        status = 'run';
        if (app.mode == "movies") {
            //haal films op en verwerk deze
            yify.getData();

        } else if (app.mode == "series") {
            //haal series op en verwerk deze
            eztv.getData();
        }
    },
    //maak een filmlijst
    maakFilmLijst: function () {
        log('filmlijst genereren');
        var films = yify.data;
        generateMovieList.start(films);
    },
    //voeg extra informatie toe aan filmlijst
    getMovieDbData: function (imdbID) {
        movieDB.getData(imdbID);
    },
    //toon de filmitems
    toonFilmItems: function () {
        FilmItems.toonFilms(filmlijst);
        status == "klaar";
    },
    //toon de filmitems
    toonSerieItems: function () {
        serieItems.tooonSeries(serieslijst);
        status == "klaar";
    },
    setMaxMoviePosterHeight: function () {
        //set max-height in op standaard waarde
        $(".filmitem img").css({
            "height": ''
        });

        // lees hoogte van element uit
        maxHeight = $(".filmitem img")[0].height;

        //stel max-height in op alle img elementen
        $(".filmitem img").css({
            "height": maxHeight
        });
    },
    loader: function (show) {
        log('showloader ' + show)
    }

}

app.run();

//stel opnieuw in als de browser een resize krijgt
$(window).resize(function () {
    app.setMaxMoviePosterHeight();
});

//stel poster hoogte in
$(".filmitem img").load(function () {
    app.setMaxMoviePosterHeight();
});


/**
 * Controlleer of de onderkant van de pagina is bereikt
 * Toon nieuwe resultaten als dat zo is.
 */
$("#content").scroll(function () {
    //bepaal hoogte content div
    hoogte = $("div #content")[0].scrollHeight + 1;
    app.setMaxMoviePosterHeight();
    //bepaal scroll hoogte
    scrollPositie = $("#content").scrollTop() + $("#content").height();

    //als je bijna bij de onderkant van de pagina bent
    if (hoogte - scrollPositie < 100 && status == "klaar") {
        //toon loader;
        //        loader(true);
        if (app.mode == 'movies') {
            //haal nieuwe set met data op.
            yify.settings.set = yify.settings.set + 1;
            yify.data = {};
            //haal nieuwe data op
            app.run();
        } else if (app.mode == 'series') {
            //haal nieuwe set met data op.
            eztv.settings.set = eztv.settings.set + 1;
            eztv.data = {};
            //haal nieuwe data op
            app.run();
        }
    }
});