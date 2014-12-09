/**
 * Locations
 *
 * Map view of all locations.
 * This shows a random picture from each location set.
 */

// Enable dev features
var dev = false;

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
        .scale(19140)
        .center([-118.618, 34.050])
        .precision(0.1);

    /**
     * Dev map features
     *
     * Useful for dev map registrion. Normally disabled.
     */
    if (dev) {
        devMapFeatures(d3, projection);
    }

    /**
     * Initiate the SVG object for drawing all the location markers
     */
    // TODO: read this in from the LESS
    var width = 1920;
    var height = 1080;
    var svg = d3.select('.container').append('svg')
        .attr('class', 'svg-canvas')
        .attr('width', width)
        .attr('height', height);

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
        }, 1000);

        function renderLocations() {

            /**
             * Draw each location
             */
            var positions = [];
            var locations = Locations.find().fetch();
            _.each(locations, function(location, i) {
                drawLocation(svg, projection, location, i);
                positions[location.dsLocId] = {
                    latitude: location.latitude,
                    longitude: location.longitude
                };
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
            images = _.shuffle(images);
            _.each(images, function(image, i) {
                var latitude = positions[image.dsLocId].latitude;
                var longitude = positions[image.dsLocId].longitude;

                var xOffset;
                var yOffset;

                if (image.dsLocId == '2') {
                    xOffset = 0.1;
                    yOffset = -0.5;
                }
                if (image.dsLocId == '3') {
                    xOffset = -2.3;
                    yOffset = -0.2;
                }
                if (image.dsLocId == '4') {
                    xOffset = 0.3;
                    yOffset = -0.2;
                }
                else if (image.dsLocId == '5') {
                    xOffset = 0.3;
                    yOffset = 0.2;
                }
                else if (image.dsLocId == '6') {
                    xOffset = -0.3;
                    yOffset = 0.4;
                }
                else if (image.dsLocId == '8') {
                    xOffset = 0.4;
                    yOffset = 0.3;
                }
                else if (image.dsLocId == '10') {
                    xOffset = 0.2;
                    yOffset = -0.3;
                }
                else if (image.dsLocId == '11') {
                    xOffset = 0.2;
                    yOffset = -0.3;
                }
                else if (image.dsLocId == '12') {
                    xOffset = 0.6;
                    yOffset = 0.4;
                }
                else if (image.dsLocId == '13') {
                    xOffset = -0.3;
                    yOffset = -0.2;
                }
                else if (image.dsLocId == '14') {
                    xOffset = -1.0;
                    yOffset = 0.1;
                }
                else if (image.dsLocId == '15') {
                    xOffset = -0.4;
                    yOffset = 0.05;
                }
                else if (image.dsLocId == '17') {
                    xOffset = -0.2;
                    yOffset = -0.2;
                }
                else if (image.dsLocId == '18') {
                    xOffset = 0.4;
                    yOffset = -0.1;
                }
                else if (image.dsLocId == '19') {
                    xOffset = -0.2;
                    yOffset = -0.4;
                }
                else if (image.dsLocId == '20') {
                    xOffset = 0.1;
                    yOffset = 0.6;
                }
                //else if (image.dsLocId == '20') {
                    //xOffset = 0.5;
                    //yOffset = 0.4;
                //}
                else if (image.dsLocId == '21') {
                    xOffset = 0.05;
                    yOffset = -0.2;
                }
                else {
                    xOffset = 0;
                    yOffset = 0;
                }

                // Our original location before offset
                var markerPosition = projection([longitude, latitude]);
                var imagePosition = projection([(parseFloat(longitude) + xOffset), (parseFloat(latitude) + yOffset)]);
                //console.log('markerPosition - ', markerPosition);
                //console.log('imagePosition - ', imagePosition);

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
                    lineMidX = markerX + ((imagePinX - markerX) / 2 ) - 5;
                    lineMidY = markerY - (markerY - imagePinY) / 2;
                    lineStroke = 'white';
                }
                //if (markerY > imagePinY) {
                    //lineMidY = markerY - (markerY - imagePinY) / 2;
                //} else {
                    //lineMidY = imagePinY + (markerY - imagePinY) / 2 + 20;
                //}

                var lineData = [
                    { 'x': markerX, 'y': markerY},
                    { 'x': lineMidX, 'y': lineMidY},
                    //{ 'x': (imagePosition[0] + 50), 'y': (imagePosition[1] + ((markerPosition[1] - imagePosition[1]) / 2))},
                    { 'x': imagePosition[0], 'y': imagePinY}
                ];
                console.log('lineData - ', lineData);

                var lineFunction = d3.svg.line()
                    .x(function(d) { return d.x; })
                    .y(function(d) { return d.y; })
                    .interpolate('basis');

                drawImage(svg, projection, markerPosition, imagePosition, image, i);

                var line = svg.append('path')
                    .attr('d', lineFunction(lineData))
                    .attr('stroke-width', 1.2)
                    .attr('fill', 'none')
                    .attr('stroke', lineStroke);

                var dot = svg.append('circle')
                    .attr('r', 10)
                    .attr('x', lineMidX)
                    .attr('y', lineMidY)
                    .attr('class', 'location-ref-marker');

            });

            _.each(locations, function(location, i) {
                drawLocation(svg, projection, location, i);
            });

        }
    });

    /**
     * TODO Remove this.
     *
     * We aren't using locations any longer, I don't think
     *
     * Or make it a dev function for testing
     */
    function drawLocation(svg, projection, location) {

        // Draw location pin
        drawPin(svg, location);

        /**
         * Dev text
         *
         * This is for marker placement and should be disabled for production.
         */
        if (dev) {
            var position = projection([location.longitude,location.latitude]);
            svg.append('text')
            .attr('x', position[0])
            .attr('y', position[1])
            .text(location.dsLocId)
            .attr('font-family', 'Courier')
            .attr('font-size', '20px')
            .attr('fill', 'white')
            .attr('stroke-width', 1.5)
            .attr('stroke', '#000');
        }

    }

    function drawPin(svg, location) {

        var position = projection([location.longitude,location.latitude]);
        var randPin = _.random(0, 2);
        var pinRotate;
        if (randPin == 0) {
            pinRotate = 15;
        }
        else if (randPin == 1) {
            pinRotate = -15;
        }
        else {
            pinRotate = -5;
        }

        var gradientPinBody = svg.append('svg:defs')
            .append('svg:linearGradient')
            .attr('id', 'gradientPinBody')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '100%')
            .attr('spreadMethod', 'pad');

        // Light
        gradientPinBody.append('svg:stop')
            .attr('offset', '0%')
            .attr('stop-color', '#EAECEC')
            .attr('stop-opacity', 1);

        // Dark
        gradientPinBody.append('svg:stop')
            .attr('offset', '100%')
            .attr('stop-color', '#8E9093')
            .attr('stop-opacity', 1);

        var pinBodyX = position[0] + 2;
        var pinBodyY = position[1] - 12;
        var pinBody = svg.append('rect')
            .attr('x', pinBodyX)
            .attr('y', pinBodyY)
            .attr('width', 2)
            .attr('height', 15)
            .attr('fill', 'url(#gradientPinBody)')
            .attr('transform', function (){
                return 'rotate(' + pinRotate + ', ' + pinBodyX + ', ' + pinBodyY + ')';
            });


        var gradientPinHead = svg.append('svg:defs')
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

        var pinHead = svg.append('circle')
            .attr('cx', position[0] + 3.8)
            .attr('cy', position[1] - 16)
            .attr('r', 5)
            .attr('fill', 'url(#gradientPinHead)');

    }

    function drawImage(svg, projection, markerPosition, imagePosition, image, i) {

        // Image position

        // Old skool border width
        var imageBorder = 5;

        var centerX = imagePosition[0];
        var centerY = imagePosition[1];
        // Group for all the picture elements
        var pictureGroup = svg.append('g');

        // Drop shadow rectangle
        var filter = pictureGroup.append('defs')
            .append('filter')
            .attr('id', 'blur')
            .append('feGaussianBlur')
            .attr('stdDeviation', 5);
        pictureGroup.append('rect')
            .attr('width', image.thumbWidth + (imageBorder * 2))
            .attr('height', image.thumbHeight + (imageBorder * 2))
            .attr('opacity', '1')
            .attr('x', 0)
            .attr('y', 0)
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
            .attr('transform', function (){
                return 'scale(.1), translate(' + (centerX / 0.1) + ', ' + (centerY / 0.1) + ')';
            });

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
    'click image':function(e){

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

