
$(document).ready(function(){
  $('.logo').click(function(event){
    $(this).removeClass('click');
    $('#search-results').removeClass('hide');
    initMap();
  });   //click function
}); //document.ready

function showUI(){
  $('.search-button').removeClass('hide');
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
      query: 'coffee'
    };   //var query
    
    service.textSearch(query, callback); //(textSearch)

    function callback(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var coffeeShops = results.slice(0, 5);
        for (var i = 0; i < results.length; i++) {
          coffeeShops.forEach(createMarker);
        }   //for
      }   //if
    }   //callback function

    var infoWINDOW;
    function createMarker(place) {
      var placeLoc = place.geometry.location;
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




