/** 
 *Basis Variablen API
 */
var yify = {
    url: "https://yts.re/api/list.json",
    settings: {
        limit: "50", //max 50
        set: 1,
        rating: "6", //vanaf IMDB rating 7
        sort: "seeds",
        quality: "ALL", //All, 720p 1080p 3D
        keywords: "",
        genre: "all",
        order: "desc" //desc asc //aflopend oplopend
    },
    data: {},
    aantalItems: 0
}

var eztv = {
    url: "http://eztvapi.re/",
    page: 1,
    data: {},
    aantalItems: 0
}

var theMovieDB = {
    url: "https://api.themoviedb.org/3/movie/",
    imgUrl: "http://image.tmdb.org/t/p/w500/",
    //http://themoviedb.apiary-mock.com/3/movie/imdbID
    settings: {
        api_key: "ffbd2b663d53a66c2dd00bb517491490",
    },
    aantalItems: 0
}

var xbmc = {
    url: null,
    movies: {
        settings: {
            "jsonrpc": "2.0",
            "method": "VideoLibrary.GetMovies",
            "params": {
                "properties": ["imdbnumber"],
            },
            "id": "1"
        },
        data: null,
        list: []
    },
    series: {
        settings: {
            "jsonrpc": "2.0",
            "method": "VideoLibrary.GetTVShows",
            "params": {
                "properties": ["rating", "imdbnumber", "playcount"],
            },
            "id": "2"
        },
        data: null,
        list: [],
        tvshows: []

    },
    data: null,
    list: [],
    action: "hide",
    cssClass: "",
    connect: function () {},
    getData: function () {}
}


if (localStorage.getItem("xbmcHost")) {
    xbmc.url = localStorage.getItem("xbmcHost");
}


xbmc.Socket = new XBMCSocket();
xbmc.connect = function () {
    status = "busy";
    console.log("Begin met ophalen xbmc data");
    xbmc.Socket.connect(xbmc.url, "9090");
    xbmc.getData();
}

xbmc.getData = function () {
    if (xbmc.Socket.isConnected && !xbmc.Socket.isPending && xbmc.movies.data == null) {
        //film informatie ophalen
        xbmc.Socket.send(xbmc.movies.settings.method, xbmc.movies.settings.params, xbmc.movies.settings.id, getXbmcMovies);
    } else if (xbmc.Socket.isConnected && !xbmc.Socket.isPending && xbmc.series.data == null) {
        //series informatie ophalen
        xbmc.Socket.send(xbmc.series.settings.method, xbmc.series.settings.params, xbmc.series.settings.id, getXbmcSeries);
    }
    if (xbmc.movies.data == null || xbmc.series.data == null) {} {
        //loopje
        setTimeout(xbmc.getData, 500);
    }

}



var filmlijst = {};
var serieslijst = {};
var afleveringenlijst = {};

var status = "none";

/**
 * Einde basis variablen.
 */


//begin het script
//getYifyData();
getEztvData();
//$('.off-canvas-wrap').foundation('offcanvas', 'toggle', 'move-right');

/** 
 *Haal informatie op uit de specificatie en stop deze in een object. roep hierna newWall aan. */

$("#zoek").on("click", function () {
    var settings = {
        limit: "50", //max 50
        rating: $(".zoeken #imdbRating").val(), //vanaf IMDB rating 7
        sort: $(".zoeken input[name=sort]:checked").val(),
        quality: $(".zoeken input[name=quality]:checked").val(), //All, 720p 1080p 3D
        keywords: $(".zoeken #keywords").val(),
        genre: $(".zoeken input[name=genre]:checked").val(),
        order: $(".zoeken input[name=order]:checked").val() //desc asc //aflopend oplopend
    };
    //roep newWall functie aan
    newWall(settings);
});

/** 
 *reset de film muur en haal nieuwe data op.
 *@param nieuwe yify settings in object
 */
function newWall(settings) {
    yify.settings = settings;
    yify.settings.set = 1;
    //oude data weghalen
    filmlijst = {};
    yify.data = {};
    theMovieDB.data = {};

    //haal oude filmitems weg.
    $(".filmItemHouder").remove();
    //toon lader
    loader(true);
    //haal niewe filmitems op.
    getYifyData();

    //  googleanalytics 
    //  track user search
    trackname = $.param(settings)
    ga('send', 'pageview', trackname);
}



