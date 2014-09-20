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
    aantalItems: 0,
    getData: function () {
        //haal data op uit YIFY api.
        yify.data = $.getJSON(yify.url, yify.settings).done(function () {
            //controleer of data succesvol is opgehaald aan de hand van de status. Als het niet goed is opgehaald probeer het dan nogmaals.
            if (yify.data.status == '200') {
                //data is opgehaald en kan verwerkt worden
                log('yify data is opgehaald');
                app.maakFilmLijst(yify.data);
            } else {
                yify.getData();
            }
        });
        í
    }
}