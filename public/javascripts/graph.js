var tz = 'Asia/Bangkok'; // no Hanoi or ICT so use BKK
var tzOffset = 7; // UTC +7
var oneHour = 3600000;
var oneWeek = oneHour * 24 * 7;

var channelId = $('#variables').data('channel-id');
var dataUrl = 'https://api.thingspeak.com/channels/' + channelId + '/feeds.json?';
dataUrl += 'timezone=' + tz;

function options(time, temperature, humidity, title) {
    return {
        title: {
            text: title
        },
        chart: {
            marginRight: 80
        },
        xAxis: {
            categories: time,
            labels: {
                formatter: function () {
                    var mins = parseInt(this.value.slice(3));
                    return (mins % 5 == 0) ? this.value : '';
                }
            }
        },
        yAxis: [{
            title: {
                text: 'Temperature'
            }
        }, {
            title: {
                text: 'Humidity'
            },
            opposite: true
        }],
        series: [
            {
                type: 'line',
                data: temperature,
                name: 'Temperature'
        },
            {
                type: 'column',
                data: humidity,
                name: 'Humidity',
                yAxis: 1
        }]
    };
}

function drawGraph(id, time, temperature, humidity) {
    var gDiv = $('#graph-' + id);
    var gOpts = options(time, temperature, humidity, gDiv.data('title'));
    gDiv.highcharts(gOpts);
    var chart = gDiv.highcharts();
    chart.yAxis[0].setExtremes(20.0, 40.0);
}

function loadGraph(graphId, rangeMillis, avgMins) {
    var time = [],
        temperature = [],
        humidity = [];

    // timestamp for one week ago in Vietnam time
    var nowMillisICT = (new Date()).getTime() + (tzOffset * oneHour);
    var oneHourBefore = new Date(nowMillisICT - rangeMillis);
    var tsStr = oneHourBefore.toISOString().slice(0, 19).replace('T', ' ');

    // fetch the data
    $.getJSON(dataUrl + '&start=' + tsStr + '&average=' + avgMins, function (data) {
        $.each(data.feeds, function (idx, dataPoint) {
            var ts = dataPoint.created_at.slice(11, 16);
            time.push(ts);
            temperature.push(parseFloat(dataPoint.field1));
            humidity.push(parseFloat(dataPoint.field2));
        });
        drawGraph(graphId, time, temperature, humidity);
    });
}

function loadGraphLive() {
    loadGraph('live', oneHour, 1);
}


function loadGraphWeek() {
    loadGraph('week', oneWeek, 1440);
}