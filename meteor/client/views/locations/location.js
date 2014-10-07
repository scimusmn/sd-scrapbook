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

    /**
     * Setup image area
     */
    var width = 1920 - 100;
    var height = 1080 - 100;
    var svg = d3.select(".images").append("svg")
        .attr("class", 'svg-canvas')
        .attr("width", width)
        .attr("height", height);

    /**
     * Setup timeline area
     */
    var time = d3.select(".time").append("svg")
        .attr("class", 'time-canvas')
        .attr("width", width - 60)
        .attr("height", 300);

    /**
     * We have to do our D3 stuff in here because of Meteor's client server
     * stuff. I don't exactly understand...
     *
     * TODO: Research
     */
    Deps.autorun(function () {
        /**
         * Wait for a half-second to let the collections load.
         *
         * TODO: figure out why we need to do this. Before I was doing this,
         * the image counts would get set three times with successively
         * increasing numbers.
         */
        window.setTimeout(function() {
            renderLocation();
        }, 500);

        function renderLocation() {
            /**
             * Render each image
             */
            var imagesCursor = Images.find();
            var imagesCount = imagesCursor.count();
            var images = imagesCursor.fetch();
            images = _.sortBy(images, function(image) {
                return image.date;
            });
            widthInterval = parseInt((width - 100) / imagesCount);
            _.each(images, function(image, i) {
                drawImage(svg, image, i, widthInterval);
            });

            /**
             * Print the start and end years of the timeline
             */
            // Start
            time.append('svg:text')
                .attr("x", 10)
                .attr("y", 35)
                .attr("class", 'time-label-start')
                .text('1800');

            // End
            time.append('svg:text')
                .attr("x", 1675)
                .attr("y", 35)
                .attr("class", 'time-label-end')
                .text('2000');

            /**
             * Render the timeline handle
             */
            time.append('rect')
                .attr("width", "50")
                .attr("height", "50")
                .attr('class', 'time-handle-rect')
                .attr("x", 0)
                .attr("y", 0);

        };
    });

    /**
     * Render each image
     */
    function drawImage(svg, image, i, widthInterval) {
        /**
         * Image properties
         */
        var x = ((100 + (widthInterval * (i+1))) - widthInterval );
        var y = 700;
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
