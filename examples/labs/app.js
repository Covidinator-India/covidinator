/**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 *
 * For more information visit:
 * https://www.amcharts.com/
 *
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */

/**
 * Create the Google Map
 */
var gmap;
var user_lat;
var user_lon;
var user_pos;

function initGoogleMap() {
  gmap = new google.maps.Map(document.getElementById("gmap"), {
    scrollwheel: true,
    disableDefaultUI: true,
    center: {lat: 23.319822231760767, lng: 79.96281904790666},
    styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
  });
//geolocate
    infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      //assign to local variables
      user_pos = pos;
      user_lat = pos.lat;
      user_lon = pos.lng;
      addPerson(pos.lat,pos.lng);

      infoWindow.setPosition(pos);
      infoWindow.setContent('You are here.');
      //infoWindow.open(gmap);
      //gmap.setCenter(pos);

    }, function() {
      handleLocationError(true, infoWindow, gmap.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, gmap.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
}

/**
 * Create the amCharts Map
 */

// Create map instance
var ammap = am4core.create("ammap", am4maps.MapChart);
//ammap.geodata = am4geodata_worldIndiaLow;
ammap.geodataSource.url = "deps/amcharts4-geodata/india_with_ladakh.json";
ammap.projection = new am4maps.projections.Mercator();
ammap.zoomDuration = 0;
ammap.zoomLevel = 1.5;
ammap.zoomEasing = am4core.ease.sinOut;

var polygonSeries = ammap.series.push(new am4maps.MapPolygonSeries());
polygonSeries.exclude = ["AR.ER"];
//polygonSeries.LegendSettings.createMarker = false;
polygonSeries.name = "Map Outline";
polygonSeries.useGeodata = true;
//polygonSeries.legendSettings.createMarker = false;
polygonSeries.hide();

// Add zoom control
ammap.zoomControl = new am4maps.ZoomControl();
ammap.homeGeoPoint = {
  latitude: 23.319822231760767,
  longitude: 79.96281904790666
};

// Configure series
var polygonTemplate = polygonSeries.mapPolygons.template;
//polygonTemplate.LegendSettings.createMarker = false;
//polygonTemplate.tooltipText = "{name}";
polygonTemplate.fill = am4core.color("#3b3b3b");
polygonTemplate.fillOpacity = 0.2;

var hs = polygonTemplate.states.create("hover");
hs.properties.fill = am4core.color("367B25");

//Add Labs
//Sort Labs into GOV,PVT and COLLECTION
var gov = [];
var pvt = [];
var col = [];

for (x=0;x<test_centers.length;x++){
var obj = test_centers[x];
  if(obj.type=="GOV"){
    gov.push(obj);
  }
  else if(obj.type =="PRIVATE"){
    pvt.push(obj);
  }
  else if(obj.type=="COLLECTION"){
    col.push(obj);
  }
}

//Government Series
var govSeries = ammap.series.push(new am4maps.MapImageSeries());
var govSeriesTemplate = govSeries.mapImages.template;
var marker = govSeriesTemplate.createChild(am4core.Sprite);
govSeries.name = "Government Labs";
govSeries.fill = am4core.color("#44D344");
govSeries.color = am4core.color("#fff");
govSeries.legendSettings.labelText = "[bold {color}]{name}[/]";
marker.path = "m -3.5639398,6.73232 h 1.58403 v 0.79201 h -1.58403 z M -5.54397,4.75228 H 1.202e-4 V 5.9403 H -5.54397 Z m 5.2272802,0 H -4.98956 l 1.7028302,-3.16805 h 1.22762 z m -2.85124,-3.96006 h 1.18802 v 0.79201 h -1.18802 z M -4.75196,-0.79181 h 4.3560702 V 0.79222 M -4.75196,-0.79181 h 4.3560702 V 0.79222 H -4.75196 Z m -1.18802,-11.08818 h 6.3361102 v 1.58402 M -5.93998,-11.87999 h 6.3361102 v 1.58402 H -5.93998 Z m 0.39601,9.50415 h 5.9401002 v 1.58403 M -5.54397,-2.37584 h 5.9401002 v 1.58403 H -5.54397 Z m 3.3660502,-3.24725 c 0.27721,0.27721 0.27721,0.71281 0,0.99002 -0.2772,0.2772 -0.71281,0.2772 -0.99001,0 m 1.22762,-0.47521 a 0.71281178,0.71281178 0 0 1 -0.71281,0.71281 0.71281178,0.71281178 0 0 1 -0.71282,-0.71281 0.71281178,0.71281178 0 0 1 0.71282,-0.71281 0.71281178,0.71281178 0 0 1 0.71281,0.71281 m 0.47521,0 a 1.1880197,1.1880197 0 0 1 -1.18802,1.18802 1.1880197,1.1880197 0 0 1 -1.18802,-1.18802 1.1880197,1.1880197 0 0 1 1.18802,-1.18802 1.1880197,1.1880197 0 0 1 1.18802,1.18802 M -4.75196,-10.29597 h 3.9600702 v 7.92013 M -4.75196,-10.29597 h 3.9600702 v 7.92013 H -4.75196 Z m 0.3960102,-1.98003 h 3.16805 v 1.58403 h -3.16805 z M 7.32624,0.119 c 0,4.47488 -3.76206,8.11814 -8.1181298,8.11814 V 4.91068 C 1.9801503,4.91068 3.99979,2.77225 3.99979,0.119 M -0.7918898,8.19754 V 4.87109 c 2.7720401,0 4.7916798,-2.13844 4.7916798,-4.79168 0,-2.65325 -2.0196397,-4.79168 -4.7916798,-4.79168 v -3.32646 c 4.3560698,0 8.1181298,3.64326 8.1181298,8.11814 0,4.51447 -3.76206,8.11813 -8.1181298,8.11813 z m 0,-2.29684 v 4.39568 H -7.0092 c -0.198,0.79201 -0.3168,1.58402 -0.3168,1.98003 H 5.70261 C 5.74221,8.71235 2.77217,5.9007 -0.7918898,5.9007 Z"
//marker.path = "M9 9l-5 1v1l4 3a2286 2286 0 0 0-1 6l5-3a14908 14908 0 0 0 5 2l-1-5 4-3v-1l-5-1-3-5-3 5z";
marker.nonScaling = true;
marker.fill = am4core.color("#44D344")
marker.stroke = am4core.color("#44D344")
marker.strokeWidth = 0.02;
marker.tooltipText = "{name}";
//marker.tooltip.background.fill = am4core.color("#fff");
govSeriesTemplate.propertyFields.latitude = "lat";
govSeriesTemplate.propertyFields.longitude = "lng";
govSeries.data = gov;
govSeries.dataFields.id = "place_id";
govSeries.dataFields.address = "address";
govSeries.dataFields.type = "type";
govSeries.dataFields.city = "city";
govSeries.dataFields.state = "state";
//tooltip
govSeries.tooltip = new am4core.Tooltip();
govSeries.tooltip.background.fill = am4core.color("#000000");
govSeries.tooltip.background.stroke = am4core.color("#44D344");
govSeries.tooltip.fontSize = "0.9em";
govSeries.tooltip.getFillFromObject = false;
govSeries.tooltip.getStrokeFromObject = false;
 // adjust tooltip
govSeries.tooltip.animationDuration = 0;
govSeries.tooltip.showInViewport = false;
govSeries.tooltip.background.fillOpacity = 0.2;
govSeries.tooltip.background.fillOpacity = 0.2;

//govSeriesTemplate.nonScaling = true;
govSeriesTemplate.strokeOpacity = 0;
govSeriesTemplate.fillOpacity = 0.85;
govSeriesTemplate.tooltipHTML = "<b>{name} | {city}, {state}</b></br></br><b>Type:</b> {type}</br><b>Address:</b> {address}</br><a href='https://www.google.com/maps/search/?api=1&query={address}&query_place_id={place_id}'>Get Directions</a>";
govSeriesTemplate.applyOnClones = true;


//Private Series
var pvtSeries = ammap.series.push(new am4maps.MapImageSeries());
var pvtSeriesTemplate = pvtSeries.mapImages.template;
var marker = pvtSeriesTemplate.createChild(am4core.Sprite);
pvtSeries.name = "Private Labs";
pvtSeries.fill = am4core.color("#2176FF");
pvtSeries.color = am4core.color("#fff");
pvtSeries.legendSettings.labelText = "[bold {color}]{name}[/]";
marker.path = "m -3.5639398,6.73232 h 1.58403 v 0.79201 h -1.58403 z M -5.54397,4.75228 H 1.202e-4 V 5.9403 H -5.54397 Z m 5.2272802,0 H -4.98956 l 1.7028302,-3.16805 h 1.22762 z m -2.85124,-3.96006 h 1.18802 v 0.79201 h -1.18802 z M -4.75196,-0.79181 h 4.3560702 V 0.79222 M -4.75196,-0.79181 h 4.3560702 V 0.79222 H -4.75196 Z m -1.18802,-11.08818 h 6.3361102 v 1.58402 M -5.93998,-11.87999 h 6.3361102 v 1.58402 H -5.93998 Z m 0.39601,9.50415 h 5.9401002 v 1.58403 M -5.54397,-2.37584 h 5.9401002 v 1.58403 H -5.54397 Z m 3.3660502,-3.24725 c 0.27721,0.27721 0.27721,0.71281 0,0.99002 -0.2772,0.2772 -0.71281,0.2772 -0.99001,0 m 1.22762,-0.47521 a 0.71281178,0.71281178 0 0 1 -0.71281,0.71281 0.71281178,0.71281178 0 0 1 -0.71282,-0.71281 0.71281178,0.71281178 0 0 1 0.71282,-0.71281 0.71281178,0.71281178 0 0 1 0.71281,0.71281 m 0.47521,0 a 1.1880197,1.1880197 0 0 1 -1.18802,1.18802 1.1880197,1.1880197 0 0 1 -1.18802,-1.18802 1.1880197,1.1880197 0 0 1 1.18802,-1.18802 1.1880197,1.1880197 0 0 1 1.18802,1.18802 M -4.75196,-10.29597 h 3.9600702 v 7.92013 M -4.75196,-10.29597 h 3.9600702 v 7.92013 H -4.75196 Z m 0.3960102,-1.98003 h 3.16805 v 1.58403 h -3.16805 z M 7.32624,0.119 c 0,4.47488 -3.76206,8.11814 -8.1181298,8.11814 V 4.91068 C 1.9801503,4.91068 3.99979,2.77225 3.99979,0.119 M -0.7918898,8.19754 V 4.87109 c 2.7720401,0 4.7916798,-2.13844 4.7916798,-4.79168 0,-2.65325 -2.0196397,-4.79168 -4.7916798,-4.79168 v -3.32646 c 4.3560698,0 8.1181298,3.64326 8.1181298,8.11814 0,4.51447 -3.76206,8.11813 -8.1181298,8.11813 z m 0,-2.29684 v 4.39568 H -7.0092 c -0.198,0.79201 -0.3168,1.58402 -0.3168,1.98003 H 5.70261 C 5.74221,8.71235 2.77217,5.9007 -0.7918898,5.9007 Z"
//marker.path = "M9 9l-5 1v1l4 3a2286 2286 0 0 0-1 6l5-3a14908 14908 0 0 0 5 2l-1-5 4-3v-1l-5-1-3-5-3 5z";
marker.nonScaling = true;
marker.fill = am4core.color("#2176FF");
marker.stroke = am4core.color("#2176FF");
marker.strokeWidth = 0.02;
marker.tooltipText = "{name}";
pvtSeriesTemplate.propertyFields.latitude = "lat";
pvtSeriesTemplate.propertyFields.longitude = "lng";
pvtSeries.data = pvt;
pvtSeries.dataFields.id = "place_id";
pvtSeries.dataFields.address = "address";
pvtSeries.dataFields.type = "type";
pvtSeries.dataFields.city = "city";
pvtSeries.dataFields.state = "state";
//tooltip
pvtSeries.tooltip = new am4core.Tooltip();
pvtSeries.tooltip.background.fill = am4core.color("#000000");
pvtSeries.tooltip.background.stroke = am4core.color("#2176FF");
pvtSeries.tooltip.fontSize = "0.9em";
pvtSeries.tooltip.getFillFromObject = false;
pvtSeries.tooltip.getStrokeFromObject = false;
 // adjust tooltip
pvtSeries.tooltip.animationDuration = 0;
pvtSeries.tooltip.showInViewport = false;
pvtSeries.tooltip.background.fillOpacity = 0.2;
pvtSeries.tooltip.background.fillOpacity = 0.2;

//govSeriesTemplate.nonScaling = true;
pvtSeriesTemplate.strokeOpacity = 0;
pvtSeriesTemplate.fillOpacity = 0.85;
pvtSeriesTemplate.tooltipHTML = "<b>{name} | {city}, {state}</b></br></br><b>Type:</b> {type}</br><b>Address:</b> {address}</br><a href='https://www.google.com/maps/search/?api=1&query={address}&query_place_id={place_id}'>Get Directions</a>";
pvtSeriesTemplate.applyOnClones = true;

//Collection Series
var colSeries = ammap.series.push(new am4maps.MapImageSeries());
var colSeriesTemplate = colSeries.mapImages.template;
var marker = colSeriesTemplate.createChild(am4core.Sprite);
colSeries.name = "Collection Centers";
colSeries.fill = am4core.color("#F1AB50");
colSeries.color = am4core.color("#fff");
colSeries.legendSettings.labelText = "[bold {color}]{name}[/]";
marker.path = "m -3.5639398,6.73232 h 1.58403 v 0.79201 h -1.58403 z M -5.54397,4.75228 H 1.202e-4 V 5.9403 H -5.54397 Z m 5.2272802,0 H -4.98956 l 1.7028302,-3.16805 h 1.22762 z m -2.85124,-3.96006 h 1.18802 v 0.79201 h -1.18802 z M -4.75196,-0.79181 h 4.3560702 V 0.79222 M -4.75196,-0.79181 h 4.3560702 V 0.79222 H -4.75196 Z m -1.18802,-11.08818 h 6.3361102 v 1.58402 M -5.93998,-11.87999 h 6.3361102 v 1.58402 H -5.93998 Z m 0.39601,9.50415 h 5.9401002 v 1.58403 M -5.54397,-2.37584 h 5.9401002 v 1.58403 H -5.54397 Z m 3.3660502,-3.24725 c 0.27721,0.27721 0.27721,0.71281 0,0.99002 -0.2772,0.2772 -0.71281,0.2772 -0.99001,0 m 1.22762,-0.47521 a 0.71281178,0.71281178 0 0 1 -0.71281,0.71281 0.71281178,0.71281178 0 0 1 -0.71282,-0.71281 0.71281178,0.71281178 0 0 1 0.71282,-0.71281 0.71281178,0.71281178 0 0 1 0.71281,0.71281 m 0.47521,0 a 1.1880197,1.1880197 0 0 1 -1.18802,1.18802 1.1880197,1.1880197 0 0 1 -1.18802,-1.18802 1.1880197,1.1880197 0 0 1 1.18802,-1.18802 1.1880197,1.1880197 0 0 1 1.18802,1.18802 M -4.75196,-10.29597 h 3.9600702 v 7.92013 M -4.75196,-10.29597 h 3.9600702 v 7.92013 H -4.75196 Z m 0.3960102,-1.98003 h 3.16805 v 1.58403 h -3.16805 z M 7.32624,0.119 c 0,4.47488 -3.76206,8.11814 -8.1181298,8.11814 V 4.91068 C 1.9801503,4.91068 3.99979,2.77225 3.99979,0.119 M -0.7918898,8.19754 V 4.87109 c 2.7720401,0 4.7916798,-2.13844 4.7916798,-4.79168 0,-2.65325 -2.0196397,-4.79168 -4.7916798,-4.79168 v -3.32646 c 4.3560698,0 8.1181298,3.64326 8.1181298,8.11814 0,4.51447 -3.76206,8.11813 -8.1181298,8.11813 z m 0,-2.29684 v 4.39568 H -7.0092 c -0.198,0.79201 -0.3168,1.58402 -0.3168,1.98003 H 5.70261 C 5.74221,8.71235 2.77217,5.9007 -0.7918898,5.9007 Z"
//marker.path = "M9 9l-5 1v1l4 3a2286 2286 0 0 0-1 6l5-3a14908 14908 0 0 0 5 2l-1-5 4-3v-1l-5-1-3-5-3 5z";
marker.nonScaling = true;
marker.fill = am4core.color("#F1AB50");
marker.stroke = am4core.color("#F1AB50");
marker.strokeWidth = 0.02;
marker.tooltipText = "{name}";
colSeriesTemplate.propertyFields.latitude = "lat";
colSeriesTemplate.propertyFields.longitude = "lng";
colSeries.data = col;
colSeries.dataFields.id = "place_id";
colSeries.dataFields.address = "address";
colSeries.dataFields.type = "type";
colSeries.dataFields.city = "city";
colSeries.dataFields.state = "state";

//tooltip
colSeries.tooltip.background.fill = am4core.color("#000000");
colSeries.tooltip.background.stroke = am4core.color("#F1AB50");
colSeries.tooltip.fontSize = "0.9em";
colSeries.tooltip.getFillFromObject = false;
colSeries.tooltip.getStrokeFromObject = false;

 // adjust tooltip
colSeries.tooltip.animationDuration = 0;
colSeries.tooltip.showInViewport = false;
colSeries.tooltip.background.fillOpacity = 0.2;
colSeries.tooltip.background.fillOpacity = 0.2;

//colSeriesTemplate.nonScaling = true;
colSeriesTemplate.strokeOpacity = 0;
colSeriesTemplate.fillOpacity = 0.85;
colSeriesTemplate.tooltipHTML = "<b>{name} | {city}, {state}</b></br></br><b>Type:</b> {type}</br><b>Address:</b> {address}</br><a href='https://www.google.com/maps/search/?api=1&query={address}&query_place_id={place_id}'>Get Directions</a>";
colSeriesTemplate.applyOnClones = true;

//Legend
ammap.legend = new am4maps.Legend();
ammap.legend.useDefaultMarker = false;
ammap.legend.labels.template.fill = am4core.color("#fff");

ammap.legend.labels.template.textDecoration = "none";
ammap.legend.valueLabels.template.textDecoration = "none";


var lmarker = ammap.legend.markers.template.children.getIndex(0);
lmarker.cornerRadius(12, 12, 12, 12);
lmarker.strokeWidth = 2;
lmarker.strokeOpacity = 1;
lmarker.stroke = am4core.color("#fff");
ammap.legend.position = "left";
ammap.legend.valign = "top";
ammap.legend.align = "middle";

// Remove square from marker template
var lmarker = ammap.legend.markers.template;
// Kill children
//lmarker.disposeChildren();
/*
// Add custom image instead
var markerimg = lmarker.createChild(am4core.Sprite);
markerimg.width = 40;
markerimg.height = 40;
markerimg.verticalCenter = "top";
markerimg.horizontalCenter = "left";
markerimg.nonScaling = true;
//markerimg.fill = am4core.color("#F1AB50");
//markerimg.stroke = am4core.color("#fff");
markerimg.strokeWidth = 0.02;
markerimg.path = "m -3.5639398,6.73232 h 1.58403 v 0.79201 h -1.58403 z M -5.54397,4.75228 H 1.202e-4 V 5.9403 H -5.54397 Z m 5.2272802,0 H -4.98956 l 1.7028302,-3.16805 h 1.22762 z m -2.85124,-3.96006 h 1.18802 v 0.79201 h -1.18802 z M -4.75196,-0.79181 h 4.3560702 V 0.79222 M -4.75196,-0.79181 h 4.3560702 V 0.79222 H -4.75196 Z m -1.18802,-11.08818 h 6.3361102 v 1.58402 M -5.93998,-11.87999 h 6.3361102 v 1.58402 H -5.93998 Z m 0.39601,9.50415 h 5.9401002 v 1.58403 M -5.54397,-2.37584 h 5.9401002 v 1.58403 H -5.54397 Z m 3.3660502,-3.24725 c 0.27721,0.27721 0.27721,0.71281 0,0.99002 -0.2772,0.2772 -0.71281,0.2772 -0.99001,0 m 1.22762,-0.47521 a 0.71281178,0.71281178 0 0 1 -0.71281,0.71281 0.71281178,0.71281178 0 0 1 -0.71282,-0.71281 0.71281178,0.71281178 0 0 1 0.71282,-0.71281 0.71281178,0.71281178 0 0 1 0.71281,0.71281 m 0.47521,0 a 1.1880197,1.1880197 0 0 1 -1.18802,1.18802 1.1880197,1.1880197 0 0 1 -1.18802,-1.18802 1.1880197,1.1880197 0 0 1 1.18802,-1.18802 1.1880197,1.1880197 0 0 1 1.18802,1.18802 M -4.75196,-10.29597 h 3.9600702 v 7.92013 M -4.75196,-10.29597 h 3.9600702 v 7.92013 H -4.75196 Z m 0.3960102,-1.98003 h 3.16805 v 1.58403 h -3.16805 z M 7.32624,0.119 c 0,4.47488 -3.76206,8.11814 -8.1181298,8.11814 V 4.91068 C 1.9801503,4.91068 3.99979,2.77225 3.99979,0.119 M -0.7918898,8.19754 V 4.87109 c 2.7720401,0 4.7916798,-2.13844 4.7916798,-4.79168 0,-2.65325 -2.0196397,-4.79168 -4.7916798,-4.79168 v -3.32646 c 4.3560698,0 8.1181298,3.64326 8.1181298,8.11814 0,4.51447 -3.76206,8.11813 -8.1181298,8.11813 z m 0,-2.29684 v 4.39568 H -7.0092 c -0.198,0.79201 -0.3168,1.58402 -0.3168,1.98003 H 5.70261 C 5.74221,8.71235 2.77217,5.9007 -0.7918898,5.9007 Z";
*/
//Add Person
// Add image series
function addPerson(lat,lng){
  var imageSeries = ammap.series.push(new am4maps.MapImageSeries());
  imageSeries.mapImages.template.propertyFields.longitude = "longitude";
  imageSeries.mapImages.template.propertyFields.latitude = "latitude";
  var imageSeriesTemplate = imageSeries.mapImages.template;
  var marker = imageSeriesTemplate.createChild(am4core.Sprite);
  imageSeries.name = "You";
  imageSeries.fill = am4core.color("#f55");
  imageSeries.color = am4core.color("#fff");
  imageSeries.legendSettings.labelText = "[bold {color}]{name}[/]";
  //marker.path = "m -3.5639398,6.73232 h 1.58403 v 0.79201 h -1.58403 z M -5.54397,4.75228 H 1.202e-4 V 5.9403 H -5.54397 Z m 5.2272802,0 H -4.98956 l 1.7028302,-3.16805 h 1.22762 z m -2.85124,-3.96006 h 1.18802 v 0.79201 h -1.18802 z M -4.75196,-0.79181 h 4.3560702 V 0.79222 M -4.75196,-0.79181 h 4.3560702 V 0.79222 H -4.75196 Z m -1.18802,-11.08818 h 6.3361102 v 1.58402 M -5.93998,-11.87999 h 6.3361102 v 1.58402 H -5.93998 Z m 0.39601,9.50415 h 5.9401002 v 1.58403 M -5.54397,-2.37584 h 5.9401002 v 1.58403 H -5.54397 Z m 3.3660502,-3.24725 c 0.27721,0.27721 0.27721,0.71281 0,0.99002 -0.2772,0.2772 -0.71281,0.2772 -0.99001,0 m 1.22762,-0.47521 a 0.71281178,0.71281178 0 0 1 -0.71281,0.71281 0.71281178,0.71281178 0 0 1 -0.71282,-0.71281 0.71281178,0.71281178 0 0 1 0.71282,-0.71281 0.71281178,0.71281178 0 0 1 0.71281,0.71281 m 0.47521,0 a 1.1880197,1.1880197 0 0 1 -1.18802,1.18802 1.1880197,1.1880197 0 0 1 -1.18802,-1.18802 1.1880197,1.1880197 0 0 1 1.18802,-1.18802 1.1880197,1.1880197 0 0 1 1.18802,1.18802 M -4.75196,-10.29597 h 3.9600702 v 7.92013 M -4.75196,-10.29597 h 3.9600702 v 7.92013 H -4.75196 Z m 0.3960102,-1.98003 h 3.16805 v 1.58403 h -3.16805 z M 7.32624,0.119 c 0,4.47488 -3.76206,8.11814 -8.1181298,8.11814 V 4.91068 C 1.9801503,4.91068 3.99979,2.77225 3.99979,0.119 M -0.7918898,8.19754 V 4.87109 c 2.7720401,0 4.7916798,-2.13844 4.7916798,-4.79168 0,-2.65325 -2.0196397,-4.79168 -4.7916798,-4.79168 v -3.32646 c 4.3560698,0 8.1181298,3.64326 8.1181298,8.11814 0,4.51447 -3.76206,8.11813 -8.1181298,8.11813 z m 0,-2.29684 v 4.39568 H -7.0092 c -0.198,0.79201 -0.3168,1.58402 -0.3168,1.98003 H 5.70261 C 5.74221,8.71235 2.77217,5.9007 -0.7918898,5.9007 Z"
  marker.path = "M9 9l-5 1v1l4 3a2286 2286 0 0 0-1 6l5-3a14908 14908 0 0 0 5 2l-1-5 4-3v-1l-5-1-3-5-3 5z";
  marker.nonScaling = true;
  marker.fill = am4core.color("#f55");
  marker.stroke = am4core.color("#f55");
  marker.strokeWidth = 0.02;
  marker.tooltipText = "{name}";
  imageSeries.data = [ {
    "title": "You Are Here",
    "latitude": lat,
    "longitude": lng,
    "id": "PA"
  }];
ammap.homeZoomLevel = 32;
ammap.homeGeoPoint = {
  latitude: lat,
  longitude: lng
};
ammap.goHome();

 // ammap.zoomToLongLat(5, lng, lat, true);
}


// Set up GMap centering
ammap.events.on("zoomlevelchanged", updateMapPosition);
ammap.events.on("mappositionchanged", updateMapPosition);
ammap.events.on("scaleratiochanged", updateMapPosition);

//Home button
var button = ammap.chartContainer.createChild(am4core.Button);
button.padding(5, 5, 5, 5);
button.align = "right";
button.marginRight = 15;
button.events.on("hit", function() {
  ammap.goHome();
});
button.icon = new am4core.Sprite();
button.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";


function updateMapPosition(ev) {
  /**
   * GMap inited?
   */
  if ( typeof gmap === "undefined" )
    return;

  // set google map zoom level:
  gmap.setZoom(Math.log2(ammap.zoomLevel) + 5);

  // sync position
  gmap.setCenter( {
    // a small adjustment needed for this div size:
    lat: ammap.zoomGeoPoint.latitude,
    lng: ammap.zoomGeoPoint.longitude
  } );
}

populateLabs(test_centers);

Number.prototype.toRad = function() {
   return this * Math.PI / 180;
}

function distance(lat1,lon1,lat2,lon2){

    var R = 6371;
    var x1 = lat2-lat1;
    var dLat = x1.toRad();  
    var x2 = lon2-lon1;
    var dLon = x2.toRad();  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2);  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 
    return d;

}

