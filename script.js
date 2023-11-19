window.initAutocomplete = function () {
    console.log("iohsoiehfs")
    let map_element = document.getElementById("map");

    let map = new google.maps.Map(map_element, {
        center: { lat: 49.246292, lng: -123.116226 },
        zoom: 12,
        mapTypeId: "terrain",
    });

  map.addListener('click', function(event) {
    handleMapClick(event.latLng, map);
  });
  
function handleMapClick(latLng, map) {
    var accessibilityData = "Accessibility Information Here";
    var infoWindow = new google.maps.InfoWindow({
      content: accessibilityData
    });
    infoWindow.setPosition(latLng);
    infoWindow.open(map);
  }

}
