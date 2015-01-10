/**
 * Single location
 *
 * This shows all the images in a timeline for the selected location.
 */

/**
 * Image properties
 */
var imageBorder = 5; // White border aorund the picture
var imageBottomPadding = 10; // Whitespace below images
var delay = 5; // Milliseconds to delay the animation per image
var dur = 500; // Milliseconds for the image animation

/**
 * Template render
 */
Template.location.rendered = function () {
    /**
     * Wait for Meteor to finish loading server data.
     *
     * Draw the location page.
     */
    window.setTimeout(function () {
        var locationContainer = $('.location');
        locationContainer.css('opacity', 0);
        drawLocation();
    }, 300);
};

/**
 * Template Events
 */
Template.location.events({
    // Highlight images when you tap anywhere on the screen
    'mousemove .container': function (e) {
        highlightImage(e.pageX);
    }
});

/**
 * Draw the location page
 */
function drawLocation() {
    /**
     * Gather image data from the Meteor collection and sort by year
     */
    var imagesCursor = Images.find();
    var imagesCount = imagesCursor.count();
    var images = imagesCursor.fetch();
    images = _.sortBy(images, function (image) {
        return image.isoDate;
    });

    /**
     * Setup the location element, and fade it in on page load.
     *
     * The location element contains all the main content on this page.
     *
     * TODO
     * Maybe wait to fade it in until the images and the timeline are loaded?
     */
    var locationContainer = $('.location');
    locationContainer.addClass('animated fadeIn');

    /**
     * Setup the timeline
     */
    var timelineBackground = $('.timeline-background');
    var timelineBackgroundWidth = timelineBackground.width();
    var timelineBackgroundHeight = timelineBackground.height();
    var timelineBackgroundLeft = parseInt(timelineBackground.css('left'));
    var timelineSVG  = d3.select('.timeline-background')
        .append('svg')
        .attr('class', 'timeline-background-svg')
        .attr('width', timelineBackgroundWidth )
        .attr('height', timelineBackgroundHeight);

    /**
     * Draw year markers at the start and end of the timeline
     */
    var firstYear = _.first(images).isoDate.substring(4,8);
    drawYearMarker(timelineSVG, 0, 50, 50, 55, firstYear);
    var lastYear = _.last(images).isoDate.substring(4,8);
    drawYearMarker(timelineSVG, (timelineBackgroundWidth - 100), 50, (timelineBackgroundWidth - 55), 55, lastYear);

    /**
     * Draw selection handle
     */
    drawTimelineHandle(timelineSVG);

    /**
     * Render each image along the timeline
     *
     * We have to find first and last image information outside the loop
     */
    var timelineImagesWidth = $('.timeline-images').width();
    var timelineImagesHeight = $('.timeline-images').height();
    var timelineImagesSVG = d3.select('.timeline-images')
        .append('svg')
        .attr('class', 'timeline-images-svg')
        .attr('width', timelineImagesWidth)
        .attr('height', timelineImagesHeight);
    var firstImageWidth = _.first(images).thumbWidth;
    var lastImageWidth = _.last(images).thumbWidth;
    _.each(images, function(image, i) {
        drawImage(timelineImagesSVG, timelineImagesWidth, timelineImagesHeight, image, i, imagesCount, firstImageWidth, lastImageWidth);
    });

    /**
     * Find the clicked image and highlight it
     *
     * TODO - This is a hack. We're looking up the x position for the
     * image clicked and then passing it to the mousemove function.
     *
     * Figure out a better non-positional way to do this.
     */
    // Get the clicked image from the URL
    var clickedImage = Router.current().params.query.image;

    // Determine which image to highlight based on pointer position
    var groupObj = d3.selectAll('g[data-id=' + clickedImage + ']');
    var timeline = $('.timeline-images-svg');
    var posX = parseInt(timeline.parent().offset().left) + parseInt(groupObj.attr('data-centerx'));
    highlightImage(posX);

}

/**
 * Draw the timeline handle
 *
 * Leave the options here until the client is sure that they like the
 * new pointer
 */
function drawTimelineHandle(svg) {
    svg.append('image')
        .attr('xlink:href', '/images/hand-2.png')
        .attr('width', 75)
        .attr('height', 146)
        .attr('class', 'time-handle-rect');
}

/**
 * Draw the start and end years for the timeline
 */
function drawYearMarker(svg, x, y, posX, posY, year) {
    // Background drop shadow filter
    svg.append('defs')
        .append('filter')
        .attr('id', 'blur')
        .append('feGaussianBlur')
        .attr('stdDeviation', 5);

    // Background drop shadow rectangle
    svg.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', 95)
        .attr('height', 60)
        .style('fill', '#000')
        .attr('filter', 'url(#blur)');

    // Background rectangle
    svg.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', 95)
        .attr('height', 60)
        .attr('fill', 'white');

    // Year text
    svg.append('svg:text')
        .attr('x', x + 10)
        .attr('y', y + 47)
        .attr('class', 'time-label-start')
        .text(year);

    // Pin
    var position = [posX, posY];
    Meteor.svgRecipes.drawPin(svg, position);
}

