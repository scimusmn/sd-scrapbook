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
 *
 * Start filtering some of the image fields that we want to return.
 * We only need the title, location, and a few other fields.
 *
 * Limiting the publish to 10 for now because of performance issues.
 */

Meteor.publish('allLocations', function() {

    /**
     * Establish the size of the image collection so that we can select random
     * elements within it.
     */
    // Devel approach to Location query
    // Eventually I'll add in a find to discover the active locations later.
    // TODO - don't do this
    var activeLocIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    var result = '';

    /**
     * Function to pad out the random numbers
     *
     * This helps us ensure that we only get one ID per location in the query
     */
    function padNumberMath(number, pad) {
        var N = Math.pow(10, pad);
        return number < N ? ('' + (N + number)).slice(1) : '' + number;
    }

    /**
     * Get an image for each location
     */
    var query = {
        // Nest our and queries in an or, so we can get each location
        $or: []
    };

    /**
     * Currently a hack
     *
     * Sometimes this will return and empoty result.
     *
     * I need to pull the random numbers from a specific list of horizontal images.
     * But for now this returns enough images to work for some of the other issues.
     */
    _.each(activeLocIds, function(activeLocId, i) {
        // Count the images in each location and pick a random one
        result = Images.find({dsLocId: activeLocId}).count();
        var randNum = padNumberMath(Math.floor((Math.random() * (result - 1) ) + 1), 3);
        console.log('randNum - ', randNum);

        // Add to our query, selecting for the location and random number
        // using the _id
        query['$or'].push({
            $and: [ { dsLocId: activeLocId }, { thumbAspectRatio: { $gt: 1 } } , { _id: { $regex: randNum + '(now$|then$|r$|$)', $options: 'i'}}]
        });

    });

    var eachLocation = Locations.find(
        {},
        {
            fields: {
                dsLocId: 1, latitude: 1, longitude: 1, link: 1, title: 1
            }
        }
    );
    var randomLocationImages = Images.find(
        query,
        {
            fields: {
                _id: 1, dsLocId: 1, thumbHeight: 1, thumbWidth: 1,
                generalLocationDs: 1
            }
        }
    );

    return [
        eachLocation,
        randomLocationImages
    ];

});

/**
 * Publish a single location
 */
Meteor.publish('singleLocation', function(link) {

    /**
     * Get current location so that we can filter images
     * only to this location.
     */
    var currentLocation = Locations.find( { 'link': link });
    var currentLocationObject = currentLocation.fetch();
    var currentLocationTitle = currentLocationObject[0].title;
    var currentLocationImages = Images.find(
        {generalLocationDs: currentLocationTitle},
        {
            fields: {
                _id: 1, dsLocId: 1, title: 1, isoDate: 1, appDate: 1,
                creationPlace: 1, creditLine: 1, expandedHeight: 1,
                expandedWidth: 1, expandedAspectRatio: 1, thumbWidth: 1,
                thumbHeight: 1, labelTextEnglish: 1, labelTextSpanish: 1
            }
        }
    );
    var returnObj = [
        currentLocation,
        currentLocationImages
    ];
    return returnObj;
});

/**
 * Publish all Images
 */
Meteor.publish('allImages', function() {
    return Images.find();
});

