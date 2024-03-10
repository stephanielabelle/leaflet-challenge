
// Adding tile layer
let street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
    foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Adding tile layer
var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

let baseMaps = {
    Street: street,
    Topography: OpenTopoMap,
}

// Create a legend to display map info
let info = L.control({
    position: "topright"
});

// When layer control is added, insert a div with class of "legendmap"
info.onAdd = function(){
    let div = L.DomUtil.create("div", "legendmap");
    return div;
};

// Creating a map with layers
let myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom:4.45,
    layers: [street]
});

// Create a control for our layers, and add our overlays to it
L.control.layers(baseMaps, null, {collapsed: false}).addTo(myMap);

// Add the info legend to map
info.addTo(myMap);

// url for GeoJSON data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
let urlplates = "https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json"

// Getting GeoJSON data Earthquake data
d3.json(url).then(function(data){
    features = data.features;
    console.log(features);
    for (let i = 0; i < features.length; i++){
        L.circle([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]], {
            radius: markersize(features[i].properties.mag),
            fillOpacity: 0.7,
            color: "black",
            fillColor: markercolour(features[i].geometry.coordinates[2]),
            weight: .5
        }).bindPopup(`<h2>${features[i].properties.place}</h2><hr>
        <p><b>Magnitude:</b> ${features[i].properties.mag}</p>
        <p><b>Date: </b>${new Date(features[i].properties.time)}</p>
        <p><b>Depth: </b>${features[i].geometry.coordinates[2]}km`).addTo(myMap)
    }
});

let legendearth = L.control({position: "bottomright"});
legendearth.onAdd = function(){
    let div = L.DomUtil.create('div', 'info legend');
        let labels = ['<strong>Depth (km)</strong>']
        let colorlabel = ["#23af03", "#baed10", "#fbec00", "#fbbc08","#ff7906", "#ff0000"];
        let categories = ["< 10","10-30", "30-50", "50-70", "70-90", "90+"];
        for (let i = 0; i < categories.length; i++){
            labels.push('<i style="background:' + colorlabel[i] + '"></i>' + categories[i])
            }
            div.innerHTML = labels.join('<br>');
        return div;
};
legendearth.addTo(myMap);


function markersize(x){
    return (x**4)*500;
};

function markercolour(x){
    if (x < 10) return "#23af03";
    else if (x < 30) return "#baed10"
    else if (x < 50) return "#fbec00"
    else if (x < 70) return "#fbbc08"
    else if (x < 90) return "#ff7906"
    else if (x => 90) return "#ff0000"
};

