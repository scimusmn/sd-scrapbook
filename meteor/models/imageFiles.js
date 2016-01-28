/*
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

*/

Slingshot.fileRestrictions('imageFiles', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
});

if (Meteor.isServer) {
  Slingshot.createDirective("imageFiles", Slingshot.S3Storage, {
    bucket: "sd-scrapbook",

    acl: "public-read",

    authorize: function () {
      //Deny uploads if user is not logged in.
      // if (!this.userId) {
      //   var message = "Please login before posting files";
      //   throw new Meteor.Error("Login Required", message);
      // }

      return true;
    },

    key: function (file) {
      //Store file into a directory by the user's username.
      // var user = Meteor.users.findOne(this.userId);
      // return user.username + "/" + file.name;
      return file.name;
    },

    region: 'us-west-2',
    AWSAccessKeyId: Meteor.settings.public.aws.accessKeyId,
    AWSSecretAccessKey: Meteor.settings.public.aws.secretAccessKey,

  });
}

