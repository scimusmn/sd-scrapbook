/**
 * Publications
 *
 * All publications-related code.
 */

/**
 * Publish all locations.
 *
 * We also pull images along or now. Eventually we will filter this down
 * for better efficiency.
 */
Meteor.publish('allLocations', function() {
    return [
        Locations.find();
        Images.find();
    ]
});

/**
 * Publish a single location
 */
Meteor.publish('singleLocation', function(id) {
    return Locations.find(id);
});

/**
 * Publish all Images
 */
Meteor.publish('allImages', function() {
    return Images.find();
});

