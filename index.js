'use strict';

const nums = {
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

module.exports = function (stringNumber) {
  // Remove comma if any
  stringNumber = stringNumber.toString().replace(/,/g, '');
  // Format number
  stringNumber = new Intl.NumberFormat('en-IN').format(stringNumber);

  const arrayNumberNe = stringNumber.toString().split('').map(ch => {
    if (ch === '.' || ch === ',') {
      return ch;
    }

    return nums[Number(ch)];
  });
  return arrayNumberNe.join('');
};
