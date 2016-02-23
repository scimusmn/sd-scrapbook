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
var schema = Images.attachSchema(new SimpleSchema({
  dsLocId: {
    type: Number,
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
    custom: function() {
      if (!this.value.match(/([0-9u]{4})-(\d{2})-(\d{2})/)) {
        return 'isoDateInvalid';
      }
    },
  },
  imageFilePaths: {
      type: [Object],
      label: 'Image File (10mb limit. PNGs and JPGs)', // (optional, defaults to "Select")
      optional: true, // (optional)
      custom: function() {
        var fileName = this.value[0].filename;
        fileName = fileName.toLowerCase();
        if (!fileName.match(/\.(jpg|jpeg|png|gif)$/)) {
          return 'wrongImageType';
        }
      },

      autoform: {
        type: 'slingshotFileUpload', // (required)
        removeLabel: 'Remove', // (optional, defaults to "Remove")
        afFieldInput: {
          // Specify which slingshotdirective to present as thumbnail when  this picture is uploaded, you can use the "key" or "directive".
          thumbnail: 'original',
          accept: ['image/png', 'image/jpeg', 'image/gif'],
          slingshotdirective: {
            original: {
              directive: 'originalImageDirective',
            },
            thumb: { // <-- This is the "key" for the "thumb" version.
              directive: 'thumbImageDirective',
              onBeforeUpload: function(file, callback) {

                // Create a thumbnail 175x175 size version.
                Resizer.resize(file, {width: 175, height: 175, cropSquare: false}, function(err, file) {
                  if (err) {
                    console.error(err);
                  }

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

  active: {
    type: Boolean,
    label: 'Active (Uncheck to hide)',
    optional: false,
    autoform: {
      afFieldInput: {
        type: 'boolean-checkbox',
        defaultValue: true,
      },
    },
  },

  title: {
    type: String,
    label: 'Title',
    defaultValue: '',
    max:30,
    optional: true,
  },
  creationPlace: {
    type: String,
    label: 'Creation place',
    defaultValue: '',
    max:30,
    optional: true,
  },
  creditLine: {
    type: String,
    label: 'Credit line',
    defaultValue: '',
    max:70,
    optional: true,
  },
  labelTextEnglish: {
    type: String,
    label: 'English label',
    defaultValue: '',
    optional: true,
    max:250,
    autoform: {
      rows: 3,
    },
  },
  labelTextSpanish: {
    type: String,
    label: 'Spanish label',
    defaultValue: '',
    optional: true,
    max:250,
    autoform: {
      rows: 3,
    },
  },
  expandedHeight: {
    type: Number,
    optional: true,
    autoform: {
      omit:true,
    },
  },
  expandedWidth: {
    type: Number,
    optional: true,
    autoform: {
      omit:true,
    },
  },
  expandedAspectRatio: {
    type: Number,
    decimal: true,
    optional: true,
    autoform: {
      omit:true,
    },
  },
  thumbWidth: {
    type: Number,
    optional: true,
    autoform: {
      omit:true,
    },
  },
  thumbHeight: {
    type: Number,
    optional: true,
    autoform: {
      omit:true,
    },
  },
  thumbAspectRatio: {
    type: Number,
    decimal: true,
    optional: true,
    autoform: {
      omit:true,
    },
  },

}));

SimpleSchema.messages({
  wrongImageType: 'Invalid file type. Please use .png, .jpg, or .jpeg.',
  isoDateInvalid: 'Use format YYYY-MM-DD (1968-02-23). Zeros denote no data (1987-01-00 = January, 1987) Within year, "u"s denote uncertainty (19uu = 1900s)',
});