//Roep yify api aan en haal informatie op als JSON. 

/** 
 *Haal basis data op uit de Yify API.
 */

function getYifyData() {
    status = "busy";
    if (xbmc.data == null && xbmc.url != null) {
        xbmc.connect();
    }
    console.log("Begin met ophalen yify data");

    //vorm url om JSON data op te halen
    var url = yify.url;

    //haal data op uit YIFY api.
    yify.data = $.getJSON(url, {
        limit: yify.settings.limit,
        set: yify.settings.set,
        rating: yify.settings.rating,
        sort: yify.settings.sort,
        quality: yify.settings.quality,
        keywords: yify.settings.keywords,
        genre: yify.settings.genre,
        order: yify.settings.order
    }).done(function () {
        //controleer of data succesvol is opgehaald aan de hand van de status. Als het niet goed is opgehaald probeer het dan nogmaals.
        if (yify.data.status == '200') {
            console.log("yify data succesvol opgehaald");
            maakFilmLijst(yify.data);
        } else {
            console.log("fout bij ophalen yify data, we proberen het nog een keer.");
            getYifyData();
        }
    });
}

/** 
 *Haal basis data op uit de trakttv API.
 */

function getEztvData() {
    //    var socket;
    keywords = '';
    console.log('eztv');
    $.getJSON('http://www.tomreinartz.com/magnetwall/socket.php?url=' + eztv.url + 'shows/' + eztv.page + '?keywords=' + keywords)
        .done(function (data) {
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
                while (s <= serie.seizoenen) {
                    serie.season[s] = {};
                    serie.season[s].episode = {};
                    s += 1;
                }
                serieslijst[value._id] = serie;
                getEztvEpisodes(value._id);
            });
            console.log(serieslijst);
            /*
klaar met het ophalen van de data
*/
            console.log(serieslijst);
            toonFilms(serieslijst);
        });
}

function getEztvEpisodes(imdbID) {
    $.getJSON('http://www.tomreinartz.com/magnetwall/socket.php?url=' + eztv.url + 'show/' + imdbID)
        .done(
            function (data) {
                $.each(data.episodes, function (index, value) {
                    epi = {};
                    //                    console.log(value);
                    //console.log(value);
                    //verwerk afleveringen
                    epi.naam = value.title;
                    epi.uitgebracht = value.first_aired;
                    epi.genre = value.genres;
                    epi.magnetLink = value.torrents;
                    epi.plot = value.overview;
                    epi.tvdbid = value.tvdb_id;
                    //                    serieslijst[imdbID].season[value.season].episode[value.episode];
                    //episode[value.episode] = epi;
                    //                    console.log(episode);
                    //stop aflevering in database
                    s = value.season;
                    e = value.episode;
                    serieslijst[imdbID].season[s].episode[e] = epi;
                    //                    serieslijst[imdbID].season[value.season].episode[value.episode] = epi;
                });
            });
}

function getXbmcMovies(XBMCdata) {
    //reset data;

    xbmc.data = {};
    //convert json string to json data
    XBMCdata = $.parseJSON(XBMCdata);
    //    set xbmc.data
    xbmc.movies.data = XBMCdata;
    // loop trough each item and make magic
    $.each(XBMCdata.result.movies, function (index, value) {
        xbmc.movies.list[value.imdbnumber] = value.label;
        //console.log(xbmc.list);
        if (filmlijst[value.imdbnumber] != undefined) {
            //als film al in de lijst is doe er dan iets mee
            if (xbmc.action = "hide") {
                //in eerste instantie toon de film dat niet meer. 
                $('a[data-imdbid="' + value.imdbnumber + '"]').parent().addClass("hideXBMC");
                xbmc.cssClass = "hideXBMC";
            }
        }
    });
}

