Template.layout.rendered = function() {
    /**
     * Define without the var to make this accessible across the events
     *
     * 3 minute screen saver
     */
    //sSaverTimeout = 180000;
    // Dev timeout
    sSaverTimeout = 2000;
    if (typeof(Router.current().params) != "undefined") {
        saverEnabled = Router.current().params.saver;
        if (!saverEnabled) {
            saveScreen(sSaverTimeout);
        }
    }
};

/**
 * Reset the screensaver everytime we get a mouse (touch) event
 */
Template.layout.events({
    'click #screensaver': function(event, template) {
        $('#screensaver').removeClass('animated fadeIn');
        $('#screensaver').addClass('animated fadeOut');
        setTimeout(function(){
            $('#screensaver').hide();
        }, 600);
    },

    'click': function(event, template) {
        // Reset the screensaver timer
        if (typeof(sSaver) != "undefined") {
            clearTimeout(sSaver);
        }
        // Start the screensaver timer
        saveScreen(sSaverTimeout);
    }

});

/**
 * Set a timeout.
 *
 * If it elapses, go back to the homepage
 */
function saveScreen(sSaverTimeout) {
    sSaver = setTimeout(function(){

        // If you're not on the homepage,
        // go there and send a flag to turn on the screensaver
        var home = Meteor.settings.public.homeItem;

        if (Router.current().route._path == '/') {
            console.log('Route path equals /');
            $('#screensaver').removeClass('animated fadeOut');
            $('#screensaver').addClass('animated fadeIn');
            $('#screensaver').show();
        }
        else {
            Router.go(
                'locations',
                {link: home},
                {query: {saver: 'true'}}
            );
        }
    }, sSaverTimeout);
}
