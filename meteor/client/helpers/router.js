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
    },
    action: function() {
        this.render();
    }
  });

  // Single Location
  this.route('location', {
    path: '/location/:link',
    waitOn: function () {
      return Meteor.subscribe('singleLocation', this.params.link);
    },
    data: function () {
      return {
        location: Locations.findOne({ 'link': this.params.link })
      };
    },
    action: function() {
        this.render();
    }
  });

  // Admin/Editor
  this.route('admin', {
    path: '/admin/',
    waitOn: function () {
      return Meteor.subscribe('allLocations');
    },
    data: function () {
      return {
        locations: Locations.find(),
        images: Images.find()
      };
    },
    action: function() {
        this.render();
    }
  });
  this.route('adminLocation', {
    path: 'admin/locations/:link',
    waitOn: function () {
      return Meteor.subscribe('singleLocation', this.params.link);
    },
    data: function () {
      return {
        location: Locations.findOne({ 'link': this.params.link }),
      };
    },
    action: function() {
        this.render();
    }
  });


});
