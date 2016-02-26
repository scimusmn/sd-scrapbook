
// This script is built to transition from using
// local image files to using images hosted on S3.
// A change necessary for addimg admin and user upload
// capabilites.

// Run by opening mongo shell in meteor directory, then:
// load('public/mongoScripts/imagesToS3.js')

// Add active field to all images, and default it to true.
print('Adding active fields to all images ...');
db.images.update({ }, {$set: {active:true}}, {multi:true});

// TODO: Add new imagepath URL to every image, pointing to
// S3 servers, and assuming image has kept same name.
print('Adding imageFilePaths fields to all images ...');

var allImagesCursor =  db.images.find({ });

while (allImagesCursor.hasNext()) {

  var myImage = allImagesCursor.next();
  var myId = myImage._id;

  // Create original file info
  var originalFilename = 'originals/' + myId + '.jpg';
  var originalImageObject = {

    'key':'original',
    'directive':'originalImageDirective',
    'filename': originalFilename,
    'src':'https://sd-scrapbook.s3-us-west-2.amazonaws.com/' + originalFilename,

  };

  // Create thumb file info
  var thumbFilename = 'thumbs/' + myId + '.jpg';
  var thumbImageObject = {

    'key':'thumb',
    'directive':'thumbImageDirective',
    'filename': thumbFilename,
    'src':'https://sd-scrapbook.s3-us-west-2.amazonaws.com/' + thumbFilename,

  };

  var myImageFilePaths = [];
  myImageFilePaths[0] = originalImageObject;
  myImageFilePaths[1] = thumbImageObject;

  db.images.update({ _id: myId }, {$set: {imageFilePaths:myImageFilePaths}}, {});

  // Remove 'iso-' string from images when found
  var myIsoDate = myImage.isoDate;
  myIsoDate = myIsoDate.replace('iso-', '');
  db.images.update({ _id: myId }, {$set: {isoDate:myIsoDate}}, {});

}

print('Done.');
