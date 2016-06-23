var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var User        = require('./app/models/user');

mongoose.connect('mongodb://localhost/snapchat');

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

var port = 8888;

var router = express.Router();

router.get('/', function (req, res) {
    res.json({ message: 'hello, our api is working' });
});

router.route('/users')

    .post(function (req, res) {
        var user = new User();
        user.name = req.body.name;

        user.save(function (err) {
            if (err) {
                res.send(err)
            }
            res.json({ message: 'user created' });
        });
    })

    .get(function (req, res) {
        User.find(function (err, users) {
            if (err) {
                res.send(err);
            }
            res.json(users);
        })
    });

app.use('/api', router);

app.listen(port);
console.log('Application running on : http://localhost:' + port + '/api');
