/* ---------------------------------------------------- +/

## Fixtures ##

Fill in the app with dummy data if database is empty.

/+ ---------------------------------------------------- */

/**
 * Locations
 */
if (Locations.find().count() === 0) {

  var anzaBorrego = Locations.insert({
    title: 'Anza Borrego',
    link: 'anza-borrego',
    description: 'Anza-Borrego Desert State Park (ABDSP) is a state park located within the Colorado Desert of southern California, United States.',
    latitude: '33.9863839',
    longitude: '-116.0195514',
    dsLocId: '1'
  });

  var clevelandNationalForest = Locations.insert({
    title: 'Cleveland National Forest',
    link: 'cleveland-nat',
    description: 'Cleveland National Forest encompasses 460,000 acres (720 sq mi (1,900 km2)), mostly of chaparral, with a few riparian areas.',
    latitude: '32.810463',
    longitude: '-116.673912',
    dsLocId: '2'
  });

  var coloradoRiver = Locations.insert({
    title: 'Colorado River',
    link: 'colorado-river',
    description: '',
    latitude: '33.499948',
    longitude: '-114.591832',
    dsLocId: '3'
  });

  var imperialValley = Locations.insert({
    title: 'Imperial Valley',
    link: 'imperial-valley',
    description: '',
    latitude: '32.7375477',
    longitude: '-114.9633007',
    dsLocId: '4'
  });

  var joshuaTree = Locations.insert({
    title: 'Joshua Tree and eastern Colorado desert',
    link: 'joshua-tree',
    description: '',
    latitude: '33.714274',
    longitude: '-115.313118',
    dsLocId: '5'
  });

  var sdNorthCoast = Locations.insert({
    title: 'San Diego - North Coast',
    link: 'san-diego-north',
    description: '',
    latitude: '32.868837',
    longitude: '-117.254309',
    dsLocId: '6'
  });

  var mojaveDesert = Locations.insert({
    title: 'Mojave Desert',
    link: 'mojave-desert',
    description: '',
    latitude: '35.8413084',
    longitude: '-116.3521761',
    dsLocId: '7'
  });

  var northSDCounty = Locations.insert({
    title: 'North San Diego County',
    link: 'north-san-diego-county',
    description: '',
    latitude: '33.366311',
    longitude: '-117.214997',
    dsLocId: '8'
  });

  var orangeCounty = Locations.insert({
    title: 'Orange County',
    link: 'orange-county',
    description: '',
    latitude: '33.810516',
    longitude: '-117.820227',
    dsLocId: '9'
  });

  var palomarMountain = Locations.insert({
    title: 'Palomar Mountain',
    link: 'palomar-mountain',
    description: '',
    latitude: '33.389664',
    longitude: '-116.895629',
    dsLocId: '10'
  });

  var saltonSea = Locations.insert({
    title: 'Salton Sea',
    link: 'salton-sea',
    description: '',
    latitude: '33.3093964',
    longitude: '-115.8392996',
    dsLocId: '11'
  });

  var sanBerardino = Locations.insert({
    title: 'San Berardino Mountains',
    link: 'san-bernardino',
    description: '',
    latitude: '34.184340',
    longitude: '-117.089876',
    dsLocId: '12'
  });

  var sanDiegoCoast = Locations.insert({
    title: 'San Diego - Coast',
    link: 'san-diego-coast',
    description: '',
    latitude: '32.694081',
    longitude: '-117.232840',
    dsLocId: '13'
  });

  var sanDiegoInland = Locations.insert({
    title: 'San Diego - Inland',
    link: 'san-diego-inland',
    description: '',
    latitude: '32.732099',
    longitude: '-117.147372',
    dsLocId: '14'
  });

  var sanGabriel = Locations.insert({
    title: 'San Gabriel Mountains',
    link: 'san-gabriel',
    description: '',
    latitude: '34.2888927',
    longitude: '-117.64672',
    dsLocId: '15'
  });

  var sanJacinto = Locations.insert({
    title: 'San Jacinto Mountains',
    link: 'san-jacinto',
    description: '',
    latitude: '33.8418194',
    longitude: '-117.1809458',
    dsLocId: '16'
  });

  var santaMonica = Locations.insert({
    title: 'Santa Monica Mountains and Coast',
    link: 'santa-monica',
    description: '',
    latitude: '34.1202995',
    longitude: '-118.9318',
    dsLocId: '17'
  });

  var southSDCounty = Locations.insert({
    title: 'South San Diego County',
    link: 'south-san-diego',
    description: '',
    latitude: '32.622338',
    longitude: '-116.442152',
    dsLocId: '18'
  });

  var losAngeles = Locations.insert({
    title: 'Los Angeles',
    link: 'los-angeles',
    description: '',
    latitude: '34.0204989',
    longitude: '-118.4117325',
    dsLocId: '19'
  });

  var riverside = Locations.insert({
    title: 'Riverside',
    link: 'riverside',
    description: '',
    latitude: '33.994096',
    longitude: '-117.357879',
    dsLocId: '20'
  });

  var channelIslands = Locations.insert({
    title: 'Channel Islands',
    link: 'channel-islands',
    description: '',
    latitude: '34.000155',
    longitude: '-119.812440',
    dsLocId: '21'
  });

}

/**
 * Images
 */
//
// Removing images from the import for now.
//
// We're working on importing the larger data set into the system using
// the CSV export form the image database.
//
//if (Images.find().count() === 0) {

  //var ds01001 = Images.insert({
    //_id: 'ds1001',
    //title: 'Fieldtrip',
    //parentLocation: anzaBorrego,
    //description: 'Beaty, guide, and Mrs. Abbott among ocotillos during San Diego Natural History Museum trip to Borrego Valley and Thousand Palm Canyon.',
    ////latitude: '33.100492',
    ////longitude: '-116.301327',
    //latitude: '34.100492',
    //longitude: '-117.301327',
    //date: '1927'
  //});

  //var ds01002 = Images.insert({
    //title: 'Coyote Creek',
    //parentLocation: anzaBorrego,
    //description: 'Beaty and Mrs. Abbott on edge of Coyote Creek during San Diego Natural History Museum trip to Borrego Valley and Thousand Palm Canyon.',
    //latitude: '33.100492',
    //longitude: '-116.301327',
    //date: '1927'
  //});

  //var ds13004 = Images.insert({
    //title: '',
    //parentLocation: sanDiegoCst,
    //description: 'Tijuana Estuary',
    //latitude: '32.551019',
    //longitude: '-117.111768',
    //date: '2014-Apr-11',
    //photographer: 'Jim Melli'
  //});

  //var ds19001Then = Images.insert({
    //title: 'Alluvial Bluffs along the Pacific Coast north of Santa Monica Canyon.',
    //parentLocation: losAngeles,
    //description: 'Alluvial Bluffs along the Pacific Coast north of Santa Monica Canyon. Pacific Ocean in background. Los Angeles County, Calfornia. ca 1904.',
    //latitude: '33.100492',
    //longitude: '-116.301327',
    //date: '1927',
    //photographer: 'Mendenhall, W.C.'
  //});

//}
