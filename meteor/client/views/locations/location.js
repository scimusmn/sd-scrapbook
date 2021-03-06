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
  },
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
      return DateUtils.getSortDate(image.isoDate);
    });

    var imagesCount = imagesCursor.count();
    Session.set('imagesCount', imagesCount);

    var intervalWidth = (timelineWidth / imagesCount);
    Session.set('intervalWidth', intervalWidth);

    /**
     * Draw the location assets
     */
    drawLocation(images);
  }, 300);

};

/**
 * Template Events
 */
Template.location.events(defineEvents());

function defineEvents() {
  var events = {
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
  };

  /**
   * Buttons for next and previous image
   */
  const imgNextButton = 'click .prev-next-buttons circle.button-left, ' +
    'click .prev-next-buttons polygon.button-left';
  events[imgNextButton] = function () {
    highlightImageByIndex(parseInt(Session.get('highlightedIndex'), 10) - 1);
  };

  const imgPrevButton = 'click .prev-next-buttons circle.button-right, ' +
    'click .prev-next-buttons polygon.button-right';
  events[imgPrevButton] = function () {
    highlightImageByIndex(parseInt(Session.get('highlightedIndex'), 10) + 1);
  };

  return events;
}

/**
 * Get the index of the image based on an array of edges
 *
 * Find out which two images the mouse is between.
 * Return the index of the left one.
 */
function getClosestEdgeIndex(array, target, middle) {
  var leftist = _.find(array, function (item) {
    return item > target;
  });

  if (typeof leftist === 'undefined') {
    leftist = array.length;
  } else {
    leftist = array.indexOf(leftist);
  }

  if (!middle) {
    leftist = leftist - 1;
  }

  return leftist;
}

/**
 * Draw the location page
 */
function drawLocation(images) {

  /**
   * Setup the location element, and fade it in on page load.
   *
   * The location element contains all the main content on this page.
   */
  var $locationContainer = $('.location');
  $locationContainer.css('opacity', 0);
  $locationContainer.addClass('animated fadeIn');

  /**
   * Setup the timeline
   */
  var $timelineBackground = $('.timeline-background');
  Session.set('$timelineBackgroundWidth', $timelineBackground.width());
  Session.set('$timelineBackgroundHeight', $timelineBackground.height());
  var $timelineBackgroundSVG  = d3.select('.timeline-background')
      .append('svg')
      .attr('class', 'timeline-background-svg')
      .attr('width', Session.get('$timelineBackgroundWidth'))
      .attr('height', Session.get('$timelineBackgroundHeight'));

  /**
   * Draw year markers at the start and end of the timeline
   */
  var firstYear = DateUtils.getNumericYear(_.first(images).isoDate);
  drawYearMarker($timelineBackgroundSVG, 0, 50, 50, 55, firstYear);
  var lastYear = DateUtils.getNumericYear(_.last(images).isoDate);
  drawYearMarker(
      $timelineBackgroundSVG,
      (Session.get('$timelineBackgroundWidth') - 100),
      50,
      (Session.get('$timelineBackgroundWidth') - 55), 55, lastYear
  );

  // Draw selection handle
  drawTimelineHandle($timelineBackgroundSVG);

  // Draw timeline images
  drawTimelineImages(images);

  /**
   * Highlight the image from the previous locations page
   *
   * When you first come to this page from the locations overview, you've
   * clicked on a specific picture within this location. This picture
   * should be highlighted when you first come to the page.
   *
   * Get the clicked image details from the URL and look up its index
   * for highlighting
   */
  var clickedImage = Router.current().params.query.image;
  var groupObj = d3.selectAll('g[data-id=' + clickedImage + ']');
  var dIndex = groupObj.attr('data-index');
  highlightImageByIndex(dIndex);

  // Save timeline offset for future transformation operations
  var $timeline = $('.timeline-images-svg');
  var timelineOffset = $timeline.parent().offset();
  Session.set('timelineOffset', timelineOffset);

  // Draw prev/next buttons
  var $locationContainerHeight = $locationContainer.height();
  var locationSVG  = d3.select('.location')
      .append('svg')
      .attr('class', 'prev-next-buttons')
      .attr('width', 1920)
      .attr('height', $locationContainerHeight);
  drawNavButton(locationSVG, 50, 400, 30, 'left');
  drawNavButton(locationSVG, 1860, 400, 30, 'right');

  // Dim button if on first or last image
  updatePrevNextButtons(dIndex);
}

