let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
});

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function markerColor(depth) {
    if (depth >= 90) {
        return '#FF0000';
    }
    else if (depth >= 70) {
        return '#FF8C00';
    }
    else if (depth >= 50) {
        return '#FFA500';
    }
    else if (depth >= 30) {
        return '#FFD580';
    }
    else if (depth >= 10) {
        return '#ADFF2F';
    }
    else {
        console.log(depth + " depth");
        return '#00FF00';
    }
}

function markerRadius(magnitude) {
    return magnitude * 4000;
}

d3.json(queryURL).then(function (data) {
    for (let i = 0; i < data.features.length; i++) {
        
        let lon = data.features[i].geometry.coordinates[1];
        let lat = data.features[i].geometry.coordinates[0];
        let depth = data.features[i].geometry.coordinates[2];

        let circle = L.circle([lon,lat], {
            color: markerColor(depth),
            fillColor: markerColor(depth),
            fillOpacity: 0.75,
            radius: markerRadius(data.features[i].properties.mag)
        }).bindPopup("Location: " + data.features[i].properties.place + "<br>" +
                     "Magnitude: " + data.features[i].properties.mag + "<br>" +
                     "Depth: " + data.features[i].geometry.coordinates[2] + "<br>" +
                     "Time: " + new Date(data.features[i].properties.time) + "<br>"
                    ).addTo(myMap);
    }
});

let legend = L.control({
    position: "bottomright"
});

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    depth = [-10, 10, 30, 50, 70, 90];
  
    for (var i = 0; i < depth.length - 1; i++) {
        console.log(i + " " + depth[i]);
        div.innerHTML += '<i style="background:' + markerColor(depth[i]) + '"></i> ' + depth[i] + "-" + (depth[i] + 20) + '<br>';
    }
    div.innerHTML += '<i style="background:' + markerColor(depth[5]) + '"></i> ' + depth[5] + '+' + '<br>';
    return div;
};

legend.addTo(myMap);