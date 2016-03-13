var channelId = $('#variables').data('channel-id');
var dataUrl = 'https://api.thingspeak.com/channels/' + channelId + '/feeds';
var tz = 'timezone=Asia/Bangkok'; // no Vietnam or ICT so use BKK

function tsFeed() {
    return dataUrl + '.json?' + tz;
}

function tsLast() {
    return dataUrl + '/last.json?' + tz;
}