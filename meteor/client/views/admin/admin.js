/**
 * Template helpers
 */
Template.admin.helpers({
  locations: function () {
    return Locations.find({}, { sort: { title: 1 } });
  },

  locationCount: function () {
    var count =  Images.find({ generalLocationDs: this.title }).count();
    console.log('count: ', count);
  },

  thumb: function () {
    var image =  Images.findOne({ generalLocationDs: this.title });
    var thumb = _.find(image.imageFilePaths, function (item) {
      return item.key == 'thumb';
    });

    return thumb;
  },

  link: function () {
    var hrefLink = 'http://' + window.location.host + '/admin/locations/' + this.link + '/';
    return hrefLink;

    // return new Spacebars.SafeString(
    //   '<a href="' + hrefLink + '">' + this.title + '</a>'
    // );

  },

});

Template.admin.events({

  'click a.preview':function (e) {

    Session.set('adminCurrentPreviewURL', '/');
    Session.set('adminCurrentReturnURL', '/admin/');
    Session.set('adminCurrentReturnName', 'All locations');

  },

});

Template.admin.onRendered(function () {
  $('body').addClass('admin');
});