/**
 * Render each image
 */
function drawImage(timelineImagesSVG, timelineBackgroundWidth, timelineImagesHeight, image, i, imagesCount, firstImageWidth, lastImageWidth) {
    var centerX;
    var leftX;
    var translateX;

    /**
     * Image positioning
     */

    // Centers for the first and last images
    var firstCenterX = imageBorder + ( ( firstImageWidth) / 2 );
    var lastCenterX = timelineBackgroundWidth - ( ( lastImageWidth) / 2 );

    // Values for the first image
    if (i === 0) {
        centerX = firstCenterX;
        leftX = imageBorder;
        translateX = leftX;
    }

    // Values for the last image
    if (i == (imagesCount - 1)){
        centerX = lastCenterX;
        leftX = timelineBackgroundWidth - lastImageWidth - imageBorder;
        translateX = leftX;
    }

    // Values for the rest of the images
    //
    // First find the proper interval between images, and then set the
    // position based on the i value
    var centerInterval = (lastCenterX - firstCenterX) / ( imagesCount - 1 );
    if ((i !== 0) && (i != (imagesCount - 1))) {
        centerX = firstCenterX + ( centerInterval * i );
        leftX = centerX - ( ( parseInt( image.thumbWidth )) / 2);
        translateX = leftX;
    }

    // Y Value for all images is the same
    //
    // This bottom aligns the images to the top of the timeline
    var bottomY = (
        timelineImagesHeight -
        image.thumbHeight -
        imageBorder -
        imageBottomPadding);

    // Start building the SVG translate command
    var translate = 'translate(' + translateX + ',' + bottomY + ')';

    /**
     * Picture group
     */
    var pictureGroup = timelineImagesSVG.append('g')
        .attr('class', 'picture-group ' + 'picture-' + i)
        .attr('data-index', i)
        .attr('data-id', image._id)
        .attr('data-iso-date', image.isoDate)
        .attr('data-app-date', image.appDate)
        .attr('data-location', image.creationPlace)
        .attr('data-credit-line', image.creditLine)
        .attr('data-title', image.title)
        .attr('data-xh', image.expandedHeight)
        .attr('data-xw', image.expandedWidth)
        .attr('data-aspect', image.expandedAspectRatio)
        .attr('data-centerx', centerX)
        .attr('data-description', image.labelTextEnglish)
        .attr('data-description-es', image.labelTextSpanish);

    /**
    * Picture drop shadow
    */
    pictureGroup.append('defs')
        .append('filter')
        .attr('id', 'blur')
        .append('feGaussianBlur')
        .attr('stdDeviation', 5);
    pictureGroup.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .style('fill', '#000')
        .attr('width', image.thumbWidth + (imageBorder * 2))
        .attr('height', image.thumbHeight + (imageBorder * 2))
        .attr('class', 'child')
        .attr('filter', 'url(#blur)');

    /**
    * Picture white border
    */
    pictureGroup.append('rect')
        // Positions are relative to the group
        .attr('x', (0 - imageBorder))
        .attr('y', (0 - imageBorder))
        .attr('width', image.thumbWidth + (imageBorder * 2))
        .attr('height', image.thumbHeight + (imageBorder * 2))
        .attr('class', 'child location-matte');

    // Image
    pictureGroup.append('image')
        .attr('xlink:href', '/images/thumbnails/' + image._id + '.jpg')
        .attr('data-id', image._id)
        .attr('data-location', image.generalLocationDs)
        .attr('width', image.thumbWidth)
        .attr('height', image.thumbHeight)
        .attr('location', image.generalLocationDs)
        .attr('class', 'child');

    // Position the image groups
    pictureGroup
        .attr('transform', function (){
            var transform = translate + ' scale(1)';
            return transform;
        });

    // Start hidden and fade in
    pictureGroup.selectAll('.child')
        .attr('opacity', '0');
    pictureGroup.selectAll('.child')
        .transition()
        .delay(i * delay) // Stagger the markers animating in
        .attr('opacity', '1')
        .duration(dur);

}

