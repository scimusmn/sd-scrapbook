/**
* Template helpers
*/

Template.adminLocation.onRendered(function () {
  $('body').addClass('admin');
});

// Helpers for adminLocation template
Template.adminLocation.helpers({

  imageEntries: function () {

    return Images.find({}, { sort:{ isoDate: 1 } });

  },

  tableSettings: function () {
    return {
      collection: Images.find({}, { sort:{ isoDate: 1 } }),

      showNavigation: 'auto',
      showNavigationRowsPerPage: true,
      class: 'table table-striped col-sm-12 reactive-table',
      filters: ['myFilter'],
      showFilter: false,
      rowsPerPage: 100,
      fields: [
        { key: 'dsNumber', label: 'DS Number' },
        { key: 'isoDate', label: 'Date' },
        { key: 'title', label: 'Title' },
        { key: 'creationPlace', label: 'Creation place' },
        { key: 'creditLine', label: 'Credit line' },

        {
          key:'active',
          label: 'Active',
          headerClass: 'something-else',
          cellClass: 'something-else',
          fn: function (value) {
            if (value === true) {
              return new Spacebars.SafeString('<div class="text-center">' +
                '<i class="fa fa-check"></i></div>');
            } else {
              return new Spacebars.SafeString('');
            }
          },
        },

        {
          key:'_id',
          label: 'Thumbnail',
          sortable: false,
          fn: function (value) {
            var thumbPath = '/images/thumbnails/' + value + '.jpg';
            var previewPath = thumbPath;
            var imgDoc = Images.findOne({ _id: value });
            if (imgDoc) {
              if (imgDoc.imageFilePaths) {
                thumbPath = imgDoc.imageFilePaths[1].src;
                previewPath = imgDoc.imageFilePaths[0].src;
              }
            }

            return new Spacebars.SafeString(
              '<img class="tableThumb" src="' + thumbPath +
              '" height=50 data-preview-src="' + previewPath +
              '" />'
            );
          },
        },

        /* Edit */
        {
          key:'_id',
          label: 'Actions',
          sortable: false,
          fn: function (value) {
            var htmlString = '<div class="text-center"><a id="' + value +
              '" href="#" class="btn btn-primary edit">' +
              '<i class="fa fa-pencil"></i><br>Edit</a></div>';
            return new Spacebars.SafeString(htmlString);
          },
        },

        /* Delete */
        {
          key:'_id',
          label: '',
          sortable: false,
          fn: function (value) {
            var htmlstring = '<div class="text-center"><a id="' + value +
              '" href="#" class="btn btn-danger delete">' +
              '<i class="fa fa-trash-o"></i><br>Delete</a></div>';
            return new Spacebars.SafeString(htmlstring);
          },
        },

        /* Preview */
        {
          key:'_id',
          label: '',
          sortable: false,
          fn: function (value) {
            var htmlString = '';
            if (Images.findOne(value).active === true) htmlString += (
              '<div class="text-center"><a id="' + value +
              '" href="/admin/preview/" class="btn btn-info preview">' +
              '<i class="fa fa-eye"></i><br>Preview</a></div>'
            );
            return new Spacebars.SafeString(htmlString);
          },
        },

      ],
    };
  },

});

