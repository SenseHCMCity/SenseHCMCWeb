var tzOffset = 7; // UTC +7
var oneHour = 3600000;
var oneWeek = oneHour * 24 * 7;

function options(time, dataValues, name, title) {
    return {
        title: {
            text: title
        },
        xAxis: {
            categories: time,
            labels: {
                formatter: function () {
                    var mins = parseInt(this.value.slice(3));
                    return (mins % 5 === 0) ? this.value : '';
                }
            }
        },
        yAxis: {
            title: {
                text: name
            },
            values: {
                formatter: function () {
                    return this.value.toFixed(2);
                }
            }
        },
        series: [{
            type: 'column',
            data: dataValues,
            name: name
        }],
        plotOptions: {
            series: {
                pointPadding: 0,
                groupPadding: 0,
                borderWidth: 0,
                shadow: false
            }
        },
        tooltip: {
            valueDecimals: 2
        },
        credits: {
            enabled: false
        },
    };
}

function drawGraph(id, time, dataValues) {
    var gDiv = $('#graph-' + id);
    var gOpts = options(time, dataValues, gDiv.data('name'), gDiv.data('title'));
    var chart = gDiv.highcharts(gOpts);
}

function loadGraphs(graphPM2_5Id, graphPM10Id, rangeMillis, avgMins, pm2_5Function, pm10Function) {
    var time = [],
        pm2_5 = [],
        pm10 = [];

    // timestamp for rangeMillis ago in Vietnam time
    var nowMillisICT = (new Date()).getTime() + (tzOffset * oneHour);
    var startTime = new Date(nowMillisICT - rangeMillis);
    var tsStr = startTime.toISOString().slice(0, 19).replace('T', ' ');

    // fetch data and draw graph
    $.getJSON(tsFeed() + '&start=' + tsStr + '&average=' + avgMins, function (data) {
        $.each(data.feeds, function (idx, dataPoint) {
            var ts = dataPoint.created_at.slice(11, 16);
            time.push(ts);
            var pm2_5Val = parseFloat(dataPoint.field1);
            if (pm2_5Function)
                pm2_5Val = pm2_5Function(pm2_5Val);
            pm2_5.push(pm2_5Val);
            var pm10Val = parseFloat(dataPoint.field2);
            if (pm10Function)
                pm10Val = pm10Function(pm10Val);
            pm10.push(pm10Val);
        });
        drawGraph(graphPM2_5Id, time, pm2_5);
        drawGraph(graphPM10Id, time, pm10);
    }).fail(function (jqxhr, textStatus, error) {
        $('#graph-' + graphPM2_5Id).append('No graph data');
        $('#graph-' + graphPM10Id).append('No graph data');
    });
}

function loadGraphsLive() {
    loadGraphs('aqi-live-pm2_5', 'aqi-live-pm10', oneHour * 2, 10, pm25, pm10);
    loadGraphs('concentration-live-pm2_5', 'concentration-live-pm10', oneHour * 2, 10);
}

function loadGraphWeek() {
    loadGraph('week', oneWeek, 1440);
}