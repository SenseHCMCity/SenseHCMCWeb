var oneHour = 3600000;
var tzOffset = 7 * oneHour; // UTC +7

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
                pointPadding: 0.1,
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
        legend: {
            enabled: false
        }
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
    var nowMillisICT = (new Date()).getTime() + tzOffset;
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
    loadGraphs('aqi-live-pm2_5', 'aqi-live-pm10', oneHour * 2, 10, aqiPM25, aqiPM10);
    loadGraphs('concentration-live-pm2_5', 'concentration-live-pm10', oneHour * 2, 10);
}

function loadGraphsNowcast() {
    var graphPM2_5Id = 'aqi-nowcast-pm2_5';
    var graphPM10Id = 'aqi-nowcast-pm10';
    var rangeMillis = 24 * oneHour;
    var avgMins = 60;

    var nowMillisICT = (new Date()).getTime() + tzOffset;
    var startTime = new Date(nowMillisICT - rangeMillis);
    var tsStr = startTime.toISOString().slice(0, 19).replace('T', ' ');

    // collect data for nowcast calculation - get last 24 hours for 1st calculation 12 hours ago
    $.getJSON(tsFeed() + '&start=' + tsStr + '&average=' + avgMins, function (data) {
        var time = [],
            pm2_5 = [],
            pm10 = [];

        // get each value from the result
        $.each(data.feeds, function (idx, dataPoint) {
            var ts = dataPoint.created_at.slice(11, 16);
            time.push(ts);
            var pm2_5Val = parseFloat(dataPoint.field1);
            pm2_5.push(pm2_5Val);
            var pm10Val = parseFloat(dataPoint.field2);
            pm10.push(pm10Val);
        });

        // calculate 12 hours of nowcast values        
        var ncRange = 12;
        var ncTime = [],
            ncPM2_5 = [],
            ncPM10 = [];
        for (var ncIdx = 0, idx = ncRange; idx < time.length; ncIdx++, idx++) {
            ncTime[ncIdx] = time[idx];
            ncPM2_5[ncIdx] = pointOptions(pm2_5.slice(idx - ncRange, idx), nowcastPM);
            ncPM10[ncIdx] = pointOptions(pm10.slice(idx - ncRange, idx), nowcastPM);
        }

        // draw graphs
        drawGraph(graphPM2_5Id, ncTime, ncPM2_5);
        drawGraph(graphPM10Id, ncTime, ncPM10);
    }).fail(function (jqxhr, textStatus, error) {
        $('#graph-' + graphPM2_5Id).append('No graph data');
        $('#graph-' + graphPM10Id).append('No graph data');
    });
}

function aqiPM25(concentration) {
    return pointOptions(concentration, pm25);
}

function aqiPM10(concentration) {
    return pointOptions(concentration, pm10);
}

function pointOptions(value, aqiF) {
    var aqiVal = aqiF(value);
    return {
        y: aqiVal,
        color: '#' + aqi_color(aqiVal)
    };
}