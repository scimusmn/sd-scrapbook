/**
 * Template helpers
 */

 // Helpers for adminLocation template
Template.adminLocation.helpers({
  imageEntries: function() {

    return Images.find({}, {sort:{isoDate: 1}});

  },

});

// Helpers for adminImageEntry template
Template.adminImageEntry.helpers({

  entry: function() {
    return Images.findOne(this._id);
  },

  thumbPath: function() {
    return '/images/thumbnails/' + this._id + '.jpg';
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
      return 'EDIT ' + Session.get('adminCurrentImageId');
    } else {
      return 'ADD';
    }

  },

});

Template.adminLocation.events({
  /**
   * Entry click
   */
  'click .imageList .btn':function(e) {

    var clickedId = $(e.currentTarget).attr('id');

    console.log(clickedId);

    if (clickedId === 'addBtn') {

      // TODO = show add new image form

    } else {

      Session.set('adminCurrentImageId', clickedId);

      var imgDoc = Images.findOne({_id:Session.get('adminCurrentImageId')});
      console.log(imgDoc.title);

      // TODO = Show edit image form populated with data.
      $('#editModal').modal('show');

    }

  },

});

/**
 * Hooks for autoform. Manipulate data before/after submission.
 */
AutoForm.hooks({

  form_imageEntry: {

    before: {
      // Replace `formType` with the form `type` attribute to which this hook applies
      insert: function(doc) {

        // Alter the doc to include
        // Todo - assign adminLocationation id

        // Then return it or pass it to this.result()
        return doc;

        //this.result(doc); (asynchronous)

      },

      update: function(doc) {

        // Alter the doc as needed
        console.log('update doc', doc);

        // Then return it or pass it to this.result()
        return doc;

        //this.result(doc); (asynchronous)

      },
    },

    docToForm: function(doc, ss) {
      console.log('doc', doc);
      console.log('ss', ss);

      console.log(doc.isoDate);

      // Date strings are formatted like this: iso-2014-00-00
      // So we must break it apart
      // var split = doc.isoDate.split('-');
      // var year = split[1];
      // var month = split[2];
      // var day = split[3];

      // doc.date.year = year;
      // doc.date.month = month;
      // doc.date.day = day;

      // console.log(split);

      return doc;

    },

    // Called when any submit operation succeeds
    onSuccess: function(formType, result) {

      console.log('autoform success:', formType, result);

      var flipbookId = result;

      // Add new flipbook to corresponding project
      var projectId = Session.get('activeProjectId');

      Projects.update({_id: projectId}, {$addToSet: {flipbookIds: flipbookId}});

      // Hide modal
      $('#add_flipbook').modal('hide');
      $('#add_flipbook form')[0].reset();

    },

    // Called when any submit operation fails
    onError: function(formType, error) {
      console.log('autoform error:', formType, error);

    },

  },

});
