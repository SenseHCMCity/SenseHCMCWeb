function loadCurrent() {
    // fetch latest ug m3 value
    // instead of using /last get last 2 records and loop through until we have a value. this is because pm2.5 and pm10 are updated alternately so the field may be blank in /last
    $.getJSON(tsFeed() + '&results=2', function (data) {
        var aqi = {};
        if (data) {
            $.each(data.feeds, function (idx, feed) {
                if (feed.field1) {
                    var concentration = parseFloat(feed.field1);
                    aqi['value'] = pm25(concentration);
                    aqi['ts'] = new Date(feed.created_at);
                }
            });
        }
        updateCurrent(aqi);
        sensorMapPopup(aqi['value']);
    }).fail(function (jqxhr, textStatus, error) {
        $('#aqi-detail').append('No data');
        updateMap('No data');
    });
}

function updateCurrent(aqi) {
    if (!aqi['value']) {
        $('#aqi-num').text('No data');
        return;
    }
    var aqiStr = aqi_label(aqi.value);
    $('#aqi-box').removeClass(function (index, css) {
        return (css.match(/aqi-/) || []).join(' ');
    });
    $('#aqi-box').addClass('aqi-' + aqiDescToId(aqiStr));
    $('#aqi').text(aqiStr + ' (' + aqi.value.toFixed(2) + ')');
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
    var popupText = (aqi) ? 'pm2.5: ' + aqi : 'No data';
    var mapEl = $('#map');
    mapPopup(mapEl.data('latitude'), mapEl.data('longitude'), popupText);
}