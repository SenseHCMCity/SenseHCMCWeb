var i18n = require('i18next');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    var sensors = req.app.get('sensors');
    res.render('index', {
        title: i18n.t('app.home'),
        sensors: sensors
    });
});

router.get('/sensor/:id', function (req, res, next) {
    var sensors = req.app.get('sensors');
    var matches = sensors.filter(function (val) {
        return val.id == req.params.id;
    });
    if (matches.length == 0)
        res.sendStatus(404);
    var sensor = matches[0];
    res.render('sensor', {
        title: 'Sensor ' + sensor.name,
        sensor: sensor
    });
});

router.get('/lang/:lang', function (req, res, next) {
    console.info('lang requested:' + req.params.lang)
    i18n.changeLanguage(req.params.lang)
    var referer = req.headers.referer;
    var redirectTo = (referer && referer.match(req.headers.host)) ? referer : '/';
    res.redirect(redirectTo);
});

module.exports = router;