/**
 * Draw nav button
 */
function drawNavButton(svg, cx, cy, r, direction) {
  // Background circle
  svg.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('class', 'button-' + direction)
      .attr('fill', '#e2d9c2')
      .attr('r', r);

  // Right or left pointing arrow
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
        .attr('points', function () {
          return triA.join(',') + ' ' + triB.join(',') + ' ' + triC.join(',');
        });
}

/**
 * Draw the timeline handle
 */
function drawTimelineHandle(svg) {
  svg.append('path')
      .style('stroke', '#341B1C')
      .style('fill', '#341B1C')
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

  _.each(images, function (image) {
    totalImagesWidth = (parseInt(totalImagesWidth, 10) + parseInt(image.thumbWidth, 10));
  });

  if (totalImagesWidth <= Session.get('$timelineBackgroundWidth')) {
    scaleFactor = 1;
  } else {
    scaleFactor = (
      (
        Session.get('$timelineBackgroundWidth') /
        (parseInt(totalImagesWidth, 10) +
        (Session.get('imagesCount') * 20))
      ) * fudgeFactor
    );
  }

  // Store scaleFactor for overlap checking in transformations
  Session.set('scaleFactor', scaleFactor);

  return scaleFactor;
}

/**
 * Render each image along the timeline
 *
 * We have to find first and last image information outside the loop
 */
function drawTimelineImages(images) {
  Session.set('timelineImagesWidth', $('.timeline-images').width());
  Session.set('timelineImagesHeight', $('.timeline-images').height());
  Session.set('firstImageWidth', _.first(images).thumbWidth);
  Session.set('lastImageWidth', _.last(images).thumbWidth);
  var timelineSVG = d3.select('.timeline-images')
      .append('svg')
      .attr('class', 'timeline-images-svg')
      .attr('width', Session.get('timelineImagesWidth'))
      .attr('height', Session.get('timelineImagesHeight'));
  var scaleFactor;

  var translateXs = [];
  var imageWidths = [];

  // Draw each image
  _.each(images, function (image, i) {
    scaleFactor = getScaleFactor(images);
    var translations = drawTimelineImage(timelineSVG, image, i, scaleFactor);
    translateXs[i] = translations[0];
    imageWidths[i] = translations[1];
  });

  Session.set('translateXs', translateXs);
  Session.set('imageWidths', imageWidths);
}

/**
 * Calculate a horizontal position for the image
 *
 * Position is based on it's order in the timeline and the scaleFactor.
 */
function calculateTimelineImageX(i, image, scaleFactor) {
  var translateX;

  // Values for the first image
  var firstImageX = (yearMarkerWidth / 2);
  if (i === 0) {
    translateX = firstImageX;
  }

  // Values for the last image
  var lastImageX = Session.get('timelineImagesWidth') -
      (image.thumbWidth * scaleFactor) -
      ((imageBorder * 2) * scaleFactor) -
      (yearMarkerWidth / 2);

  if (i == (Session.get('imagesCount') - 1)) {
    translateX = lastImageX;
  }

  // Values for the rest of the images
  //
  // First find the proper interval between images, and then set the
  // position based on the i value
  var centerInterval = (lastImageX - firstImageX) / (Session.get('imagesCount') - 1);
  if ((i !== 0) && (i != (Session.get('imagesCount') - 1))) {
    translateX = firstImageX + (centerInterval * i);
  }

  return translateX;

}

/**
 * Calculate a vertical position for the image
 *
 * We use the image size to align all the images along the bottom of the timeline.
 */
