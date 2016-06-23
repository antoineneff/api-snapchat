var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var UserSchema  = new Schema({
    name: String
    email: String,
    password: String,
    token: String
});

module.exports = mongoose.model('User', UserSchema);
