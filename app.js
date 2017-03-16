
$(document).ready(function(){
  $('button').click(function(event){
    $('#intro').addClass('hide');
    $('#please-wait').removeClass('hide');
    initMap();
  });   //click function
}); //document.ready

function showUI(){
  $('button').removeClass('hide');
}   //showUI

var map;
var infowindow;

function initMap() {
  navigator.geolocation.getCurrentPosition(function(position) {
    var currentLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
    
    map = new google.maps.Map(document.getElementById('map'), {
      center: currentLocation,
      zoom: 13
    }); //map

    var service = new google.maps.places.PlacesService(map);
    var query = {
      location: currentLocation,
      radius: '1000',
      keyword: 'coffee'
    };   //var query
    
    service.radarSearch(query, searchResults); //(textSearch)
    var currentPosition = new google.maps.Marker({
      position: currentLocation,
      map: map,
      label: 'You are here',
    });

    function searchResults(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        $('#please-wait').addClass('hide');
        $('#map').removeClass('hide');
      //  console.log(currentLocation);
        // currentLocation(createMarker);
        var coffeeShops = results.slice(0, 5);
        for (var i = 0; i < results.length; i++) {
          coffeeShops.forEach(createMarker);
        }   //for
      }   //if
      else if (status === "ZERO_RESULTS") {
          $('#place-details').addClass('detail-info');
          $('#place-details').html(
            '<div class="place-name">' + 'No coffee found nearby' + '</div>');
      }   //else if
      else {
        if (status === google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
          $('#place-details').addClass('detail-info');
          $('#place-details').html(
            '<div class="place-info">' + 
            'We are currently doing our regular maintenance, please try again later' + 
            '</div>');
        }   //if inside else
      }   //else
    }   //callback function

    var infoWINDOW;
    
    function createMarker(place) {
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
      });   //var marker

      google.maps.event.addListener(marker, 'click', function() {
        if (infoWINDOW) { infoWINDOW.close(); }
        var infowindow = new google.maps.InfoWindow();
        infoWINDOW = infowindow;
        infowindow.setContent(place.name);
        infowindow.open(map, this);

        service.getDetails(place, function(details, status){
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            infowindow.setContent(details.name);
            $('#place-details').addClass('detail-info');
            $('#place-details').html(
              '<div class="place-name">' + details.name + '</div>' + 
              '<div class="place-info">' + details.vicinity + '</div>' +
              '<div class="place-info">' + details.formatted_phone_number + '</div>'
            );   // .html
          }  //if
        });   //getDetails
      });   //addListener
    }   //createMarker function
	});   //getCurrentPosition 
}   //initMap




