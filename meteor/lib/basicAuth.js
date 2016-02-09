var basicAuth = new HttpBasicAuth(Meteor.settings.public.adminName, Meteor.settings.public.adminPassword);
basicAuth.protect(['/admin']);
