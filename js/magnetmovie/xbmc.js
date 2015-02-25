var xbmc = {
  url: '192.168.1.198',
  movies: {
    settings: {
      "jsonrpc": "2.0",
      "method": "VideoLibrary.GetMovies",
      "params": {
        "properties": ["imdbnumber"],
      },
      "id": "1"
    },
    data: undefined,
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
  getData: function () {},
  hideMovieItems: function () {
    // loop trough each item and make magic
    if(xbmc.movies.data === undefined){
     return; 
    }
    $.each(xbmc.movies.data.result.movies, function (index, value) {
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
}


if (localStorage.getItem("xbmcHost")) {
  //xbmc.url = localStorage.getItem("xbmcHost");
}


xbmc.Socket = new XBMCSocket();
xbmc.connect = function () {
  status = "busy";
//  xbmc.url = localStorage.getItem('xbmcUrl');
  console.log("Begin met ophalen xbmc data");
  if(xbmc.movies.data){
    xbmc.Socket.connect(xbmc.url, "9090");
  }
}

xbmc.getData = function () {
  if(xbmc.url === undefined || xbmc.url === null){ 
   return; 
  }
  if (xbmc.Socket.isConnected && !xbmc.Socket.isPending && xbmc.movies.data == null) {
    //film informatie ophalen
    xbmc.Socket.send(xbmc.movies.settings.method, xbmc.movies.settings.params, xbmc.movies.settings.id, getXbmcMovies);
  }
  /*else if (xbmc.Socket.isConnected && !xbmc.Socket.isPending && xbmc.series.data == null) {
        //series informatie ophalen
        xbmc.Socket.send(xbmc.series.settings.method, xbmc.series.settings.params, xbmc.series.settings.id, getXbmcSeries);
    }*/
  if (xbmc.movies.data == null && xbmc.series.data == null) {} {
    //loopje
    setTimeout(xbmc.getData, 500);
  }

}

function getXbmcMovies(XBMCdata) {
  //reset data;
  console.log('movies');
  xbmc.movies.data = {};
  //convert json string to json data
  XBMCdata = $.parseJSON(XBMCdata);
  //    set xbmc.data
  xbmc.movies.data = XBMCdata;
  xbmc.hideMovieItems();
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