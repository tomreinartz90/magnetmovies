var eztv = {
    socket: 'http://www.tomreinartz.com/magnetwall/socket.php?url=',
    //    url: "http://eztvapi.re/",
    url: "http://br.api.ptn.pm/",
    settings: {
        keywords: '',
        page: 1
    },
    data: {},
    aantalItems: 0,
    getData: function () {
        console.log('eztv');
        $.getJSON(eztv.socket + eztv.url + 'shows/' + eztv.settings.page + '?keywords=' + eztv.settings.keywords, function (data) {
            log('loop');
            eztv.data = data;
            //haal de episodes op
            $.each(data, function (index, value) {
                serie = {};
                //Zet de data in een nieuwe variable
                serie.naam = value.title;
                serie.seizoenen = value.num_seasons;
                serie.poster = value.images.poster,
                serie.uitgebracht = value.year;
                serie.genre = value.Genre;
                serie.rating = value.MovieRating;
                serie.imdbID = value._id;
                serie.num = yify.aantalItems;
                serie.season = {};
                s = 1
                serieslijst[value._id] = serie;
                eztv.getEpisodes(value._id);
            });

        });
    },
    getEpisodes: function (imdbID) {
        $.getJSON(eztv.socket + eztv.url + 'show/' + imdbID,
            function (data) {
                $.each(data.episodes, function (index, value) {
                    epi = {};
                    //verwerk afleveringen
                    epi.naam = value.title;
                    epi.uitgebracht = value.first_aired;
                    epi.genre = value.genres;
                    epi.magnetLink = value.torrents;
                    epi.plot = value.overview;
                    epi.tvdbid = value.tvdb_id;
                    //stop aflevering in database
                    s = value.season;
                    e = value.episode;
                    //voeg seizoen toe aan lijst als deze nog niet bestaat.
                    if (serieslijst[imdbID].season[s] == undefined) {
                        serieslijst[imdbID].season[s] = {};
                        serieslijst[imdbID].season[s].episode = {};
                    }
                    if (serieslijst[imdbID].season[s] != undefined) {
                        serieslijst[imdbID].season[s].episode[e] = epi;
                    }
                });
                app.toonSerieItems();
            });
    }
}