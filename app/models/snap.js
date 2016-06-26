var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var SnapSchema  = new Schema({
    id_sender: String,
    id_receiver: String,
    duration: Number,
    url: String,
    watched: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Snap', SnapSchema);
