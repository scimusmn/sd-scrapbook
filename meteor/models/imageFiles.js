Slingshot.fileRestrictions('originalImageDirective', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
  maxSize: 10 * 1024 * 1024, // 10 MB (use null for unlimited).
});

Slingshot.fileRestrictions('thumbImageDirective', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
  maxSize: 10 * 1024 * 1024, // 10 MB (use null for unlimited).
});

if (Meteor.isServer) {

  // Full size directive
  Slingshot.createDirective('originalImageDirective', Slingshot.S3Storage, {

    bucket: 'sd-scrapbook',
    region: 'us-west-2',
    acl: 'public-read',

    AWSAccessKeyId: Meteor.settings.public.aws.accessKeyId,
    AWSSecretAccessKey: Meteor.settings.public.aws.secretAccessKey,

    authorize: function() {
      return true;
    },

    key: function(file) {
      var filepath = 'originals/' + Meteor.uuid() + '-' + file.name;
      return filepath;
    },

  });

  // Thumbnail directive
  Slingshot.createDirective('thumbImageDirective', Slingshot.S3Storage, {

    bucket: 'sd-scrapbook',
    region: 'us-west-2',
    acl: 'public-read',

    AWSAccessKeyId: Meteor.settings.public.aws.accessKeyId,
    AWSSecretAccessKey: Meteor.settings.public.aws.secretAccessKey,

    authorize: function() {
      return true;
    },

    key: function(file) {
      var filepath = 'thumbs/' + Meteor.uuid() + '-' + file.name;
      return filepath;
    },

  });
}
