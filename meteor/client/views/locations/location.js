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
var timelineWidth = 1730; // Width of the timeline

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
        /**
         * Location information
         *
         * Define some basic information about the location assets for use
         * after the page is rendered.
         */
        var imagesCursor = Images.find();
        var images = imagesCursor.fetch();

        var imagesCount = imagesCursor.count();
        Session.set('imagesCount', imagesCount);

        var intervalWidth = (timelineWidth / imagesCount);
        Session.set('intervalWidth', intervalWidth);

        /**
         * Draw the location assets
         */
        var locationContainer = $('.location');
        locationContainer.css('opacity', 0);
        drawLocation(images);
    }, 300);
};

/**
 * Template Events
 */
Template.location.events({
    /**
     * Highlight images when you press on the bottom part of the screen
     *
     * We only highlight the images on the bottom part of the screen
     */
    'mousemove .container': function (e) {
        if (e.pageY >= 840) {
            console.log('Highlighting');
            highlightImage(e.pageX);
        }
    },
    'click .prev-next-buttons circle.button-left, click .prev-next-buttons polygon.button-left': function (e) {
        console.log('Button left clicked: e - ', e);
        highlightImage(100);
    },
    'click .prev-next-buttons circle.button-right, click .prev-next-buttons polygon.button-right': function (e) {
        console.log('Button right clicked: e - ', e);
        highlightImage(500);
    }
});

/**
 * Draw the location page
 */
function drawLocation(images) {
    /**
     * Gather image data from the Meteor collection and sort by year
     */
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
    var totalImagesWidth  = 0;
    _.each(images, function(image, i) {
        console.log('image.thumbWidth - ', image.thumbWidth);
        totalImagesWidth = (parseInt(totalImagesWidth, 10) + parseInt(image.thumbWidth, 10));
    });
    console.log('totalImagesWidth - ', totalImagesWidth);
    console.log('timelineImagesWidth - ', timelineImagesWidth);

    /**
     * Create scale factor for the images
     *
     * Shrink the images by this scale factor and all of the pictures will be
     * visible along the timeline. Add a fudge factor of 0.4 to make the images
     * overlap slightly.
     *
     * Don't oversize the images on unpopulated timelines.
     */
    var scaleFactor;
    if (totalImagesWidth <= timelineImagesWidth) {
        scaleFactor = 1;
    } else {
        var fudgeFactor = 1;
        scaleFactor = ((timelineImagesWidth / (parseInt(totalImagesWidth, 10) + (Session.get('imagesCount') * 20))) * fudgeFactor);
    }
    console.log('scaleFactor - ', scaleFactor);

    _.each(images, function(image, i) {
        drawTimelineImage(timelineImagesSVG, timelineImagesWidth, timelineImagesHeight, image, i, firstImageWidth, lastImageWidth, scaleFactor);
    });

    /**
     * Special the clicked image and highlight it
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
    // TODO: cleanup this mess. We shouldn't need to use jquery here
    var timeline = $('.timeline-images-svg');
    var timelineOffset = timeline.parent().offset();
    Session.set('timelineOffset', timelineOffset);
    var posX = parseInt(timelineOffset.left, 10) + parseInt(groupObj.attr('data-centerx'), 10);
    highlightImage(posX);

    /**
     * Draw circle
     */
    var locationContainerHeight = locationContainer.height();
    var locationSVG  = d3.select('.location')
        .append('svg')
        .attr('class', 'prev-next-buttons')
        .attr('width', 1920 )
        .attr('height', locationContainerHeight);

    drawNavButton(locationSVG, 50, 400, 30, 'left');
    drawNavButton(locationSVG, 1860, 400, 30, 'right');

}

/**
 * Draw temp circle
 *
 * Drawing a cirle for the next and prev buttons
 *
 */
function drawNavButton(svg, cx, cy, r, direction) {
    svg.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('class', 'button-' + direction)
        .attr('fill', '#e2d9c2')
        //.attr('fill-opacity', 0.5)
        .attr('r', r);

    var triA;
    var triB;
    var triC;
    if (direction == 'left') {
        triA = [(cx - (r / 2)), cy];
        triB = [(cx + 10), (cy - 20)];
        triC = [(cx + 10), (cy + 20)];
    } else {
        triA = [(cx + (r / 2)), cy];
        triB = [(cx - 10), (cy + 20)];
        triC = [(cx - 10), (cy - 20)];
    }

    svg.append('polygon')
        .attr('fill', '#341B1C')
        .attr('class', 'button-' + direction)
        //.attr('fill-opacity', 0.8)
        .attr('points',function() {
            return triA.join(',') + ' ' + triB.join(',') + ' ' + triC.join(',');
        });
        //.attr('points', cx,cy, (cx + 50), (cy + 50), (cx - 50), (cy + 50)');
}


