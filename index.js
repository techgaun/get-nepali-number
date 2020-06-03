'use strict';
var Intl = require('intl');

var nums = {
  0: '०',
  1: '१',
  2: '२',
  3: '३',
  4: '४',
  5: '५',
  6: '६',
  7: '७',
  8: '८',
  9: '९'
};

module.exports = function (strNum) {
  // remove comma if any
  strNum = strNum.toString().search(',') ? strNum.toString().split(',').join('') : strNum;
  // format number
  strNum = new Intl.NumberFormat('en-IN').format(strNum);

  var arrNumNe = strNum.toString().split('').map(function (ch) {
    if (ch === '.' || ch === ',') {
      return ch;
    }
    return nums[Number(ch)];
  });
  return arrNumNe.join('');
};
