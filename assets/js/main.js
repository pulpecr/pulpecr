(function() {
  function isMobile() {
    return screen.availWidth < 640;
  }

  var ig = (function() {
    function load() {
      $.ajax({
        url: 'https://api.instagram.com/v1/users/self/media/recent/?count=12&access_token=1984275473.79a23b0.d777ba026890422aa89c4fae80f65153',
        dataType: 'jsonp',
      })
      .done(function(res) {
        renderFeed(res.data);
      });
    }

    function renderPost(post) {
      var result = [];
      result.push('<article class="' + (isMobile() ? 'instagram__slider-item' : 'instagram__feed-item') + '">');
      result.push('<img src=\"' + post.images.standard_resolution.url + '\" />');
      if (!isMobile()) {
        result.push('<p>' + post.caption.text + '</p>');
      }
      result.push('</article>');
      return result.join('');
    }

    function buildTemplate(posts) {
      var t = [];
      posts.forEach(function(post) {
        t.push(renderPost(post));
      });
      return t.join('');
    }


    function renderFeed(posts) {
      if (isMobile()) {
        var el = $('#igSlider');
        el.html(buildTemplate(posts));
        el.flickity({
          prevNextButtons: false,
          pageDots: false,
          imagesLoaded: true,
          setGallerySize: false
        });
        el.height(el.width());
      } else {
        $('#igFeed').html(buildTemplate(posts));
      }
    }

    return {
      init: function() {
        load();
      }
    };
  })();

  // Init Instagram posts
  ig.init();

})();


