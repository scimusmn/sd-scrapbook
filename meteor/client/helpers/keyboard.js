$(document).keydown(function(e) {
  switch (e.which) {
    case 37: // Left
    break;

    case 38: // Up
    break;

    case 39: // Right
    break;

    case 40: // Down
    break;

    case 65: // A
    break;

    case 67: // C

      // Toggle cursor visibility
      if ($('body').css('cursor') === 'none') {
        $('body').css('cursor', 'auto');
      }else {
        $('body').css('cursor', 'none');
      }

    break;

    case 69: // E

      if (e.ctrlKey && e.shiftKey) {
        console.log('You pressed CTRL + SHIFT + E');
      }

    break;

    default: return; // Exit this handler for other keys
  }

});
