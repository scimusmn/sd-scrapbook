/* ---------------------------------------------------- +/

## Fixtures ##

Fill in the app with dummy data if database is empty.

/+ ---------------------------------------------------- */

// Fixture data
if (Locations.find().count() === 0) {

  Locations.insert({
    title: "Eridanus",
    description: "Eridanus is a constellation. It is represented as a river; its name is the Ancient Greek name for the Po River.",
    latitude: "32.715",
    longitude: "-117.1625"
  });

  Locations.insert({
    title: "Cassiopeia",
    description: "Cassiopeia is a constellation in the northern sky, named after the vain queen Cassiopeia in Greek mythology, who boasted about her unrivalled beauty.",
    latitude: "34.05",
    longitude: "-118.25"
  });

  Locations.insert({
    title: "Anza-Borrego Desert",
    description: "Anza-Borrego Desert State Park (ABDSP) is a state park located within the Colorado Desert of southern California, United States.",
    latitude: "33.100492",
    longitude: "-116.301327"

  });

}

if (Images.find().count() === 0) {

  Images.insert({
    title: "Fieldtrip",
    description: "Beaty, guide, and Mrs. Abbott among ocotillos during San Diego Natural History Museum trip to Borrego Valley and Thousand Palm Canyon.",
    latitude: "33.100492",
    longitude: "-116.301327"

  });

}
