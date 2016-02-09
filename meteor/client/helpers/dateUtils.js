// ISO Date Utils
var getDisplayDate = function(isoDate) {

  isoDate = clean(isoDate);

  var month = getDisplayMonth(isoDate);
  var year = getDisplayYear(isoDate);
  var day = getDisplayDay(isoDate);

  var str = '';

  if (month === '') {
    str = year;
  } else if (day === '') {
    str = month + ', ' + year;
  } else {
    str = month + ' ' + day + ', ' + year;
  }

  return str;

};

var getDisplayYear = function(isoDate) {

  isoDate = clean(isoDate);
  var y = isoDate.substring(0, 4);

  var uIndex = y.indexOf('u');
  if (uIndex === 1) {
    // 1000's
    y = y.substring(0, 1) + '000\'s';
  } else if (uIndex === 2) {
    // 1900's
    y = y.substring(0, 2) + '00\'s';
  } else if (uIndex === 3) {
    // 1980's
    y = y.substring(0, 3) + '0\'s';
  }

  return y;

};

var getNumericYear = function(isoDate) {

  isoDate = clean(isoDate);
  var y = isoDate.substring(0, 4);

  var uIndex = y.indexOf('u');
  if (uIndex === 1) {
    // 1500
    y = y.substring(0, 1) + '500';
  } else if (uIndex === 2) {
    // 1950
    y = y.substring(0, 2) + '50';
  } else if (uIndex === 3) {
    // 1955
    y = y.substring(0, 3) + '5';
  }

  return y;

};

var getDisplayMonth = function(isoDate) {

  isoDate = clean(isoDate);

  var m = isoDate.substring(5, 7);

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

var getDisplayDay = function(isoDate) {

  isoDate = clean(isoDate);
  var d = isoDate.substring(8, 10);
  if (d === '00') {
    d = '';
  } else if (d.charAt(0) == '0') {
    d = d.charAt(1);
  }

  return d;

};

var getSortDate = function(isoDate) {

  var sortDate = clean(isoDate);

  var year = getNumericYear(isoDate);

  sortDate = year + isoDate.substring(4, 10);

  return sortDate;

};

var clean = function(isoDate) {

  // Remove 'iso' if prepended
  if (isoDate && isoDate.indexOf('iso-') != -1) {
    isoDate = isoDate.replace('iso-', '');
  }

  return isoDate;

};

DateUtils = {};
DateUtils.getDisplayDate = getDisplayDate;
DateUtils.getDisplayYear = getDisplayYear;
DateUtils.getDisplayMonth = getDisplayMonth;
DateUtils.getDisplayDay = getDisplayDay;
DateUtils.getNumericYear = getNumericYear;
DateUtils.getSortDate = getSortDate;

