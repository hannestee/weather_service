

var locations = [];
var temperature = [];
var typed_location;

$( document ).ready(function() {
    console.log("ready!");

    $('#searchButton').click(function(){
        console.log('clicked');
        var value = $("#location").val();
        locations = [];
        getLocation(value);
        typed_location = value;
    });


    function getLocation(name) {
        //console.log('getLocation');
        $.ajax({
            'url': 'http://api.geonames.org/search?name='+name+'&username=karjala100',
            'dataType': 'xml',
            'success': onGetLocation
            });
    }


    function onGetLocation(data) {
        //console.log('onGetLocation');
        $(data).find('geoname').each(function () {

            var id = $(this).find('geonameId').text();
            var name = $(this).find('toponymName').text();
            var countryName = $(this).find('countryName').text();
            var lat = $(this).find('lat').text();
            var lng = $(this).find('lng').text();

            locations.push({'id':id, 'info':[name, countryName, lat, lng]});
        });

        console.log(locations);
        //console.log(typed_location);

        getWeather(locations[0].info[2], locations[0].info[3]);
        getWebcam(locations[0].info[2], locations[0].info[3]);
    }


    function getWeather(lat, lng){
        $.ajax({
            'url': 'http://api.geonames.org/findNearByWeatherJSON?lat='+lat+'&lng='+lng+'&username=karjala100',
            'dataType': 'json',
            'success': showWeather
        });
    }

    function getWebcam(lat, lng){
        $.ajax({
            url: 'https://webcamstravel.p.mashape.com/webcams/list/nearby=+'+lat+','+lng+',10', // The URL to the API. You can get this by clicking on "Show CURL example" from an API profile
            type: 'GET', // The HTTP Method
            data: {}, // Additional parameters here
            datatype: 'json',
            success: function(data) {
                console.log(data);
                console.log(data.result.webcams[0].id);
                setWebcam(data.result.webcams[0].id);

            },
            error: function(err) { console.log(err); },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-Mashape-Authorization", "Q6Q4WUhrnUmshp3J1WLLwlQ6ASJBp1LMEDqjsnYE2z845CFuMx"); // Enter here your Mashape key
            }
        });
    }

    function showWeather(data) {

        $.each(data, function(){
            console.log(data);
           console.log(data.weatherObservation.temperature);
           temp = data.weatherObservation.temperature;
           /*temperature.push({'temperature': data.temperature})
            console.log(data);*/
        });

        if (locations[0] !== null) {
            onLocationSelected(locations[0].info[0], locations[0].info[1], temp);
        } else {
            onLocationSelected('Not found', 'Not found');
        }
    }
});