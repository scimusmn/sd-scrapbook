/* ---------------------------------------------------- +/

## Fixtures ##

Fill in the app with dummy data if database is empty.

/+ ---------------------------------------------------- */

/**
 * Locations
 */
if (Locations.find().count() === 0) {

  var sanDiegoCst = Locations.insert({
    title: "San Diego",
    description: "San Diego is a city along the coast.",
    latitude: "32.551019",
    longitude: "-117.111768"
  });

  var losAngeles = Locations.insert({
    title: "Los Angeles",
    description: "Los Angeles is a city",
    latitude: "34.0218628",
    longitude: "-118.4804206"
  });

  var anzaBorrego = Locations.insert({
    title: "Anza-Borrego Desert",
    description: "Anza-Borrego Desert State Park (ABDSP) is a state park located within the Colorado Desert of southern California, United States.",
    latitude: "33.100492",
    longitude: "-116.301327"

  });

}

/**
 * Images
 */
if (Images.find().count() === 0) {

  var ds01001 = Images.insert({
    title: "Fieldtrip",
    parentLocation: anzaBorrego,
    description: "Beaty, guide, and Mrs. Abbott among ocotillos during San Diego Natural History Museum trip to Borrego Valley and Thousand Palm Canyon.",
    latitude: "33.100492",
    longitude: "-116.301327",
    date: '1927'
  });

  var ds01002 = Images.insert({
    title: "Coyote Creek",
    parentLocation: anzaBorrego,
    description: "Beaty and Mrs. Abbott on edge of Coyote Creek during San Diego Natural History Museum trip to Borrego Valley and Thousand Palm Canyon.",
    latitude: "33.100492",
    longitude: "-116.301327",
    date: '1927'
  });

  var ds13004 = Images.insert({
    title: "",
    parentLocation: sanDiegoCst,
    description: "Tijuana Estuary",
    latitude: "32.551019",
    longitude: "-117.111768",
    date: '2014-Apr-11',
    photographer: 'Jim Melli'
  });

  var ds19001Then = Images.insert({
    title: "Alluvial Bluffs along the Pacific Coast north of Santa Monica Canyon.",
    parentLocation: losAngeles,
    description: "Alluvial Bluffs along the Pacific Coast north of Santa Monica Canyon. Pacific Ocean in background. Los Angeles County, Calfornia. ca 1904.",
    latitude: "33.100492",
    longitude: "-116.301327",
    date: '1927',
    photographer: 'Mendenhall, W.C.'
  });

}
