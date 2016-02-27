var express = require('express');
var path = require('path');
var fs = require('fs');
var yaml = require('js-yaml')
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var i18n = require('i18next');
var i18nMid = require('i18next-express-middleware');
var i18nBck = require('i18next-node-fs-backend');

var routes = require('./routes/index');

var app = express();

// get sensor details 
var sensors = yaml.load(fs.readFileSync('config/sensors.yml', 'utf8')).sensors;
app.set('sensors', sensors);
console.log(sensors);

// i18n setup
i18n.use(i18nBck);
i18n.use(i18nMid.LanguageDetector).init({
    lng: 'en',
    saveMissing: true,
    debug: true,
    "backend": {
        "loadPath": "locales/{{lng}}/{{ns}}.json"
    }
});
app.use(i18nMid.handle(i18n, {
    //ignoreRoutes: ["/foo"],
    removeLngFromUrl: false // ?? yeah prob...
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;