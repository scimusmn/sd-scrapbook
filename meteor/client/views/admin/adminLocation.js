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
      rowsPerPage: 10,
      fields: ['isoDate',
                'title',
                'creationPlace',
                'creditLine',
                { key:'_id', label: 'thumb', fn: function(value) {
                  var thmPath = '/images/thumbnails/' + value + '.jpg';
                  return new Spacebars.SafeString('<img class="tableThumb" src="' + thmPath + '" height=25 />');
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
    console.log('expand', $(e.currentTarget).attr('src'), e.clientY);
    var expandSrc = $(e.currentTarget).attr('src');
    $('#tableThumbPreview').show();
    $('#tableThumbPreview img').attr('src', expandSrc);
    $('#tableThumbPreview').css('top', e.clientY);
    $('#tableThumbPreview').css('left', e.clientX);
  },

  'mousemove table img.tableThumb':function(e) {
    $('#tableThumbPreview').show();
    $('#tableThumbPreview').css('top', e.clientY);
    $('#tableThumbPreview').css('left', e.clientX);
  },

  'mouseleave table img.tableThumb':function(e) {
    console.log('leave', $(e.currentTarget).attr('src'));
    $('#tableThumbPreview').hide();
  },

});

Template.adminEditModal.events({

  'change .myFileInput': function(event, template) {

    FS.Utility.eachFile(event, function(file) {
      Images.insert(file, function(err, fileObj) {
        if (err) {
          // Handle error
          console.log('Image Upload Error:', err);
        } else {
          // Handle success depending what you need to do
          console.log('Image upload success...');
          console.log(fileObj);
        }
      });
    });

  },
});

Template.uploader.events({

  'change input[type="file"]':function(event, template) {
    //Modules.client.uploadToAmazonS3( { event: event, template: template } );

    ///

    console.log('before img upload -----');

    var imageFileUploader = new Slingshot.Upload('imageFiles');

    imageFileUploader.send($('.upload-area input')[0].files[0], function(error, downloadUrl) {
      if (error) {
        // Log service detailed response.
        console.error('img Error uploading', uploader.xhr.response);
        alert(error);
      } else {
        console.log('img upload success! ', downloadUrl);

        //Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
      }
    });


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
