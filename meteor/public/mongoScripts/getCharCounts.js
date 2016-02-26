
// This script is for finding the current longest
// character count for each text field in the Images collection.

// Run by opening mongo shell in meteor directory, then:
// load('public/mongoScripts/getCharCounts.js')

function printFieldMinMax(fieldName) {
  var max = 0;
  var min = db.images.findOne()[fieldName].length;
  var maxId = '';

  db.images.find().forEach(function(doc) {
    var currentLength = doc[fieldName].length;
    if (currentLength > max) {
      max = currentLength;
      maxId = doc._id;
    }

    if (currentLength < min) {
      min = currentLength;
    }
  });

  print(fieldName);
  print('max:' + max + ' (' + maxId + ')');
  print('min:' + min);
  print('\n');

}

function printCharCounts(fieldNames) {
  for (var i = 0; i < fieldNames.length; i++) {
    printFieldMinMax(fieldNames[i]);
  }
}

printCharCounts(['title', 'creationPlace', 'creditLine', 'labelTextEnglish', 'labelTextSpanish']);
