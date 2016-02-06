// ISO Date Utils

var getDisplayYear = function(isoDate) {

  isoDate = clean(isoDate);
  var y = isoDate.substring(0, 4);
  return y;

};

var getFullDisplayString = function(isoDate) {

  isoDate = clean(isoDate);
  var str = isoDate.substring(0, 4);
  return str;

};

var getDisplayMonth = function(isoDate) {

  isoDate = clean(isoDate);

  var m = isoDate.substring(6, 8);

  var mStr = '';

  switch (m){
    case '00':
      mStr = '';
      break;
    case '01':
      mStr = 'January';
      break;
    case '02':
      mStr = 'February';
      break;
    case '03':
      mStr = 'March';
      break;
    case '04':
      mStr = 'April';
      break;
    case '05':
      mStr = 'May';
      break;
    case '06':
      mStr = 'June';
      break;
    case '07':
      mStr = 'July';
      break;
    case '08':
      mStr = 'August';
      break;
    case '09':
      mStr = 'September';
      break;
    case '10':
      mStr = 'October';
      break;
    case '11':
      mStr = 'November';
      break;
    case '12':
      mStr = 'December';
      break;
    case 'uu':
      mStr = '';
      break;
    default:
      console.log('Warning - No display month available for:', m);
      break;
  }

  return mStr;

};

var clean = function(isoDate) {

  // Remove 'iso' if prepended
  if (isoDate && isoDate.indexOf('iso-') != -1) {
    isoDate = isoDate.replace('iso-', '');
  }

  return isoDate;

};

DateUtils = {};
DateUtils.getDisplayYear = getDisplayYear;
DateUtils.getDisplayMonth = getDisplayMonth;
DateUtils.getFullDisplayString = getFullDisplayString;
