var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var UserSchema  = new Schema({
    name: String,
    email: {
        type: String,
        select: false
    },
    password: {
        type: String,
        select: false
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('User', UserSchema);
