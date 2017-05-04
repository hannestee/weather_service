/**
 * Created by hannest on 4/27/17.
 */

//Esimerkkejä:
var list_city = [{"Cities":
                    [{"Helsinki": {
                        "lon": '60',
                        "lat": '25'
                        }
                    },
                    {"Espoo": {
                        "lon": '60',
                        "lat": '25'
                        }
                    }]
}];


var list_weather = [{"Weather":
                    {
                        "temp":'+6c',
                        "icon":'rain'
                    }
}];


//console.log(list_city);
//console.log(list_weather)

$( document ).ready(function() {
    console.log( "main.js ready!" );

    loadFavourites();

    $('#favouritesButton').click(function(){
        //console.log('clicked');

        var location = $("#currentCity").text();
        var temperature = $("#temp").text();

        var storage_item  = {location : [location, temperature]};

        localStorage.setItem("favourites", JSON.stringify(storage_item));

        $( ".currentWeather" ).append( "<div style='border: 1px solid cyan;'><p>"+location+"</p>" +
            "<p>"+temperature+"</p></div>" );
    });
});


function loadFavourites() {
    if (localStorage.getItem("favourites") !== null){
        //console.log("favourites set");
        var favourites = JSON.parse(localStorage.getItem("favourites"));
        //console.log(favourites.location[0]);
        $( ".currentWeather" ).append( "<div style='border: 1px solid cyan;'><p>"+favourites.location[0]+"</p>" +
            "<p>"+favourites.location[1]+"</p></div>" );
    }
}

function onLocationSelected(location, country, temp){
    //console.log('Location: ' + location);
    /*for (city of list_city){
        console.log(city);
    }*/
    $("#currentCity").text(location + ", " + country);
    $("#temp").text(temp+'°C');
}

function setWebcam(webcamid) {
    $("iframe").attr("src", "//api.lookr.com/embed/timelapse/" + webcamid + "/day?autoresize=1");
}


