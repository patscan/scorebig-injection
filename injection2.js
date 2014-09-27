/*
SECOND VIEW = https://www.scorebig.com/gerard-way-tickets/sfo
*/
(function(){

  var getArtistId = function(cb) {
    var name = $('.performer-container-wrap').find('h2').text().trim();
    var call = $.ajax('http://api.openaura.com/v1/search/artists?limit=1&q=' + encodeURI(name).toLowerCase() + '&api_key=oaprodkey4alldathingz');
    $.when(call).done(function(data){ 
      id =  data[0].oa_artist_id;
      cb(id);
    });
  };

  var init = function() {
    getArtistId(function(id) {
      var infoCall = $.get('http://api.openaura.com/v1/classic/artists/' + id  + '?id_type=oa%3Aartist_id&api_key=oaprodkey4alldathingz' );
      var sourcesCall = $.get('http://api.openaura.com/v1/source/artists/' + id  + '?id_type=oa%3Aartist_id&api_key=oaprodkey4alldathingz' );
      var aiCall = $.get('http://api.openaura.com/v1/info/artists/' + id + '?with_sources=false&id_type=oa%3Aartist_id&api_key=oaprodkey4alldathingz');
      $.when(infoCall, sourcesCall, aiCall).done(function(info, sources, ai) {
        inject(info[0], sources[0], ai[0]);
      });
    });
  };

  var inject = function(info, sources, ai) {
    var $imageContainer = $('.sidebar-image');
    var $infoContainer = $($('.performer-list-wrap.drop-shadow').parent())
    var $banner = $('.performer-banner');
    var sources = sources.sources;

    $imageContainer.css({ 
      'height' : 338,
      'background-image' : 'url(' + info.artist_images[0].url + ')',
      'background-size' : 'cover'
    }); 

    $banner.css({
      'background-image' : 'url(' + ai.cover_photo[0].media[2].url + ')'
    });

    $imageContainer.find('img').hide();
    $imageContainer.addClass('fotorama');
    $('.landing-description').prepend(info.bio);
    twitterSrc = _.find(sources, function(source) { return source.provider_name == "Twitter" });
    facebookSrc = _.find(sources, function(source) { return source.provider_name == "Facebook" });
     
    $infoContainer.append(
      '<div style="padding: 10px; border-radius: 5px; padding-top: 30px; ">' +
      '<div>' +
      '<strong>Stay in touch with '+ info.name +': </strong>' +
      '</div>' +

      '<div style="margin-top: 15px;">' +
      '<a class="twitter-follow-button" href="' + twitterSrc.url + '" data-show-count="true" data-lang="en" data-size="large">Follow @' + twitterSrc.handle +'</a>' +
      '<script type="text/javascript">' +
      'window.twttr = (function (d, s, id) {' +
        'var t, js, fjs = d.getElementsByTagName(s)[0];' +
        'if (d.getElementById(id)) return;' +
        'js = d.createElement(s); js.id = id;' +
        'js.src= "https://platform.twitter.com/widgets.js";' +
        'fjs.parentNode.insertBefore(js, fjs);' +
        'return window.twttr || (t = { _e: [], ready: function (f) { t._e.push(f) } });' +
      '}(document, "script", "twitter-wjs"));' +
      '</script>' +
      '</div>' +

      '<div style="margin-top: 15px;">' +
      '<iframe src="//www.facebook.com/plugins/like.php?href=' + facebookSrc.url  + '&amp;width&amp;layout=standard&amp;action=like&amp;show_faces=true&amp;share=true&amp;height=100" scrolling="no" frameborder="0" style="border:none; overflow:hidden; height:30px; width:auto;" allowTransparency="true"></iframe>' +
      '</div>' +
      '</div>'
    );

    $('head').append(
      '<link  href="http://fotorama.s3.amazonaws.com/4.6.2/fotorama.css" rel="stylesheet"> <!-- 3 KB --><script src="http://fotorama.s3.amazonaws.com/4.6.2/fotorama.js"></script> <!-- 16 KB -->'
    );
  };

  $(document).ready(function() {
    init();
  });
}());


//classic call for Taylor below:
//curl -XGET 'http://api.openaura.com/v1/classic/artists/47?id_type=oa%3Aartist_id&api_key=oaprodkey4alldathingz'

//search call for Taylor Swift:
//curl -XGET 'http://api.openaura.com/v1/search/artists?limit=1&q=Taylor+Swift&api_key=oaprodkey4alldathingz'


