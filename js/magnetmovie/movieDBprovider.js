var movieDB = {
  url: "https://api.themoviedb.org/3/movie/",
  imgUrl: "http://image.tmdb.org/t/p/w500/",
  settings: {
    api_key: "ffbd2b663d53a66c2dd00bb517491490",
  },
  aantalItems: 0,
  getData: function (imdbID) {
    if (!imdbID) {
      return;
    }

    movieStorage = JSON.parse(localStorage.getItem('movieStorage'));
    if (movieStorage[imdbID] !== undefined) {
      movieDB.processData(movieStorage[imdbID], imdbID);
      movieDBserie.aantalItems += 1;
      if (movieDBserie.aantalItems == aantalFilms) {
        log('movieDBserie informatie opgehaald')
      }
      return;
    }

    //vorm url om JSON data op te halen
    var url = movieDB.url + imdbID;

    //haal data op uit OMDB api.
    $.ajax({
      url: url,
      type: 'get',
      data: {
        api_key: movieDB.settings.api_key
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status == 404 || errorThrown == 'Not Found') {
          movieDB.aantalItems += 1;
          filmlijst[imdbID] = null;
          delete filmlijst[imdbID];
        }
      }
    }).done(function (data) {
      //console.log(data);
      movieStorage[imdbID] = data;
      localStorage.setItem('movieStorage', JSON.stringify(movieStorage));

      movieDB.processData(data, imdbID);


    });

  },
  processData: function (data, imdbID) {
    filmlijst[imdbID].plot = data.overview;
    filmlijst[imdbID].poster = movieDB.imgUrl + data.poster_path;


    //toon filmlijst als alle items zijn opgehaald
    movieDB.aantalItems += 1;
    if (movieDB.aantalItems == aantalFilms) {
      log('movieDB informatie opgehaald')
      app.toonFilmItems()
    }
    vidUrl = movieDB.url + data.id + "/videos";

    //haal trailer info op
    $.getJSON(vidUrl, {
      api_key: movieDB.settings.api_key
    }).done(function (data) {
      if (data.results.length > 0) {
        filmlijst[imdbID].trailer = data.results[0].key;
      } else {
        filmlijst[imdbID].trailer = null;
      }
      return;
    });
  }


}