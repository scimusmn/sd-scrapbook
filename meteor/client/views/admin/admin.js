/**
 * Template helpers
 */
Template.admin.helpers({
  locations: function() {

    return Locations.find({}, {sort:{title:1}});

  },

});

Template.adminLocationButton.helpers({
  location: function() {

    return Locations.findOne(this._id);

  },

  locationURL: function() {

    return 'http://' + window.location.host + '/admin/locations/' + this.link + '/';

  },

});