//function rollOverLab(lab){
//   ammap.openModal("We clicked on <strong>" + lab.name + "</strong>");
//}
govSeriesTemplate.events.on("hit", function(ev) {
  ammap.closeAllPopups();
  ammap.openPopup("<b>"+ ev.target.dataItem.dataContext.name +" | "+ ev.target.dataItem.dataContext.city + ", " + ev.target.dataItem.dataContext.state + "</b></br></br><b>Type:</b>" + ev.target.dataItem.dataContext.type + "</br><b>Address:</b>" + ev.target.dataItem.dataContext.address + "</br><a href='https://www.google.com/maps/place/?q=" + ev.target.dataItem.dataContext.name + ev.target.dataItem.dataContext.address + "'><b>Get Directions</b></a>");
});
pvtSeriesTemplate.events.on("hit", function(ev) {
  ammap.closeAllPopups();
  ammap.openPopup("<b>"+ ev.target.dataItem.dataContext.name +" | "+ ev.target.dataItem.dataContext.city + ", " + ev.target.dataItem.dataContext.state + "</b></br></br><b>Type:</b>" + ev.target.dataItem.dataContext.type + "</br><b>Address:</b>" + ev.target.dataItem.dataContext.address + "</br><a href='https://www.google.com/maps/place/?q=" + ev.target.dataItem.dataContext.name + ev.target.dataItem.dataContext.address + "'><b>Get Directions</b></a>");
});
colSeriesTemplate.events.on("hit", function(ev) {
  ammap.closeAllPopups();
  ammap.openPopup("<b>"+ ev.target.dataItem.dataContext.name +" | "+ ev.target.dataItem.dataContext.city + ", " + ev.target.dataItem.dataContext.state + "</b></br></br><b>Type:</b>" + ev.target.dataItem.dataContext.type + "</br><b>Address:</b>" + ev.target.dataItem.dataContext.address + "</br><a href='https://www.google.com/maps/place/?q=" + ev.target.dataItem.dataContext.name + ev.target.dataItem.dataContext.address + "'><b>Get Directions</b></a>");
});


