/* ---------------------------------------------------- +/

## Locations ##

All code related to the Locations collection goes here.

/+ ---------------------------------------------------- */

Locations = new Meteor.Collection('locations');

// Allow/Deny

Locations.allow({
  insert: function(userId, doc){
    return can.createLocation(userId);
  },
  update:  function(userId, doc, fieldNames, modifier){
    return can.editLocation(userId, doc);
  },
  remove:  function(userId, doc){
    return can.removeLocation(userId, doc);
  }
});

// Methods

Meteor.methods({
  createLocation: function(location){
    if(can.createLocation(Meteor.user()))
      Locations.insert(location);
  },
  removeLocation: function(location){
    if(can.removeLocation(Meteor.user(), location)){
      Locations.remove(location._id);
    }else{
      throw new Meteor.Error(403, 'You do not have the rights to delete this location.')
    }
  }
});
