var movieDBserie = {
  url: "http://api.themoviedb.org/3/",
  search: 'search/tv',
  series: 'tv/',
  imgUrl: "http://image.tmdb.org/t/p/w500/",
  backDropUrl: "http://image.tmdb.org/t/p/w1280/",
  settings: {
    api_key: movieDB.settings.api_key,
  },
  aantalItems: 0,
  getData: function (imdbID) {
    if (!imdbID) {
      return;
    }
    serieStorage = JSON.parse(localStorage.getItem('serieStorage'));
    if (serieStorage[imdbID] !== undefined) {
      serieslijst[imdbID].movieDBData = serieStorage[imdbID];
      movieDBserie.aantalItems += 1;
      //console.log('got it ' + serieslijst[imdbID].naam)
      if (movieDBserie.aantalItems == aantalFilms) {
        log('movieDBserie informatie opgehaald')
      }
      return;
    }

    //haal id op uit OMDB api.
    if (serieslijst[imdbID].movieDBid === 0) {
      movieDBserie.getMovieDBid(imdbID);
      return;
    }

    //vorm url om JSON data op te halen
    var url = movieDBserie.url + movieDBserie.series + serieslijst[imdbID].movieDBid

    $.ajax({
      url: url,
      type: 'get',
      data: {
        api_key: movieDBserie.settings.api_key,
      }
    }).done(function (data) {
      console.log(data);
      serieslijst[imdbID].movieDBData = data;
      
      //add info to local storage
      serieStorage[imdbID] = data;
      localStorage.setItem('serieStorage',  JSON.stringify(serieStorage));
      //toon serielijst als alle items zijn opgehaald
      movieDBserie.aantalItems += 1;
      if (movieDBserie.aantalItems == aantalFilms) {
        log('movieDBserie informatie opgehaald')
      }
    });

  },
  getMovieDBid: function (imdbID) {
    var name = serieslijst[imdbID].naam;
    url = movieDBserie.url + movieDBserie.search
    $.ajax({
      url: url,
      type: 'get',
      data: {
        api_key: movieDBserie.settings.api_key,
        query: name
      }
    }).done(function (data) {
      serieslijst[imdbID].movieDBid = data.results[0].id;
      movieDBserie.getData(imdbID);
    });
  }
}