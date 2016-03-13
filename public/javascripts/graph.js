var tzOffset = 7; // UTC +7
var oneHour = 3600000;
var oneWeek = oneHour * 24 * 7;

function options(time, pm2_5, pm10, title) {
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
                text: 'pm2.5'
            }
        }, {
            title: {
                text: 'pm10'
            },
            opposite: true
        }],
        series: [
            {
                type: 'line',
                data: pm2_5,
                name: 'pm2.5'
        },
            {
                type: 'column',
                data: pm10,
                name: 'pm10',
                yAxis: 1
        }]
    };
}

function drawGraph(id, time, pm2_5, pm10) {
    var gDiv = $('#graph-' + id);
    var gOpts = options(time, pm2_5, pm10, gDiv.data('title'));
    gDiv.highcharts(gOpts);
    var chart = gDiv.highcharts();
    chart.yAxis[0].setExtremes(20.0, 40.0);
}

function loadGraph(graphId, rangeMillis, avgMins) {
    var time = [],
        pm2_5 = [],
        pm10 = [];

    // timestamp for one week ago in Vietnam time
    var nowMillisICT = (new Date()).getTime() + (tzOffset * oneHour);
    var oneHourBefore = new Date(nowMillisICT - rangeMillis);
    var tsStr = oneHourBefore.toISOString().slice(0, 19).replace('T', ' ');

    // fetch the data
    $.getJSON(tsFeed() + '&start=' + tsStr + '&average=' + avgMins, function (data) {
        $.each(data.feeds, function (idx, dataPoint) {
            var ts = dataPoint.created_at.slice(11, 16);
            time.push(ts);
            pm2_5.push(parseFloat(dataPoint.field1));
            pm10.push(parseFloat(dataPoint.field2));
        });
        drawGraph(graphId, time, pm2_5, pm10);
    }).fail(function (jqxhr, textStatus, error) {
        $('#graph-' + graphId).append('No graph data');
    });
}

function loadGraphLive() {
    loadGraph('live', oneHour, 1);
}


function loadGraphWeek() {
    loadGraph('week', oneWeek, 1440);
}