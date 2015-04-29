// Read Keen API secrets from thhe unstracked config/settings.json file
keenClient = new Keen({
    projectId: Meteor.settings.public.keen.projectId,
    writeKey: Meteor.settings.public.keen.writeKey,
    readKey: Meteor.settings.public.keen.readKey,
});


