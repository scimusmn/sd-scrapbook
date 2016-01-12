/**
 * Images
 *
 * All code related to the Images collection goes here.
 */

Images = new Meteor.Collection('images');

// Allow/Deny

Images.allow({
  insert: function(userId, doc) {
    return can.createImage(userId);
  },

  update:  function(userId, doc, fieldNames, modifier) {
    return can.editImage(userId, doc);
  },

  remove:  function(userId, doc) {
    return can.removeImage(userId, doc);
  },
});

// Methods

Meteor.methods({
  createImage: function(image) {
    if (can.createImage(Meteor.user()))
        Images.insert(image);
  },

  removeImage: function(image) {
    if (can.removeImage(Meteor.user(), image)) {
      Images.remove(image._id);
    }else {
      throw new Meteor.Error(403, 'You do not have the rights to delete this image.')
    }
  },
});

// Attach schema for autoforms

Images.attachSchema(new SimpleSchema({
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
  formYear: {
    type: Number,
    label: 'Year (Required)',
    defaultValue: '0000',
    optional: false,
    autoform: {
      class: 'col-sm-6'
    },
  },
  formMonth: {
    type: Number,
    label: 'Month',
    defaultValue: '',
    optional: true,
    autoform: {
      class: 'col-sm-6'
    },
  },
  formDay: {
    type: Number,
    label: 'Day',
    defaultValue: '',
    optional: true,
    autoform: {
      class: 'col-sm-6'
    },
  },


  // image: {
  //   type: String,
  //   optional: true,
  //   autoform: {
  //     afFieldInput: {
  //       type: 'fileUpload',
  //       collection: 'imageFiles',
  //       accept: 'image/*',
  //       label: 'Image',
  //       removeLabel: 'Change',
  //     },
  //   },
  // },
  // isoDate: {
  //   type: Date,
  //   label: 'Date',
  // },

}));
