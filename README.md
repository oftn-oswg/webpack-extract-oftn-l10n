# webpack-extract-oftn-l10n

This Webpack plugin allows you to automatically export localization strings from applications using the [oftn-l10n](https://github.com/oftn-oswg/oftn-l10n) library. No need to duplicate effort!

It looks for every reference to `R.<property>` and at every comment looking for `R.<property> = <string>`. A Russian translator can create a new translation by copying this file to **ru.json** and changing the language tag from `""` to `"ru"`.

## Usage

Install the plugin:

```sh
npm install --save-dev webpack-extract-oftn-l10n
```

And then include it in your configuration:

```js
const path = require('path');
const fs = require('fs');
const ExtractStringsPlugin = require('webpack-extract-oftn-l10n.js');

module.exports = {
  entry: './test.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [new ExtractStringsPlugin({
    variable: 'R',
    output: path.join(__dirname, 'localizations/default.json')
  })]
};
```

### Options

| Option     | Type                  | Default |                                          |
| ---------- | --------------------- | ------- | ---------------------------------------- |
| `variable` | *string*              | `"R"`   | The name of the identifier to search for which accesses the translation. |
| `output`   | *string* \| *boolean* | `false` | The path of the localization file to create. |

See [oftn-l10n-example](https://github.com/oftn-oswg/oftn-l10n-example) to view a more detailed example using this library.
