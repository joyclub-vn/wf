const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'joyclub-customize.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
};
