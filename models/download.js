var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var DownloadToken = new mongoose.Schema({
    token: {
      type: String,
      required: true
    },
    file: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    }
});

module.exports = mongoose.model( 'DownloadToken', DownloadToken );