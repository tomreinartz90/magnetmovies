var modal = {
  showMovie: function () {
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
      animation: 'fade',
      animation_speed: 50,
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



  },
  showSerie: function (serieObject) {
    //toon de popup
    //serie
    var data = serieObject
    console.log(data);

    //wijzig de informatie in de popup zodat deze past bij het filmitem.
    $('#serieModal #titel').html(data.naam);
    $('#serieModal #plot').html(data.movieDBData.overview);
    $('#serieModal #genre').html(data.genre);
    $('#serieModal #kwaliteit').html(data.kwaliteit);
    $('#serieModal #rating').html(data.movieDBData.vote_average);
    $('#serieModal #geupload').html(data.geupload);
    $('#serieModal #poster').attr('src', data.poster);

    //        $('#serieModal #trailer').attr("src", "http://www.youtube.com/embed/" + data.trailer);
    $('#serieModal .button').attr("href", "#");
    $('#serieModal .seasons').html('');
    $('#serieModal .episodes').html('');
    $('#serieModal').css('background-image', 'url('+movieDBserie.backDropUrl + data.movieDBData.backdrop_path +')');
    //        loop trough seasons
    console.log(data.season);
    $.each(data.season, function (index, value) {

      log(index);
      //            $("#serieModal #seasons").append('<a href="#' + value.season + '"');
      var season = index;
      var data = value;
      var tab = '<dd><a href="#panel' + season + '">' + season + '</a></dd>';
      var content = '<div class="content" id="panel' + season + '"></div>';
      $('#serieModal .seasons').prepend(tab);
      $('#serieModal .episodes').prepend(content);
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
        $("#serieModal #panel" + season + " ").prepend('<a class="button" href="' + link + '">season ' + season + ' episode ' + episode + ' - ' + quality + '</a>');
      });

    });
    $('#serieModal .seasons > dd:nth-of-type(1)').addClass('active');
    $('#serieModal .episodes > div:nth-of-type(1)').addClass('active');

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
}

//eventhandler

$("#content").on("click", ".filmitem", function (event) {
  //event.preventDefault();
  var id = $(this).data("imdbid");
  if (filmlijst[id] != undefined) {
    //filmdetails
    data = filmlijst[id];
    modal.showMovie(data);
  } else if (serieslijst[id] != undefined) {
    //afleveringsdetails
    data = serieslijst[id];
    modal.showSerie(data);
  }
});