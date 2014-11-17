
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
  fixtures: glob('**/*.hbs')   // Optional: Provide a glob with external fixtures. Default: none
  options: {                   // Optional: Options to pass to the KSS traverse() method. Default: {}
    mask : '*.less|*.css',
    markdown  : true,
    multiline: false,
    typos: false
  }
}));
```

## External fixtures

  KSS lacks the ability to include external fixtures in the markup section. Here is how to work around this:
  Say, you have an external HTML fixture in your site that you like to appear in the markup section of your
  KSS styleguide so you don't have to do updates twice.

  1. In your KSS, put the following in the according markup section:

  ```css
  // Styleguide x
  //
  // ...
  //
  // Markup: {{> path/to/external_fixture.hbs}}
  ```

  2. In your metalsmith build file, add a [glob](https://www.npmjs.org/package/glob) of all fixture files
    that you need to be available to KSS:

  ```js
  metalsmith(__dirname)
      .clean(true)
      .metadata(meta)
      .use(kss({ source: 'less/', target: 'styleguide/', pageTemplate: 'page.html', fixtures: glob.sync('less/**/*.hbs') }))
  ```

## License

  MIT
