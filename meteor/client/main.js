/**
 * Hide or show cursor based on settings file
 */
if (Meteor.isClient) {

  /**
   * Kiosk mode
   * Set a body class for kiosk mode.
   * This controls the display of the cursor and the screensaver.
   * In kiosk mode, the cursor is hidden and the screensaver is enabled.
   * In admin mode, the cursor is visible and the screensaver is disenabled.
   */
  if (
    Meteor.settings &&
    Meteor.settings.public &&
    Meteor.settings.public.kiosk == 'true'
  ) {
    Meteor.startup(function () {
       $('body').addClass('kiosk-mode');
     });
  } else {
    Meteor.startup(function () {
       $('body').addClass('admin-mode');
     });
  }

}
