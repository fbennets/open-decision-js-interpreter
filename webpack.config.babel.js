const path = require('path');

module.exports = [{
  module: {
    rules: [{
        test: /\.js/,
        exclude: /(node_modules|bower_components)/,
        use: [{
            loader: 'babel-loader'
        }]
    }]
},
  optimization: {
    minimize: false
},
  mode: 'production',
  entry: './src/core.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'open-decision-js-core.js',
    globalObject: 'this',
    library: {
        name: 'OpenDecisionJSCore',
        type: 'umd',
        export: 'default',
        umdNamedDefine: true
      },
  },
},
{
  module: {
    rules: [{
        test: /\.js/,
        exclude: /(node_modules|bower_components)/,
        use: [{
            loader: 'babel-loader'
        }]
    }]
},
  optimization: {
    minimize: false
},
  mode: 'production',
  entry: './src/js-interpreter.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'open-decision-js-interpreter.js',
    globalObject: 'this',
    library: {
        name: 'OpenDecisionJSInterpreter',
        type: 'umd',
        export: 'default',
        umdNamedDefine: true
      },
  },
}];

