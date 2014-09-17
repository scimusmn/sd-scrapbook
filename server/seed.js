/* ---------------------------------------------------- +/

## Fixtures ##

Fill in the app with dummy data if database is empty.

/+ ---------------------------------------------------- */

// Fixture data
if (Locations.find().count() === 0) {

  Locations.insert({
    title: "Eridanus",
    body: "Eridanus is a constellation. It is represented as a river; its name is the Ancient Greek name for the Po River.",
    latitude: "32.715",
    longitude: "-117.1625"
  });

  Locations.insert({
    title: "Cassiopeia",
    body: "Cassiopeia is a constellation in the northern sky, named after the vain queen Cassiopeia in Greek mythology, who boasted about her unrivalled beauty.",
    latitude: "34.05",
    longitude: "-118.25"
  });

  Locations.insert({
    title: "Scorpius",
    body: "Scorpius, sometimes known as Scorpio, is one of the constellations of the zodiac.",
    latitude: "33.05",
    longitude: "-118.25"
  });

}
