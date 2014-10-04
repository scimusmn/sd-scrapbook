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

    console.log('Locations collection = ', Locations);
    console.log('Images collection = ', Images);

    /**
     * Setup image area
     */
    var width = 1920 - 100;
    var height = 1080 - 100;
    var svg = d3.select(".images").append("svg")
        .attr("class", 'svg-canvas')
        .attr("width", width)
        .attr("height", height);

    Deps.autorun(function () {
        /**
         * Draw each image
         */
        var images = Images.find().fetch();
        console.log('Images to draw', images);
        //images = _.shuffle(images);
        _.each(images, function(image, i) {
            drawImage(svg, image, i);
        });
    });

    function drawImage(svg, image, i) {

        // Totally stand in dummy position for testing
        position = [300, 400];

        /**
         * Draw the title
         *
         * We probably won't use this on the final map.
         */
        svg.append('svg:text')
            .attr("x", position[0] - 100)
            .attr("y", position[1] - 110)
            .attr("class", 'location-title')
            .text(image.title);

        // Old skool border width
        var imageBorder = 5;

        // Group for all the picture elements
        var pictureGroup = svg.append("g")
            .attr('class', 'picture-group')

        var filter = pictureGroup.append("defs")
        .append("filter")
            .attr("id", "blur")
        .append("feGaussianBlur")
            .attr("stdDeviation", 5);

        // Drop shadow rectangle
        pictureGroup.append('rect')
            .attr("width", "0")
            .attr("height", "0")
            .attr("opacity", ".1")
            .attr("x", (position[0]))
            .attr("y", (position[1]))
            .style('fill', '#000')
            .transition()
            .delay(i * 50) // Stagger the markers animating in
            // Simulate scaling form the center of the image
            .attr("x", (position[0]) - (image.thumbWidth / 2))
            .attr("y", (position[1]) - (image.thumbHeight / 2))
            .attr("width", image.thumbWidth + (imageBorder * 2))
            .attr("height", image.thumbHeight + (imageBorder * 2))
            .attr("opacity", "1")
            .attr("filter", "url(#blur)")
            .duration(500);

        // White border rectangle
        pictureGroup.append('rect')
            .attr("width", "0")
            .attr("height", "0")
            .attr("opacity", ".1")
            .attr("x", (position[0]))
            .attr("y", (position[1]))
            .attr('class', 'location-matte')
            .transition()
            .delay(i * 50) // Stagger the markers animating in
            // Simulate scaling form the center of the image
            .attr("x", (position[0]) - (image.thumbWidth / 2))
            .attr("y", (position[1]) - (image.thumbHeight / 2))
            .attr("width", image.thumbWidth + (imageBorder * 2))
            .attr("height", image.thumbHeight + (imageBorder * 2))
            .attr("opacity", "1")
            .duration(500);

        // Image
        pictureGroup.append('image')
            .attr("xlink:href", "/images/thumbnails/" + image._id + ".jpg")
            .attr("data-id", image._id)
            .attr("data-location", image.generalLocationDs)
            .attr("width", "0")
            .attr("height", "0")
            .attr("opacity", ".1")
            .attr("x", (position[0] + imageBorder))
            .attr("y", (position[1] + imageBorder))
            .transition()
            .delay(i * 50) // Stagger the markers animating in
            // Simulate scaling form the center of the image
            .attr("x", (position[0] + imageBorder) - (image.thumbWidth / 2))
            .attr("y", (position[1] + imageBorder) - (image.thumbHeight / 2))
            .attr("width", image.thumbWidth)
            .attr("height", image.thumbHeight)
            .attr("opacity", "1")
            .attr('location', image.generalLocationDs)
            .duration(500);
    }



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
