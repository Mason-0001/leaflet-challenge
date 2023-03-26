// Store the API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {
// Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

    // Determine the color of the marker based on the depth.

    function getColor(depth) {
        if (depth <= 10) {
          return "#00FF00"; // green
        } else if (depth <= 30) {
          return "#ADFF2F"; // green-yellow
        } else if (depth <= 50) {
          return "#FFFF00"; // yellow
        } else if (depth <= 70) {
          return "#FFA500"; // orange
        } else if (depth <= 90) {
          return "#FF4500"; // orange-red
        } else {
          return "#FF0000"; // red
        }
      }

// Define a function to create the markers for each earthquake feature.
function createMarker(feature, latlng) {
    var magnitude = feature.properties.mag;
    var depth = feature.geometry.coordinates[2];

    // Determine the size of the marker based on the magnitude.
    var size = magnitude * 5;

    // Create the marker object.
    var marker = L.circleMarker(latlng, {
      color: "#000000",
      fillColor: getColor(feature.geometry.coordinates[2]),
      fillOpacity: 1.0,
      radius: size,
      weight: 1
    });

    // Add a popup to the marker.
    marker.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);

    // Return the marker object.
    return marker;
  }



   // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createMarker
  });

// Create a legend control and add it to the map.
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.style.backgroundColor = 'darkgrey'; // Set background color to white
  
  // Add HTML for legend with colored boxes
  div.innerHTML += '<i style="background:#00FF00"></i> -10-10<br>';
  div.innerHTML += '<i style="background:#ADFF2F"></i> 10-30<br>';
  div.innerHTML += '<i style="background:#FFFF00"></i> 30-50<br>';
  div.innerHTML += '<i style="background:#FFA500"></i> 50-70<br>';
  div.innerHTML += '<i style="background:#FF4500"></i> 70-90<br>';
  div.innerHTML += '<i style="background:#FF0000"></i> 90+<br>';

  return div;
};

    // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);

  function createMap(earthquakes) {

    // Create the base layers.

    var natGeo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
        maxZoom: 16
    });
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    var baseMaps = {
      "Topographic Map": topo,
      "National Geographic Map": natGeo
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [topo, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  


legend.addTo(myMap);
  }
}
  
