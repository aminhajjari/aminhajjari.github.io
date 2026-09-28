/* jshint unused:false */
/*!
 * Project:     cv - Amin Hajjari
 * File:        assets/js/front/index.js
 */

'use strict';

window.jQuery(function ($) {

  let defOpts = Object.assign({}, {
    selector: 'div'
    , inclass:  ''
    , outclass: ''
  });

  // ---------------------------------------------------------------------------
  // Waypoints
  // ---------------------------------------------------------------------------
  let wShow = function (o) {
    // Skip entries whose selector is empty or not on the page (avoids a Waypoints crash)
    if (!o || !o.selector || !$(o.selector).length) { return null; }
    let opts = Object.assign({}, defOpts || {}, o || {});

    return new window.Waypoint.Inview({
      element: $(opts.selector)
      , enter: function (dir) {
          this.element.removeClass(opts.outclass).addClass(opts.inclass);
        }
      , entered: function (dir) {}
      , exit: function (dir) {}
      , exited: function (dir) {
          this.element.removeClass(opts.inclass).addClass(opts.outclass);
        }
      , offset: function () {
          return 70 + this.element.clientHeight;
        }
    });
  };

  // ---------------------------------------------------------------------------
  //  Animations
  // ---------------------------------------------------------------------------
  (function () {

    let w = window;
    let dataRoot = w.location.origin + '/data/';

    function status (r) {
      if (r.status >= 200 && r.status < 300) {
        return Promise.resolve(r);
      } else {
        console.warn('Looks like there was a problem. Status Code: ' + r.status);
        return Promise.reject(new Error(r.statusText));
      }
    }

    function json (r) {
      let contentType = r.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return r.json();
      } else if (contentType && contentType.includes('text/plain')) {
        return JSON.parse(r);
      }
      throw new TypeError('Oops, we haven\'t got JSON!');
    }

    let AnimationsConfig = fetch(dataRoot + 'animations.json')
      .then(status)
      .then(json)
      .then(function (lo) {
        return Promise.resolve(lo.animations);
      })
      .catch(function (err) {
        console.warn('Failed to fetch DATA: [', err, ']');
        return Promise.reject(err);
      });

    let AnimationsEnabled = AnimationsConfig.then(function (loAnimations) {
      return Promise.resolve(loAnimations).then(function (lo) {
        return new Promise(function (resolve, reject) {
          $.each(lo, function (i, o) {
            wShow(o);
          });
          return resolve();
        });
      });
    })
    .catch(function (e) {
      console.log('Failed to Enable Animations: [', e, ']');
      return Promise.reject(e);
    });

    AnimationsEnabled.then(function () {
      console.log('%c✓ %cAnimations: ENABLED', 'color:green;font-weight:bold;font-size:16px;', 'color:blue;font-weight:bold;');
      return Promise.resolve(true);
    })
    .catch(function (e) {
      console.warn('Animations NOT ENABLED: [', e, ']');
      return Promise.reject(e);
    });

  })();

  // ---------------------------------------------------------------------------
  //  NOTY
  // ---------------------------------------------------------------------------
  (function () {
    $.noty.defaults = {
      layout:         'topRight'
      , theme:        'defaultTheme'
      , type:         'success'
      , text:         ''
      , dismissQueue: true
      , force:        false
      , maxVisible:   8
      , template:     '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>'
      , timeout:      5000
      , progressBar:  true
      , buttons:      false
      , animation: {
          open:      {height: 'toggle'}
          , close:   'animated flipOutY'
          , easing:  'swing'
          , speed:   500
        }
      , closeWith:   ['click']
      , modal:       false
      , killer:      false
      , callback: {
          onShow:         function () {}
          , afterShow:    function () {}
          , onClose:      function () {}
          , afterClose:   function () {}
          , onCloseClick: function () {}
        }
    };
  })();

  // ---------------------------------------------------------------------------
  //  Indicators
  // ---------------------------------------------------------------------------
  (function () {

    $(window).ready(function () {
      console.log('%cAmin Hajjari - CV', 'color:red;font-weight:bold;font-size:24px;');
    });

    $(document).ready(function () {
      console.log('%c✓ %cDOCUMENT: READY', 'color:green;font-weight:bold;font-size:16px;', 'color:black;font-weight:normal;');

      // Preloader
      $('#pre-status').fadeOut();
      $('#tt-preloader').delay(100).fadeOut('fast');

      // Make html visible (FOUC fix)
      $('html').css({ 'visibility': 'visible', 'opacity': '1' });

      console.log('%c✓ %cPRELOADER REMOVED', 'color:green;font-weight:bold;font-size:16px;', 'color:black;');
    });

    $(window).on('load', function () {
      console.log('%c✓ %cWINDOW: LOAD', 'color:green;font-weight:bold;font-size:16px;', 'color:black;font-weight:normal;');
    });

  }());

});