function getXbmcSeries(XBMCdata) {
    console.log("series");
    //reset data;
    //xbmc.data = {};
    //convert json string to json data
    XBMCdata = $.parseJSON(XBMCdata);
    //    set xbmc.data
    xbmc.series.data = XBMCdata;
    console.log(xbmc.series.data);
    // loop trough each item and make magic
    $.each(XBMCdata.result.tvshows, function (index, value) {
        xbmc.series.list[value.imdbnumber] = value.label;
        xbmc.series.tvshows.push(value.tvshowid);
        console.log(value.label);
    });
    getXbmcEpisodes();
}


item = 0;

function getXbmcEpisodes(data) {
    if (xbmc.Socket.isPending) {
        //loopje
        setTimeout(getXbmcEpisodes, 500);
    } else {
        //console.log(xbmc.series.tvshows[item]);
        this.method = "VideoLibrary.GetSeasons";
        this.params = {
            "tvshowid": xbmc.series.tvshows[item]
        };
        item++;
        console.log(item < xbmc.series.tvshows.length);
        xbmc.Socket.send(getXbmcEpisodes.method, getXbmcEpisodes.params, item, getXbmcEpisodes);
        if (item < xbmc.series.tvshows.length) {
            //        console.log("doe iets");

            //xbmc.Socket.send(xbmc.series.settings.method, xbmc.series.settings.params, xbmc.series.settings.id, getXbmcSeries);
        }
    }
}


/* *
 * Roep themovieDB api aan en haal informatie op als JSON * @param string IMDB.*Als alle informatie is opgehaald toon de films.*/

function setMovieDBData(imdbID) {
    if (!imdbID) {
        console.log("Geen imdbID om informatie op te halen.");
    } else {

        //vorm url om JSON data op te halen
        var url = theMovieDB.url + imdbID;

        //haal data op uit OMDB api.
        $.getJSON(url, {
            api_key: theMovieDB.settings.api_key
        }).done(function (data) {
            //console.log(data);
            filmlijst[imdbID].plot = data.overview;
            filmlijst[imdbID].poster = theMovieDB.imgUrl + data.poster_path;

            vidUrl = theMovieDB.url + data.id + "/videos";

            //haal trailer info op
            $.getJSON(vidUrl, {
                api_key: theMovieDB.settings.api_key
            }).done(function (data) {
                if (data.results.length > 0) {
                    filmlijst[imdbID].trailer = data.results[0].key;
                } else {
                    filmlijst[imdbID].trailer = null;
                }
            });

            //tel één op bij het aantal items
            theMovieDB.aantalItems += 1;

            //als alle films zijn bijgewerkt toon dan de films. 
            if (theMovieDB.aantalItems == yify.aantalItems) {
                toonFilms(filmlijst);
            }

        });



    }
}



/** 
 *verwerk de data van yify in een nieuw object zonder de overbodige informatie;
 *@param Json yify data
 *Roep functie setMovieDBData en setYoutubeData na het verwerken van elk filmitem.
 */
function maakFilmLijst(data) {

    //    console.log(data.responseJSON.MovieList);
    moviecount = data.responseJSON.MovieCount;
    data = data.responseJSON.MovieList;

    status = "begin met verwerken van yify data";

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
            film.num = yify.aantalItems;

            //stop de film in de filmlijst
            filmlijst[value.ImdbCode] = film;

        });
    } else {
        status = "niet meer films beschikbaar";
        loader(false);
    }
    status = "yify data is verwerkt";
}


/** 
 *toon elk filmitem op de homepagina.
 */
function toonFilms(data) {
    //data = filmlijst;
    $.each(data, function (index, value) {
        if (!isFilmGetoond(index)) {
            $("#content").append(toonFilmItem(value));
        }
    });
    $(".filmitem img").load(function () {
        setMaxMoviePosterHeight();
    });
    status = "klaar";
    loader(false);
};

/**
 *
 * @param imdbID as STRING
 * return boolean
 */
function isFilmGetoond(imdbID) {
    var aanwezig = false;
    if ($('a[data-imdbid="' + imdbID + '"]').length != 0) {
        aanwezig = true;
    }
    return aanwezig;
}


/** 
 *Zet informatie van het filmitem om in HTML om te plaatsen op de homepagina.
 *@param Json data van het film item.
 *@return HML informatie van de film.
 */
