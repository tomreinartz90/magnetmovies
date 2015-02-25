var generateMovieList = {
  info: '',
  start: function (data) {
    //    console.log(data.responseJSON.MovieList);
    moviecount = data.responseJSON.data.movie_count;
    data = data.responseJSON.data.movies;
    //        return;

    log("begin met verwerken van yify data");
    console.log(data);
    console.log(moviecount);

    //loop door de Yify data 
    if (moviecount > 0) {
      $.each(data, function (index, value) {
        /*****
                 **Toekomst
                 **Controleer of film al bestaat, bestaat de film voeg dan de uploaddatum, kwaliteit en magnet link hieraan toe.
                 ******/
        filmBestaat = false;
        if (filmlijst[value.ImdbCode] != undefined) {
          filmBestaat = true;
        }

        //maak een schoon film object aan;
        film = {
          naam: "",
          geupload: "",
          uitgebracht: "",
          genre: "",
          kwaliteit: "",
          rating: "",
          poster: "",
          imdbID: "",
          magnetLink: [],
          plot: "",
          trailer: "",
          num: ""
        }

        if (filmBestaat) {
          film = filmlijst[value.ImdbCode];
        }

        //yify data in film object stoppen
        film.naam = value.title;
        film.geupload = value.date_uploaded;
        film.uitgebracht = value.year;
        film.genre = value.genres;
        
        film.rating = value.rating;
        film.imdbID = value.imdb_code;
        $.each(value.torrents, function (index, download) {
          film.kwaliteit += download.quality + " ";
          film.magnetLink[download.quality] = download.url;
        });
        film.num = aantalFilms;

        //stop de film in de filmlijst
        filmlijst[value.imdb_code] = film;
        aantalFilms += 1;
      });
      //data is verwerkt en filmitems kunnen worden extend
      log("yify data is verwerkt");
      //extend de movie informatie
      $.each(data, function (index, value) {
        movieDB.getData(value.imdb_code);
      });
      //            app.toonFilmItems();
    } else {
      status = "niet meer films beschikbaar";
      app.loader(false);
    }

  }
}