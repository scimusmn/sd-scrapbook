// Run by opening mongo shell in meteor directory, then:
// load('public/mongoScripts/addDateFields.js')

// Add dateCreated and dateModified fields to
// any entries that do not currently have them.
// Use the default date of January 17, 2015 (Opening date of exhibit)

// Warning: Will overwrite any datefields currently set.
db.images.update({ }, {$set: {dateCreated:'Sat Jan 17 2015 00:00:00 GMT-0600 (CST)'}}, {multi:true});
db.images.update({ }, {$set: {dateModified:'Sat Jan 17 2015 00:00:00 GMT-0600 (CST)'}}, {multi:true});
