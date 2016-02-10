// Configure Basic Auth to require password for any admin page.
// Set correct name and password in config/settings.json

var basicAuth = new HttpBasicAuth(Meteor.settings.public.adminName, Meteor.settings.public.adminPassword);
basicAuth.protect(['/admin']);
