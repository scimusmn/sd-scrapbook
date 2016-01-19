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

// Methods

Meteor.methods({
  createImage: function(image) {
    Images.insert(image);
  },

  removeImage: function(image) {
    Images.remove(image._id);
  },
});

// Attach schema for autoforms
Images.attachSchema(new SimpleSchema({
  // imageFile: {
  //   type: String,
  //   optional: false,
  //   autoform: {
  //     afFieldInput: {
  //       type: 'fileUpload',
  //       collection: 'imageFiles',
  //       accept: 'image/*',
  //       label: 'Image File',
  //       removeLabel: 'Change',
  //     },
  //   },
  // },
  isoDate: {
    type: String,
    label: 'Date ( yyyy-mm-dd )',
    defaultValue: '0000-00-00',
    max:10,
    min:10,
    optional: false,
  },
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
