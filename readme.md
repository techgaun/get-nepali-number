# get-nepali-number [![Build Status](https://travis-ci.org/techgaun/get-nepali-number.svg?branch=master)](https://travis-ci.org/techgaun/get-nepali-number)

> Convert any english (technically hindu-arabic) numeral to Nepali number


## Install

```
# Using npm
$ npm install --save get-nepali-number

# Using yarn
$ yarn add get-nepali-number
```


## Usage

```js
var getNepaliNumber = require('get-nepali-number');

getNepaliNumber(100);
//=> '१००'

getNepaliNumber(2000);
//=> '२,०००'

getNepaliNumber(200.05);
//=> '२००.०५'

getNepaliNumber(2000.50);
//=> '२,०००.५'

getNepaliNumber('2,00,000.50');
//=> '२,००,०००.५'

getNepaliNumber('1,000,365.50');
//=> '१०,००,३६५.५'
```


## API

### getNepaliNumber(num)

#### num

Type: `number` or `string`

provide a number to convert to Nepali numeral

## License

MIT © [techgaun](http://samar.techgaun.com)
