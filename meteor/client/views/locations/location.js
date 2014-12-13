/**
 * Single location
 *
 * This shows all the images in a timeline for the selected location.
 */

// Enable dev features
var dev = false;

/**
 * Image properties
 */
var imageBorder = 5; // White border aorund the picture
var imageBottomPadding = 10; // Whitespace below images
var delay = 5; // Milliseconds to delay the animation per image
var dur = 500; // Milliseconds for the image animation

Template.location.rendered = function () {

    /**
     * Setup image area
     */
    var locationContainer = $('.location');

    // Fade in the main location container
    locationContainer.addClass('animated fadeIn');

    var locationWidth = locationContainer.width();

    /**
     * Setup timeline background
     */
    var homeButtonWidth = 100;
    var timelineBackground = $('.timeline-background');
    var timelineBackgroundWidth = (
        locationWidth -
        timelineBackground.css('margin-left').replace('px', '') -
        timelineBackground.css('margin-right').replace('px', '') -
        homeButtonWidth - 150
    );
    //$('.timeline-background').style('margin-left', homeButtonWidth)
    var timelineBackgroundHeight = timelineBackground.height();
    var timelineSVG  = d3.select('.timeline-background')
        .append('svg')
        .attr('class', 'timeline-background-svg')
        .attr('width', timelineBackgroundWidth + 200)
        .attr('height', timelineBackgroundHeight + 40);

    /**
     * Setup timeline images area
     */
    var timelineImages = $('.timeline-images');
    var timelineImagesHeight = timelineImages.height();
    var timelineImagesSVG = d3.select('.timeline-images')
        .append('svg')
        .attr('class', 'timeline-images-svg')
        .attr('width', timelineBackgroundWidth)
        .attr('height', timelineImagesHeight);

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
        window.setTimeout(function () {
            renderLocation(timelineSVG, timelineImagesSVG, timelineBackgroundWidth, timelineImagesHeight);
        }, 500);

    });

};

/**
 * Render the location page
 */
