var mymap = L.map('mapid').setView([40.2838, -3.8215], 16);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);
L.marker([40.2838, -3.8215]).addTo(mymap).bindPopup('<a href="http://www.etsit.urjc.es">ETSIT</a> (<a href="http://www.urjc.es">URJC</a>)').openPopup();
function onMapClick(e) {
	L.marker(e.latlng).addTo(mymap).bindPopup(e.latlng.toString()).openPopup();
}
function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(mymap)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(mymap);
}
function onLocationError(e) {
    alert(e.message);
}

function addr_search() {
	var inp = document.getElementById("addr");

	$.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {

	var items = [];

	$.each(data, function(key, val) {
	  items.push(
	    "<li><a href='#' onclick='chooseAddr(" +
	    val.lat + ", " + val.lon + ");return false;'>" + val.display_name +
	    '</a></li>'
	  );
	});

    $('#results').empty();
    if (items.length != 0) {
      $('<p>', { html: "Search results:" }).appendTo('#results');
      $('<ul/>', {
        'class': 'my-new-list',
        html: items.join('')
      }).appendTo('#results');
    } else {
      $('<p>', { html: "No results found" }).appendTo('#results');
    }
  });
}

function chooseAddr(lat, lng, type) {
  var location = new L.LatLng(lat, lng);
  mymap.panTo(location);

  if (type == 'city' || type == 'administrative') {
    mymap.setZoom(11);
  } else {
    mymap.setZoom(13);
  }
}

mymap.on('click', onMapClick);
mymap.on("locationfound", onLocationFound);
mymap.on("locationerror", onLocationError);
mymap.locate({setView: true, maxZoom: 16});

function json(jsonp) {
	$("#images").empty();
	$.getJSON(jsonp, function(data) {
		$.each(data.items, function(i, item) {
			$("<img>").attr("src", item.media.m).appendTo("#images");
		});
	})
}

$("#click").click(function(event) {
	var search = $("#search").val();
	var jsonp = "http://api.flickr.com/services/feeds/photos_public.gne?tags=" 
	+ search + "&tagmode=any&format=json&jsoncallback=?";
	json(jsonp);
})

