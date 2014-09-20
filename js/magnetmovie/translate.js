//haal taal van browser op
var lang = navigator.language || navigator.userLanguage;

//als taal niet beschikbaar is gebruik dan engels.
if (lang != "nl" && lang != "en") {
    lang = "en"
}

//haal het taal bestand op.
$.getJSON('js/lang/' + lang + '.json', function (data) {
    langData = data;
    translate(langData);
});

/***
 * Vertaal de website in de taal van de browser
 * @param langData taal informatie in JSON format.
 */
function translate(langData) {
    //plaats taal informatie op de juiste plaats

    //stel genres in
    setGenres(langData.genres);
    setSorts(langData.sort);
}

/**
 * Stel de genres in bij het menu aan de hand van de informatie in het taal bestand.
 * @param genres in JSON format
 */
function setGenres(genres) {
    //loop door de resultaten heen en maak voor iedere genre een nieuwe selector aan
    num = 0;
    $.each(genres, function (index, value) {
        //maak nieuwe radius button aan en toon deze in het menu
        if (index == "all") {
            checked = "checked"
        } else {
            checked = ""
        };
        $("#genre .content").append('<div class="switch round radius"><input id="GenreSwitch' + num + '" type="radio" ' + checked + ' name="genre" value="' + index + '"><label for="GenreSwitch' + num + '">' + value + '</label> </div>');

        //teller +1
        num++;
    });
}

/**
 * Stel de sortering in bij het menu aan de hand van de informatie in het taal bestand.
 * @param sort in JSON format
 */
function setSorts(sorts) {
    //loop door de resultaten heen en maak voor iedere sortering een nieuwe selector aan
    num2 = 0;
    $.each(sorts, function (index, value) {
        //maak nieuwe radius button aan en toon deze in het menu
        if (index == "seeds") {
            checked = "checked"
        } else {
            checked = ""
        };
        $("#sort .content").append('<div class="switch round radius"><input id="sortSwitch' + num2 + '" type="radio" ' + checked + ' name="sort" value="' + index + '"><label for="sortSwitch' + num2 + '">' + value + '</label> </div>');

        //teller +1
        num2++;
    });
}