var tz = 'Asia/Bangkok'; // no Hanoi or ICT so use BKK
var channelId = $('#variables').data('channel-id');
var dataUrl = 'https://api.thingspeak.com/channels/' + channelId + '/feeds.json?';
dataUrl += 'timezone=' + tz;

function thingspeakApi() {
    return dataUrl;
}