var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var User        = require('./app/models/user');
var bcrypt      = require('bcrypt');

mongoose.connect('mongodb://localhost/snapchat');

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

var port = 3000;

var router = express.Router();

router.get('/', function (req, res) {
    res.json({ message: 'hello, our api is working' });
});

// AUTHENTICATE
router.post('/auth', function (req, res) {
    User.find({ email: req.body.email }, function (err, user) {
        if (err) {
            res.json({
                error: err,
                data: null,
                token: null
            });
        } else {
            console.log(user);
            // console.log(bcrypt.compareSync(req.body.password, user.password));
        }
    });
});

// REGISTER
router.post('/users', function (req, res) {

    if (req.body.name === undefined) {
        return res.json({
            error: 'Missing name',
            data: null,
            token: null
        });
    }
    if (req.body.email === undefined) {
        return res.json({
            error: 'Missing email',
            data: null,
            token: null
        });
    }
    if (req.body.password === undefined) {
        return res.json({
            error: 'Missing password',
            data: null,
            token: null
        });
    }

    // Check if email already exists
    User.find({ name: req.body.name}, function (err, user) {
        if (user.length >= 1) {
            res.json({
                error: 'Name already taken',
                data: null,
                token: null
            });
        } else {
            User.find({ email: req.body.email}, function (err, user) {
                if (user.length >= 1) {
                    res.json({
                        error: 'Email already taken',
                        data: null,
                        token: null
                    });
                } else {
                    var user = new User();
                    user.name = req.body.name;
                    user.email = req.body.email;
                    user.password = bcrypt.hashSync(req.body.password, 10);

                    user.save(function (err) {
                        if (err) {
                            res.json({
                                error: err,
                                data: null,
                                token: null
                            });
                        } else {
                            res.json({
                                error: false,
                                data: 'You have been registered',
                                token: null
                            });
                        }
                    });
                }
            });
        }
    });
});

// LIST ALL USERS
router.get('/users', function (req, res) {
    User.find(function (err, users) {
        if (err) {
            res.json({
                error: err,
                data: null,
                token: null
            });
        } else {
            res.json({
                error: false,
                data: users,
                token: null
            });
        }
    });
});

// GET ONE USER
router.get('/users/:id', function (req, res) {
    User.find({ id: req.params.id }, function (err, user) {
        if (err) {
            res.json({
                error: err,
                data: null,
                token: null
            });
        } else {
            res.json({
                error: false,
                data: user,
                token: null
            });
        }
    });
});

// UPDATE USER PASSWORD
router.put('/users/:id', function (req, res) {

});


// SEND A SNAP
router.post('/snaps', function (req, res) {

});

// LIST ALL SNAPS RECEIVED (NOT WATCHED YET)
router.get('/snaps', function (req, res) {

});

// CHANGE SNAP STATUS TO WATCHED
router.post('/snaps/:id', function (req, res) {

});


// LIST ALL FRIENDS
router.get('/friends', function (req, res) {

});

// ADD A FRIEND
router.post('/friends', function (req, res) {

});

// DELETE A FRIEND
router.delete('/friends/:id', function (req, res) {

});

// LIST FRIENDS REQUESTS
router.get('/friends/requests', function (req, res) {

});

app.use('/api', router);

app.listen(port);
console.log('Application running on : http://localhost:' + port + '/api');
