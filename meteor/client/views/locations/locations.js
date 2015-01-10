/**
 * Locations
 *
 * Map view of all locations.
 * This shows a random picture from each location set.
 */

// Enable dev features
var enableDevMap = false;
var enableDevLocIds = false;

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
        //.scale(16160)
        .scale(19225)
        // bigger right, bigger up
        .center([-118.616, 34.048])
        .precision(0.1);

    /**
     * Dev map features
     *
     * These are a set of lines and points that are useful for setting the
     * projection values if the map scale or pan changes.
     *
     * These are disabled in prodcution.
     */
    if (enableDevMap) {
        devMapFeatures(d3, projection);
    }

    /**
     * Initiate the SVG object for drawing all the location markers
     */
    // TODO: read this in from the LESS
    var width = 1920;
    var height = 1080;
    var svg = d3.select('.container')
        .append('svg')
        .attr('class', 'svg-canvas')
        .attr('width', width)
        .attr('height', height);

    /**
     * Wait for Meteor to finish loading server data
     */

    /**
     * Locations
     *
     * Loop through each location, drawing pins and defining
     * the positional details which we'll use for the images
     */
    var locations = Locations.find().fetch();
    var positions = drawLocations(projection, svg, locations);

    /**
     * Images
     *
     * Draw all the images, one for each location.
     */
    window.setTimeout(function() {
        var images = Images.find().fetch();
        drawImages(projection, svg, positions, images);
    }, 300);



    /**
     * Draw all locations
     *
     * Returns and object of the Location IDs with pixel equivelemtns
     * of their lat, long coordinates
     */
    function drawLocations(projection, svg, locations) {
        var positions = [];
        _.each(locations, function(location) {

            // Define the position
            var position = projection([location.longitude,location.latitude]);

            positions[location.dsLocId] = {
                latitude: location.latitude,
                longitude: location.longitude
            };

            /**
             * Dev location IDs
             *
             * This prints the location ID near each location marker for development work.
             *
             * This is disabled in production.
             */
            if (enableDevLocIds) {
                svg.append('text')
                .attr('x', position[0] - 5)
                .attr('y', position[1] - 2)
                .text(location.dsLocId)
                .attr('font-family', 'Courier')
                .attr('font-size', '20px')
                .attr('fill', 'white')
                .attr('stroke-width', 1.5)
                .attr('stroke', '#000');
            }

        });
        return positions;
    }

    /**
     * Draw all images
     */
    function drawImages(projection, svg, positions, images) {

        _.each(images, function(image, i) {

            // Location marker position
            var latitude = positions[image.dsLocId].latitude;
            var longitude = positions[image.dsLocId].longitude;
            var markerPosition = projection([longitude, latitude]);

            // Image position
            var offsets = defineImageOffsets(image.dsLocId);
            var xOffset = offsets[0];
            var yOffset = offsets[1];
            var imagePosition = projection([
                (parseFloat(longitude) + xOffset),
                (parseFloat(latitude) + yOffset)
            ]);

            // Draw the individual image
            drawImage(projection, svg, markerPosition, imagePosition, image, i);

            /**
             * Draw the line connecting the marker pin and the image pin
             */
            drawString(projection, svg, markerPosition, imagePosition, xOffset, yOffset, image);

        });
    }

    /**
     * Draw one image
     */
    function drawImage(projection, svg, markerPosition, imagePosition, image, i) {

        // Old skool border width
        var imageBorder = 5;
        // Max character length in location name
        var locationLength = 20;

        var centerX = imagePosition[0];
        var centerY = imagePosition[1];
        // Group for all the picture elements
        var pictureGroup = svg.append('g');

        var boxWidth = image.thumbWidth + (imageBorder * 2);
        var boxHeight = image.thumbHeight + (imageBorder * 2) + 40;

        // Drop shadow rectangle
        pictureGroup.append('defs')
            .append('filter')
            .attr('id', 'blur')
            .append('feGaussianBlur')
            .attr('stdDeviation', 5);
        pictureGroup.append('rect')
            .attr('width', boxWidth)
            .attr('height', boxHeight)
            .attr('opacity', '1')
            .attr('x', 3)
            .attr('y', 3)
            .style('fill', '#000')
            .attr('filter', 'url(#blur)');

        // White border rectangle
        pictureGroup.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', boxWidth)
            .attr('height', boxHeight)
            .attr('opacity', '1')
            .attr('class', 'location-matte');

        // Write a short version of the locaiton name
        var imageName = image.generalLocationDs;
        if (imageName.length > locationLength ) {
            imageName = imageName.substring(0,locationLength) + '...';
        }
        pictureGroup.append('text')
            .attr('x', 10)
            .attr('y', image.thumbHeight + 37)
            .text(imageName)
            .attr('font-family', 'Amatic SC')
            .attr('font-size', '26px')
            .attr('fill', '#663233');

        // Image
        pictureGroup.append('image')
            .attr('x', imageBorder)
            .attr('y', imageBorder)
            .attr('width', image.thumbWidth)
            .attr('height', image.thumbHeight)
            .attr('opacity', '1')
            .attr('xlink:href', '/images/thumbnails/' + image._id + '.jpg')
            .attr('data-id', image._id)
            .attr('data-locid', image.dsLocId)
            .attr('data-location', image.generalLocationDs);

        // Starting state for picture group
        pictureGroup
            .attr('opacity', '0')
            .attr('class', 'picture-group')
            .attr('data-locid', image.dsLocId)
            .attr('transform', function (){
                return 'scale(.1), translate(' + (centerX / 0.1) + ', ' + (centerY / 0.1) + ')';
            });

        imagePosition = [imagePosition[0], ((imagePosition[1] - (image.thumbHeight/ 2) - 5) + 15)];
        Meteor.svgRecipes.drawPin(svg, imagePosition);

        // Animate picture group to full size
        pictureGroup
            .transition()
            .attr('opacity', '1')
            .attr('transform', function (){
                var transform =
                    'rotate(' + _.random(-2,2) + ', ' +
                        ( centerX - ( image.thumbWidth / 2 ) ) + ', ' +
                        ( centerY - ( image.thumbHeight / 2 ) ) +
                    '),' +
                    'scale(1),' +
                    'translate(' +
                        ( centerX - ( image.thumbWidth / 2 ) ) + ', ' +
                        ( centerY - ( image.thumbHeight / 2 ) ) +
                    ')';
                return transform;
            })
            .duration(300)
            .delay(i * 30); // Stagger the markers animating in
    }

    function drawString(projection, svg, markerPosition, imagePosition, xOffset, yOffset, image) {
        var markerX = parseFloat(markerPosition[0]);
        var markerY = parseFloat(markerPosition[1]);

        var imagePinX = imagePosition[0];
        var imagePinY = (imagePosition[1] - (2*(image.thumbHeight / 5)));

        // Check to see if the image is above or below the marker
        var lineMidX;
        var lineMidY;
        var lineStroke = '#DDDFE0';
        //
        // Image is SW of the marker
        //
        if ((markerX > imagePinX) && (markerY < imagePinY)) {
            lineMidX = imagePinX + ((markerX - imagePinX) / 2) + 20;
            lineMidY = markerY - (markerY - imagePinY) / 2;
            lineStroke = 'white';
        }
        // Image is NW of marker
        else if ((markerX > imagePinX) && (markerY > imagePinY)){
            lineMidX = imagePinX + ((markerX - imagePinX) / 2 ) - 20;
            lineMidY = markerY - (markerY - imagePinY) / 2;
            lineStroke = 'white';
        }
        // Image is NE of marker
        else if ((markerX < imagePinX) && (markerY > imagePinY)){
            lineMidX = markerX + ((imagePinX - markerX) / 2 ) + 20;
            lineMidY = markerY - (markerY - imagePinY) / 2;
        }
        // Image is SE of marker
        else {
            lineMidX = markerX + ((imagePinX - markerX) / 2 );
            lineMidY = markerY + ((imagePinY - markerY) / 2 ) + 10;
            lineStroke = 'white';
        }

        var lineData = [
            { 'x': markerX, 'y': markerY + 16.5 - 15},
            { 'x': lineMidX, 'y': lineMidY},
            //{ 'x': (imagePosition[0] + 50), 'y': (imagePosition[1] + ((markerPosition[1] - imagePosition[1]) / 2))},
            { 'x': imagePosition[0], 'y': imagePinY}
        ];

        // Curve type
        // https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate

        var lineFunction = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate('basis');

        /**
         * Only display pin lines if the offset isn't 0
         */
        if (xOffset !== 0 && yOffset !== 0) {
            // Draw a pin at the location position
            Meteor.svgRecipes.drawPin(svg, [markerX, markerY]);

            var stringGroup = svg.append('g');

            stringGroup.append('path')
                .attr('d', lineFunction(lineData))
                .attr('stroke-width', 1.2)
                .attr('fill', 'none')
                .attr('stroke', lineStroke);

            stringGroup.append('defs')
                .append('filter')
                .attr('id', 'line-blur')
                .append('feGaussianBlur')
                .attr('stdDeviation', 4);
            stringGroup.append('path')
                .attr('d', lineFunction(lineData))
                .attr('stroke-width', 1.6)
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('transform', function (){
                    var transform = 'translate(0,2)';
                    return transform;
                })
                .attr('filter', 'url(#line-blur)');

            stringGroup
                .attr('class', 'string-group');

        }
    }


    /**
     * Define manual offsets for each specific location
     */
    function defineImageOffsets(locId) {
        var xOffset;
        var yOffset;
        if (locId == '1') {
            xOffset = 0;
            yOffset = 0;
            //xOffset = 0.3;
            //yOffset = -0.2;
        }
        else if (locId == '2') {
            xOffset = 0;
            yOffset = 0;
        }
        else if (locId == '3') {
            xOffset = 0;
            yOffset = 0;
            //xOffset = -0.1;
            //yOffset = -0.3;
        }
        else if (locId == '4') {
            xOffset = 0;
            yOffset = 0;
        }
        else if (locId == '5') {
            xOffset = 0;
            yOffset = 0;
        }
        else if (locId == '6') {
            xOffset = -0.45;
            yOffset = 0.2;
        }
        else if (locId == '7') {
            xOffset = 0;
            yOffset = 0;
        }
        else if (locId == '8') {
            xOffset = 0;
            yOffset = 0;
        }
        else if (locId == '9') {
            xOffset = 0;
            yOffset = 0;
        }
        else if (locId == '10') {
            xOffset = 0;
            yOffset = 0;
        }
        else if (locId == '11') {
            xOffset = 0;
            yOffset = 0;
        }
        else if (locId == '12') {
            xOffset = 0;
            yOffset = 0;
        }
        else if (locId == '13') {
            xOffset = -0.15;
            yOffset = -0.4;
        }
        else if (locId == '14') {
            xOffset = -0.5;
            yOffset = -0.1;
        }
        else if (locId == '15') {
            xOffset = 0;
            yOffset = 0;
        }
        else if (locId == '17') {
            xOffset = 0;
            yOffset = 0;
        }
        else if (locId == '18') {
            xOffset = 0;
            yOffset = 0;
        }
        else if (locId == '19') {
            xOffset = 0;
            yOffset = 0;
        }
        else if (locId == '20') {
            xOffset = 0;
            yOffset = 0;
        }
        else if (locId == '21') {
            xOffset = 0;
            yOffset = 0;
        }
        else {
            xOffset = 0;
            yOffset = 0;
        }

        var offsets = [xOffset, yOffset];
        return offsets;
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

        d3.json('/data/salton.json', function(error, salton) {
        svg.append('path')
            .datum(topojson.feature(salton, salton.objects.salton))
            .attr('d', path)
            .attr('class', 'water');
        });

        d3.json('/data/i15.json', function(error, i15) {
        svg.append('path')
        .datum(topojson.feature(i15, i15.objects.i15))
            .attr('d', path)
            .attr('class', 'road');
        });

        /**
         * Solid state polygon.
         * Only really useful for positioning the wiggly part of the Colorado
         * River in Mexico.
         */
        d3.json('/data/states.json', function(error, states) {
            svg.append('path')
            .datum(topojson.feature(states, states.objects.states))
            .attr('d', path)
            .attr('class', 'states');
        });

        /**
         * Cities markers
         */
        d3.json('/data/cities.json', function(error, cities) {
            svg.append('path')
            .datum(topojson.feature(cities, cities.objects.cities))
            .attr('d', path)
            .attr('class', 'cities');
        });

    }

};

