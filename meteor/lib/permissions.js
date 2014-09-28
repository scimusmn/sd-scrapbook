/* ---------------------------------------------------- +/

## Permissions ##

Permission checks

Usage:

if (can.editItem(Meteor.user(), myItem)){
  // do something
}

/+ ---------------------------------------------------- */

can = {
  createLocation: function (userId) {
    return true;
  },
  editLocation: function (userId, location) {
    return userId === location.userId;
  },
  removeLocation: function (userId, location) {
    return userId === location.userId;
  },
  createImage: function (userId) {
    return true;
  },
  editImage: function (userId, image) {
    return userId === image.userId;
  },
  removeImage: function (userId, image) {
    return userId === image.userId;
  }
}
