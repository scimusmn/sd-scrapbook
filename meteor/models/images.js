/**
 * Images
 *
 * All code related to the Images collection goes here.
 */

Images = new Meteor.Collection('images');

// Allow/Deny
Images.allow({
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

// Attach schema for autoforms
Images.attachSchema(new SimpleSchema({
  dsLocId: {
    type: String,
    optional: false,
    autoform: {
      omit:true,
    },
  },
  generalLocationDs: {
    type: String,
    optional: false,
    autoform: {
      omit:true,
    },
  },
  isoDate: {
    type: String,
    label: 'Date ( yyyy-mm-dd )',
    defaultValue: '0000-00-00',
    max:10,
    min:10,
    optional: false,
  },

  imageFilePaths: {
      // This package can also take type: [String],
      // but in that case it will only save the src.
      type: [Object],
      label: 'Image File', // (optional, defaults to "Select")
      optional: true, // (optional)
      autoform: {
        type: 'slingshotFileUpload', // (required)
        removeLabel: 'Remove', // (optional, defaults to "Remove")
        afFieldInput: {
          // Specify which slingshotdirective to present as thumbnail when  this picture is uploaded, you can use the "key" or "directive".
          thumbnail: 'original',
          slingshotdirective: {
            original: {
              directive: 'originalImageDirective',
              onBeforeUpload: function(file, callback) {
                // Size down if larger than 5000x5000
                Resizer.resize(file, {width: 5000, height: 5000, cropSquare: false}, function(err, file) {
                  if (err) {
                    console.error(err);
                  }

                  // Change filename before upload.
                  var origName = file.name;
                  var extension = origName.substr(origName.lastIndexOf('.'));
                  var locFolder = Session.get('adminCurrentLocationLink');
                  var unique = Meteor.uuid();

                  file.name = locFolder + '/originals/' + unique + extension;

                  callback(file);

                });
              },
            },
            thumb: { // <-- This is the "key" for the "thumb" version.
              directive: 'thumbImageDirective',
              onBeforeUpload: function(file, callback) {
                // Create a thumbnail 175x175 size version.
                Resizer.resize(file, {width: 175, height: 175, cropSquare: false}, function(err, file) {
                  if (err) {
                    console.error(err);
                  }

                  // Change filename before upload.
                  var origName = file.name;
                  var extension = origName.substr(origName.lastIndexOf('.'));
                  var locFolder = Session.get('adminCurrentLocationLink');
                  var unique = Meteor.uuid();

                  file.name = locFolder + '/thumbs/' + unique + extension;

                  callback(file);

                });
              },
            },
          },
        },
      },
    },

  // NOTICE! These are required for the above type: slingshot [Object].
  'imageFilePaths.$.key': { type: String },
  'imageFilePaths.$.filename': { type: String },
  'imageFilePaths.$.src': { type: String },
  'imageFilePaths.$.directive': { type: String },

  title: {
    type: String,
    label: 'Title',
    defaultValue: '',
    optional: true,
  },
  creationPlace: {
    type: String,
    label: 'Creation place',
    defaultValue: '',
    optional: true,
  },
  creditLine: {
    type: String,
    label: 'Credit line',
    defaultValue: '',
    optional: true,
  },
  labelTextEnglish: {
    type: String,
    label: 'English label',
    defaultValue: '',
    optional: true,
    autoform: {
      rows: 3,
    },
  },
  labelTextSpanish: {
    type: String,
    label: 'Spanish label',
    defaultValue: '',
    optional: true,
    autoform: {
      rows: 3,
    },
  },

}));

