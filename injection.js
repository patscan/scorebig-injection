/*
FIRST VIEW = https://www.scorebig.com/concert-tickets/sfo
*/

(function(){
  var getArtistNames = function() {
    var artistNames = [];
    _.each($('h3.title'), function(h3) {
      artistNames.push( $(h3).text().trim() );
    });
    return artistNames;
  };

  var searchAjaxCalls = function() {
    var calls = [];
    _.each(getArtistNames(), function(name) {
      calls.push( $.ajax('http://api.openaura.com/v1/search/artists?limit=1&q=' + encodeURI(name).toLowerCase() + '&api_key=oaprodkey4alldathingz'));
    });
    return calls;
  };

  var getArtistIds = function(cb) {
    var calls = searchAjaxCalls(),
        idz = [];
    $.when.apply($, calls).done(function(){ 
      _.each(calls, function(call) { idz.push( JSON.parse(call.responseText)[0].oa_artist_id) });
      cb(idz);
    });
  };

  var getArtistInfo = function(artistIdz, cb) {
    var calls = [],
        artistIdz = artistIdz,
        infoResponse = [];

    for(i=0;i<artistIdz.length;i++) {
      calls.push( $.get('http://api.openaura.com/v1/classic/artists/' + artistIdz[i] + '?id_type=oa%3Aartist_id&api_key=oaprodkey4alldathingz' ));
    };

    $.when.apply($, calls).done(function() { 
      _.each(calls, function(call) { 
        infoResponse.push( JSON.parse(call.responseText) );
      });
      cb(infoResponse);
    });
  };

  var init = function() {
    var artist_ids = [];

    getArtistIds(function(ids){ 
      getArtistInfo(ids, function(infoResp) {
        inject(infoResp);
      });
    });
  };

  var inject = function(infoResp) {
   for(i=0; i<$('h3.title').length; i++) {
     var $title = $($('h3.title')[i])
     var artistInfo = _.find(infoResp, function(obj) { return obj.name === $title.text().trim(); });
     if ( typeof(artistInfo) === "undefined" ) { continue; }
     console.log(artistInfo);
     var $image = $title.parent().parent().parent().find('img');
     var $imageContainer = $( $image.parent() );
     var birthplace = '';
     //var birthplace = artistInfo.birthplace != "" ? artistInfo.birthplace : artistInfo.location_formed;

     //if (typeof(birthplace) == "undefined") { birthplace = "" };
     if (artistInfo.birthplace || artistInfo.location_formed) {
       birthplace = artistInfo.birthplace != "" ? artistInfo.birthplace : artistInfo.location_formed;
     }

     //$image.attr('src', artistInfo.artist_images[0].url);
     $imageContainer.css({ 
       'width': 100,
       'height': 100,
       'background-image': 'url('+artistInfo.artist_images[0].url+ ')',
       'background-size' : 'cover',
       'display' : 'block',
       'margin-right': '15px'
     });
     $image.hide();
     $title.parent().find('.event-info').prepend(
       '<div style="margin: 5px 0;">' +
       birthplace +
       '</div>'
     );
     $title.parent().find('.upcoming-count').append(
       '<div style="width: 350px; height: 27px; overflow: hidden; font-size: 10px; text-overflow: ellipsis; margin-top: 5px" class="mini-bio">'+
         artistInfo.bio +
       '</div>'
     );

     $('.mini-bio').hover( 
       function() { $(this).css('height', ''); },
       function() { $(this).css('height', '27px'); }
     );
     
     //$title.parent().prepend( artistInfo.
     console.dir(artistInfo);
   }
  }

  $(document).ready(function() {
    init();
  });
}());


//classic call for Taylor below:
//curl -XGET 'http://api.openaura.com/v1/classic/artists/47?id_type=oa%3Aartist_id&api_key=oaprodkey4alldathingz'

//search call for Taylor Swift:
//curl -XGET 'http://api.openaura.com/v1/search/artists?limit=1&q=Taylor+Swift&api_key=oaprodkey4alldathingz'


