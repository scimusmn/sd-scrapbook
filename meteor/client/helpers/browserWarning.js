// Browser Alert
// If user is not using preferred browsers, display alert

if (Meteor.isClient === true) {

  // Chrome 1+
  var isChrome = !!window.chrome && !!window.chrome.webstore;

  if (!isChrome) {

    console.log("Not using chrome. Flash warning....");

    setTimeout(function () {

      $('.browser-warning').show();

    }, 1500);

  }

}
