/**
 * Template helpers
 */
Template.adminLocation.helpers({
  imageEntries: function() {

    return Images.find({}, {sort:{isoDate: 1}});

  },

});

Template.adminImageEntry.helpers({

  entry: function() {
    return Images.findOne(this._id);
  },

  thumbPath : function() {
    return '/images/thumbnails/' + this._id + '.jpg';
  },

});

/*
_id: "ds02040"
appDate: "date-September 2014, 20"
creationPlace: "Laguna Campground, CA"
creditLine: "Susanne Clara Bard"
dsLocId: 2
expandedAspectRatio: 1.28866
expandedHeight: 1164
expandedWidth: 1500
isoDate: "iso-20-09-2014"
labelTextEnglish: "Dripping water faucets at Laguna Campground provide a precious oasis for mountain birds like this female Acorn Woodpecker."
labelTextSpanish: "Los grifos que gotean en el campamento de Laguna proveen un invaluable oasis para los pájaros de la montaña como este carpintero bellotero hembra."
thumbHeight: 136
thumbWidth: 175
title: "Female Acorn Woodpecker"
*/
