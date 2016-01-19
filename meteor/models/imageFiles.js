// Set up access for AWS S3 image file storage
var imageFileStore = new FS.Store.S3('imageFiles', {
  region: 'us-west-2', // Optional in most cases
  accessKeyId: Meteor.settings.public.aws.accessKeyId, // Required if environment variables are not set
  secretAccessKey: Meteor.settings.public.aws.secretAccessKey, // Required if environment variables are not set
  bucket: 'sd-scrapbook', // Required
});

ImageFiles = new FS.Collection('imageFiles', {
  stores: [imageFileStore],
});

// Set rules and subscriptions
ImageFiles.allow({
  insert: function(userId, doc) {
    return true;
  },

  update:  function(userId, doc, fieldNames, modifier) {
    return true;
  },

  remove:  function(userId, doc) {
    return true;
  },
});

