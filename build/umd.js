const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    clickety: path.resolve(__dirname,'../clickety.js')
  },
  output: {
    filename: 'clickety.umd.js',
    path: path.resolve(__dirname,'../dist'),
    library: 'Clickety',
    libraryTarget: 'umd'
  },
}