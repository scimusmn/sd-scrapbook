Slingshot.fileRestrictions('imageFiles', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
});

if (Meteor.isServer) {
  Slingshot.createDirective('imageFiles', Slingshot.S3Storage, {
    bucket: 'sd-scrapbook',

    acl: 'public-read',

    authorize: function() {
      return true;
    },

    key: function(file) {
      // TODO - decide filename based on current image entry id
      // Session.get('currentImageEntry') + '_thumb' ;

      //Store file into a directory by the user's username.
      // var user = Meteor.users.findOne(this.userId);
      // return user.username + "/" + file.name;

      console.log('uploaded name', file.name);
      console.log('uploaded locationId', file.locationId);

      return file.name;
    },

    region: 'us-west-2',
    AWSAccessKeyId: Meteor.settings.public.aws.accessKeyId,
    AWSSecretAccessKey: Meteor.settings.public.aws.secretAccessKey,

  });
}
