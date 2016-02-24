var i18n = require('i18next');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', {
        title: i18n.t('app.site') + ' - Home'
    });
});

router.get('/sensor', function (req, res, next) {
    res.render('sensor', {
        title: i18n.t('app.site') + ' - Sensor'
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