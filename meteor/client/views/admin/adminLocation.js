/**
 * Template helpers
 */

 // Helpers for adminLocation template
Template.adminLocation.helpers({
  imageEntries: function() {

    return Images.find({}, {sort:{isoDate: 1}});

  },

  tableSettings: function() {
    return {
      collection: Images.find({}, {sort:{isoDate: 1}}),

      showNavigation: 'auto',
      showNavigationRowsPerPage: true,
      showFilter: true,
      rowsPerPage: 10,
      fields: ['isoDate',
                'title',
                'creationPlace',
                'creditLine',
                { key:'_id', label: 'thumb', fn: function(value) {
                  var thumbPath = '/images/thumbnails/' + value + '.jpg';
                  var previewPath = thumbPath;
                  var imgDoc = Images.findOne({ _id: value });
                  if (imgDoc) {
                    if (imgDoc.imageFilePaths) {
                      thumbPath = imgDoc.imageFilePaths[1].src;
                      previewPath = imgDoc.imageFilePaths[0].src;
                    }
                  }

                  return new Spacebars.SafeString('<img class="tableThumb" src="' + thumbPath + '" height=25 data-preview-src="' + previewPath + '" />');
                },
              },
                { key:'_id', label: 'action', fn: function(value) {
                  return new Spacebars.SafeString('<a id="' + value + '" href="#" class="edit"><i class="fa fa-pencil"></i> Edit</a> &nbsp; <a id="' + value + '" href="#" class="delete"><i class="fa fa-trash-o"></i> Delete</a>');
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
  'click a.edit, click .btn.add':function(e) {

    var clickedId = $(e.currentTarget).attr('id');

    if (clickedId === 'addBtn') {

      Session.set('adminCurrentImageId', '');
      $('#editModal').modal('show');

    } else {

      Session.set('adminCurrentImageId', clickedId);

      $('#editModal').modal('show');

    }

  },

  'click a.delete':function(e) {

    var imgToDeleteId = $(e.currentTarget).attr('id');

    console.log('delete clicked:', imgToDeleteId);

    var response = confirm('Are you sure you want to delete Image ' + imgToDeleteId + '?');

    if (response == true) {
      Images.remove(imgToDeleteId);
    } else {
      console.log('Deletion canceled.');
    }

  },

  'mouseenter table img.tableThumb':function(e) {

    var expandSrc = $(e.currentTarget).attr('data-preview-src');
    var preview = $('#tableThumbPreview');
    $('#tableThumbPreview img').attr('src', expandSrc);
    preview.css('top', e.clientY - preview.outerHeight() / 2);
    preview.css('right', $(document).width() - e.clientX + 17);
    preview.delay(150).stop().fadeIn(70);

  },

  'mousemove table img.tableThumb':function(e) {
    var preview = $('#tableThumbPreview');
    preview.css('top', e.clientY - preview.outerHeight() / 2);
    preview.css('right', $(document).width() - e.clientX + 17);
  },

  'mouseleave table img.tableThumb':function(e) {
    $('#tableThumbPreview').stop().hide();
  },

  'show.bs.modal':function(e) {

    // Hack to fix autoform bug.
    // Clears image upload form when
    // no imageFilePaths are found. -tn
    setTimeout(function() {
      var imgDoc = Images.findOne({ _id: Session.get('adminCurrentImageId') });
      if (imgDoc) {
        if (imgDoc.imageFilePaths) {
          // Already has image. Allow to display.
          return;
        }
      }

      $('#editModal .file-upload-clear').trigger('click');
    }, 20);

  },

  'shown.bs.modal':function(e) {

  },

});

/**
 * Hooks for autoform. Manipulate data before/after submission.
 */
AutoForm.hooks({

  formImageEntry: {

    before: {

      insert: function(doc) {

        // Add location Id to create link to current location
        doc.dsLocId = Locations.findOne().dsLocId;
        doc.generalLocationDs = Locations.findOne().title;

        this.result(doc); // (asynchronous)

      },

      update: function(doc) {

        this.result(doc); // (asynchronous)

      },

    },

    docToForm: function(doc, ss) {

      // TODO - Remove unneccessary iso prepend (cleaning old data)
      if (doc.isoDate && doc.isoDate.indexOf('iso-') != -1) {
        doc.isoDate = doc.isoDate.replace('iso-', '');
      }

      return doc;

    },

    // Called when any submit operation succeeds
    onSuccess: function(formType, result) {

      console.log('autoform success:', formType, result);

      if (formType === 'insert') {
        Session.set('adminCurrentImageId', result);

      }

      console.log('New doc:');
      console.log(Images.findOne(Session.get('adminCurrentImageId')));

      // Hide modal
      $('#editModal').modal('hide');
      $('#editModal form')[0].reset();

    },

    // Called when any submit operation fails
    onError: function(formType, error) {

      console.log('Autoform error:', formType, error);

    },

  },

});
