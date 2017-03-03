

$('.search-button').click(function(event){
	event.preventDefault();
	$(this).addClass('hide');
	$('#search-results').removeClass('hide');

});   //click function




var map;
var infowindow;

function initMap() {
  navigator.geolocation.getCurrentPosition(function(position) {
    var currentLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
    
    map = new google.maps.Map(document.getElementById('map'), {
      center: currentLocation,
      zoom: 15
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
      // create function for div to show results details
      }   //for
    }   //if
  }   //callback function

function createMarker(place) {
  var placeLoc = place.geometry.location;
  //var markerLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //var labelIndex = 0;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    //label: markerLabels[labelIndex++ % labels.length],
  });   //var marker

  google.maps.event.addListener(marker, 'click', function() {
    console.log(place);
    var infowindow = new google.maps.InfoWindow();
    infowindow.setContent(place.name);
    infowindow.open(map, this);

    service.getDetails(place, function(details, status){
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        infowindow.setContent(details.name);
        $('#place-details').append(
          '<span>' + details.name + '</span><br>' + 
          '<span>' + place.formatted_address + '</span>');
      }

    });   //getDetails
  });   //addListener
}   //createMarker function

/*

//radar search - search within specified radius

service.getDetails({
          placeId: place_id
        }, function(place, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            var marker = new google.maps.Marker({
              map: map,
              position: place.geometry.location
            });
            google.maps.event.addListener(marker, 'click', function() {
              infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                'Place ID: ' + place.place_id + '<br>' +
                place.formatted_address + '</div>');
              infowindow.open(map, this);
            });
          }
        });
*/

	});   //getCurrentPosition 
}   //initMap







/* 
	SEARCH FOR PLACE DETAILS
service = new google.maps.places.PlacesService(map);
service.getDetails(request, callback);

	geocoding services
	- create var to get location (use placeID geocoder)
	- once location is identified, search details on restaurant




	SEARCH NEARBY PLACES
service = new google.maps.places.PlacesService(map);
service.nearbySearch(request, callback);
*/