function toonFilmItem(data) {
    //    var cssClass = '';
    if (xbmc.list[data.imdbID] != undefined) {
        cssClass = xbmc.cssClass;
    } else {
        cssClass = ''
    }
    film = '<div class="' + cssClass + ' filmItemHouder small-6 medium-4 large-2 xlarge-2 columns"><a class="filmitem" href="#' + data.uitgebracht + '" data-imdbid="' + data.imdbID + '" data-dropdown="drop' + data.num + '" data-options="is_hover:true">';
    film += '<img width="100%" src="' + data.poster + '"/><br><h5>' + data.naam + '</h5><h6>' + data.uitgebracht + '</h6></a>';

    /*film += '<ul id="drop' + data.num + '" class="f-dropdown" data-dropdown-content>';

        if (data.magnetLink["720p"] != undefined) {
            film += '<li><a href="' + data.magnetLink["720p"] + '">Download in 720p</a></li>';
        }
        if (data.magnetLink["1080p"] != undefined) {
            film += '<li><a href="' + data.magnetLink["1080p"] + '">Download in 1080p</a></li>';
        }
        if (data.magnetLink["3D"] != undefined) {
            film += '<li><a href="' + data.magnetLink["3D"] + '">Download in 3D</a></li>';
        }*/
    //    film += '<li><a href="http://www.imdb.com/title/' + data.imdbID + '" target="_blank">bekijk film informatie op IMDB</a></li></ul></div>'

    //film informatie terug sturen.
    return film;
}

/**
 * Controlleer of de onderkant van de pagina is bereikt
 * Toon nieuwe resultaten als dat zo is.
 */
$("#content").scroll(function () {
    //bepaal hoogte content div
    hoogte = $("div #content")[0].scrollHeight + 1;

    //bepaal scroll hoogte
    scrollPositie = $("#content").scrollTop() + $("#content").height();

    //als je bijna bij de onderkant van de pagina bent
    if (hoogte - scrollPositie < 100 && status == "klaar") {
        //toon loader;
        loader(true)
        //haal nieuwe set met data op.
        yify.settings.set = yify.settings.set + 1;
        yify.data = {};
        //haal nieuwe data op
        getYifyData();
    }
});

/**
 *Controlleer of de XBMC koppeling is ingevuld en plaats deze data in xbmc.url.
 *Bij een valide url roep de functie getXBMCdata aan.
 */
$('#XBMCadress').focusout(function () {
    var url = this.value;
    url = url,
    xbmc.url = url;
    //store url to XBMC host
    localStorage.setItem("xbmcHost", xbmc.url);
    getXBMCData();
});

/** 
 *Toon de film informatie middels een popup.
 *Controlleer of er op een film item wordt geklik, vul de popup met de bijpassende informatie en toon deze.
 */
