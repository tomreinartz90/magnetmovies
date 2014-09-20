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