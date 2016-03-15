Template.layout.rendered = function () {
  /**
   * Define without the var to make this accessible across the events
   *
   * 3 minute screen saver
   */
  var sSaver;
  sSaverTimeout = 180000;

  // Dev timeout
  //sSaverTimeout = 5000;

  clearTimeout(sSaver);
  saveScreen(sSaverTimeout);
};

/**
 * Reset the screensaver everytime we get a mouse (touch) event
 */
Template.layout.events({
  // Any mouse up or mousemove event keeps the screensaver away
  mousemove: function (event, template) {
    // Reset the screensaver timer
    clearTimeout(sSaver);
    saveScreen(sSaverTimeout);
  },

  mouseup: function (event, template) {
    // Reset the screensaver timer
    clearTimeout(sSaver);
    saveScreen(sSaverTimeout);
  },

  'click #screensaver': function (event, template) {
    // Fade the screensaver
    // It's important to hide the element or nothing underneath
    // will be clickable
    $('#screensaver').removeClass('animated fadeIn');
    $('#screensaver').addClass('animated fadeOut');
    setTimeout(function () {
      $('#screensaver').hide();
    }, 600);

    // Go to the homepage if were not already there
    if (Router.current().path != '/') {
      Router.go('/');
    }

    // Restart the screensaver timer
    clearTimeout(sSaver);
    saveScreen(sSaverTimeout);

  },

  dragstart: function (e) {
    e.preventDefault();
  },
});

/**
 * Display the screensaver after a timeout
 */
function saveScreen(sSaverTimeout) {
  sSaver = setTimeout(function () {
    $('#screensaver').removeClass('animated fadeOut');
    $('#screensaver').addClass('animated fadeIn');
    $('#screensaver').show();
  }, sSaverTimeout);
}
