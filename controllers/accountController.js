/**
 * 로그인 및 회원가입에 대한 Controller로 실질적으로 이곳에서 처리
 */
var Account = require('../model/account_model')
  , passport = require("passport");


module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index', { User : req.user});
    });

    app.get('/register', function(req, res) {
        res.render('register', {});
    });

    app.post('/register', function(req, res, next) {
        console.log('registering user');
        Account.register(new Account({
            username: req.body.username,
            IdeaCount: 0
        }), req.body.password, function(err) {
            if (err) {
                console.log('error while user register!', err);
                return next(err);
            }

            console.log('user registered!');

            res.redirect('/');
        });
    });

    app.get('/login', function(req, res) {
        res.render('login', {
            user: req.user
        });
    });

    app.post('/login', passport.authenticate('local'), function(req, res) {
        res.redirect('/');
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
}
