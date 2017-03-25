
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
var markerLabels = 'ABCDEFGHIJ';
var markerLabelIndex = 0;

function initMap() {
  navigator.geolocation.getCurrentPosition(function(position) {
    var currentLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
    
    map = new google.maps.Map(document.getElementById('map'), {
      center: currentLocation,
      zoom: 12
    }); //map

    var service = new google.maps.places.PlacesService(map);
    var query = {
      location: currentLocation,
      radius: '2000',
      rankBy: google.maps.places.RankBy.DISTANCE,
      keyword: 'coffee'
    };   //var query
    
    service.radarSearch(query, searchResults); //(textSearch)
    var currentPosition = new google.maps.Marker({
      position: currentLocation,
      map: map, 
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      label: 'You are here',
    });

    function searchResults(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        $('#please-wait').addClass('hide');
        $('#search-results').removeClass('hide');

        var coffeeShops = results.slice(0, 10);
        coffeeShops.forEach(createMarker);
      }   //if maps OK

      else if (status === "ZERO_RESULTS") {
          $('#place-details').addClass('detail-info');
          $('#place-details').html(
            '<div class="place-name">' + 'No coffee found nearby' + '</div>');
      }   //else if "zero-results"
      else {
        if (status === google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
          $('#place-details').addClass('detail-info');
          $('#place-details').html(
            '<div class="place-info">' + 
            'We are currently doing our regular maintenance, please try again later' + 
            '</div>');
        }   //if inside else
        else if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
          $('#place-details').addClass('detail-info');
          $('#place-details').html(
            '<div class="place-info">' + 
            'We are currently doing our regular maintenance, please try again later' + 
            '</div>');
        }   //else if inside else
      }   //else
    }   //searchResults function

    var infoWINDOW;
    
    function createMarker(place, index) {
    
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        label: markerLabels[index],
      });   //var marker
      
      var $place = $('<li class="place-details"></li>').appendTo('ul#results-list');
      var $placeLabel = $('<div class="place-label inline"></div>').appendTo($place);
      var $placeInfo = $('<div class="place-info inline"></div>').appendTo($place);
      var $name = $('<p class="name"></p>').appendTo($place);
      var $address = $('<p class="address"></p>').appendTo($place);
      var $phone = $('<p class="phone"></p>').appendTo($place);
      
      service.getDetails(place, function(details, status){
        $placeLabel.text(marker.label);
        $name.text(details.name);
        $address.text(details.vicinity);
        $phone.text(details.formatted_phone_number);

        if (status === google.maps.places.PlacesServiceStatus.OK) {
          google.maps.event.addListener(marker, 'click', function(){
            if (infoWINDOW) { infoWINDOW.close(); }
            var infowindow = new google.maps.InfoWindow();
            infoWINDOW = infowindow;
            infowindow.open(map, marker);
            infowindow.setContent(details.name);
            $('.place-details').removeClass('highlight');
            $place.toggleClass('highlight');
          
            google.maps.event.addListener(infowindow,'closeclick',function(){
              $('.place-details').removeClass('highlight');
            }); //addListener for closeclick
          });  //addListener

        }  //if
      });   //getDetails
    }   //createMarker function
	});   //getCurrentPosition 
}   //initMap




