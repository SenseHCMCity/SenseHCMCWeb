function loadCurrent() {
    // fetch latest ug m3 value
    // instead of using /last get last 2 records and loop through until we have a value. this is because pm2.5 and pm10 are updated alternately so the field may be blank in /last
    $.getJSON(tsFeed() + '&results=2', function (data) {
        var aqi = {};
        if (data) {
            $.each(data.feeds, function (idx, feed) {
                if (feed.field1) {
                    var concentration = parseFloat(feed.field1);
                    aqi['ts'] = new Date(feed.created_at);
                    aqi['pm2.5'] = pm25(concentration);
                    aqi['pm10'] = pm10(concentration);
                }
            });
        }
        updateCurrent(aqi);
        sensorMapPopup(aqi);
    }).fail(function (jqxhr, textStatus, error) {
        $('#aqi-detail').append('No data');
        updateMap('No data');
    });
}

function updateCurrent(aqi) {
    if (!aqi['pm2.5']) {
        $('#aqi-num').text('No data');
        return;
    }
    var aqiStr = aqi_label(aqi['pm2.5']);
    $('#aqi-box').css('background-color', '#' + aqi_color(aqi['pm2.5']));
    $('#aqi').text(aqiStr + ' (' + aqi['pm2.5'].toFixed(2) + ')');
    $('#aqi-detail').text(aqi.ts);
}

function aqiDescToId(desc) {
    return desc.toLowerCase().replace(/ /g, '').substr(0, 11);
}

function sensorMap() {
    var mapEl = $('#map');
    createMap(mapEl.data('latitude'), mapEl.data('longitude'), 16);
}

function sensorMapPopup(aqi) {
    var popupText;
    if (aqi['pm2.5'] || aqi['pm10']) {
        popupText = '<b>AQI</b><br>';
        if (aqi['pm2.5'])
            popupText = 'PM 2.5 AQI: ' + aqi['pm2.5'];
        if (aqi['pm10']) {
            if (popupText != '') popupText += '<br>';
            popupText += 'PM 10 AQI: ' + aqi['pm10'];
        }
    } else
        popupText = 'No data';
    var mapEl = $('#map');
    mapPopup(mapEl.data('latitude'), mapEl.data('longitude'), popupText);
}