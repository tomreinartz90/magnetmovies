var generateMovieList = {
    info: '',
    start: function (data) {
        //    console.log(data.responseJSON.MovieList);
        moviecount = data.responseJSON.MovieCount;
        data = data.responseJSON.MovieList;
        //        return;

        log("begin met verwerken van yify data");

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
                film.naam = value.MovieTitleClean;
                film.geupload = value.DateUploaded;
                film.uitgebracht = value.MovieYear;
                film.genre = value.Genre;
                film.kwaliteit += value.Quality + " ";
                film.rating = value.MovieRating;
                film.imdbID = value.ImdbCode;
                film.magnetLink[value.Quality] = value.TorrentMagnetUrl;
                film.num = aantalFilms;

                //stop de film in de filmlijst
                filmlijst[value.ImdbCode] = film;
                aantalFilms += 1;
            });
            //data is verwerkt en filmitems kunnen worden extend
            log("yify data is verwerkt");
            //extend de movie informatie
            $.each(data, function (index, value) {
                movieDB.getData(value.ImdbCode);
            });
            //            app.toonFilmItems();
        } else {
            status = "niet meer films beschikbaar";
            app.loader(false);
        }

    }
}