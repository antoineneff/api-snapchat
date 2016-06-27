var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var FriendSchema = new Schema({
    id_asking: String,
    id_user: String,
    accepted: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Friend', FriendSchema);
