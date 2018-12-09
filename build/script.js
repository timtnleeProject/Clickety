const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    clickety: path.resolve(__dirname,'../clickety.js')
  },
  output: {
    filename: 'clickety.min.js',
    path: path.resolve(__dirname,'../dist'),
    library: 'Clickety',
    libraryTarget: 'window',
  },
}