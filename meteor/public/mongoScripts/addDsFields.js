// Run by opening mongo shell in meteor directory, then:
// load('public/mongoScripts/addDsFields.js')

// Take the DS number data from the existing _id
// field for each location and copy it to a new
// field called "DS Number"

// Add dsNumber field to all images, and default it to true.
db.images.update({ }, {$set: {dsNumber:'ds00000'}}, {multi:true});

var allImagesCursor =  db.images.find({ });

while (allImagesCursor.hasNext()) {

  var myImage = allImagesCursor.next();
  var myId = myImage._id;

  var myDsNumber = '';
  if (myId.substring(0, 2) === 'ds' && myId.length === 7) {
    myDsNumber = myId;
  } else {
    myDsNumber = '';
    print('Could not convert to DS Number: ' + myId);
  }

  db.images.update({ _id: myId }, {$set: {dsNumber:myDsNumber}}, {});

}
