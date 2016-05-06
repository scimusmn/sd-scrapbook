/**
* Sync images and the images table from the online database before
* launching the Meteor application
*/
if (Meteor.isServer) {

  /**
  * Kiosk mode
  *
  * If in Kioks mode, try and sync the images and images data down to the
  * local copy of the application from the online editor.
  */
  if (
    Meteor.settings &&
    Meteor.settings.public &&
    Meteor.settings.public.kiosk == 'true'
  ) {

    // Load modules for executing external commands
    fs = Npm.require('fs');
    exec = Npm.require('child_process').exec;
    cmd = Meteor.wrapAsync(exec);

    // Customizable path for the application. Allows us to download the images
    // from S3 to any defined path.
    var installPath = Meteor.settings.public.installPath;

    // Sync down the images.json database file from S3. A server process
    // saves this file there. We use it to repopulate the database after
    // Meteor reset. This way, the local kiosk application always gets the
    // latest data from the server each time the application starts up.
    cmd(
      'aws s3 sync s3://sd-scrapbook/db ' + installPath + '/meteor/private',
      Meteor.bindEnvironment(
        function (error, stdout, stderr) {
          if (error) {
            throw new Meteor.Error('error...');
          } else {
            console.log('Downloading images.json');

            // Import the database once the file is pulled down from S3
            importImages();
          }
        }
      )
    );

    // Sync down the image thumbanils
    cmd(
      'aws s3 sync s3://sd-scrapbook/thumbs ' + installPath + '/meteor/public/images/s3/thumbs',
      Meteor.bindEnvironment(
        function (error, stdout, stderr) {
          if (error) {
            throw new Meteor.Error('error...');
          } else {
            console.log('Sync thumbnails done');
          }
        }
      )
    );

    // Sync down the full sized images
    cmd(
      'aws s3 sync s3://sd-scrapbook/originals ' +
      installPath + '/meteor/public/images/s3/originals',

      Meteor.bindEnvironment(
        function (error, stdout, stderr) {
          if (error) {
            throw new Meteor.Error('error...');
          } else {
            console.log('Sync originals done');
          }
        }
      )
    );

    /**
    * Load data into the local database if none is present
    **

    /**
    * Locations
    */
    Locations.remove({});
    if (Locations.find().count() === 0) {

      var anzaBorrego = Locations.insert({
        title: 'Anza Borrego',
        link: 'anza-borrego',
        description: 'Anza-Borrego Desert State Park (ABDSP) is a state park located within the Colorado Desert of southern California, United States.',
        latitude: '33.100595',
        longitude: '-116.151306',
        dsLocId: '1',
      });

      var clevelandNationalForest = Locations.insert({
        title: 'Cleveland National Forest',
        link: 'cleveland-nat',
        description: 'Cleveland National Forest encompasses 460,000 acres (720 sq mi (1,900 km2)), mostly of chaparral, with a few riparian areas.',
        latitude: '32.758856',
        longitude: '-116.674749',
        dsLocId: '2',
      });

      var coloradoRiver = Locations.insert({
        title: 'Colorado River',
        link: 'colorado-river',
        description: '',
        latitude: '33.410193',
        longitude: '-114.693563',
        dsLocId: '3',
      });

      var imperialValley = Locations.insert({
        title: 'Imperial Valley',
        link: 'imperial-valley',
        description: '',
        latitude: '32.793580',
        longitude: '-114.973715',
        dsLocId: '4',
      });

      var joshuaTree = Locations.insert({
        title: 'Joshua Tree',
        link: 'joshua-tree',
        description: '',
        latitude: '33.795570',
        longitude: '-115.621892',
        dsLocId: '5',
      });

      var sdNorthCoast = Locations.insert({
        title: 'San Diego - North Coast',
        link: 'san-diego-north',
        description: '',
        latitude: '32.968837',
        longitude: '-117.254309',
        dsLocId: '6',
      });

      // This isn't visible because of the map cropping
      var mojaveDesert = Locations.insert({
        title: 'Mojave Desert',
        link: 'mojave-desert',
        description: '',
        latitude: '34.336705',
        longitude: '-115.899297',
        dsLocId: '7',
      });

      var northSDCounty = Locations.insert({
        title: 'North San Diego County',
        link: 'north-san-diego-county',
        description: '',
        latitude: '33.366311',
        longitude: '-117.214997',
        dsLocId: '8',
      });

      var orangeCounty = Locations.insert({
        title: 'Orange County',
        link: 'orange-county',
        description: '',
        latitude: '33.810516',
        longitude: '-117.820227',
        dsLocId: '9',
      });

      var palomarMountain = Locations.insert({
        title: 'Palomar Mountain',
        link: 'palomar-mountain',
        description: '',
        latitude: '33.398098',
        longitude: '-116.781367',
        dsLocId: '10',
      });

      var saltonSea = Locations.insert({
        title: 'Salton Sea',
        link: 'salton-sea',
        description: '',
        latitude: '33.287301',
        longitude: '-115.529622',
        dsLocId: '11',
      });

      var sanBerardino = Locations.insert({
        title: 'San Bernardino Mountains',
        link: 'san-bernardino',
        description: '',
        latitude: '34.131438',
        longitude: '-116.538973',
        dsLocId: '12',
      });

      var sanDiegoCoast = Locations.insert({
        title: 'San Diego - Coast',
        link: 'san-diego-coast',
        description: '',
        latitude: '32.694081',
        longitude: '-117.232840',
        dsLocId: '13',
      });

      var sanDiegoInland = Locations.insert({
        title: 'San Diego - Inland',
        link: 'san-diego-inland',
        description: '',
        latitude: '32.832099',
        longitude: '-117.097372',
        dsLocId: '14',
      });

      var sanGabriel = Locations.insert({
        title: 'San Gabriel Mountains',
        link: 'san-gabriel',
        description: '',
        latitude: '34.3288927',
        longitude: '-118.04672',
        dsLocId: '15',
      });

      var sanJacinto = Locations.insert({
        title: 'San Jacinto Mountains',
        link: 'san-jacinto',
        description: '',
        latitude: '33.8418194',
        longitude: '-116.9809458',
        dsLocId: '16',
      });

      var santaMonica = Locations.insert({
        title: 'Santa Monica Mountains and Coast',
        link: 'santa-monica',
        description: '',
        latitude: '33.923742',
        longitude: '-118.816882',
        dsLocId: '17',
      });

      var southSDCounty = Locations.insert({
        title: 'South San Diego County',
        link: 'south-san-diego',
        description: '',
        latitude: '32.536355',
        longitude: '-116.301214',
        dsLocId: '18',
      });

      var losAngeles = Locations.insert({
        title: 'Los Angeles',
        link: 'los-angeles',
        description: '',
        latitude: '33.663533',
        longitude: '-118.293658',
        dsLocId: '19',
      });

      var riverside = Locations.insert({
        title: 'Riverside',
        link: 'riverside',
        description: '',
        latitude: '33.894096',
        longitude: '-117.357879',
        dsLocId: '20',
      });

      var channelIslands = Locations.insert({
        title: 'Channel Islands',
        link: 'channel-islands',
        description: '',
        latitude: '33.823736',
        longitude: '-119.687298',
        dsLocId: '21',
      });

    }

  }
}
/**
* If the images collection has been reset, reload the latest data from a local
* JSON file.
*
* This process is used in the kiosk update from the remote version of the
* tool. When the kiosk starts up each morning we reset the database and
* then load the latest data from the online database if it has changed.
*
* The download process for this file is not handled within this application.
*/
function importImages() {
  if (Images.find().count() === 0) {
    console.log('Importing private/images.json to db');
    var data = JSON.parse(Assets.getText('images.json'));
    data.forEach(function (item, index, array) {
      Images.insert(item);
    });
  }
}