function calculateTimelineImageY(image, scaleFactor) {
  var bottomY = Session.get('timelineImagesHeight') -
      (image.thumbHeight * scaleFactor) -
      ((imageBorder * 2) * scaleFactor) -
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

  var thumbSrc = '/images/thumbnails/' + image._id + '.jpg';
  if (image.imageFilePaths && image.imageFilePaths[1]) {
    thumbSrc = image.imageFilePaths[1].src;
    if (Meteor.settings.public.kiosk == 'true') {
      var thumbFile = thumbSrc.split('/');
      var fileName = thumbFile[thumbFile.length - 1];
      var fileFolder = thumbFile[thumbFile.length - 2];
      thumbSrc = '/images/s3/' + fileFolder + '/' + fileName;
    }
  }

  var expandedSrc = '';
  if (image.imageFilePaths && image.imageFilePaths[0]) {
    expandedSrc = image.imageFilePaths[0].src;
    if (Meteor.settings.public.kiosk == 'true') {
      var expandedFile = expandedSrc.split('/');
      var expandedFileName = expandedFile[expandedFile.length - 1];
      var expandedFileFolder = expandedFile[expandedFile.length - 2];
      expandedSrc = '/images/s3/' + expandedFileFolder + '/' + expandedFileName;
    }
  }

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
      .attr('data-display-date', DateUtils.getDisplayDate(image.isoDate))
      .attr('data-location', image.creationPlace)
      .attr('data-credit-line', image.creditLine)
      .attr('data-title', image.title)
      .attr('data-x', translateX)
      .attr('data-expanded-src', expandedSrc)
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
  // Positions are relative to the group
  pictureGroup.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', imageCardWidth)
      .attr('height', imageCardHeight)
      .attr('class', 'child location-matte');

  // SVG draw the image
  pictureGroup.append('image')
      .attr('x', imageBorder)
      .attr('y', imageBorder)
      .attr('xlink:href', thumbSrc)
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
        .attr('transform', function () {
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

  return [translateX, image.thumbWidth];

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
  handle.attr('transform', function () {
    var transform = 'translate(' + (handleX) + ', 100)';
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
  var leftBound = (yearMarkerWidth / 2);
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
 * Use the mouse cursor position to highlight the current image
 */
function highlightImageByPointer(pointerX) {

  // Position selection handle
  var posX = boundPosX(pointerX - Session.get('timelineOffset').left);
  positionHandle(posX);

  /**
   * Get the index of the image to highlight
   *
   * We use different trigger functions, depending on whether the images
   * are overlapping or not.
   */
  var closestEdgeIndex;
  if (Session.get('scaleFactor') < 1) {
    closestEdgeIndex = getClosestEdgeIndex(
        Session.get('translateXs'), posX
    );
  } else {
    var translateXs = Session.get('translateXs');
    var imageWidths = Session.get('imageWidths');
    var rightEdges;
    rightEdges = _.map(translateXs, function (x, key) {
      return x + imageWidths[key];
    });

    var middlePoints = [];
    middlePoints = _.map(rightEdges, function (x, key) {
      if (key != rightEdges.length) {
        return (x + ((translateXs[key + 1] - x) / 2));
      } else {
        return (x + ((Session.get('timelineImagesWidth') - x) / 2));
      }
    });

    // Remove the undefined element.
    // Middle array is shorter than the right edge array.
    middlePoints.pop();

    closestEdgeIndex = getClosestEdgeIndex(
        middlePoints, posX, true
    );
  }

  Session.set('highlightedIndex', closestEdgeIndex);

  // Update prev/next buttons
  updatePrevNextButtons(closestEdgeIndex);

  // Update highlighted image: text and big image
  var $hlImg = $('g[data-index=' + closestEdgeIndex + ']');
  updateHighlightedImageText($hlImg);
  updateHighlightedImage($hlImg);

}

/**
 * Use the image index to highlight the current image
 */
function highlightImageByIndex(index) {

  // Trying to navigate beyond the timeline. Return false.
  if (index < 0 || index > (Session.get('imagesCount') - 1)) {
    return false;
  }

  // Get the highlighted image
  var $hlImg = $('g[data-index=' + index + ']');

  Session.set('highlightedIndex', index);

  // Update prev/next buttons
  updatePrevNextButtons(index);

  // Position selection handle
  updateHighlightedImageHandle(index);

  // Update highlighted image: text and big image
  updateHighlightedImageText($hlImg);
  updateHighlightedImage($hlImg);

  return true;

}

/**
 * Dim prev/next buttons if on first or last index
 */
function updatePrevNextButtons(index) {

  var $nextBtn = $('.prev-next-buttons circle.button-right, ' +
    '.prev-next-buttons polygon.button-right');
  var $prevBtn = $('.prev-next-buttons circle.button-left, ' +
    '.prev-next-buttons polygon.button-left');

  if (index <= 0) {
    $prevBtn.css('opacity', '0.35');
  } else {
    $prevBtn.css('opacity', '1.0');
  }

  if (index >= (Session.get('imagesCount') - 1)) {
    $nextBtn.css('opacity', '0.35');
  } else {
    $nextBtn.css('opacity', '1.0');
  }

}

/**
 * Move the handle to the appropriate position for a specific image
 */
function updateHighlightedImageHandle(index) {
  var posX;
  var $hlImg = $('g[data-index=' + index + ']');

  /**
   * Find appropriate handle location
   */

  if ((Session.get('imagesCount') - 1) == index) {

    // Last image
    var timelineRightEdge = Session.get('timelineImagesWidth') -
        (yearMarkerWidth / 2);
    posX = (
            $hlImg.data('x') +
            ((timelineRightEdge - $hlImg.data('x')) / 2)
           );

  } else {
    // All other images

    if (Session.get('scaleFactor') < 1) {
      /**
       * If images are overlapping position the handle in between the
       * two image X positions
       */
      var $nextImg = $('g[data-index=' + (parseInt(index, 10) + 1) + ']');
      posX = $hlImg.data('x') + (($nextImg.data('x') - $hlImg.data('x')) / 2);
    } else {
      /**
       * If images aren't overlapping, place the handle in the middle
       * of the image
       */
      var $thumbRect = $('g[data-index=' + (parseInt(index, 10)) + '] rect');
      var $thumbRectWidth = $thumbRect.attr('width');
      posX = $hlImg.data('x') + ($thumbRectWidth / 2);
    }
  }

  positionHandle(posX);
}

/**
 * Update highlighted image text
 *
 * Pull data from timeline images and store it in the Session.
 * The session variables are linked to template elements.
 */
function updateHighlightedImageText($hlImg) {
  Session.set('highlightedImageLocation', $hlImg.data('location'));
  Session.set('highlightedImageDate', $hlImg.data('display-date'));
  Session.set('highlightedImageDescription', $hlImg.data('description'));
  Session.set('highlightedImageDescriptionEs', $hlImg.data('description-es'));

  var highlightedImageCredit;
  if (($hlImg.data('credit-line')).length) {
    $('.image-detail div.image-credit-line').text('Courtesy of ' + $hlImg.data('credit-line'));
  } else {
    $('.image-detail div.image-credit-line').text('');
  }

  Session.set('highlightedImageCredit', highlightedImageCredit);
}

/**
 * Update the big highlighted image
 */
function updateHighlightedImage($hlImg) {
  var $hlImgId = $hlImg.data('id');
  var $hlImgExHeight = parseFloat($hlImg.data('xh'));
  var $hlImgExWidth = parseFloat($hlImg.data('xw'));
  var $hlImgAspect = parseFloat($hlImg.data('aspect'));
  var aspectR;

  /**
   * Bound image size based on aspect ratio
   *
   * For portrait images, that are taller than narrow, limit the height.
   */
  if ($hlImgAspect < 1) {
    if ($hlImgExHeight > 800) {
      $hlImgExHeight = 800;
    }

    $hlImgExWidth = $hlImgExHeight * $hlImgAspect;
    aspectR = $hlImgAspect;
  } else {
    /**
     * Landscape - wider than tall. Limit the width to 1000px
     */
    if ($hlImgExWidth > 1000) {
      $hlImgExWidth = 1000;
    }

    $hlImgExHeight = $hlImgExWidth / $hlImgAspect;
    aspectR = $hlImgAspect;
  }

  /**
   * Update the big image
   *
   * Only make changes when we need to.
   */

  // TODO : Eventually should remove non-standard way of pathing to full image
  var imagePath = '/images/expanded/' + $hlImgId + '.jpg';
  if ($hlImg.data('expanded-src') && $hlImg.data('expanded-src') !== '') {
    imagePath = $hlImg.data('expanded-src');
  }

  if ($('.image-fullsize-image').attr('src') != imagePath) {
    $('.image-fullsize-image').attr('src', imagePath).stop(true, true).hide().fadeIn(400);
    $('.image-fullsize-image').attr('width', ($hlImgExWidth));
    $('.image-fullsize-image').attr('height', ($hlImgExHeight));
    $('.image-fullsize-image').attr('aspect', aspectR);
  }
}
