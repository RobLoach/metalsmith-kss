
# metalsmith-kss

  A Metalsmith plugin to create KSS documentation.

## Status

  [![Travis Build Status](https://travis-ci.org/kwizzn/metalsmith-kss.svg?branch=master)](https://travis-ci.org/kwizzn/metalsmith-kss)

## Installation

    $ npm install metalsmith-kss

## CLI Usage

  Install via npm and then add the `metalsmith-kss` key to your `metalsmith.json` plugins, like so:

```json
{
  "plugins": {
    "metalsmith-kss": {
      "...": "..."
    }
  }
}
```

## Javascript Usage

  Pass `options` to the kss plugin and pass it to Metalsmith with the `use` method:

```js
var kss = require('metalsmith-kss');

metalsmith.use(kss({
  source: 'css/',              // Required: Where to look for KSS-documented CSS files
  target: 'styleguide/',       // Required: Where to store the output files.
  sectionQuery: '2.x.x',       // Optional: Query to pass to the KSS section() method. Default: none
  template: 'custom-kss.html', // Optional: Path to custom (Handlebars) template. Default: './templates/kss.hbs'
  pageTemplate: 'page.html',   // Optional: Path to custom (Handlebars) page template. Default: none
  flatten: false,              // Optional: Whether to flatten the KSS section hierarchy. Default: false
  options: {                   // Optional: Options to pass to the KSS traverse() method. Default: {}
    mask : '*.less|*.css',
    markdown  : true,
    multiline: false,
    typos: false
  }
}));
```

## License

  MIT
