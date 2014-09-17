/* ---------------------------------------------------- +/

## Publications ##

All publications-related code.

/+ ---------------------------------------------------- */

// Publish all Locations

Meteor.publish('allLocations', function() {
  return Locations.find();
});

// Publish a single location

Meteor.publish('singleLocation', function(id) {
  return Locations.find(id);
});

/**
 * Publish all Images
 */
Meteor.publish('allImages', function() {
  return Images.find();
});

