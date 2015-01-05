var dev = true;

//log function when development mode is on
function log(data) {
  if (dev) {
    console.log(data)
  }
}

// functions
//@prepros-prepend movieDBprovider.js
//@prepros-prepend movieDBserieProvider.js
//@prepros-prepend movieprovider.js
//@prepros-prepend serieprovider.js
//@prepros-prepend generateMovielist.js
//@prepros-prepend toonFilmItems.js
//@prepros-prepend toonSerieItems.js
//@prepros-prepend xbmc_socket.js
//@prepros-prepend translate.js
//@prepros-prepend modal.js
//@prepros-prepend sidebar.js
//@prepros-prepend xbmc.js

//variables
var filmlijst = {};
var aantalFilms = 0;
var serieslijst = {};
var serieStorage = {};
var movieStorage = {};
var status = 'wachten';
var activateDownloads = localStorage.getItem("downloadable");
//activateDownloads = true;
if (activateDownloads == "true") {
  log('downloads activated')
}

log(localStorage.getItem('filmlijst'));

$('#XBMCadress').focusout(function () {
  var url = this.value;
  if ((url == 'activatedownloads') || (url == 'download') || (url == 'ActivateDownloads') || (url == 'activateDownloads')) {
    localStorage.setItem("downloadable", true);
    alert('you can now download');
  } else {
    localStorage.setItem('xbmcUrl', url);
    alert('XBMC adress hes ');
  }

});

function activateDownload() {
  localStorage.setItem("downloadable", true)
}

if (localStorage.getItem('movieStorage') === null) {
  localStorage.setItem('movieStorage', '{}');
}
if (localStorage.getItem('serieStorage') === null) {
  localStorage.setItem('serieStorage', '{}');
}


var app = {
  mode: 'movies',

  run: function () {
    if (localStorage.getItem('app.mode') !== null) {
      app.mode = localStorage.getItem('app.mode')
    }
    xbmc.connect();
    log(app.mode);
    status = 'run';
    //hide mobile menu
    $('#standard-menu').addClass('show-for-medium-up');
    app.loader(true);
    if (app.mode == "movies") {
      //haal films op en verwerk deze
      //filmlijst = JSON.parse(localStorage.getItem('filmslijst'));
      yify.getData();

    } else if (app.mode == "series") {
      //haal series op en verwerk deze
      //serielijst = JSON.parse(localStorage.getItem('serieslijst'));
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
  //voeg extra informatie toe aan filmlijst
  getMovieDBserieData: function (imdbID) {
    movieDBserie.getData(imdbID);
  },

  //toon de filmitems
  toonFilmItems: function () {
    FilmItems.toonFilms(filmlijst);
    console.log(filmlijst);
    localStorage.setItem('filmslijst', JSON.stringify(filmlijst));
    status == "klaar";
    xbmc.hideMovieItems();
  },
  //toon de filmitems
  toonSerieItems: function () {
    serieItems.tooonSeries(serieslijst);
    localStorage.setItem('serieslijst', JSON.stringify(serieslijst));
    status == "klaar";
  },
  setMaxMoviePosterHeight: function () {

    if ($(".filmitem img").length > 1) {
      //set max-height in op standaard waarde
      $(".filmitem img").css({
        "height": ''
      });

      // lees hoogte van element uit
      maxHeight = $(".filmitem img")[0].height;

      //stel max-height in op alle img elementen
      $(".filmitem img").css({
        "max-height": maxHeight
      });
    }
  },
  loader: function (show) {
    log('showloader ' + show)
    if (show) {
      $("body").append('<div id="loader" class="preloader"></div>');
    } else {
      $("#loader").remove();
    }
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
      log(eztv.settings.set);
      eztv.data = {};
      //haal nieuwe data op
      app.run();
    }
  }
});