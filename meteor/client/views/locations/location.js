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
var yearMarkerWidth = 95;

/**
 * Template helpers
 */
Template.location.helpers({
    highlightedImageLocation: function () {
        return Session.get('highlightedImageLocation');
    },
    highlightedImageDate: function () {
        return Session.get('highlightedImageDate');
    },
    highlightedImageDescription: function () {
        return Session.get('highlightedImageDescription');
    },
    highlightedImageDescriptionEs: function () {
        return Session.get('highlightedImageDescriptionEs');
    },
    highlightedImageCredit: function () {
        return Session.get('highlightedImageCredit');
    }
});

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

        // Sort images by year
        images = _.sortBy(images, function (image) {
            return image.isoDate;
        });

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
 * Get the closest value in an array of sorted images
 */
function getClosest(array, target) {
    var tuples = _.map(array, function(val) {
        return [val, Math.abs(val - target)];
    });
    console.log('tuples - ', tuples);
    var reduced = _.reduce(
        //tuples, function(memo, val) { return (memo[1] < val[1]) ? memo : val; }, [-1, 999]
        tuples, function(memo, val) {
            if (memo[1] < val[1]) {
                return memo;
            }
            else {
                return val;
            }
        }, [-1, 999]
    );
    console.log('reduced - ', reduced);
    return reduced[0];
}

function getLeftist(array, target) {
    var leftist = _.find(array, function(item) {
        return item > target;
    });

    if (typeof leftist === 'undefined'){
        leftist = array.length;
    } else {
        leftist = array.indexOf(leftist);
    }
    leftist = leftist - 1;

    return leftist;
}

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
            highlightImageByPointer(e.pageX);
        }
    },
    'click .prev-next-buttons circle.button-left, click .prev-next-buttons polygon.button-left': function (e) {
        console.log('Button left clicked: e - ', e);
        highlightImageByPointer(100);
    },
    'click .prev-next-buttons circle.button-right, click .prev-next-buttons polygon.button-right': function (e) {
        console.log('Button right clicked: e - ', e);
        highlightImageByPointer(500);
    }
});

/**
 * Draw the location page
 */
