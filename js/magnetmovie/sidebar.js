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


$(".mode-films").on("click", function () {
  $(this).addClass('disabled');
  $('.film-zoeker').show();
  $(".mode-series").removeClass('disabled');
  //remove old items
  $(".filmItemHouder").remove();
  //sest mode to movies
  localStorage.setItem('app.mode', 'movies');
  app.mode = 'movies';
  filmlijst = {};
  serieslijst = {};
  yify.settings.page = 1;
  yify.data = {};
  //haal nieuwe data op
  app.run();
});

$(".mode-series").on("click", function () {
  $(this).addClass('disabled');
  $('.film-zoeker').hide();
  $(".mode-films").removeClass('disabled');
  //remove old items
  $(".filmItemHouder").remove();
  //set mode to series
  
  localStorage.setItem('app.mode', 'series');
  app.mode = 'series';
  filmlijst = {};
  serieslijst = {};
  //haal nieuwe set met data op.
  eztv.settings.set = 1;
  eztv.data = {};
  //haal nieuwe data op
  app.run();
});

$("#zoek").on("click", function () {
  yify.settings = {
    page: 1,
    limit: "30", //max 50
    minimum_rating: $(".zoeken #imdbRating").val(), //vanaf IMDB rating 7
    sort_by: $(".zoeken input[name=sort]:checked").val(),
    quality: $(".zoeken input[name=quality]:checked").val(), //All, 720p 1080p 3D
    query_term: $(".zoeken #keywords").val(),
    genre: $(".zoeken input[name=genre]:checked").val(),
    order_by: $(".zoeken input[name=order]:checked").val() //desc asc //aflopend oplopend
  };
  //roep newWall functie aan
  localStorage.setItem('app.mode', 'movies');
  app.mode = 'movies';
  filmlijst = {};
  serieslijst = {};
  yify.settings.page = 1;
  yify.data = {};
  //haal nieuwe data op
  $(".filmItemHouder").remove();
  app.run();
});

//Mobile search
$('.mobile-search').on('click', function () {
  $('#standard-menu').toggleClass('show-for-medium-up');
});


//autocomplete movie title
/*$('.movie - search - term ').on("input click", function (e) {
    var val = $(this).val();
    dataList = $('#
movie - datalist ');
    dataList.empty();

    if (val === "" || val.length < 3) return;
    log(val);
    $.ajax({
        type: "GET",
        url: '
http: //api.themoviedb.org/3/search/movie',
async: false,
data: {
    api_key: movieDB.settings.api_key,
    query: val
},
success: function (data) {
    if (data.results.length) {
        log(data);
        for (var i = 0, len = data.results.length; i < len; i++) {
            var opt = $("<option></option>").attr("value", data.results[i]['title']);
            //tempObj[data.results[i]['city']] = data.results[i]['id'];

            dataList.append(opt);
        }
    }
}

});

}); * //*/