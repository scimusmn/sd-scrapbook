/* ---------------------------------------------------- +/

## Image ##

Code related to the image template

/+ ---------------------------------------------------- */

Template.image.created = function () {
  //
};

Template.image.helpers({

  myHelper: function () {
    //
  }

});

Template.image.rendered = function () {
  //
};

Template.image.events({

  'click .delete': function(e, instance){
    var image = this;
    e.preventDefault();
    Meteor.call('removeImage', image, function(error, result){
      alert('Image deleted.');
      Router.go('/images');
    });
  }

});
