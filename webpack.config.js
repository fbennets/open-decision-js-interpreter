const path = require('path');

module.exports = {
  optimization: {
    minimize: false
},
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'open-decision-js-core.js',

    library: {
        name: 'OpenDecisionJSCore',
        type: 'var',
      },
  },
};

