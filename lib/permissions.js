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
  }
}
