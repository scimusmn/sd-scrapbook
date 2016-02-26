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
    label: function() {
      return getToolTipLabel('Date ( yyyy-mm-dd )', 'Use <em><strong>0</strong></em> to mark no data (1987-01-00 --> January, 1987).  &nbsp;Use <em><strong>u</strong></em> to mark uncertainty (19uu --> 1900s).');
    },

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
      label: function() {
        return getToolTipLabel('Image File', 'Max filesize is 10mb. Allowed file-types are PNGs and JPGs.');
      },

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
    label: function() {
      return getToolTipLabel('Title', 'Character limit: 150. Only displays if <em>Creation place</em> is left empty.');
    },

    defaultValue: '',
    max:150,
    optional: true,
  },
  creationPlace: {
    type: String,
    label: function() {
      return getToolTipLabel('Creation place', 'Character limit: 60.');
    },

    defaultValue: '',
    max:60,
    optional: true,
  },
  creditLine: {
    type: String,
    label: function() {
      return getToolTipLabel('Credit line', 'Character limit: 130.');
    },

    defaultValue: '',
    max:130,
    optional: true,
  },
  labelTextEnglish: {
    type: String,
    label: function() {
      return getToolTipLabel('English label', 'Character limit: 275.');
    },

    defaultValue: '',
    optional: true,
    max:275,
    autoform: {
      rows: 3,
    },
  },
  labelTextSpanish: {
    type: String,
    label: function() {
      return getToolTipLabel('Spanish label', 'Character limit: 340.');
    },

    defaultValue: '',
    optional: true,
    max:340,
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

function getToolTipLabel(labelTxt, tipTxt) {
  return new Spacebars.SafeString(labelTxt + '&nbsp;<i class="fa fa-question-circle tip" data-tooltip-direction="e" data-tooltip="' + tipTxt + '"></i>');
}