//Adding functions
  // what happens when a country is rolled-over
  function rollOverLab(place_id) {

    resetHover();
    console.log(place_id);
    for(var i = 0; i< govSeries.data.length; i++){
      console.log[i];
    }
      /*var image = govSeries.getImageById(govSeries.place_id);
      if (image) {
        image.dataItem.dataContext.place_id = govSeries.dataItem.dataContext.place_id;
        image.isHover = true;
      }
      var image = pvtSeries.getImageById(pvtSeries.dataItem.place_id);
      if (image) {
        image.dataItem.dataContext.place_id = pvtSeries.dataItem.dataContext.place_id;
        image.isHover = true;
      }
      var image = colSeries.getImageById(colSeries.dataItem.place_id);
      if (image) {
        image.dataItem.dataContext.place_id = colSeries.dataItem.dataContext.place_id;
        image.isHover = true;
      }*/
  }

    // what happens when a country is rolled-out
  function rollOutLab(mapPolygon) {
    var image = bubbleSeries.getImageById(mapPolygon.dataItem.id)

    resetHover();
    if (image) {
      image.isHover = false;
    }
  }

    function resetHover() {
    polygonSeries.mapPolygons.each(function(polygon) {
      polygon.isHover = false;
    })

    govSeries.mapImages.each(function(image) {
      image.isHover = false;
    })

    pvtSeries.mapImages.each(function(image) {
      image.isHover = false;
    })

    colSeries.mapImages.each(function(image) {
      image.isHover = false;
    })
  }

function populateLabs(list) {
  var table = $("#areas tbody");
  table.find(".area").remove();
  for (var i = 0; i < list.length; i++) {
    var lab = list[i];
    var tr = $("<tr>").addClass("lab").data("labname", lab.place_id).appendTo(table).on("click", function() {
      selectLab(labname);
    }).hover(function() {
     rollOverLab($(this).data("labname"));
    });
    $("<td>").appendTo(tr).data("labname", lab.place_id).html(lab.name);
    $("<td>").addClass("areaid").appendTo(tr).html(lab.type);
    $("<td>").addClass("areaid").appendTo(tr).html(lab.city);
    $("<td>").addClass("areaid").appendTo(tr).html(lab.state);

  }
  $("#areas").DataTable({
    "paging": false,
    "select": true
  }).column("1")
    .order("desc")
    .draw();;
}