/**
 * Locations
 *
 * Code related to the locations template
 */

Template.locations.created = function () {
    //
};

Template.locations.helpers({
    //
});

/**
 * Code executed once the page is loaded and rendered
 */
Template.locations.rendered = function () {

    /**
     * Set the map projection to a Southern California focus
     *
     * This will need to be reprojected if the background map raster changes
     */
    var projection = d3.geo.mercator()
        .scale(13168)
        .center([-119.082, 34.656])
        .precision(0.1);

    /**
     * Dev map features
     *
     * Useful for dev map registrion. Normally disabled
     */
    //devMapFeatures(d3, projection);

    /**
     * Initiate the SVG object for drawing all the location markers
     */
    // TODO: read this in from the LESS
    var width = 1920;
    var height = 1080;
    var svg = d3.select(".container").append("svg")
        .attr("class", 'svg-canvas')
        .attr("width", width)
        .attr("height", height);

    /**
     * Load the meteor collection for Locations and Images
     */
    Deps.autorun(function () {

        //
        // Not sure why but we need to wait a few milliseconds before
        // asking for the images object from MiniMongo. otherwise we'll Get
        // the previous page's collection, which includes all the images for
        // that location, resulting in tens of images animating into place
        //
        window.setTimeout(function() {
            renderLocations();
        }, 200);

        function renderLocations() {

            /**
             * Draw each location
             */
            var locations = Locations.find().fetch();
            _.each(locations, function(location, i) {
                drawLocation(svg, projection, location, i);
            });

            /**
             * Draw each image
             *
             * TODO:
             * Actually I think that this will be our primary collection. I might
             * move this into a seperate collection at some point.
             *
             */
            var images = Images.find().fetch();
            console.log('images', images);
            images = _.shuffle(images);
            console.log('shuffled images', images);
            _.each(images, function(image, i) {
                drawImage(svg, projection, image, i);
            });
        }
    });

    function drawLocation(svg, projection, location, i) {
        /**
        * Use D3's projection manipulation to turn the long, lat coordinates into
        * tralation measurements.
        * Transform is a basic SVG attribute, and translate is a type of
        * transformation.
        */
        position = projection([location.longitude,location.latitude]);

        /**
         * Draw a white background first
         *
         * This serves as the matte for a shadow and also gives us a old
         * skoool white border around the photo.
         */
        //svg.append('rect')
        //.attr("transform", function() {
        //return "translate(" + projection([location.longitude,location.latitude]) + ")";
        //})
        //.attr("width", 300)
        //.attr("height", 250)
        //.attr('stroke', 'white')
        //.attr('stroke-width', '10')
        //.attr('class', 'location-matte');

        //clipId = 'special-' + i;
        //svg.append('clipPath')
        //.attr("id", clipId)
        /**
         * Clip with a circle that bounces in from its center
         */
        ////.append('circle')
        ////.attr("transform", function() {
        ////return "translate(" + projection([location.longitude,location.latitude]) + ")";
        ////})
        ////.attr("r", .01)
        ////.transition()
        ////.attr("r", 90)
        ////.duration(300)
        ////.delay(i * 200) // Stagger the markers animating in
        ////.transition()
        ////.attr("r", 40)
        ////.duration(100)
        ////.transition()
        ////.attr("r", 80)
        ////.duration(80)

        /**
         * Clip the image with a rectangle
         */
        //.append('rect')
        //.attr("transform", function() {
        //return "translate(" + projection([location.longitude,location.latitude]) + ")";
        //})
        //.attr("width", 300)
        //.attr("height", 250)

        //.attr('clip-path', clipIdUrl)
        //.attr("transform", function() {
        //return "translate(" + projection([location.longitude,location.latitude]) + ")";
        //})
        //.attr("r", 40);

        //clipIdUrl = 'url(#' + clipId + ')';
        //svg.append('image')
        //.attr("xlink:href", "/images/house.jpg")
        //.attr("width", "600")
        //.attr("height", "400")
        //.attr("x", (position[0]-100))
        //.attr("y", (position[1]-100))
        //.attr("clip-path", clipIdUrl);

        /**
         * Reference dot to show where the location lat long is pointing
         *
         * This should be turned off in the final version.
         */
        svg.append('circle')
            .attr("r", 10)
            .attr("transform", function() {
                    return "translate(" + projection([location.longitude,location.latitude]) + ")";
                    })
        .attr("class", 'location-ref-marker');

        /**
         * Append an image at a specific location
         *
         * This is for reference, now that we're appending images
         * per marker.
         */
            //svg.append("svg:image")
            //.attr("xlink:href", "/images/house.jpg")
            //.attr("x", position[0])
            //.attr("y", position[1])
            //.attr("width", "200")
            //.attr("height", "182")
            //.transition()
            //.attr("width", "400")
            //.attr("height", "282")
            //.duration(800);
    }

    function drawImage(svg, projection, image, i) {

        position = projection([image.longitude, image.latitude]);

        // Old skool border width
        var imageBorder = 5;

        // Group for all the picture elements
        var pictureGroup = svg.append("g")
            .attr('class', 'picture-group');

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

    function devMapFeatures(d3, projection) {
        /**
         * Test map data to position the map projection
         *
         * These don't need to be shown in the final map, but keep them here.
         * If the background raster map changes, we will need this data to
         * reproject the D3 map so that the location markers are correct.
         */

        var path = d3.geo.path()
        .projection(projection);

        d3.json("/data/salton.json", function(error, salton) {
        svg.append("path")
            .datum(topojson.feature(salton, salton.objects.salton))
            .attr("d", path)
            .attr("class", 'water');
        });

        d3.json("/data/i15.json", function(error, i15) {
        svg.append("path")
        .datum(topojson.feature(i15, i15.objects.i15))
            .attr("d", path)
            .attr("class", 'road');
        });

        /**
         * Solid state polygon.
         * Only really useful for positioning the wiggly part of the Colorado
         * River in Mexico.
         */
        d3.json("/data/states.json", function(error, states) {
            svg.append("path")
            .datum(topojson.feature(states, states.objects.states))
            .attr("d", path)
            .attr("class", 'states');
        });

        /**
         * Cities markers
         */
        d3.json("/data/cities.json", function(error, cities) {
            svg.append("path")
            .datum(topojson.feature(cities, cities.objects.cities))
            .attr("d", path)
            .attr("class", 'cities');
        });

    }

};

Template.locations.events({
    /**
     * Image click
     */
    'click image':function(event, template){

        var animateContentOut = function() {
            var imagePositions = d3.selectAll('image').attr('x');
            d3.selectAll("image").each( function(d, i){

                x = Number(d3.select(this).attr("x"));
                y = Number(d3.select(this).attr("y"));

                width = Number(d3.select(this).attr("width"));
                height = Number(d3.select(this).attr("height"));

                centerX = parseInt(x + (width / 2));
                centerY = parseInt(y + (height / 2));

                var pictureGroup = d3.select(this.parentNode)
                    .transition()
                    .delay(i * 75) // Stagger the markers animating out
                    .attr("transform", function (){
                        transform = 'translate(' + centerX + ',' + centerY + ')scale(0)';
                        return transform;
                    })
                    .duration(500);

            });
        };
        animateContentOut();

        window.setTimeout(function() {
            goDestination();
        }, 500);

        function goDestination() {
            // Get the clicked location string from the COM data-location attribute
            var imageLocation = $(event.currentTarget).data("location");
            var clickedImage  = $(event.currentTarget).data("id");
            console.log('clickedImage - ', clickedImage);
            // Query Mongo for a location with a matching title
            var clickedLocation = Locations.findOne( {title: imageLocation });
            // Navigate to the Location with the matching _id
            Router.go(
                'location',
                {link: clickedLocation.link},
                {query: {image: clickedImage}}
            );
        }

    }
});

