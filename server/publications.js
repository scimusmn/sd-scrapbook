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
    var imagesCount = Images.find({}).count();
    console.log(imagesCount);

    var randNum = Math.floor((Math.random() * (imagesCount - 1) ) + 1);
    console.log('rand', randNum);
    return [
        Locations.find(),
        //Images.find( {}, { title: 1, longitude: 1, latitude: 1, photographer: 1}).skip(randNum).limit(1)


        Images.find( {}, {'title':1, longitude: 1, latitude: 1, skip: randNum, limit: 1})
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