/**
 * Draw the timeline handle
 */
function drawTimelineHandle(svg) {
    //
    // Disabling hand pointer
    //
    // The odd shape and the timeline difficulties are making this a bad choice
    //
    // Keep this around until we're certain that we don't want
    // to use this any longer.
    //svg.append('image')
        //.attr('xlink:href', '/images/hand-2.png')
        //.attr('width', 75)
        //.attr('height', 146)
        //.attr('class', 'time-handle-rect');

    svg.append('path')
        .style('stroke', '#341B1C')
        .style('fill', '#341B1C')
        //.attr('width', 300)
        .attr('class', 'time-handle-rect')
        .attr('d', 'M 0,50, L 25,0, L 50,50 Z');
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
function drawTimelineImage(timelineImagesSVG, timelineBackgroundWidth, timelineImagesHeight, image, i, firstImageWidth, lastImageWidth, scaleFactor) {
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
    if (i == (Session.get('imagesCount') - 1)){
        centerX = lastCenterX;
        leftX = timelineBackgroundWidth - lastImageWidth - imageBorder;
        translateX = leftX;
    }

    // Values for the rest of the images
    //
    // First find the proper interval between images, and then set the
    // position based on the i value
    var centerInterval = (lastCenterX - firstCenterX) / ( Session.get('imagesCount') - 1 );
    if ((i !== 0) && (i != (Session.get('imagesCount') - 1))) {
        centerX = firstCenterX + ( centerInterval * i );
        leftX = centerX - ( parseInt(image.thumbWidth, 10) / 2);
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
            var transform = translate + ' scale(' + scaleFactor + ')';
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

/**
 * Position timeline handle
 *
 * Position the handle center on our pointer, but prevent it
 * from going off the edge of the timeline.
 */
function positionHandle(posX) {
    // Handle object
    var handle = d3.select('.time-handle-rect');

    // Handle width
    var handleWidth = handle.node().getBBox().width;

    // Center handle on mouse X
    var handleX = (posX + (handleWidth / 2));

    // Move handle
    handle.attr('transform', function (){
        var transform = 'translate(' + ( handleX ) + ', 100)';
        return transform;
    });

}

/**
 * Bound posX
 *
 * Prevent the posX from getting modified outside of the timeline boundaries.
 */
function boundPosX(posX) {
    // Left edge
    if (posX <= 20) {
        posX = 20;
        //handleX = posX + handleWidth;
    }
    // Right edge
    if (posX >= 1620) {
        posX = 1620;
        //handleX = posX;
    }
    return posX;
}

function getDistanceScale(picture, posInterval) {
    /**
     * Determine a scale value based on mouse position
     */
    i = Number(d3.select(picture).attr('data-index'));
    console.log('i - ', i);
    var distance = posInterval - i;
    var distanceScale;
    if (distance === 0) {
        distanceScale = 1;
    } else {
        var minVal = 0.5;
        var maxVal = 0.7;
        distanceScale = ( minVal + (maxVal - minVal) * (1 / (Math.abs(posInterval - i))));
    }

    return distanceScale;

}

function getPosInterval(posX) {
    return Math.floor(posX / Session.get('intervalWidth'));
}

function highlightImage(pointerX) {
    /**
     * Get timeline width for position calculations
     */

    // Set an X position for modifications based on mouse X
    var posX = boundPosX(pointerX - Session.get('timelineOffset').left);

    // Position selection handle
    positionHandle(posX);

    /**
     * Scale the images based on mouse position
     *
     * Make the images nearest the cursor the biggest
     */
    console.log('Interval width - ', Session.get('intervalWidth'));

    d3.selectAll('.picture-group').each( function(d, i){

        var distanceScale = getDistanceScale(this, getPosInterval(posX));

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
            //
            // Disabling
            //
            //t.scale = [distanceScale, distanceScale];

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
        if ( i >= ( Session.get('imagesCount') / 2 ) ) {
            imageBorderTranslate = imageBorder * -1;
        }
        var translateX = dataCenterX - ((imageWidth * distanceScale) / 2) + imageBorderTranslate;

        /**
         * Y position
         *
         * Highlight the current image by moving it up
         */
        var highlightHeight;
        if (getPosInterval(posX) == i) {
            highlightHeight = 50;
        } else {
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
        //console.log('t.translate - ', t.translate[0]);
        t.translate = [
            t.translate[0],
            t.translate[1],
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
    var hlImg = $('g[data-index=' + getPosInterval(posX) + ']');

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

    } else {
        /**
         * Landscape - wider than tall. Limit the width to 1000px
         */
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
