function initMap() {
    var vancouverCoords = { lat: 49.2827, lng: -123.1207 };
    var map = new google.maps.Map(document.getElementById('map'), {
      center: vancouverCoords,
      zoom: 12  // Adjust the zoom level as needed
    });
  }