
# metalsmith-kss

  A Metalsmith plugin to create KSS documentation.

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
  // ...
}));
```

## License

  MIT
