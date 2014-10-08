/* ---------------------------------------------------- +/

## Location ##

Code related to the location template

/+ ---------------------------------------------------- */

//Template.location.created = function () {
//};

//Template.location.helpers({
    //myHelper: function () {
    //}
//});

Template.location.rendered = function () {
    // Fade in the main location wrapper
    $('.location').addClass('animated fadeIn92');

    /**
     * Setup image area
     */
    var width = 1800,
        height = 1080 - 100,
        svg = d3.select(".images").append("svg")
            .attr("class", 'svg-canvas')
            .attr("width", width)
            .attr("height", height);

    /**
     * Setup timeline area
     */
    var time = d3.select(".time").append("svg")
        .attr("class", 'time-canvas')
        .attr("width", width - 30)
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
            var timelineMargin = 60;
            widthInterval = parseInt((width - timelineMargin) / imagesCount);
            var firstImageWidth = images[0].thumbWidth;
            var lastImageWidth = images[parseInt(imagesCount - 1)].thumbWidth;
            _.each(images, function(image, i) {
                drawImage(svg, image, i, imagesCount, firstImageWidth, lastImageWidth, timelineMargin, widthInterval);
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
    function drawImage(svg, image, i, imagesCount, firstImageWidth, lastImageWidth, timelineMargin, widthInterval) {
        /**
         * Image properties
         */
        var imageBorder = 5;
        var delay = 2; // Milliseconds to delay the animation per image
        var dur = 500; // Milliseconds for the image animation

        /**
         * Image positioning
         */
        // The x calue for the first image at the left edge of the timeline
        var leftEdge = (timelineMargin / 2) - imageBorder;
        var centerX;
        if (i === 0) {
            centerX = leftEdge;
        }

        // The x value for the last image at the right edge of the timeline
        //
        // The last values account for the shadow offset in the group
        var rightEdge = (timelineMargin / 2) + 1760 - lastImageWidth - (imageBorder * 2) - 5;
        if (i == (imagesCount - 1)){
            centerX = rightEdge;
        }

        // Find the proper interval between images, for the rest of the images
        var rightEdgeCenter = rightEdge + (firstImageWidth / 2);
        var centerInterval = (rightEdgeCenter - leftEdge) / (imagesCount - 2);

        if ((i !== 0) && (i != (imagesCount - 1))) {
            // 15 for white border and shadow
            centerX = leftEdge + (centerInterval * i) - ((image.thumbWidth + 15) / 2);
        }

        // Put the images at the top of the timeline
        var bottomY = (835 - image.thumbHeight);
        var translate = 'translate(' + centerX + ',' + bottomY + ')';

        /**
         * Picture group parent
         */
        var pictureGroup = svg.append("g")
            .attr('class', 'picture-group ' + 'picture-' + i)
            .attr('data-index', i)
            .attr('data-date', image.date)
            .attr("transform", function (){
                return translate;
            });

            /**
            * Picture drop shadow
            */
            var filter = pictureGroup.append("defs")
                .append("filter")
                .attr("id", "blur")
                .append("feGaussianBlur")
                .attr("stdDeviation", 5);
            pictureGroup.append('rect')
                .attr("x", 0)
                .attr("y", 0)
                .style('fill', '#000')
                .attr("width", image.thumbWidth + (imageBorder * 2))
                .attr("height", image.thumbHeight + (imageBorder * 2))
                .attr('class', 'child')
                .attr("filter", "url(#blur)");

            /**
            * Picture white border
            */
            pictureGroup.append('rect')
                // Positions are relative to the group
                .attr("x", (0 - imageBorder))
                .attr("y", (0 - imageBorder))
                .attr("width", image.thumbWidth + (imageBorder * 2))
                .attr("height", image.thumbHeight + (imageBorder * 2))
                .attr('class', 'child location-matte');

            // Image
            pictureGroup.append('image')
                .attr("xlink:href", "/images/thumbnails/" + image._id + ".jpg")
                .attr("data-id", image._id)
                .attr("data-location", image.generalLocationDs)
                //// Simulate scaling form the center of the image
                .attr("width", image.thumbWidth)
                .attr("height", image.thumbHeight)
                .attr('location', image.generalLocationDs)
                .attr('class', 'child');

        /**
         * Picture starting state
         *
         * Scale at 0
         * All child elements with an opacity of 0
         */
        pictureGroup
            .attr("transform", function (){
                transform = translate + ',scale(0)';
                return transform;
            });
        pictureGroup.selectAll('.child')
            .attr("opacity", "0");

        /**
         * Picture - Animate in.
         *
         * Scale and opacity at 1
         */
        pictureGroup
            .transition()
            .delay(i * delay) // Stagger the markers animating in
            .attr("transform", function (){
                transform = translate + ',scale(1)';
                return transform;
            })
            .duration(dur);
        pictureGroup.selectAll('.child')
            .transition()
            .delay(i * delay) // Stagger the markers animating in
            .attr("opacity", "1")
            .duration(dur);

    }
};

Template.location.events({
    // Desired functionality, but disabled for testing
    //'mousemove .container': function (e) {
    'click .container': function (e) {

        /**
         * Setup basic objects and widths
         */
        var timeline = $('.time-canvas');

        // Count elements in our SVG element to get number of images
        var imagesCount = d3.selectAll('.picture-group')[0].length;

        // Pixel interval between images
        var intervalWidth = (timeline.width() / imagesCount);

        // Mouse position relative to the timeline
        var posX = e.pageX - timeline.parent().offset().left;
        var posInterval = Math.floor(posX / intervalWidth);

        /**
         * Position the handle relative to our pointer event
         */
        var handle = d3.select('.time-handle-rect');
        var handleWidth = handle.attr('width');
        var handleWidthHalf = (handleWidth / 2);

        // Prevent the handle from going off the edge of the timeline
        if (posX < handleWidthHalf) {
            posX = (handleWidthHalf);
            posInterval = 1;
        }
        if (posX > 1760 - handleWidthHalf) {
            posX = (1760 - handleWidthHalf);
            posInterval = imagesCount;
        }

        // Set the middle of the handle to the mouse position
        handle.attr('x', (posX - handleWidthHalf));

        /**
         * Scale the images based on mouse position
         *
         * Make the images nearest the cursor the biggest
         */
        d3.selectAll('.picture-group').each( function(d, i){

            /**
             * Determine a scale value based on mouse position
             */
            i = Number(d3.select(this).attr("data-index"));
            console.log('i', i);
            console.log('posInterval');
            var distance = posInterval - i;
            //var distanceScale;
            if (distance === 0) {
                distanceScale = 1;
            }
            else {
                distanceScale = (2 * (1 / Math.abs(posInterval - i)));
            }

            /**
             * Transform the picture group
             */
            var pictureGroup = d3.select(this);
            // Get the current transform object
            var t = d3.transform(pictureGroup.attr('transform'));
            // Set the scale value, without changing other attributes
            // This allows the image to stay at its current X,Y position
            // while scaling.
            t.scale = [distanceScale, distanceScale];
            // Turn the transform back into a string for SVG
            transformString = t.toString();
            pictureGroup
                .transition()
                .duration(50)
                .attr("transform", transformString);
        });

        /**
         * Dev mouse position data
         */
        $('.dev-mouse').html(
            'Rel pointer X = ' + posX + '<br>' +
            'Interval width = ' + intervalWidth + '<br>' +
            'Pos interval = ' + posInterval + '<br>'
        );

    },

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
