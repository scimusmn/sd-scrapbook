// ISO Date Utils
var getDisplayDate = function(isoDate) {

  console.log('getDisplayDate', isoDate);

  isoDate = clean(isoDate);

  var month = getDisplayMonth(isoDate);
  var year = getDisplayYear(isoDate);
  var day = getDisplayDay(isoDate);

  var str = '';

  console.log(month);
  if (month === '') {
    console.log('no month found. using year');
    console.log(year);
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
  }

  return d;

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

