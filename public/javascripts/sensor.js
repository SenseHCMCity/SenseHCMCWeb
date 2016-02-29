var map, geo;

function loadMap() {
    var mapEl = $('#map');
    geo = [mapEl.data('latitude'), mapEl.data('longitude')];
    map = L.map('map').setView(geo, 16);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

function loadCurrentLevel() {
    $.getJSON(thingspeakApi() + '&results=1', function (data) {
        var level = {};
        if (data.feeds.length > 0) {
            level['value'] = parseFloat(data.feeds[0].field1);
            level['ts'] = new Date(data.feeds[0].created_at);
        }
        updateLevelBox(level);
        updateMap(level);
    });
}

function updateLevelBox(level) {
    if (!level['value']) {
        $('#level-num').text('No data');
        return;
    }
    var levelStr = levelLabel(level.value);
    $('#level-box').removeClass(function (index, css) {
        return (css.match(/aqi-/) || []).join(' ');
    });
    $('#level-box').addClass('aqi-' + levelStr.toLowerCase());
    $('#level').text(levelStr + ' (' + level.value.toFixed(2) + ')');
    $('#level-detail').text(level.ts);
}


function updateMap(level) {
    var popupText = level['value'];
    if (!popupText)
        popupText = 'No data';
    L.marker(geo).addTo(map).bindPopup('Temperature: ' + popupText).openPopup();
}

// TODO: SWAP out temperature level with AQI ranges
function levelLabel(level) {
    var levelStr;
    if (level >= 35)
        levelStr = 'Unhealthy';
    else if (level >= 32)
        levelStr = 'Sensitive';
    else if (level >= 29)
        levelStr = 'Moderate';
    else
        levelStr = 'Good';
    return levelStr;
}