function drawLocation(images) {

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
    Session.set('timelineBackgroundWidth', timelineBackground.width());
    Session.set('timelineBackgroundHeight', timelineBackground.width());
    var timelineBackgroundSVG  = d3.select('.timeline-background')
        .append('svg')
        .attr('class', 'timeline-background-svg')
        .attr('width', Session.get('timelineBackgroundWidth'))
        .attr('height', Session.get('timelineBackgroundHeight'));

    /**
     * Draw year markers at the start and end of the timeline
     */
    var firstYear = _.first(images).isoDate.substring(4,8);
    drawYearMarker(timelineBackgroundSVG, 0, 50, 50, 55, firstYear);
    var lastYear = _.last(images).isoDate.substring(4,8);
    drawYearMarker(
        timelineBackgroundSVG,
        (Session.get('timelineBackgroundWidth') - 100),
        50,
        (Session.get('timelineBackgroundWidth') - 55), 55, lastYear
    );

    // Draw selection handle
    drawTimelineHandle(timelineBackgroundSVG);

    // Draw timeline images
    drawTimelineImages(images);

    /**
     * Highlight the clicked image
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
    //
    // Temp removing this because of errors
    //
    //var posX = parseInt(timelineOffset.left, 10) + parseInt(groupObj.attr('data-centerx'), 10);
    //highlightImageByPointer(posX);

    // Draw prev/next buttons
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
        .attr('width', yearMarkerWidth)
        .attr('height', 60)
        .style('fill', '#000')
        .attr('filter', 'url(#blur)');

    // Background rectangle
    svg.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', yearMarkerWidth)
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
 * Create scale factor for the images
 *
 * Shrink the images by this scale factor and all of the pictures will be
 * visible along the timeline. Add a fudge factor of 0.4 to make the images
 * overlap slightly.
 *
 * Don't oversize the images on unpopulated timelines.
 */
function getScaleFactor(images) {
    var scaleFactor;
    var fudgeFactor = 2;
    var totalImagesWidth = 0;

    _.each(images, function(image) {
        totalImagesWidth = (parseInt(totalImagesWidth, 10) + parseInt(image.thumbWidth, 10));
    });
    if (totalImagesWidth <= Session.get('timelineBackgroundWidth')) {
        scaleFactor = 1;
    } else {
        scaleFactor = ((Session.get('timelineBackgroundWidth') / (parseInt(totalImagesWidth, 10) + (Session.get('imagesCount') * 20))) * fudgeFactor);
    }
    return scaleFactor;
}

/**
 * Render each image along the timeline
 *
 * We have to find first and last image information outside the loop
 */
function drawTimelineImages(images) {
    //var timelineBackgroundWidth = $('.timeline-images').width();
    //var timelineBackgroundHeight = $('.timeline-images').height();
    Session.set('timelineBackgroundWidth', $('.timeline-images').width());
    Session.set('timelineBackgroundHeight', $('.timeline-images').height());
    Session.set('firstImageWidth', _.first(images).thumbWidth);
    Session.set('lastImageWidth', _.last(images).thumbWidth);
    var timelineSVG = d3.select('.timeline-images')
        .append('svg')
        .attr('class', 'timeline-images-svg')
        .attr('width', Session.get('timelineBackgroundWidth'))
        .attr('height', Session.get('timelineBackgroundHeight'));
    var scaleFactor;

    var translateXs = [];

    // Draw each image
    _.each(images, function(image, i) {
        scaleFactor = getScaleFactor(images);
        translateXs[i] = drawTimelineImage(timelineSVG, image, i, scaleFactor);
    });
    Session.set('translateXs', translateXs);
}

/**
 * Calculate a horizontal position for the image
 *
 * Position is based on it's order in the timeline and the scaleFactor.
 */
function calculateTimelineImageX(i, image, scaleFactor) {
    var translateX;

    // Values for the first image
    var firstImageX = ( yearMarkerWidth / 2 );
    if (i === 0) {
        translateX = firstImageX;
    }

    // Values for the last image
    var lastImageX = Session.get('timelineBackgroundWidth') -
        ( image.thumbWidth * scaleFactor ) -
        ( ( imageBorder * 2 ) * scaleFactor) -
        ( yearMarkerWidth / 2 );

    if (i == (Session.get('imagesCount') - 1)){
        translateX = lastImageX;
    }

    // Values for the rest of the images
    //
    // First find the proper interval between images, and then set the
    // position based on the i value
    var centerInterval = (lastImageX - firstImageX) / ( Session.get('imagesCount') - 1 );
    if ((i !== 0) && (i != (Session.get('imagesCount') - 1))) {
        translateX = firstImageX + ( centerInterval * i );
    }

    return translateX;

}

/**
 * Calculate a vertical position for the image
 *
 * We use the image size to align all the images along the bottom of the timeline.
 */
function calculateTimelineImageY(image, scaleFactor) {
    var bottomY = Session.get('timelineBackgroundHeight') -
        ( image.thumbHeight * scaleFactor ) -
        ( ( imageBorder * 2 ) * scaleFactor ) -
        imageBottomPadding;
    return bottomY;
}

/**
 * Render a single timeline image
 */
function drawTimelineImage(timelineSVG, image, i, scaleFactor) {
    var centerX;
    var translateX;
    var bottomY;
    var imageCardWidth = image.thumbWidth + (imageBorder * 2);
    var imageCardHeight = image.thumbHeight + (imageBorder * 2);

    // Calculate image positions
    translateX = calculateTimelineImageX(i, image, scaleFactor);
    bottomY = calculateTimelineImageY(image, scaleFactor);

    /**
     * Create a SVG group for all of the picture elements
     *
     * We store data about the picture for manipulation by events via the DOM
     */
    var pictureGroup = timelineSVG.append('g')
        .attr('class', 'picture-group ' + 'picture-' + i)
        .attr('data-index', i)
        .attr('data-id', image._id)
        .attr('data-iso-date', image.isoDate)
        .attr('data-app-date', image.appDate)
        .attr('data-location', image.creationPlace)
        .attr('data-credit-line', image.creditLine)
        .attr('data-title', image.title)
        .attr('data-x', translateX)
        .attr('data-xh', image.expandedHeight)
        .attr('data-xw', image.expandedWidth)
        .attr('data-aspect', image.expandedAspectRatio)
        .attr('data-centerx', centerX)
        .attr('data-description', image.labelTextEnglish)
        .attr('data-description-es', image.labelTextSpanish);

    // SVG - draw drop shadow
    pictureGroup.append('defs')
        .append('filter')
        .attr('id', 'blur')
        .append('feGaussianBlur')
        .attr('stdDeviation', 5);
    pictureGroup.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .style('fill', '#000')
        .attr('width', imageCardWidth)
        .attr('height', imageCardHeight)
        .attr('class', 'child')
        .attr('filter', 'url(#blur)');

    // SVG - Draw picture's white border
    pictureGroup.append('rect')
        // Positions are relative to the group
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', imageCardWidth)
        .attr('height', imageCardHeight)
        .attr('class', 'child location-matte');

    // SVG draw the image
    pictureGroup.append('image')
        .attr('x', imageBorder)
        .attr('y', imageBorder)
        .attr('xlink:href', '/images/thumbnails/' + image._id + '.jpg')
        .attr('data-id', image._id)
        .attr('data-location', image.generalLocationDs)
        .attr('width', image.thumbWidth)
        .attr('height', image.thumbHeight)
        .attr('location', image.generalLocationDs)
        .attr('class', 'child');

    /**
     * Apply D3 trasforms to translate them to their correct X & Y position
     * and then to scale them to the right size based on the scaleFactor
     */
    pictureGroup
        .attr('transform', function (){
            var transform = 'translate(' + translateX + ',' + bottomY + ')' +
                ' scale(' + scaleFactor + ')';
            return transform;
        });

    /**
     * Fade in
     *
     * Start with all of the images hidden and then do a staggered fade in
     */
    pictureGroup.selectAll('.child')
        .attr('opacity', '0');
    pictureGroup.selectAll('.child')
        .transition()
        // Stagger the markers animating in
        .delay(i * delay)
        .attr('opacity', '1')
        .duration(dur);

    return translateX;

}

/**
 * Position timeline handle
 *
 * Position the handle center on our pointer
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
    console.log('posX - ', posX);
    var leftBound = ( yearMarkerWidth / 2 );
    if (posX <= leftBound) {
        posX = leftBound;
    }
    // Right edge
    var rightBound = 1580;
    if (posX >= rightBound) {
        posX = rightBound;
    }
    return posX;
}

/**
 * Determine a scale value based on mouse position
 */
//function getDistanceScale(pictureGroup, posInterval) {
    ////var distance = posInterval - Number(d3.select(picture).attr('data-index'));
    //var distance = posInterval - parseInt(pictureGroup.attr('data-index'), 10);
    //var distanceScale;
    //if (distance === 0) {
        //distanceScale = 1;
    //} else {
        //var minVal = 0.5;
        //var maxVal = 0.7;
        //distanceScale = ( minVal + (maxVal - minVal) * ( 1 / distance ));
    //}

    //return distanceScale;
//}

//function getPosInterval(posX) {
    //return Math.floor(posX / Session.get('intervalWidth'));
//}

//function getTimelineTransformString(posX, pictureGroup, distanceScale, i) {
    //var imageInGroup = pictureGroup.select('image');
    //var imageHeight = imageInGroup.attr('height');
    //var imageWidth = imageInGroup.attr('width');

    //// Get the current transform object
    //var dataCenterX = pictureGroup.attr('data-centerx');
    //var t = d3.transform(pictureGroup.attr('transform'));

    //var timelineImages = $('.timeline-images');
    //var timelineBackgroundHeight = timelineImages.height();

    /**
     * X position
     *
     * Position the image off its center, scaled by the size of the
     * image. Push the image right or left for the image border
     * based on whether it's on the left or the right side.
     */
    ////var imageBorderTranslate = imageBorder;
    ////if ( i >= ( Session.get('imagesCount') / 2 ) ) {
        ////imageBorderTranslate = imageBorder * -1;
    ////}
    ////var translateX = dataCenterX - ((imageWidth * distanceScale) / 2) + imageBorderTranslate;

    /**
     * Y position
     *
     * Highlight the current image by moving it up
     */
    ////var highlightHeight;
    ////if (getPosInterval(posX) == i) {
        ////highlightHeight = 50;
    ////} else {
        ////highlightHeight = 0;
    ////}
    ////var translateY = (
            ////timelineBackgroundHeight -
            ////( imageHeight * distanceScale ) -
            ////imageBorder -
            ////imageBottomPadding -
            ////highlightHeight);
    ////console.log('translateY - ', translateY);

    ////t.scale = [distanceScale, distanceScale];
    //t.translate = [
        //t.translate[0],
        //t.translate[1],
    //];
    //var transformString = t.toString();

    //return transformString;

//}

/**
 * Use the mouse cursor position to highlight the current image
 */
function highlightImageByPointer(pointerX) {

    // Position selection handle
    var posX = boundPosX(pointerX - Session.get('timelineOffset').left);
    positionHandle(posX);

    // Get the index of the image to highlight, based on mouse position
    var closestLeftEdgeIndex = getLeftist(Session.get('translateXs'), posX);

    // Update highlighted image: text and big image
    var hlImg = $('g[data-index=' + closestLeftEdgeIndex + ']');
    updateHighlightedImageText(hlImg);
    updateHighlightedImage(hlImg);

}

/**
 * Update highlighted image text
 *
 * Pull data from timeline images and store it in the Session.
 * The session variables are linked to template elements.
 */
function updateHighlightedImageText(hlImg) {
    Session.set('highlightedImageLocation', hlImg.data('location'));
    Session.set('highlightedImageDate', hlImg.data('app-date').substring(5));
    Session.set('highlightedImageDescription', hlImg.data('description'));
    Session.set('highlightedImageDescriptionEs', hlImg.data('description-es'));
    var highlightedImageCredit;
    if ((hlImg.data('credit-line')).length) {
        $('.image-detail div.image-credit-line').text('Courtesy of ' + hlImg.data('credit-line'));
    } else {
        $('.image-detail div.image-credit-line').text('');
    }
    Session.set('highlightedImageCredit', highlightedImageCredit);
}

/**
 * Update the big highlighted image
 */
function updateHighlightedImage(hlImg) {
    var hlImgId = hlImg.data('id');
    var hlImgExHeight = parseFloat(hlImg.data('xh'));
    var hlImgExWidth = parseFloat(hlImg.data('xw'));
    var hlImgAspect = parseFloat(hlImg.data('aspect'));
    var aspectR;

    /**
     * Bound image size based on aspect ratio
     *
     * For portrait images, that are taller than narrow, limit the height.
     */
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

    /**
     * Update the big image
     *
     * Only make changes when we need to.
     */
    var imagePath = '/images/expanded/' + hlImgId + '.jpg';
    if ($('.image-fullsize-image').attr('src') != imagePath) {
        $('.image-fullsize-image').attr('src', imagePath).stop(true, true).hide().fadeIn(400);
        $('.image-fullsize-image').attr('width', (hlImgExWidth));
        $('.image-fullsize-image').attr('height', (hlImgExHeight));
        $('.image-fullsize-image').attr('aspect', aspectR);
    }
}

