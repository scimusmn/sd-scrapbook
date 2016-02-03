Slingshot.fileRestrictions('imageFiles', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
  maxSize: 10 * 1024 * 1024, // 10 MB (use null for unlimited).
});

// Slingshot.fileRestrictions('imageThumbFiles', {
//   allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
//   maxSize: 10 * 1024 * 1024, // 10 MB (use null for unlimited).
// });

if (Meteor.isServer) {

  Slingshot.createDirective('imageFiles', Slingshot.S3Storage, {
    bucket: 'sd-scrapbook',

    acl: 'public-read',

    authorize: function() {
      return true;
    },

    key: function(file) {

      var uniqueId = Meteor.uuid();
      var uniqueFilename = uniqueId + '-' + file.name;
      console.log('new key');
      console.log(uniqueFilename);
      return uniqueFilename;

    },

    region: 'us-west-2',
    AWSAccessKeyId: Meteor.settings.public.aws.accessKeyId,
    AWSSecretAccessKey: Meteor.settings.public.aws.secretAccessKey,

  });

  // Slingshot.createDirective('imageThumbFiles', Slingshot.S3Storage, {
  //   bucket: 'sd-scrapbook',

  //   acl: 'public-read',

  //   authorize: function() {
  //     return true;
  //   },

  //   key: function(file) {

  //     var uniqueId = Meteor.uuid();
  //     var uniqueFilename = 'thumb-' + uniqueId + '-' + file.name;
  //     console.log('new thumb key');
  //     console.log(uniqueFilename);
  //     return uniqueFilename;

  //   },

  //   region: 'us-west-2',
  //   AWSAccessKeyId: Meteor.settings.public.aws.accessKeyId,
  //   AWSSecretAccessKey: Meteor.settings.public.aws.secretAccessKey,

  // });
}
