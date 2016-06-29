var config      = require('./config');

var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var fileUpload  = require('express-fileupload');

var mongoose    = require('mongoose');
mongoose.Promise = global.Promise;
var User        = require('./app/models/user');
var Snap        = require('./app/models/snap');
var Friend      = require('./app/models/friend');

var bcrypt      = require('bcrypt');
var jwt         = require('jsonwebtoken');

mongoose.connect(config.database);
app.set('secret', config.secret);

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(fileUpload());

var router = express.Router();

router.get('/', function (req, res) {
    res.json({ message: 'hello, our api is working' });
});

// AUTHENTICATE
router.post('/auth', function (req, res) {
    User.findOne({ email: req.body.email })
        .select('+password +email')
        .exec(function (err, user) {
            if (user === null) {
                res.json({
                    error: 'This email does not match any user',
                    data: null,
                    token: null
                });
            } else {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    var token = jwt.sign(user, app.get('secret'), {
                        expiresIn: '24h'
                    });
                    res.json({
                        error: false,
                        data: user,
                        token: token
                    });
                } else {
                    res.json({
                        error: 'Wrong password',
                        data: null,
                        token: null
                    });
                }
            }
        });
});

// REGISTER
router.post('/users', function (req, res) {

    // Check if a field is missing
    var fields = ['name', 'email', 'password'];
    var missingFields = [];

    fields.forEach(function (field) {
        if (req.body[field] === undefined) {
            missingFields.push(field);
        }
    });

    if (missingFields.length > 0) {
        return res.json({
            error: 'Missing ' + missingFields,
            data: null,
            token: null
        });
    }

    // Check if email is valid
    var regex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
    if (regex.test(req.body.email) === false) {
        return res.json({
            error: 'Email is not valid',
            data: null,
            token: null
        });
    }

    // Check if name already exists
    User.find({ name: req.body.name}, function (err, user) {
        if (user.length >= 1) {
            res.json({
                error: 'Name already taken',
                data: null,
                token: null
            });
        } else {
            // Check if email already exists
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

// MIDDLEWARE CHECKING FOR TOKEN
router.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, app.get('secret'), function (err, decoded) {
            if (err) {
                res.json({
                    error: 'Failed to authenticate token',
                    data: null,
                    token: null
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(403).json({
            error: 'No token provided',
            data: null,
            token: null
        });
    }
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
    User.findOne({ _id: req.params.id }, function (err, user) {
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
router.patch('/users/:id', function (req, res) {
    if (req.body.password === undefined) {
        return res.json({
            error: 'No new password provided',
            data: null,
            token: null
        });
    }

    if (req.decoded._doc._id = req.params.id) {
        User.findOneAndUpdate({ _id: req.params.id}, { password: bcrypt.hashSync(req.body.password, 10) }, function (err, user) {
            if (err) {
                res.json({
                    error: err,
                    data: null,
                    token: null
                });
            } else {
                res.json({
                    error: false,
                    data: 'Password updated',
                    token: null
                });
            }
        });
    } else {
        res.json({
            error: 'Updating password failed. Wrong token or id',
            data: null,
            token: null
        });
    }
});


// SEND A SNAP
router.post('/snaps', function (req, res) {

    // Check if a field is missing
    var fields = ['id_receiver', 'duration'];
    var missingFields = [];

    fields.forEach(function (field) {
        if (req.body[field] === undefined) {
            missingFields.push(field);
        }
    });

    if (missingFields.length > 0) {
        return res.json({
            error: 'Missing ' + missingFields,
            data: null,
            token: null
        });
    }

    // Check if file is missing
    if (req.files === null) {
        return res.json({
            error: 'Missing snap',
            data: null,
            token: null
        });
    }

    User.find({ _id: req.body.id_receiver }, function (err, user) {
        if (err) {
            res.json({
                error: 'Receiver does not exist',
                data: null,
                token: null
            });
        } else {

            // Uploading image on server
            var image = req.files.snap;
            image.mv('./app/uploads/' + image.name, function (err) {
                if (err) {
                    res.status(500).json({
                        error: err,
                        data: null,
                        token: null
                    });
                } else {
                    // Adding snap in database
                    var snap = new Snap();
                    snap.id_sender = req.decoded._doc._id;
                    snap.id_receiver = req.body.id_receiver;
                    snap.duration = req.body.duration;
                    snap.url = image.name;

                    snap.save(function (err) {
                        if (err) {
                            res.json({
                                error: err,
                                data: null,
                                token: null
                            });
                        } else {
                            res.json({
                                error: false,
                                data: 'Your snap has been sent',
                                token: null
                            });
                        }
                    });
                }
            });
        }
    });
});

// LIST ALL SNAPS RECEIVED (NOT WATCHED YET)
router.get('/snaps', function (req, res) {
    Snap.find({ id_receiver: req.decoded._doc._id, watched: false }, function (err, snaps) {
        if (err) {
            res.json({
                error: err,
                data: null,
                token: null
            });
        } else {
            res.json({
                error: false,
                data: snaps,
                token: null
            });
        }
    })
});

// CHANGE SNAP STATUS TO WATCHED
router.patch('/snaps/:id', function (req, res) {
    Snap.findOneAndUpdate({ _id: req.params.id, watched: false }, { watched: true }, function (err, snap) {
        if (err) {
            res.json({
                error: 'Snap does not exist or has already been watched',
                data: null,
                token: null
            });
        } else {
            if (snap.id_receiver === req.decoded._doc._id) {
                res.json({
                    error: false,
                    data: 'Snap is now marked as watched',
                    token: null
                });
            } else {
                res.json({
                    error: 'You are not the receiver of this snap',
                    data: null,
                    token: null
                });
            }
        }
    })
});


// LIST ALL FRIENDS
router.get('/friends', function (req, res) {
    Friend.find(
        { accepted: true },
        { $or: [
            { 'id_asking': req.decoded._doc._id },
            { 'id_accepting': req.decoded._doc._id }
        ]}, function (err, friends) {
            if (err) {
                res.json({
                    error: err,
                    data: null,
                    token: null
                });
            } else {
                res.json({
                    error: false,
                    data: friends,
                    token: null
                });
            }
        }
    );
});

// ADD A FRIEND
router.post('/friends', function (req, res) {
    if (req.body.email === undefined) {
        return res.json({
            error: 'Missing email',
            data: null,
            token: null
        });
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            res.json({
                error: 'This email does not match any user',
                data: null,
                token: null
            });
        } else {
            var friend = new Friend();
            friend.id_asking = req.decoded._doc._id;
            friend.id_user = user._id;

            friend.save(function (err) {
                if (err) {
                    res.json({
                        error: err,
                        data: null,
                        token: null
                    });
                } else {
                    res.json({
                        error: false,
                        data: 'Your request has been sent',
                        token: null
                    });
                }
            });
        }
    });
});

// DELETE A FRIEND
router.delete('/friends/:id', function (req, res) {

});

// LIST FRIENDS REQUESTS
router.get('/friends/requests', function (req, res) {
    Friend.find({ id_user: req.decoded._doc._id, accepted: false }, function (err, friends) {
        if (err) {
            res.json({
                error: err,
                data: null,
                token: null
            });
        } else {
            var users = [];
            var promises = [];
            friends.forEach(function (friend) {
                var promise = User.findOne({ _id: friend.id_asking }, function (err, user) {
                    if (err) {
                        res.json({
                            error: err,
                            data: null,
                            token: null
                        });
                    } else {
                        users.push(user);
                    }
                });
                promises.push(promise);
            });
            Promise.all(promises).then(function (users) {
                return res.json({
                    error: false,
                    data: users,
                    token: null
                });
            });
        }
    })
});

app.use('/api', router);

app.listen(config.port);
console.log('Application running on : http://localhost:' + config.port + '/api');