function highlightImage(pointerX) {
    /**
     * Get timeline width for position calculations
     */
    var timeline = $('.timeline-images-svg');

    /**
     * Determine which image to highlight based on pointer position
     */
    var posX = pointerX - timeline.parent().offset().left;

    var imagesCount = d3.selectAll('.picture-group')[0].length;
    var intervalWidth = (
            timeline.width() /
            imagesCount);

    /**
     * Timeline handle
     *
     * Position the handle center on our pointer, but prevent it
     * from going off the edge of the timeline.
     */
    var handle = d3.select('.time-handle-rect');

    // This positions the hand graphic correctly. The mouse position
    // will exactly match up with the index finger on the graphic.
    var handleFingerOffset = 16;
    var handleX = posX - handleFingerOffset;

    // Prevent the handle from going off the edge of the area
    // Left edge
    if (posX <= 20) {
        posX = 20;
        handleX = posX - handleFingerOffset;
    }
    // Right edge
    if (posX >= 1620) {
        posX = 1620;
        handleX = posX;
    }

    // Move handle
    handle.attr('transform', function (){
        var transform = 'translate(' + ( handleX ) + ', 40)';
        return transform;
    });

    /**
     * Scale the images based on mouse position
     *
     * Make the images nearest the cursor the biggest
     */
    var posInterval = Math.floor(posX / intervalWidth);
    d3.selectAll('.picture-group').each( function(d, i){

        /**
         * Determine a scale value based on mouse position
         */
        i = Number(d3.select(this).attr('data-index'));
        var distance = posInterval - i;
        var distanceScale;
        if (distance === 0) {
            distanceScale = 1;
        }
        else {
            var minVal = 0.5;
            var maxVal = 0.7;
            distanceScale = ( minVal + (maxVal - minVal) * (1 / (Math.abs(posInterval - i))));
        }

        /**
         * Transform the picture group
         */
        var pictureGroup = d3.select(this);
        var imageInGroup = pictureGroup.select('image');
        var imageHeight = imageInGroup
            .attr('height');
        var imageWidth = imageInGroup
            .attr('width');
        // Get the current transform object
        var dataCenterX = pictureGroup.attr('data-centerx');
        var t = d3.transform(pictureGroup.attr('transform'));
        // Set the scale value, without changing other attributes
        // This allows the image to stay at its current X,Y position
        // while scaling.
        t.scale = [distanceScale, distanceScale];

        var timelineImages = $('.timeline-images');
        var timelineImagesHeight = timelineImages.height();

        /**
         * X position
         *
         * Position the image off its center, scaled by the size of the
         * image. Push the image right or left for the image border
         * based on whether it's on the left or the right side.
         */
        var imageBorderTranslate = imageBorder;
        if ( i >= ( imagesCount / 2 ) ) {
            imageBorderTranslate = imageBorder * -1;
        }
        var translateX = dataCenterX - ((imageWidth * distanceScale) / 2) + imageBorderTranslate;

        /**
         * Y position
         *
         * Highlight the current image by moving it up
         */
        var highlightHeight;
        if (posInterval == i) {
            highlightHeight = 50;
        }
        else {
            highlightHeight = 0;
        }
        var translateY = (
                timelineImagesHeight -
                ( imageHeight * distanceScale ) -
                imageBorder -
                imageBottomPadding -
                highlightHeight);

        /**
         * Transform the image
         *
         * Turn the transform back into a string for SVG
         */
        t.translate = [
            translateX,
            translateY
                ];
        var transformString = t.toString();
        pictureGroup
            .transition()
            .duration(100)
            .ease('circle-out')
            .attr('transform', transformString);
    });

    /**
     * Display detail information about the photograph
     */
    // Get the image data from the thumbnail data objects
    var hlImg = $('g[data-index=' + posInterval + ']');

    // Set the title
    var hlImgTitle = hlImg.data('title');
    $('.image-detail h4').text(hlImgTitle);

    var hlImgDescription = hlImg.data('description');
    var hlImgDescriptionEs = hlImg.data('description-es');
    $('.image-detail div.image-description').text(hlImgDescription);
    $('.image-detail div.image-description-es').text(hlImgDescriptionEs);
    $('.image-detail div.image-location').text(hlImg.data('location'));
    $('.image-detail div.image-date').text(hlImg.data('app-date').substring(5));
    if ((hlImg.data('credit-line')).length) {
        $('.image-detail div.image-credit-line').text('Courtesy of ' + hlImg.data('credit-line'));
    } else {
        $('.image-detail div.image-credit-line').text('');
    }
    var hlImgId = hlImg.data('id');
    var hlImgExHeight = parseFloat(hlImg.data('xh'));
    var hlImgExWidth = parseFloat(hlImg.data('xw'));
    var hlImgAspect = parseFloat(hlImg.data('aspect'));

    /**
     * Portait - taller than narrow. Limit the height to 600px
     */
    var aspectR;
    if (hlImgAspect < 1) {
        if (hlImgExHeight > 800) {
            hlImgExHeight = 800;
        }
        hlImgExWidth = hlImgExHeight * hlImgAspect;

        aspectR = hlImgAspect;
    }
    /**
     * Landscape - wider than tall. Limit the width to 1000px
     */
    else {
        if (hlImgExWidth > 1000) {
            hlImgExWidth = 1000;
        }
        hlImgExHeight = hlImgExWidth / hlImgAspect;
        aspectR = hlImgAspect;
    }

    // Only change the image when we need to
    var imagePath = '/images/expanded/' + hlImgId + '.jpg';
    if ($('.image-fullsize-image').attr('src') != imagePath) {
        $('.image-fullsize-image').attr('src', imagePath).stop(true, true).hide().fadeIn(400);
        $('.image-fullsize-image').attr('width', (hlImgExWidth));
        $('.image-fullsize-image').attr('height', (hlImgExHeight));
        $('.image-fullsize-image').attr('aspect', aspectR);
    }
}
