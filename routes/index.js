var i18n = require('i18next');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    var sensors = req.app.get('sensors');
    res.render('index', {
        title: i18n.t('app.site') + ' - Home',
        sensors: sensors
    });
});

router.get('/sensor/:id', function (req, res, next) {
    var sensors = req.app.get('sensors');
    var matches = sensors.filter(function (val) {
        console.info(val);
        return val.id == req.params.id;
    });
    if (matches.length == 0)
        res.sendStatus(404);
    var sensor = matches[0];
    console.info(sensor);
    res.render('sensor', {
        title: i18n.t('app.site') + ' - ' + sensor.name + ' Sensor',
        sensor: sensor
    });
});

router.get('/lang/:lang', function (req, res, next) {
    console.info(i18n.language)
    i18n.changeLanguage(req.params.lang)
    console.info(i18n.language)

    res.render('index', {
        title: i18n.t('app.site')
    });
});

module.exports = router;