$("#content").on("click", ".filmitem", function (event) {
    //event.preventDefault();
    var id = $(this).data("imdbid");
    var type = '';
    console.log(serieslijst[id]);
    if (filmlijst[id] != undefined) {
        //filmdetails
        data = filmlijst[id];
        type = 'film';
    } else if (serieslijst[id] != undefined) {
        //afleveringsdetails
        data = serieslijst[id];
        type = 'serie';
    }
    if (type == 'film') {
        //filmitem
        //wijzig de informatie in de popup zodat deze past bij het filmitem.
        $('#filmModal #titel').html(data.naam);
        $('#filmModal #plot').html(data.plot);
        $('#filmModal #genre').html(data.genre);
        $('#filmModal #kwaliteit').html(data.kwaliteit);
        $('#filmModal #rating').html(data.rating);
        $('#filmModal #geupload').html(data.geupload);
      
        

        $('#filmModal #trailer').attr("src", "http://www.youtube.com/embed/" + data.trailer);
        $('#filmModal .button').attr("href", "#");
        if (localStorage.getItem("downloadable") == "true") {
            $('#filmModal #download720p').attr("href", data.magnetLink["720p"]);
            $('#filmModal #download1080p').attr("href", data.magnetLink["1080p"]);
            $('#filmModal #download3D').attr("href", data.magnetLink["3D"]);
        }
        //toon de popup
        $('#filmModal').foundation('reveal', 'open', {
            animation: 'fadeAndPop',
            animation_speed: 250,
            close_on_background_click: true,
            dismiss_modal_class: 'close-reveal-modal',
            bg_class: 'reveal-modal-bg',
            root_element: 'body',
            bg: $('.reveal-modal-bg'),
            css: {
                open: {
                    'opacity': 0,
                    'visibility': 'visible',
                    'display': 'block'
                },
                close: {
                    'opacity': 1,
                    'visibility': 'hidden',
                    'display': 'none'
                }
            }
        });

        //    googleanalytics
        trackname = data.imdbID + ' - ' + data.naam;
        ga('send', 'pageview', trackname);
    } else if (type == 'serie') {
        console.log('serie');
        //serie


        //wijzig de informatie in de popup zodat deze past bij het filmitem.
        $('#serieModal #titel').html(data.naam);
        $('#serieModal #plot').html(data.plot);
        $('#serieModal #genre').html(data.genre);
        $('#serieModal #kwaliteit').html(data.kwaliteit);
        $('#serieModal #rating').html(data.rating);
        $('#serieModal #geupload').html(data.geupload);

        //        $('#serieModal #trailer').attr("src", "http://www.youtube.com/embed/" + data.trailer);
        $('#serieModal .button').attr("href", "#");

        //        loop trough seasons
        console.log(data);
        $.each(data.season, function (index, value) {
            //            $("#serieModal #seasons").append('<a href="#' + value.season + '"');
            var season = index;
            var data = value;

            $.each(data['episode'], function (index, value) {
                var episode = index;
                var data = value;
                //                console.log(data.magnetLink);
                var downloads = data.magnetLink;
                var link = '';
                var quality = '';
                if (downloads['1080p'] != undefined) {
                    //                 1080p  
                    link = downloads['1080p'].url;
                    quality = '1080p';
                } else if (downloads['720p'] != undefined) {
                    //                 720p   
                    link = downloads['720p'].url;
                    quality = '720p';
                } else if (downloads['480p'] != undefined) {
                    //                 480p   
                    link = downloads['480p'].url;
                    quality = '480p';
                } else {
                    //                 undefined
                    link = downloads['0'].url;
                    quality = 'unknown';

                }
                $("#serieModal #episodes").prepend('<a href="' + link + '">season ' + season + ' episode ' + episode + ' - ' + quality + '</a><br>');
            });

        });

        //        loop trough episodes

        if (localStorage.getItem("downloadable") == "true") {
            $('#serieModal #download720p').attr("href", data.magnetLink["720p"]);
            $('#serieModal #download1080p').attr("href", data.magnetLink["1080p"]);
            $('#serieModal #download3D').attr("href", data.magnetLink["3D"]);
        }
        //toon de popup
        $('#serieModal').foundation('reveal', 'open', {
            animation: 'fadeAndPop',
            animation_speed: 250,
            close_on_background_click: true,
            dismiss_modal_class: 'close-reveal-modal',
            bg_class: 'reveal-modal-bg',
            root_element: 'body',
            bg: $('.reveal-modal-bg'),
            css: {
                open: {
                    'opacity': 0,
                    'visibility': 'visible',
                    'display': 'block'
                },
                close: {
                    'opacity': 1,
                    'visibility': 'hidden',
                    'display': 'none'
                }
            }
        });
    }
});

/**
 *toon of hide loader
 * @param true/false bolean
 */
function loader(toon) {
    if (toon) {
        $("#content").prepend('<div id="loader" class="preloader"></div>');
    } else {
        $("#loader").remove();
    }
}



/**
 * Stel de maximale afbeeldingsgrote in aan de hand van de eerste afbeelding
 */
function setMaxMoviePosterHeight() {
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
}




/*
 * Sidebar menu
 * open als accordeon als er op een label geklikt wordt
 */
$(".off-canvas-list").on("click", ".navigation", function (event) {
    if ($(this).parent().hasClass("open")) {
        $(this).parent().removeClass("open");
    } else {
        $(".off-canvas-list .open").removeClass("open");
        $(this).parent().addClass("open");
    }
});

/*
 * Downloading is illegal, this is a developer option. Do not activate it unless you want to risk a fee for downloading illegal files.
 */
function activateDownloads() {
    localStorage.setItem("downloadable", true);
    console.log("you can now download");
    return
}