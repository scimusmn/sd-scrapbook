Template.adminPreview.helpers({

  previewURL: function() {

    if (!Session.get('adminCurrentPreviewURL')) {
      Session.set('adminCurrentPreviewURL', '/');
    }

    return Session.get('adminCurrentPreviewURL');

  },

  returnURL: function() {

    if (!Session.get('adminCurrentReturnURL')) {
      Session.set('adminCurrentReturnURL', '/admin/');
    }

    return Session.get('adminCurrentReturnURL');

  },

  returnLocationName: function() {

    if (!Session.get('adminCurrentReturnName')) {
      Session.set('adminCurrentReturnName', 'Admin');
    }

    return Session.get('adminCurrentReturnName');
  },

});

Template.adminPreview.events({

  'click .zoomBtns a': function(e) {

    var clickedId = $(e.currentTarget).attr('id');

    var scaleVal = parseFloat(clickedId);

    console.log(scaleVal);

    $('.iframe-container iframe').css({
        '-webkit-transform': 'scale(' + scaleVal + ')',
        '-moz-transform': 'scale(' + scaleVal + ')',
        '-ms-transform': 'scale(' + scaleVal + ')',
        '-o-transform': 'scale(' + scaleVal + ')',
        'transform': 'scale(' + scaleVal + ')',
      });

  },

});
