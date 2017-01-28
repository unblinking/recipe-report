var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var passportLocalMongoose = require('passport-local-mongoose');

var accountSchema = new Schema({
    username: String,
    password: String
});

//accountSchema.plugin(passportLocalMongoose);

var account = mongoose.model('account', accountSchema);

module.exports = account;