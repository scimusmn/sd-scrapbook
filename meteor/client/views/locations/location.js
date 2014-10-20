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
    locationContainer.addClass('animated fadeIn92');

    var locationWidth = locationContainer.width();

    /**
     * Setup timeline background
     */
    var timelineBackground = $('.timeline-background');
    var timelineBackgroundWidth = (
        locationWidth -
        timelineBackground.css('margin-left').replace('px', '') -
        timelineBackground.css('margin-right').replace('px', '')
    );
    var timelineBackgroundHeight = timelineBackground.height();
    var timelineSVG  = d3.select('.timeline-background')
        .append('svg')
        .attr('class', 'timeline-background-svg')
        .attr('width', timelineBackgroundWidth)
        .attr('height', timelineBackgroundHeight);

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
        return image.date;
    });

    /**
     * Date information for the timeline
     */
    var firstYear = _.first(images).date.substring(0,4);
    var lastYear = _.last(images).date.substring(0,4);

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
    // Start
    timelineSVG
        .append('svg:text')
        .attr('x', 10)
        .attr('y', 35)
        .attr('class', 'time-label-start')
        .text(firstYear);

    // End
    timelineSVG
        .append('svg:text')
        .attr('x', (timelineBackgroundWidth - 90))
        .attr('y', 35)
        .attr('class', 'time-label-end')
        .text(lastYear);

    /**
     * Render the timeline handle
     */
    timelineSVG .append('rect')
        .attr('width', '50')
        .attr('height', '50')
        .attr('class', 'time-handle-rect')
        .attr('x', 0)
        .attr('y', 0);

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
        .attr('data-date', image.date)
        .attr('data-location', image.creationPlace)
        .attr('data-photographer', image.photographer)
        .attr('data-title', image.title)
        .attr('data-xh', image.expandedHeight)
        .attr('data-centerx', centerX)
        .attr('data-description', image.description)
        .attr('transform', function (){
            return translate;
        });

        /**
        * Picture drop shadow
        */
        var filter = pictureGroup.append('defs')
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
    var randomRotation = Math.floor(Math.random()*6) + 1;
    randomRotation *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
    pictureGroup
        .transition()
        .delay(i * delay) // Stagger the markers animating in
        .attr('transform', function (){
            var transform = translate + ',scale(1),rotate(' + randomRotation + ')';
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
    var handleX;
    if (posX <= handleWidthHalf) {
        handleX = handleWidthHalf;
    }
    if (posX >= timeline.width() - handleWidthHalf) {
        handleX = (timeline.width() - handleWidthHalf);
    }
    if ( ( posX > handleWidthHalf ) && ( posX < ( timeline.width() - handleWidthHalf ) ) ) {
        handleX = posX;
    }
    handle.attr( 'x', ( handleX - handleWidthHalf ) );

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
    $('.image-detail span.image-description').text(hlImgDescription);
    $('.image-detail span.image-location').text(hlImg.data('location'));
    $('.image-detail span.image-date').text(hlImg.data('date'));
    $('.image-detail span.image-photographer').text(hlImg.data('photographer'));

    var hlImgId = hlImg.data('id');
    var hlImgExHeight = hlImg.data('xh');

    // Only change the image when we need to
    var imagePath = '/images/expanded/' + hlImgId + '.jpg';
    if ($('.big-picture-image').attr('src') != imagePath) {
        $('.big-picture-image').attr('src', imagePath).stop(true, true).hide().fadeIn(400);
        $('.big-picture-image').attr('height', (parseInt(hlImgExHeight) / 2));
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

Template.location.events({
    // Desired functionality, but disabled for testing
    //'mousemove .container': function (e) {
    'click .container': function (e) {
        highlightImage(e.pageX);
    },

    'click .back': function(e, instance){
        console.clear();
    },

});
