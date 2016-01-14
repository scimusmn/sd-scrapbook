/**
 * Template helpers
 */

 // Helpers for adminLocation template
Template.adminLocation.helpers({
  imageEntries: function() {

    return Images.find({}, {sort:{isoDate: 1}});

  },

  thumbPath: function() {
    return '/images/thumbnails/' + this._id + '.jpg';
  },

  tableSettings: function() {
    return {
      collection: Images.find({}, {sort:{isoDate: 1}}),

      showNavigation: 'auto',
      showNavigationRowsPerPage: true,
      showFilter: true,
      rowsPerPage: 5,
      fields: ['isoDate',
                'title',
                'creationPlace',
                'creditLine',
                { key:'_id', label: 'thumb', fn: function(value) {
                  var thmPath = '/images/thumbnails/' + value + '.jpg';
                  return new Spacebars.SafeString('<img src="' + thmPath + '" height=70 />');
                },
              },
                { key:'_id', label: 'action', fn: function(value) {
                  return new Spacebars.SafeString('<a id="' + value + '" class="edit btn btn-default"><i class="fa fa-pencil"></i> Edit</a> &nbsp; <a id="' + value + '" class="delete btn btn-default"><i class="fa fa-trash-o"></i> Delete</a>');
                },
              },
            ],
    };
  },

});

// Helpers for adminEditModal template
Template.adminEditModal.helpers({

  editImage: function() {

    return Images.findOne({ _id: Session.get('adminCurrentImageId') });

  },

  updateOrInsertMode: function() {

    if (Session.get('adminCurrentImageId') && Session.get('adminCurrentImageId') !== '') {
      return 'update';
    } else {
      return 'insert';
    }

  },

  modalHeader: function() {

    if (Session.get('adminCurrentImageId') && Session.get('adminCurrentImageId') !== '') {
      return 'EDIT IMAGE';
    } else {
      return 'ADD NEW IMAGE';
    }

  },

});

Template.adminLocation.events({
  /**
   * Entry click
   */
  'click .btn.edit, click .btn.add':function(e) {

    var clickedId = $(e.currentTarget).attr('id');

    console.log(clickedId);

    if (clickedId === 'addBtn') {

      Session.set('adminCurrentImageId', '');
      $('#editModal').modal('show');

    } else {

      Session.set('adminCurrentImageId', clickedId);

      var imgDoc = Images.findOne({_id:Session.get('adminCurrentImageId')});

      $('#editModal').modal('show');

    }

  },

  'click .btn.delete':function(e) {

    var imgToDeleteId = $(e.currentTarget).attr('id');

    console.log('delete clicked:', imgToDeleteId);

    var response = confirm('Are you sure you want to delete Image ' + imgToDeleteId + '?');

    if (response == true) {
      Images.remove(imgToDeleteId);
    } else {
      console.log('Deletion canceled.');
    }

  },

});

/**
 * Hooks for autoform. Manipulate data before/after submission.
 */
AutoForm.hooks({

  form_imageEntry: {

    before: {

      insert: function(doc) {

        console.log('before date: ' + doc.isoDate);

        // Add location Id to create link to current location
        var locationId = Locations.findOne().dsLocId;
        var locationTitle = Locations.findOne().title;
        doc.dsLocId = locationId;
        doc.generalLocationDs = locationTitle;

        this.result(doc);// (asynchronous)

      },

    },

    docToForm: function(doc, ss) {

      console.log('isoDate:\n' + doc.isoDate);

      // Remove unneccessary iso prepend (cleaning old data)
      if (doc.isoDate && doc.isoDate.indexOf('iso-') != -1) {
        doc.isoDate = doc.isoDate.replace('iso-', '');
      }

      return doc;

    },

    // Called when any submit operation succeeds
    onSuccess: function(formType, result) {

      console.log('autoform success:', formType, result);

      // // Hide modal
      $('#editModal').modal('hide');
      $('#editModal form')[0].reset();

    },

    // Called when any submit operation fails
    onError: function(formType, error) {
      console.log('autoform error:', formType, error);

    },

  },

});
