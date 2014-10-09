/* ---------------------------------------------------- +/

## Client Router ##

Client-side Router.

/+ ---------------------------------------------------- */

// Config

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
});

// Filters

var filters = {

  myFilter: function () {
    // do something
  },

  isLoggedIn: function() {
    if (!(Meteor.loggingIn() || Meteor.user())) {
      alert('Please Log In First.');
      this.stop();
    }
  }

};

Router.onBeforeAction(filters.myFilter, {only: ['locations']});

// Routes

Router.map(function() {

  // Locations

  this.route('locations', {
    path: '/',
    waitOn: function () {
      return Meteor.subscribe('allLocations');
    },
    data: function () {
      return {
        locations: Locations.find(),
        images: Images.find()
      };
    }
  });

  this.route('location', {
    path: '/location/:_id',
    waitOn: function () {
      return Meteor.subscribe('singleLocation', this.params._id);
    },
    data: function () {
      return {
        location: Locations.findOne(this.params._id)
      }
    }
  });

  this.route('content');

  // Users

  this.route('login');

  this.route('signup');

  this.route('forgot');

});
