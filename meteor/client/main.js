/**
 * Hide or show cursor based on settings file
 */
if (Meteor.isClient) {
  if (Meteor.settings &&
    Meteor.settings.public &&
    Meteor.settings.public.cursor) {
    Meteor.startup(function () {
      console.log('body - ', $('body'));
      $('body').addClass('show-cursor');
    });
  } else {
    Meteor.startup(function () {
      console.log('body - ', $('body'));
      $('body').addClass('hide-cursor');
    });
  }
}