Template.locations.events({
    /**
     * Image click
     */
    'click g.picture-group':function(e){

        var animateContentOut = function() {

            var width, height, t;
            d3.selectAll('image').each( function(d, i){

                // Get the image dimensions
                width = Number(d3.select(this).attr('width'));
                height = Number(d3.select(this).attr('height'));

                // Get the current transform object
                t = d3.transform(d3.select(this.parentNode).attr('transform'));

                // Scale to zero from the center
                t.scale = [0, 0];
                t.translate[0] = t.translate[0] + ( width / 2 );
                t.translate[1] = t.translate[1] + ( height / 2 );
                var transformString = t.toString();

                // Only this one has problems
                d3.selectAll('.string-group')
                    .transition()
                    .delay(i * 20)
                    .attr('opacity', '0')
                    .duration(400);
                d3.selectAll('.pin-group')
                    .transition()
                    .delay(i * 20)
                    .attr('opacity', '0')
                    .attr('transform', transformString)
                    .duration(400);
                d3.select(this.parentNode)
                    .transition()
                    .delay(i * 20)
                    .attr('opacity', '0')
                    .attr('transform', transformString)
                    .duration(400);
            });
        };
        animateContentOut();

        window.setTimeout(function() {
            goDestination();
        }, 600);

        function goDestination() {
            // Get the clicked location string from the COM data-location attribute
            var imageLocation = String($(e.currentTarget).data('locid'));
            var clickedImage = $('image[data-locid="' + imageLocation + '"]').data('id');

            // Query Mongo for a location with a matching title
            var clickedLocation = Locations.findOne( {dsLocId: imageLocation });
            // Navigate to the Location with the matching _id
            Router.go(
                'location',
                {link: clickedLocation.link},
                {query: {image: clickedImage}}
            );
        }

    }
});

