/* ---------------------------------------------------- +/

## Location ##

Code related to the location template

/+ ---------------------------------------------------- */

Template.location.created = function () {
    //
};

Template.location.helpers({

    myHelper: function () {
        //
    }

});

Template.location.rendered = function () {
    // Fade in the main location wrapper
    $('.location').addClass('animated fadeIn92');
};

Template.location.events({

    'click .back': function(e, instance){
        console.clear();
    },
    'click .delete': function(e, instance){
        var location = this;
        e.preventDefault();
        Meteor.call('removeLocation', location, function(error, result){
            alert('Location deleted.');
            Router.go('/locations');
        });
    }

});
