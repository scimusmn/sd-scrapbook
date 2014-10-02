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
        .precision(.1);


    var path = d3.geo.path()
        .projection(projection);


    /**
     * City markers
     */
    devMapFeatures(d3, projection);

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
     * Load the meteor collection for the Locations
     */
    Deps.autorun(function () {
        var locations = Locations.find().fetch();
        var images = Images.find().fetch();
        _.each(locations, function(location, i) {

            /**
             * Use D3's projection manipulation to turn the long, lat coordinates into
             * tralation measurements.
             * Transform is a basic SVG attribute, and translate is a type of
             * transformation.
             *
             * Position the circles at the center of the map at first and then
             * move them to their real location with a transition.
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
             * Finally draw a placename
             */
            svg.append('svg:text')
                .attr("x", position[0])
                .attr("y", position[1])
                .attr("class", 'location-title')
                .text(location.title);

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
                .attr("class", 'location-ref-marker')

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
        });

        /**
         * Images
         *
         * Actually I think that this will be our primary collection. I might
         * move this into a seperate collection at some point.
         *
         */
        images = _.shuffle(images);
        _.each(images, function(image, i) {
            console.log('Image: Title - ', image.title + '; Latitude - ' + image.latitude + '; Longitude - ' + image.longitude );
            position = projection([image.longitude, image.latitude]);
            console.log('img ID', image._id);

            /**
             * Draw a white background first
             *
             * This serves as the matte for a shadow and also gives us a old
             * skoool white border around the photo.
             */
            //svg.append('rect')
                //.attr("transform", function() {
                    //return "translate(" + position + ") scale(0.1)";
                //})
                //.attr("width", 300)
                //.attr("height", 250)
                //.attr('stroke', 'white')
                //.attr('stroke-width', '10')
                //.attr('class', 'location-matte')
                //.transition()
                //.delay(i * 100) // Stagger the markers animating in
                //.attr("transform", function() {
                    //return "translate(" + position + ") scale(1, 1)";
                //})
                //.duration(200);
            svg.append('svg:text')
                .attr("x", position[0])
                .attr("y", position[1])
                .attr("class", 'location-title')
                .text(image.title);

            var img = new Image();
            var imgWidth = '';
            var imgHeight = '';
            var imgRatio = '';


            svg.append('image')
                .attr("xlink:href", "/images/thumbnails/" + image._id + ".jpg")
                .attr("width", "0")
                .attr("height", "0")
                .attr("opacity", ".1")
                .attr("x", (position[0]-100))
                .attr("y", (position[1]-100))
                .attr('class', 'location-matte')
                .transition()
                .delay(i * 50) // Stagger the markers animating in
                .attr("width", image.thumbWidth)
                .attr("height", image.thumbHeight)
                .attr("opacity", "1")
                .duration(500);

            //img.onload = function() {

              //imgWidth = this.width;
              //imgHeight = this.height;
              //console.log('DIMENSIONS: ',  imgWidth, imgHeight);

                ////.transition()
                ////.delay(i * 100) // Stagger the markers animating in
                ////.attr("transform", function() {
                    ////return "translate(" + position + ") scale(1, 1)";
                ////})

            //}
            //imgRatio = (parseInt(imgWidth) / parseInt(imgHeight));
            //console.log('ratio', imgRatio);
            //img.src = "/images/source-photos/" + image._id + ".jpg";
            //imgScaledHeight = Math.round(parseInt(imgWidth) * imgRatio);
            //console.log('scaled height: ', imgScaledHeight);
        });
    });


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
    // Respond to events
});