// Helpers for adminEditModal template
Template.adminEditModal.helpers({

  editImage: function () {

    return Images.findOne({ _id: Session.get('adminCurrentImageId') });

  },

  updateOrInsertMode: function () {

    if (Session.get('adminCurrentImageId') && Session.get('adminCurrentImageId') !== '') {
      return 'update';
    } else {
      return 'insert';
    }

  },

  modalHeader: function () {

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
  'click a.edit, click .btn.add':function (e) {

    var clickedId = $(e.currentTarget).attr('id');

    if (clickedId === 'addBtn') {

      Session.set('adminCurrentImageId', '');
      $('#editModal').modal('show');

    } else {

      Session.set('adminCurrentImageId', clickedId);
      $('#editModal').modal('show');

    }

  },

  'click a.delete':function (e) {

    var imgToDeleteId = $(e.currentTarget).attr('id');

    console.log('delete clicked:', imgToDeleteId);

    var response = confirm('Are you sure you want to delete Image ' + imgToDeleteId + '?');

    if (response == true) {
      Images.remove(imgToDeleteId);
    } else {
      console.log('Deletion canceled.');
    }

  },

  'click a.preview':function (e) {

    var imgToPreviewId = $(e.currentTarget).attr('id');

    // Example link to image...
    // /riverside?image=ds20001

    var currentLink = Locations.findOne().link;
    var previewURL = 'http://' + window.location.host + '/location/' + currentLink + '';
    if (imgToPreviewId) {
      previewURL += '?image=' + imgToPreviewId;
    }

    Session.set('adminCurrentPreviewURL', previewURL);
    Session.set('adminCurrentReturnURL', '/admin/locations/' + currentLink);
    Session.set('adminCurrentReturnName', Locations.findOne().title);
    console.log('teete');

    // Router.go('/admin/preview');

  },

  'mouseenter table img.tableThumb':function (e) {

    var expandSrc = $(e.currentTarget).attr('data-preview-src');
    var $preview = $('#tableThumbPreview');
    $('#tableThumbPreview img').attr('src', expandSrc);
    $preview.css('top', e.clientY - $preview.outerHeight() / 2);
    $preview.css('right', $(document).width() - e.clientX + 17);
    $preview.delay(150).stop().fadeIn(70);

  },

  'mousemove table img.tableThumb':function (e) {
    var $preview = $('#tableThumbPreview');
    $preview.css('top', e.clientY - $preview.outerHeight() / 2);
    $preview.css('right', $(document).width() - e.clientX + 17);
  },

  'mouseleave table img.tableThumb':function (e) {
    $('#tableThumbPreview').stop().hide();
  },

  'show.bs.modal':function (e) {

    // Hack to fix autoform bug.
    // Clears image upload form when
    // no imageFilePaths are found. -tn
    setTimeout(function () {
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

  'shown.bs.modal':function (e) {

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

  if (
    editDoc.imageFilePaths == undefined ||
    editDoc.imageFilePaths == 'undefined' ||
    !editDoc.imageFilePaths
  ) {
    callback(doc);
    return false;
  }

  var expandedSrc = editDoc.imageFilePaths[0].src;
  var thumbSrc = editDoc.imageFilePaths[1].src;
  var myImage = new Image();
  var myThumbImage = new Image();

  var expandedLoaded = false;
  var thumbLoaded = false;

  myImage.onload = function () {

    console.log('\' Expanded is ' + this.width + ' by ' + this.height + ' pixels in size.');

    editDoc.expandedWidth = this.width;
    editDoc.expandedHeight = this.height;
    editDoc.expandedAspectRatio = (this.width / this.height).toFixed(4);

    expandedLoaded = true;
    if (thumbLoaded && expandedLoaded) {
      if (isUpdate) {
        callback({ $set:editDoc });
        return true;
      } else {
        callback(editDoc);
        return true;
      }
    }

  };

  myThumbImage.onload = function () {

    console.log('\' Thumb is ' + this.width + ' by ' + this.height + ' pixels in size.');

    editDoc.thumbWidth = this.width;
    editDoc.thumbHeight = this.height;
    editDoc.thumbAspectRatio = (this.width / this.height).toFixed(4);

    thumbLoaded = true;
    if (thumbLoaded && expandedLoaded) {
      if (isUpdate) {
        callback({ $set:editDoc });
        return true;
      } else {
        callback(editDoc);
        return true;
      }
    }

  };

  myImage.onerror = function () {

    console.log('\'' + this.name + '\' (expanded) failed to load.');
    callback(doc);
    return false;

  };

  myThumbImage.onerror = function () {

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

      insert: function (doc) {

        // Add location Id to create link to current location
        doc.dsLocId = Locations.findOne().dsLocId;
        doc.generalLocationDs = Locations.findOne().title;

        // Add image meta data
        loadImgDimensions(doc, false, this.result);

      },

      update: function (doc) {

        // Add image meta data
        loadImgDimensions(doc, true, this.result);

      },

    },

    docToForm: function (doc, ss) {

      return doc;

    },

    // Called when any submit operation succeeds
    onSuccess: function (formType, result) {

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
    onError: function (formType, error) {

      console.log('Autoform error:', formType, error);

    },

  },

});
