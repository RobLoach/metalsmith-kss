
# metalsmith-kss

  A Metalsmith plugin to create KSS documentation.

  **Disclaimer: This is work in progress! Things left to do:**

  - Tests

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
  source: 'less/',
  target: 'styleguide/',
  template: 'custom-kss.html'
  pageTemplate: 'page.html',
  options: {
    mask : '*.less|*.css',
    markdown  : true,
    multiline: false,
    typos: false
  }
}));
```

## License

  MIT

