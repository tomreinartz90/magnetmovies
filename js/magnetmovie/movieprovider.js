/** 
 *Basis Variablen API
 */
var yify = {
  url: "http://yts.to/api/v2/list_movies.jsonp",
  settings: {
    limit: "30", //max 50
    page: 1,
    minimum_rating: "6", //vanaf IMDB rating 7
    sort_by: "seeds",
    quality: "ALL", //All, 720p 1080p 3D
    query_term: "",
    genre: "all",
    order_by: "desc" //desc asc //aflopend oplopend
  },
  data: {},
  aantalItems: 0,
  getData: function () { 
    //haal data op uit YIFY api.
    yify.data = $.ajax({method: "GET",
                        url: yify.url, 
                        data: yify.settings,
                       dataType: "jsonp"}).done(function () {
      //controleer of data succesvol is opgehaald aan de hand van de status. Als het niet goed is opgehaald probeer het dan nogmaals.
      if (yify.data.status == '200') {
        //data is opgehaald en kan verwerkt worden
        log('yify data is opgehaald');
        app.maakFilmLijst(yify.data);
      } else {
        yify.getData();
      }
    });
  }
}