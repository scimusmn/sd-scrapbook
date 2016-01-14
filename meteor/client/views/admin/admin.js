/**
 * Template helpers
 */
Template.admin.helpers({

  tableSettings: function() {
    return {
      collection: Locations.find({}, {sort:{title:1}}),

      showNavigation: 'auto',
      showNavigationRowsPerPage: false,
      showFilter: false,
      rowsPerPage:30,
      fields: ['title',
                'link',
                { key:'link',label: 'action', fn: function(value) {
                  var hrefLink = 'http://' + window.location.host + '/admin/locations/' + value + '/';
                  return new Spacebars.SafeString('<a href="' + hrefLink + '"><i class="fa fa-search"></i> View</a>');
                },},],
    };
  },

});
