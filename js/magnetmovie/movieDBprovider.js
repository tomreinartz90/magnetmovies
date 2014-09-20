var movieDB = {
    url: "https://api.themoviedb.org/3/movie/",
    imgUrl: "http://image.tmdb.org/t/p/w500/",
    //http://themoviedb.apiary-mock.com/3/movie/imdbID
    settings: {
        api_key: "ffbd2b663d53a66c2dd00bb517491490",
    },
    aantalItems: 0,
    getData: function (imdbID) {
        if (!imdbID) {
            return;
        }

        //vorm url om JSON data op te halen
        var url = movieDB.url + imdbID;

        //haal data op uit OMDB api.
        $.getJSON(url, {
            api_key: movieDB.settings.api_key
        }, function (data) {
            //console.log(data);
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


        });

    }


}