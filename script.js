// ----------------------------------------------------------------------------
// CONSTANTS + VARIABLES
// ----------------------------------------------------------------------------

// Contains all of the current marker on the map
// List of Marker
let markers = [];

// Google maps map element (set in initializer)
let map;

// Google maps search element
let search_box;

// ----------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------

// Purpose: Runs whenever the page is loaded to initialize the map element and search bar
window.initAutocomplete = async function () {

    // Google maps element
    let map_element = document.getElementById("map");
    let map = new google.maps.Map(map_element, {
        center: { lat: 49.246292, lng: -123.116226 },
        zoom: 12,
        mapTypeId: "terrain",
    });

    // Search bar element
    let search_bar = document.getElementById("search_bar");
    let search_box = new google.maps.places.SearchBox(search_bar);

    // Search for places nearby where the map currently is
    map.addListener("bounds_changed", () => {
        search_box.setBounds(map.getBounds())
    })

    // Add an event listener for the input field
    search_box.addListener("places_changed", updateMap);
}

// Purpose: Called when the user presses enter on a new search to update the map to the new result
function updateMap() {
    const places = search_box.getPlaces();

    // Exit function if there are no places from the search
    if (places.length == 0) {
        return;
    }

    // Clear out the old markers on the screen
    markers.forEach((marker) => {
        marker.setMap(null);
    });
    markers = [];

    // The bounds of the google maps screen to zoom to, containing all locations
    let bounds = new google.maps.LatLngBounds()

    // For each place, get the icon, name and location.
    places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
            console.log("Returned place contains no geometry");
            return;
        }

        // Create a marker for each place.
        markers.push(
            new google.maps.Marker({
                map,
                title: place.name,
                position: place.geometry.location,
            }),
        );

        // Add in all the new locations to the bounds
        if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
    });

    // Set the bounds of the map to a scaled version of the new bounds
    map.fitBounds(getExtendedBounds(bounds, 3.0))
}

// Signature: (LatLngBounds, float) -> LatLngBounds
// Purpose: Returns the bounds extended by the given percentage
//          E.g. 1.5 -> 150% larger
function getExtendedBounds(bounds, percentage) {
    var point_SW = bounds.getSouthWest();
    var point_NE = bounds.getNorthEast();

    var lat_adjustment = (point_NE.lat() - point_SW.lat()) * (percentage - 1);
    var lng_adjustment = (point_NE.lng() - point_SW.lng()) * (percentage - 1);
    
    var new_point_NE = new google.maps.LatLng(
        point_NE.lat() + lat_adjustment, point_NE.lng() + lng_adjustment);
    var new_point_SW = new google.maps.LatLng(
        point_SW.lat() - lat_adjustment, point_SW.lng() - lng_adjustment);

    new_bounds = new google.maps.LatLngBounds();
    new_bounds.extend(new_point_NE);
    new_bounds.extend(new_point_SW);
    
    return new_bounds;
}