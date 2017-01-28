var mongoose = require('mongoose');
var mongodb_uri = process.env.MONGODB_URI;
var Schema = mongoose.Schema;

//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
//var account = require('./models/account');
//passport.use(new LocalStrategy(account.authenticate()));

var db = mongoose.connection;

db.once('open', function() {

    console.log("Connected to MongoDB server");

    // console.log(db);

    var accountSchema = new Schema({
        username: String,
        password: String
    });
    var account = mongoose.model('account', accountSchema);
    var awesomeuser = new account({
        username: 'awesomeuser',
        password: 'testing'
    });

    awesomeuser.save(function (err, awesomeuser) {
        //if (err) return console.error(err);
        console.dir(awesomeuser);
    });

    /*
    account.register(new account({ username : 'Joe' }), 'password', function(err, account) {
        if (err) {
            console.log('there was an error');
        }
        passport.authenticate('local')(req, res, function () {
          console.log('success i think');
        });
    });
    */

    
    account.find(function(err, accounts) {
        console.log('Accounts:...');
        console.log(accounts);
    });
    

    db.close();

});

mongoose.Promise = global.Promise; // https://github.com/Automattic/mongoose/issues/4291
mongoose.connect(mongodb_uri);

/**
 * To run this:
 * MONGODB_URI='mongodb://tester:SOELWezeuYcxzqrql6Mh@ds133279.mlab.com:33279/heroku_s8q6jj8v' node testing__mongodb.js
 */

