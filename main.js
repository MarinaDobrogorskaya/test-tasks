var map, marker;
var locationInfo = document.getElementById('location-info');
var list = document.getElementById('list');
var counter = document.getElementById('counter');
var currentTime = document.getElementById('current-time');
var fullDate = document.getElementById('utc-date');

var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov','Dec'];


function main() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: {lat: 48.4622135, lng: 34.8602723}
    });

    marker = new google.maps.Marker({
        map: map,
        title: 'ISS is here!'
    });

    getLocation();
    getISSCrew();
    getUTCTime();
}


function getLocation () {
    $.getJSON('http://api.open-notify.org/iss-now.json')
        .done(function(data) {
            var lat = data['iss_position']['latitude'];
            var lng = data['iss_position']['longitude'];
            marker.setPosition({lat: +lat, lng: +lng});
            map.setCenter({lat: +lat, lng: +lng});
            locationInfo.innerText = 'Latitude: ' + lat + ', longitude: ' + lng;
        })
        .fail(function() {
            console.log( "error" );
        })
        .always(function() {
            setTimeout(getLocation, 5000);
        });

}

function createCrewList(arr){
    list.innerHTML = '';
    var amount = 0;
    for(var i = 0; i < arr.length; i++){
        if(arr[i].craft === 'ISS'){
            amount += 1;
            var unit = document.createElement('div');
            var card = document.createElement('div');
            var icon = document.createElement('span');
            var name = document.createElement('h5');
            unit.classList.add('well', 'well-sm');
            icon.classList.add('glyphicon', 'glyphicon-user');
            name.innerText = arr[i].name;
            unit.appendChild(icon);
            unit.appendChild(name);
            list.appendChild(unit);
        }
    }
    counter.innerText = 'Total amount: ' + amount + ' people on ISS';
}
function getISSCrew() {
    $.getJSON('http://api.open-notify.org/astros.json')
        .done(function(data) {
            var people = data['people'];
            createCrewList(people);
        })
        .fail(function() {
            console.log( "error" );
        })
        .always(function() {
            setTimeout(getISSCrew, 5000);
        });
}

function getUTCTime() {
    var date = new Date();
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    currentTime.innerText = 'Current UTC time: ' + hour + ':' + minute;
    fullDate.innerText = week[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    setTimeout(getUTCTime, 5000);
}