function renderLocation(timelineSVG, timelineImagesSVG, timelineBackgroundWidth, timelineImagesHeight) {
    /**
     * Gather image data from the Meteor collection
     */
    var imagesCursor = Images.find();
    var imagesCount = imagesCursor.count();
    var images = imagesCursor.fetch();
    images = _.sortBy(images, function (image) {
        return image.isoDate;
    });

    /**
     * Date information for the timeline
     */
    var firstYear = _.first(images).isoDate.substring(4,8);
    var lastYear = _.last(images).isoDate.substring(4,8);

    /**
     * Define some set attributes that we can't find in the loop
     */
    var firstImageWidth = images[0].thumbWidth;
    var lastImageWidth = images[parseInt(imagesCount - 1)].thumbWidth;

    /**
     * Render each image from the Meteor collection data along the timeline
     */
    _.each(images, function(image, i) {
        drawImage(timelineImagesSVG, timelineBackgroundWidth, timelineImagesHeight, image, i, imagesCount, firstImageWidth, lastImageWidth);
    });

    /**
     * Find the clicked image and highlight it
     *
     * TODO - This is a hack. We're looking up the x position for the
     * image clicked and then passing it to the mousemove function.
     *
     * Figure out a better non-positional way to do this.
     */
    var clickedImage = Router.current().params.image;
    var clickedImageDom = $('g[data-id=' + clickedImage + ']');
    var clickedImageLeft = clickedImageDom.position().left;
    window.setTimeout(function () {
        highlightImage(clickedImageLeft + 140);
    }, 500);

    /**
     * Print the start and end years of the timeline
     */
    // Start - Drop shadow
    timelineSVG.append('defs')
        .append('filter')
        .attr('id', 'blur')
        .append('feGaussianBlur')
        .attr('stdDeviation', 5);

    // Start - Rectangle
    timelineSVG.append('rect')
        .attr('x', 0)
        .attr('y', 50)
        .attr('width', 95)
        .attr('height', 60)
        .style('fill', '#000')
        .attr('filter', 'url(#blur)');

    timelineSVG
        .append('rect')
        .attr('x', 0)
        .attr('y', 50)
        .attr('width', 95)
        .attr('height', 60)
        .attr('fill', 'white');

    // Start - Text
    timelineSVG
        .append('svg:text')
        .attr('x', 10)
        .attr('y', 97)
        .attr('class', 'time-label-start')
        .text(firstYear);

    var position = [50, 55];
    drawPin(timelineSVG, position);


    // End - Drop shadow
    timelineSVG.append('defs')
        .append('filter')
        .attr('id', 'blur')
        .append('feGaussianBlur')
        .attr('stdDeviation', 5);

    // End - Rectangle
    timelineSVG.append('rect')
        .attr('x', (timelineBackgroundWidth + 50))
        .attr('y', 50)
        .attr('width', 95)
        .attr('height', 60)
        .style('fill', '#000')
        .attr('filter', 'url(#blur)');

    timelineSVG
        .append('rect')
        .attr('x', (timelineBackgroundWidth + 50))
        .attr('y', 50)
        .attr('width', 95)
        .attr('height', 60)
        .attr('fill', 'white');

    // End - Text
    timelineSVG
        .append('svg:text')
        .attr('x', (timelineBackgroundWidth + 60))
        .attr('y', 97)
        .attr('class', 'time-label-end')
        .text(lastYear);

    position = [(timelineBackgroundWidth + 105), 55];
    drawPin(timelineSVG, position);

    // End
    //timelineSVG
        //.append('rect')
        //.attr('x', (timelineBackgroundWidth - 100))
        //.attr('y', 0)
        //.attr('width', 95)
        //.attr('height', 60)
        //.attr('fill', 'white');

    //timelineSVG
        //.append('svg:text')
        //.attr('x', (timelineBackgroundWidth - 90))
        //.attr('y', 47)
        //.attr('class', 'time-label-end')
        //.text(lastYear);

    /**
     * Render the timeline handle
     */
    //timelineSVG .append('rect')
        //.attr('width', '50')
        //.attr('height', '50')
        //.attr('x', 0)
        //.attr('y', 100);

    timelineSVG.append('image')
        .attr('xlink:href', '/images/hand-2.png')
        .attr('width', 75)
        .attr('height', 146)
        .attr('class', 'time-handle-rect');

    //timelineSVG.append('path')
        //.style('stroke', '#E0D0B4')
        //.style('fill', '#E0D0B4')
        ////.attr('width', 300)
        //.attr('class', 'time-handle-rect')
        //.attr('d', 'M 0,50, L 25,0, L 50,50 Z');

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
     * Picture group parent
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
        .attr('data-description-es', image.labelTextSpanish)
        .attr('transform', function (){
            return translate;
        });

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

    /**
     * Picture starting state
     *
     * Scale at 0
     * All child elements with an opacity of 0
     */
    pictureGroup
        .attr('transform', function (){
            var transform = translate + ',scale(0), rotate(45)';
            return transform;
        });
    pictureGroup.selectAll('.child')
        .attr('opacity', '0');

    /**
     * Picture - Animate in.
     *
     * Scale and opacity at 1
     */
    pictureGroup
        .transition()
        .delay(i * delay) // Stagger the markers animating in
        .attr('transform', function (){
            // Random roation code is slow. Debug before showing this off.
            //var transform = translate + ',scale(1),rotate(' + _.random(-20,20) + ')';
            var transform = translate + ',scale(1))';
            return transform;
        })
        .duration(dur);
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
    var timeline = $('.timeline-background-svg');

    /**
     * Determine which image to highlight based on pointer position
     */
    var posX = pointerX - timeline.parent().offset().left;
    var imagesCount = d3.selectAll('.picture-group')[0].length;
    var intervalWidth = (
            timeline.width() /
            imagesCount);
    var posInterval = Math.floor(posX / intervalWidth);

    /**
     * Timeline handle
     *
     * Position the handle center on our pointer, but prevent it
     * from going off the edge of the timeline.
     */
    var handle = d3.select('.time-handle-rect');
    var handleWidthHalf = ( handle.attr('width') / 2 );
    console.log('handleWidthHalf - ', handleWidthHalf);
    var handleX;
    if (posX <= (handleWidthHalf + 20)) {
        handleX = handleWidthHalf + 20;
    }
    if (posX >= (timeline.width() - handleWidthHalf - 40)) {
        handleX = (timeline.width() - handleWidthHalf) - 40;
    }
    if ( ( posX > handleWidthHalf ) && ( posX < ( timeline.width() - handleWidthHalf ) ) ) {
        handleX = posX;
    }
    handle.attr('transform', function (){
        var transform = 'translate(' + ( handleX - 50) + ', 40)';
        return transform;
    });

    //handle.attr( 'x', ( handleX - handleWidthHalf ) );

    /**
     * Scale the images based on mouse position
     *
     * Make the images nearest the cursor the biggest
     */
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
    $('.image-detail div.image-credit-line').text(hlImg.data('credit-line'));

    var hlImgId = hlImg.data('id');
    var hlImgExHeight = parseFloat(hlImg.data('xh'));
    var hlImgExWidth = parseFloat(hlImg.data('xw'));
    var hlImgAspect = parseFloat(hlImg.data('aspect'));

    /**
     * Portait - taller than narrow. Limit the height to 600px
     */
    var testVar;
    var aspectR;
    if (hlImgAspect < 1) {
        if (hlImgExHeight > 800) {
            hlImgExHeight = 800;
        }
        hlImgExWidth = hlImgExHeight * hlImgAspect;

        aspectR = hlImgAspect;
        testVar = 'portrait';
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
        testVar = 'landscape';
    }

    // Only change the image when we need to
    var imagePath = '/images/expanded/' + hlImgId + '.jpg';
    if ($('.big-picture-image').attr('src') != imagePath) {
        $('.big-picture-image').attr('src', imagePath).stop(true, true).hide().fadeIn(400);
        $('.big-picture-image').attr('width', (hlImgExWidth));
        $('.big-picture-image').attr('height', (hlImgExHeight));
        $('.big-picture-image').attr('temp', testVar);
        $('.big-picture-image').attr('aspect', aspectR);
    }

    /**
     * Dev mouse position data
     */
    if (dev) {
        $('.dev-mouse').html(
            'Rel pointer X = ' + posX + '<br>' +
            'Interval width = ' + intervalWidth + '<br>' +
            'Pos interval = ' + posInterval + '<br>'
        );
    }

}

function drawPin(svg, position) {

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
    var filterLoose = pinGroup.append('defs')
        .append('filter')
        .attr('id', 'pin-blur-tight')
        .attr('x', '-100')
        .attr('y', '-100')
        .attr('width', '200')
        .attr('height', '200')
        .append('feGaussianBlur')
        .attr('stdDeviation', 2);

    var filterTight = pinGroup.append('defs')
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
    var pinBodyShadow = pinGroup.append('rect')
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

    var pinHead = pinGroup.append('circle')
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

Template.location.events({
    // Desired functionality, but disabled for testing
    'mousemove .container': function (e) {
    //'click .container': function (e) {
        highlightImage(e.pageX);
    },

    'click .back': function(e, instance){
        console.clear();
    },

});
