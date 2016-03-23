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

Meteor.publish('allLocations', function () {

  /**
  * Establish the size of the image collection so that we can select random
  * elements within it.
  */
  var activeLocIds = _.range(1, 22);
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
    $or: [],
  };

  /**
  * Currently a hack
  *
  * Sometimes this will return and empoty result.
  *
  * I need to pull the random numbers from a specific list of horizontal images.
  * But for now this returns enough images to work for some of the other issues.
  */
  _.each(activeLocIds, function (activeLocId) {
    // Find the IDs of all the images that are horizontal
    result = Images.find({
      $and: [
        { dsLocId: activeLocId },
        { active: true },
        { thumbAspectRatio: { $gt: 1 } },
      ],
    },
    {
      fields: { dsLocId: 1 },
    });

    // Pick a random ID from the horizontal images
    var items = result.fetch();
    var randId = '';
    if (items.length > 0) {
      var randId = items[Math.floor(Math.random() * items.length)]._id;
    }

    // Add to our query, selecting for the location and random _id
    query['$or'].push({
      $and: [{ dsLocId: activeLocId }, { _id: randId }],
    });

  });

  var eachLocation = Locations.find(
    {},
    {
      fields: {
        dsLocId: 1, latitude: 1, longitude: 1, link: 1, title: 1,
      },
    }
  );

  var randomLocationImages = Images.find(
    query,
    {
      fields: {
        _id: 1, dsLocId: 1, thumbHeight: 1, thumbWidth: 1,
        generalLocationDs: 1, imageFilePaths: 1, active: 1,
      },
    }
  );

  return [
    eachLocation,
    randomLocationImages,
  ];

});

/**
* Publish a single location
*/
Meteor.publish('singleLocation', function (link, filterInactive) {

  /**
  * Get current location so that we can filter images
  * only to this location.
  */
  var currentLocation = Locations.find({ link: link });
  var currentLocationObject = currentLocation.fetch();
  var currentLocId = parseInt(currentLocationObject[0].dsLocId);
  var filter;
  if (filterInactive) {
    // Only deliver active images.
    filter = { dsLocId: currentLocId, active: true };
  } else {
    // Deliver all images.
    filter = { dsLocId: currentLocId };
  }

  var currentLocationImages = Images.find(
    filter,
    {
      fields: {
        _id: 1, dsLocId: 1, title: 1, isoDate: 1, appDate: 1, generalLocationDs:1,
        creationPlace: 1, creditLine: 1, expandedHeight: 1,
        expandedWidth: 1, expandedAspectRatio: 1, thumbWidth: 1,
        thumbHeight: 1, thumbAspectRatio: 1, labelTextEnglish: 1, labelTextSpanish: 1,
        imageFilePaths: 1, active: 1, dsNumber: 1,
      },
    }
  );
  var returnObj = [
    currentLocation,
    currentLocationImages,
  ];
  return returnObj;
});

/**
* Publish all Images
*/
Meteor.publish('allImages', function () {
  return Images.find();
});

/**
* Publish all Image Files
*/
Meteor.publish('allImageFiles', function () {
  return ImageFiles.find();
});
