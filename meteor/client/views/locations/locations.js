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
     * Load the meteor collection for Locations and Images
     */
    Deps.autorun(function () {

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
         * Draw one image for each location
         */
        var images = Images.find().fetch();

        //
        // Shuffle images so that they draw in a random order
        //
        images = _.shuffle(images);

        _.each(images, function(image, i) {
            var latitude = positions[image.dsLocId].latitude;
            var longitude = positions[image.dsLocId].longitude;

            //
            // Position images using custom offsets for each location
            //
            var xOffset;
            var yOffset;
            if (image.dsLocId == '1') {
                xOffset = 0.3;
                yOffset = -0.2;
            }
            else if (image.dsLocId == '2') {
                xOffset = -0.1;
                yOffset = -0.4;
            }
            else if (image.dsLocId == '3') {
                xOffset = -0.1;
                yOffset = -0.3;
            }
            else if (image.dsLocId == '4') {
                xOffset = 0;
                yOffset = 0;
            }
            else if (image.dsLocId == '5') {
                xOffset = 0.4;
                yOffset = 0.05;
            }
            else if (image.dsLocId == '6') {
                xOffset = -0.4;
                yOffset = -0.05;
            }
            else if (image.dsLocId == '7') {
                xOffset = 0.6;
                yOffset = -1.5;
            }
            else if (image.dsLocId == '8') {
                xOffset = 0;
                yOffset = 0;
            }
            else if (image.dsLocId == '9') {
                xOffset = 0;
                yOffset = 0;
            }
            else if (image.dsLocId == '10') {
                xOffset = 0.4;
                yOffset = 0.1;
            }
            else if (image.dsLocId == '11') {
                xOffset = 0.2;
                yOffset = -0.3;
            }
            else if (image.dsLocId == '12') {
                xOffset = 0.35;
                yOffset = 0.1;
            }
            else if (image.dsLocId == '13') {
                xOffset = -0.2;
                yOffset = -0.35;
            }
            else if (image.dsLocId == '14') {
                xOffset = -1.1;
                yOffset = -0.3;
            }
            else if (image.dsLocId == '15') {
                xOffset = -0.4;
                yOffset = 0.05;
            }
            else if (image.dsLocId == '17') {
                xOffset = -0.1;
                yOffset = -0.2;
            }
            else if (image.dsLocId == '18') {
                xOffset = 0.4;
                yOffset = -0.3;
            }
            else if (image.dsLocId == '19') {
                xOffset = -0.2;
                yOffset = -0.4;
            }
            else if (image.dsLocId == '20') {
                xOffset = 0.2;
                yOffset = 0.3;
            }
            else if (image.dsLocId == '21') {
                xOffset = 0.05;
                yOffset = -0.3;
            }
            else {
                xOffset = 0;
                yOffset = 0;
            }

            /**
             * Define positions for image and the marker
             */
            var markerPosition = projection([longitude, latitude]);
            var imagePosition = projection([(parseFloat(longitude) + xOffset), (parseFloat(latitude) + yOffset)]);

            /**
             * Draw the image
             */
            drawImage(svg, projection, markerPosition, imagePosition, image, i);

            /**
             * Draw the line connecting the marker pin and the image pin
             */
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
                svg.append('path')
                    .attr('d', lineFunction(lineData))
                    .attr('stroke-width', 1.2)
                    .attr('fill', 'none')
                    .attr('stroke', lineStroke);

                svg.append('defs')
                    .append('filter')
                    .attr('id', 'line-blur')
                    .append('feGaussianBlur')
                    .attr('stdDeviation', 4);
                svg.append('path')
                    .attr('d', lineFunction(lineData))
                    .attr('stroke-width', 1.6)
                    .attr('fill', 'none')
                    .attr('stroke', 'black')
                    .attr('transform', function (){
                        var transform = 'translate(0,2)';
                        return transform;
                    })
                    .attr('filter', 'url(#line-blur)');
            }

        });

    });

    /**
     * Draw each location
     *
     * Returns and object of the Location IDs with pixel equivelemtns
     * of their lat, long coordinates
     */
    function drawLocations(projection, svg, locations) {
        var positions = [];
        _.each(locations, function(location) {

            // Define the position
            var position = projection([location.longitude,location.latitude]);

            // Draw a pin at the location position
            drawPin(svg, position);

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

    function drawPin(svg, position) {

        // Pin location

        // Randomize the pin rotation
        var randPin = _.random(0, 2);
        var pinRotate;
        if (randPin === 0) {
            pinRotate = 0;
        }
        else if (randPin == 1) {
            pinRotate = -5;
        }
        else {
            pinRotate = 5;
        }

        /**
         * Pin Group
         */
        var pinGroup = svg.append('g');

        pinGroup
            .attr('width', '200')
            .attr('height', '200');

        var pinHeadRadius = 5;
        var pinBodyWidth = 2;
        var pinBodyHeight = 15;

        /**
         * Blur filters
         *
         * We make a couple filters of differing blurs
         *
         * We also make the filter bigger to be to prevent clipping
         */
        pinGroup.append('defs')
            .append('filter')
            .attr('id', 'pin-blur-tight')
            .attr('x', '-100')
            .attr('y', '-100')
            .attr('width', '200')
            .attr('height', '200')
            .append('feGaussianBlur')
            .attr('stdDeviation', 2);

        pinGroup.append('defs')
            .append('filter')
            .attr('id', 'pin-blur-loose')
            .attr('x', '-100')
            .attr('y', '-100')
            .attr('width', '200')
            .attr('height', '200')
            .append('feGaussianBlur')
            .attr('stdDeviation', 3);

        /**
         * Map depression
         * Small ellipse shadow where the pin sticks into the map
         */
        pinGroup.append('ellipse')
            .attr('cx', 0)
            .attr('cy', pinBodyHeight + 4)
            .attr('rx', 6.5)
            .attr('ry', 1.5)
            .attr('fill', 'black')
            .attr('filter', 'url(#pin-blur-loose)')
            .attr('opacity', '.8');

        /**
         * Pin Body shadow
         *
         * 45 degree shadow for the pin body
         */
        var pinShadowRot = 140;
        var pinBodyShadowWidth = 2;
        pinGroup.append('rect')
            .attr('x', (0 - (pinBodyShadowWidth / 2)))
            .attr('y', (pinHeadRadius / 2))
            .attr('width', pinBodyShadowWidth)
            .attr('height', 15)
            .attr('fill', 'black')
            .attr('transform', function (){
                var transform = 'rotate(' + pinShadowRot + ', 0, 18)';
                return transform;
            })
            .attr('filter', 'url(#pin-blur-tight)')
            .attr('opacity', '.8');

        /**
         * Pin head shadow
         */
        pinGroup.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', pinHeadRadius - 1)
            .attr('fill', 'black')
            .attr('transform', function (){
                var transform = 'rotate(' + pinShadowRot + ', 0, 18)';
                return transform;
            })
            .attr('opacity', '.4')
            .attr('filter', 'url(#pin-blur-loose)');

        /**
         * Pin body
         *
         * silver gradient rectangle for the body of the pin
         */
        var gradientPinBody = pinGroup.append('svg:defs')
            .append('svg:linearGradient')
            .attr('id', 'gradientPinBody')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '100%')
            .attr('spreadMethod', 'pad');

        // Light gradient color
        gradientPinBody.append('svg:stop')
            .attr('offset', '0%')
            .attr('stop-color', '#EAECEC')
            .attr('stop-opacity', 1);

        // Dark gradient color
        gradientPinBody.append('svg:stop')
            .attr('offset', '100%')
            .attr('stop-color', '#8E9093')
            .attr('stop-opacity', 1);

        pinGroup.append('rect')
            .attr('x', (0 - (pinBodyWidth / 2)))
            .attr('y', (pinHeadRadius / 2))
            .attr('width', pinBodyWidth)
            .attr('height', pinBodyHeight)
            .attr('fill', 'url(#gradientPinBody)');

        /**
         * Pin head
         *
         * Red radial gradient in a circle for the pin top
         */
        var gradientPinHead = pinGroup.append('svg:defs')
            .append('svg:linearGradient')
            .attr('id', 'gradientPinHead')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '100%')
            .attr('spreadMethod', 'pad');

        gradientPinHead.append('svg:stop')
            .attr('offset', '0%')
            .attr('stop-color', '#aa0000')
            .attr('stop-opacity', 1);

        gradientPinHead.append('svg:stop')
            .attr('offset', '100%')
            .attr('stop-color', '#3D0000')
            .attr('stop-opacity', 1);

        pinGroup.append('circle')
            //.attr('cx', position[0] + 3.8)
            //.attr('cy', position[1] - 16)
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', pinHeadRadius)
            .attr('fill', 'url(#gradientPinHead)');

        /**
         * Position the pin
         *
         * We transform the entire pin group into the marker location
         */
        pinGroup
            .attr('class', 'pin-group')
            .attr('transform', function (){
                var transform = 'translate(' + (position[0]) + ', ' + ((position[1]) - pinBodyHeight) + ')' +
                    'rotate(' + pinRotate + ', 0, 0)';
                return transform;
            });

    }

    function drawImage(svg, projection, markerPosition, imagePosition, image, i) {

        // Old skool border width
        var imageBorder = 5;

        var centerX = imagePosition[0];
        var centerY = imagePosition[1];
        // Group for all the picture elements
        var pictureGroup = svg.append('g');

        // Drop shadow rectangle
        pictureGroup.append('defs')
            .append('filter')
            .attr('id', 'blur')
            .append('feGaussianBlur')
            .attr('stdDeviation', 5);
        pictureGroup.append('rect')
            .attr('width', image.thumbWidth + (imageBorder * 2))
            .attr('height', image.thumbHeight + (imageBorder * 2) + 40)
            .attr('opacity', '1')
            .attr('x', 3)
            .attr('y', 3)
            .style('fill', '#000')
            .attr('filter', 'url(#blur)');

        // White border rectangle
        pictureGroup.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', image.thumbWidth + (imageBorder * 2))
            .attr('height', image.thumbHeight + (imageBorder * 2) + 40)
            .attr('opacity', '1')
            .attr('class', 'location-matte');

        var imageName = image.generalLocationDs;
        if (imageName.length > 15 ) {
            imageName = imageName.substring(0,15) + '...';
        }

        pictureGroup.append('text')
            .attr('x', 10)
            .attr('y', image.thumbHeight + 37)
            .text(imageName)
            .attr('font-family', 'Amatic SC')
            .attr('font-size', '30px')
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

        //pictureGroup.append('text')
            //.attr('x', (image.thumbWidth/ 2))
            //.attr('y', (image.thumbHeight/ 2))
            //.text(image.dsLocId)
            //.attr('font-family', 'Courier')
            //.attr('font-size', '50px')
            //.attr('fill', '#FFF')
            //.attr('stroke-width', 2)
            //.attr('stroke', '#000');

        // Starting state for picture group
        pictureGroup
            .attr('opacity', '0')
            .attr('class', 'picture-group')
            .attr('data-locid', image.dsLocId)
            .attr('transform', function (){
                return 'scale(.1), translate(' + (centerX / 0.1) + ', ' + (centerY / 0.1) + ')';
            });

        imagePosition = [imagePosition[0], ((imagePosition[1] - (image.thumbHeight/ 2) - 5) + 15)];
        drawPin(svg, imagePosition);

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
            .duration(400)
            .delay(i * 50); // Stagger the markers animating in
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
                d3.select(this.parentNode)
                    .transition()
                    .delay(i * 75)
                    .attr('transform', transformString)
                    .duration(500);
            });
        };
        animateContentOut();

        window.setTimeout(function() {
            goDestination();
        }, 500);

        function goDestination() {
            // Get the clicked location string from the COM data-location attribute
            var imageLocation = String($(e.currentTarget).data('locid'));
            var clickedImage  = $(e.currentTarget).data('id');
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

