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

// ImageUtil
function loadImgDimensions(doc, isUpdate, callback) {

  var editDoc;
  if (isUpdate) {
    editDoc = doc.$set;
  } else {
    editDoc = doc;
  }

  if (editDoc.imageFilePaths == undefined || editDoc.imageFilePaths == 'undefined' || !editDoc.imageFilePaths) {
    callback(doc);
    return false;
  }

  var expandedSrc = editDoc.imageFilePaths[0].src;
  var thumbSrc = editDoc.imageFilePaths[1].src;
  var myImage = new Image();
  var myThumbImage = new Image();

  var expandedLoaded = false;
  var thumbLoaded = false;

  myImage.onload = function() {

    console.log('\' Expanded is ' + this.width + ' by ' + this.height + ' pixels in size.');

    editDoc.expandedWidth = this.width;
    editDoc.expandedHeight = this.height;
    editDoc.expandedAspectRatio = (this.width / this.height).toFixed(4);

    expandedLoaded = true;
    if (thumbLoaded && expandedLoaded) {
      if (isUpdate) {
        callback({$set:editDoc});
        return true;
      } else {
        callback(editDoc);
        return true;
      }
    }

  };

  myThumbImage.onload = function() {

    console.log('\' Thumb is ' + this.width + ' by ' + this.height + ' pixels in size.');

    editDoc.thumbWidth = this.width;
    editDoc.thumbHeight = this.height;
    editDoc.thumbAspectRatio = (this.width / this.height).toFixed(4);

    thumbLoaded = true;
    if (thumbLoaded && expandedLoaded) {
      if (isUpdate) {
        callback({$set:editDoc});
        return true;
      } else {
        callback(editDoc);
        return true;
      }
    }

  };

  myImage.onerror = function() {

    console.log('\'' + this.name + '\' (expanded) failed to load.');
    callback(doc);
    return false;

  };

  myThumbImage.onerror = function() {

    console.log('\'' + this.name + '\' (thumb) failed to load.');
    callback(doc);
    return false;

  };

  myImage.src = expandedSrc;
  myThumbImage.src = thumbSrc;

}

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

        // Add image meta data
        loadImgDimensions(doc, false, this.result);

      },

      update: function(doc) {

        // Add image meta data
        loadImgDimensions(doc, true, this.result);

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
