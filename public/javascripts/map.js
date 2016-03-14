var map;

function createMap(latitude, longitude, zoom) {
    map = L.map('map').setView([latitude, longitude], zoom);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

function mapPopup(latitude, longitude, popupText) {
    L.marker([latitude, longitude]).addTo(map).bindPopup(popupText).openPopup();
}