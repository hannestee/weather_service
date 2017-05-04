var worseWeather = [[64.53, 40.54, 'Arkhangel´sk', 'Russia'], [68.43, 27.45, 'Inari', 'Finland'], [68.44, 18.08, 'Bjørnfjell', 'Norway'], [64.18, -51.72, 'Nuuk', 'Greenland'], [62.84, -69.87, 'Kimmirut', 'Canada'], [71.29, -156.78, 'Barrow', 'United States, Alaska']];
var locations = [];

$(document).ready(function () {
    console.log("model.js ready!");

    var temperature;

    $('#searchButton').click(function () {
        var value = $("#location").val();
        locations = []; //tyhjentää locations taulun
        getLocation(value);
    });


    function getLocation(name) {
        $.ajax({
            'url': 'http://api.geonames.org/search?name=' + name + '&username=karjala100',
            'dataType': 'xml',
            'success': onGetLocation
        });
    }

    function getPlaceName(lat, lng) {
        $.ajax({
            'url': 'http://api.geonames.org/findNearbyPlaceNameJSON?lat=' + lat + '&lng=' + lng + '&username=karjala100',
            'dataType': 'json',
            'success': function (data) {
                console.log(data.geonames[0].name);
                getLocation(data.geonames[0].name);
            }
        });
    }

    function onGetLocation(data) {
        $(data).find('geoname').each(function () {

            var id = $(this).find('geonameId').text();
            var name = $(this).find('toponymName').text();
            var countryName = $(this).find('countryName').text();
            var lat = $(this).find('lat').text();
            var lng = $(this).find('lng').text();

            locations.push({'id': id, 'info': [name, countryName, lat, lng]});
        });
        getWeather(locations[0].info[2], locations[0].info[3], 'current');
    }


    function getWeather(lat, lng, weatherType, place) {

        if (weatherType === 'current') {
            $.ajax({
                'url': 'http://api.geonames.org/findNearByWeatherJSON?lat=' + lat + '&lng=' + lng + '&username=karjala100',
                'dataType': 'json',
                'success': showWeather
            });
        } else {
            $.ajax({
                'url': 'http://api.geonames.org/findNearByWeatherJSON?lat=' + lat + '&lng=' + lng + '&username=karjala100',
                'dataType': 'json',
                'success': function (data) {
                    showWorseWeather(data, place, lat, lng);
                }
            });
        }

    }

    function getWebcam(lat, lng) {
        $.ajax({
            url: 'https://webcamstravel.p.mashape.com/webcams/list/nearby=+' + lat + ',' + lng + ',10', // The URL to the API. You can get this by clicking on "Show CURL example" from an API profile
            type: 'GET', // The HTTP Method
            data: {}, // Additional parameters here
            datatype: 'json',
            success: function (data) {
                setWebcam(data.result.webcams[0].id);
            },
            error: function (err) {
                console.log(err);
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-Mashape-Authorization", "Q6Q4WUhrnUmshp3J1WLLwlQ6ASJBp1LMEDqjsnYE2z845CFuMx"); // Enter here your Mashape key
            }
        });
    }

    function showWeather(data) {
        $.each(data, function () {
            temp = data.weatherObservation.temperature;
            temperature = temp;
        });
        if (locations[0] !== null) {
            onLocationSelected(locations[0].info[0], locations[0].info[1], temp);
        } else {
            onLocationSelected('Not found', 'Not found');
        }
        setWorseWeather();
    }

    function showWorseWeather(data, place, lat, lng) {
        $.each(data, function () {
            if (parseInt(temperature) > parseInt(data.weatherObservation.temperature)) {
                $(".worse").show();
                $("#worseCity").text(place);
                $("#worseTemp").text(data.weatherObservation.temperature + '°C');
                getWebcam(lat, lng);
            } else {
                $(".worse").hide();
            }
        });
    }

    function setWorseWeather() {
        var rand = worseWeather[Math.floor(Math.random() * worseWeather.length)];
        getWeather(rand[0], rand[1], '', rand[2] + ', ' + rand [3]);
    }


    function getGeoLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    function showPosition(position) {
        console.log("Geo coords: ", position.coords.latitude, position.coords.longitude);
        getPlaceName(position.coords.latitude, position.coords.longitude);
    }

    getGeoLocation();
});

