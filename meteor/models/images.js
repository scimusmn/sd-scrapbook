/**
 * Images
 *
 * All code related to the Images collection goes here.
 */

Images = new Meteor.Collection('images');

// Allow/Deny

Images.allow({
    insert: function(userId, doc){
        return can.createImage(userId);
    },
    update:  function(userId, doc, fieldNames, modifier){
        return can.editImage(userId, doc);
    },
    remove:  function(userId, doc){
        return can.removeImage(userId, doc);
    }
});

// Methods

Meteor.methods({
    createImage: function(image){
        if(can.createImage(Meteor.user()))
            Images.insert(image);
    },
    removeImage: function(image){
        if(can.removeImage(Meteor.user(), image)){
            Images.remove(image._id);
        }else{
            throw new Meteor.Error(403, 'You do not have the rights to delete this image.')
        }
    }
});
