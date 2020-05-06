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
 * Create the amCharts Map
 */

am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dark);
// Create map instance
var ammap = am4core.create("ammap", am4maps.MapChart);
//ammap.geodata = am4geodata_worldIndiaLow;
ammap.geodataSource.url = "deps/amcharts4-geodata/india_with_ladakh.json";
ammap.projection = new am4maps.projections.Mercator();
//ammap.zoomDuration = 0;
ammap.zoomLevel = 1.5;
ammap.zoomEasing = am4core.ease.sinOut;

// top title
var title = ammap.titles.create();
title.fontSize = "1.5em";
title.text = "Hospitals, Beds, ICUs, and Ventilators";
title.align = "left";
title.horizontalCenter = "left";
title.marginLeft = 20;
title.paddingBottom = 10;
title.fill = am4core.color("#ffffff");
title.y = 20;

var polygonSeries = ammap.series.push(new am4maps.MapPolygonSeries());
polygonSeries.exclude = ["AR.ER"];
//polygonSeries.LegendSettings.createMarker = false;
polygonSeries.name = "Map";
polygonSeries.useGeodata = true;
polygonSeries.hiddenInLegend = true; 

//polygonSeries.calculateVisualCenter = true;
//polygonSeries.legendSettings.createMarker = false;
//polygonSeries.hide();
/*
polygonSeries.events.on("inited", function () {
  polygonSeries.mapPolygons.each(function (polygon) {
    //var label = labelSeries.mapImages.create();
    //var state = polygon.dataItem.dataContext.id.split("-").pop();

    for (x=icu.length;x<icu.length;x--){
      var obj = icu[x];
      if(obj.id==polygon.dataItem.dataContext.id){
        obj.latitude = polygon.visualLatitude;
        obj.longitude = polygon.visualLongitude;
      }
    }
    //label.latitude = polygon.visualLatitude;
    //label.longitude = polygon.visualLongitude;
    //label.children.getIndex(0).text = state;
    console.log(obj);
  });
});*/

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
polygonTemplate.fill = am4core.color("#000");
polygonTemplate.fillOpacity = 0.2;
polygonTemplate.stroke = am4core.color("#fff");
polygonTemplate.strokeOpacity = 0.50;
polygonSeries.tooltip.getFillFromObject = false;
polygonSeries.tooltip.background.fill = am4core.color("#000");
polygonSeries.tooltip.background.fillOpacity = 0.75;
polygonTemplate.tooltipPosition = "fixed";
//polygonTemplate.tooltip.stroke = am4core.color("#ff8800");
polygonTemplate.tooltipHTML = `<center><strong>{name}</strong></center>
                              <hr />
                              <table>
                              <tr>
                                <th align="left">Hospitals</th>
                                <td>{totalHospitals}</td>
                              </tr>
                              <tr>
                                <th align="left">Beds</th>
                                <td>{totalBeds}</td>
                              </tr>
                              <tr>
                                <th align="left">ICUs</th>
                                <td>{totalICU}</td>
                              </tr>
                              <tr>
                                <th align="left">Ventilators</th>
                                <td>{totalVentilators}</td>
                              </tr>
                              </table>
                              <hr />`;
polygonSeries.data = icu;
polygonSeries.dataFields.id = "id";
polygonSeries.dataFields.name = "name";
polygonSeries.dataFields.totalHospitals = "totalHospitals";
polygonSeries.dataFields.totalBeds = "totalBeds";
polygonSeries.dataFields.totalICU = "totalICU";
polygonSeries.dataFields.totalVentilators = "totalVentilators";

var countryColor = am4core.color("#3b3b3b");

var hs = polygonTemplate.states.create("hover");
hs.properties.fill = am4core.color("367B25");

/*
for (x=0;x<icu.length;x++){
var obj = icu[x];
obj.pieDataHospitals = [{"category": "Public Hospitals" ,"value": obj.publicHospitals },
                        {"category": "Private Hospitals" ,"value": obj.privateHospitals },
                        {"category": "Total Hospitals" ,"value": obj.totalHospitals }];

obj.pieDataBeds = [{"category": "Public Beds" ,"value": obj.publicBeds },
                        {"category": "Private Beds" ,"value": obj.privateBeds },
                        {"category": "Total Beds" ,"value": obj.totalBeds }];

obj.pieDataICUs = [{"category": "Public ICUs" ,"value": obj.publicICU },
                        {"category": "Private ICUs" ,"value": obj.privateICU },
                        {"category": "Total ICUs" ,"value": obj.totalICU }];

obj.pieDataVentilators = [{"category": "Public Ventilators" ,"value": obj.publicVentilators },
                        {"category": "Private Ventilators" ,"value": obj.privateVentilators },
                        {"category": "Total Ventilators" ,"value": obj.totalVentilators }];

                        polygonSeries.mapPolygons.each(function (polygon) {

      if(obj.id==polygon.dataItem.dataContext.id){
        obj.latitude = polygon.visualLatitude;
        obj.longitude = polygon.visualLongitude;
      }
  })

console.log(obj);
}
*/

//PIES!!!
//Start Pie Chart
// Create an image series that will hold pie charts
var pieSeries = ammap.series.push(new am4maps.MapImageSeries());
var pieTemplate = pieSeries.mapImages.template;
pieTemplate.propertyFields.latitude = "latitude"; //FIX THIS LATER
pieTemplate.propertyFields.longitude = "longitude";
pieSeries.fill = am4core.color("#50b8e1");
pieSeries.data = icu;
pieSeries.dataFields.id = "id";
pieSeries.dataFields.name = "name";
pieSeries.name = "Hospitals";
var pieChartTemplate = pieTemplate.createChild(am4charts.PieChart);
pieChartTemplate.adapter.add("data", function(data, target) {
  if (target.dataItem) {
    return target.dataItem.dataContext.pieDataHospitals;
  }
  else {
    return [];
  }
});

//pieChartTemplate.propertyFields.width = 1;
//pieChartTemplate.propertyFields.height = 1;
pieChartTemplate.nonScaling = true;
pieChartTemplate.horizontalCenter = "middle";
pieChartTemplate.verticalCenter = "middle";
//pieChartTemplate.innerRadius = am4core.percent(30);
pieChartTemplate.width = 60;
pieChartTemplate.height = 60;

//var pieTitle = pieChartTemplate.titles.create();
//pieTitle.text = "{name}";
//pieTitle.fill = am4core.color("#fff");

var pieSeriesTemplate = pieChartTemplate.series.push(new am4charts.PieSeries);
//pieSeriesTemplate.slices.template.fill = am4core.color("#fff");
pieSeriesTemplate.dataFields.category = "category";
pieSeriesTemplate.dataFields.value = "value";
pieSeriesTemplate.slices.template.propertyFields.fill = "color";
//pieeries.dataFields.depthValue = "litres";
pieSeriesTemplate.labels.template.disabled = true;
pieSeriesTemplate.ticks.template.disabled = true;


// Beds Pie Chart

// Create an image series that will hold pie charts
var pieSeriesBed = ammap.series.push(new am4maps.MapImageSeries());
var pieTemplateBed = pieSeriesBed.mapImages.template;
pieTemplateBed.propertyFields.latitude = "latitude"; //FIX THIS LATER
pieTemplateBed.propertyFields.longitude = "longitude";
pieSeriesBed.fill = am4core.color("#904c95");
pieSeriesBed.data = icu;
pieSeriesBed.dataFields.id = "id";
pieSeriesBed.dataFields.name = "name";
pieSeriesBed.name = "Beds";
var pieChartTemplateBed = pieTemplateBed.createChild(am4charts.PieChart);
pieChartTemplateBed.adapter.add("data", function(data, target) {
  if (target.dataItem) {
    return target.dataItem.dataContext.pieDataBeds;
  }
  else {
    return [];
  }
});
//pieChartTemplate.propertyFields.width = 1;
//pieChartTemplate.propertyFields.height = 1;
pieChartTemplateBed.nonScaling = true;
pieChartTemplateBed.horizontalCenter = "middle";
pieChartTemplateBed.verticalCenter = "middle";
//pieChartTemplateBed.innerRadius = am4core.percent(60);
pieChartTemplateBed.width = 60;
pieChartTemplateBed.height = 60;
//var pieTitle = pieChartTemplate.titles.create();
//pieTitle.text = "{name}";
//pieTitle.fill = am4core.color("#fff");
var pieSeriesTemplateBed = pieChartTemplateBed.series.push(new am4charts.PieSeries);
pieSeriesTemplateBed.dataFields.category = "category";
pieSeriesTemplateBed.dataFields.value = "value";
pieSeriesTemplateBed.slices.template.propertyFields.fill = "color";
pieSeriesTemplateBed.labels.template.disabled = true;
pieSeriesTemplateBed.ticks.template.disabled = true;

// ICUs Pie Chart

// Create an image series that will hold pie charts
var pieSeriesICU = ammap.series.push(new am4maps.MapImageSeries());
var pieTemplateICU = pieSeriesICU.mapImages.template;
pieTemplateICU.propertyFields.latitude = "latitude"; //FIX THIS LATER
pieTemplateICU.propertyFields.longitude = "longitude";
pieSeriesICU.fill = am4core.color("#ff8000");
pieSeriesICU.data = icu;
pieSeriesICU.dataFields.id = "id";
pieSeriesICU.dataFields.name = "name";
pieSeriesICU.name = "ICUs";
var pieChartTemplateICU = pieTemplateICU.createChild(am4charts.PieChart);
pieChartTemplateICU.adapter.add("data", function(data, target) {
  if (target.dataItem) {
    return target.dataItem.dataContext.pieDataICUs;
  }
  else {
    return [];
  }
});
//pieChartTemplate.propertyFields.width = 1;
//pieChartTemplate.propertyFields.height = 1;
pieChartTemplateICU.nonScaling = true;
pieChartTemplateICU.horizontalCenter = "middle";
pieChartTemplateICU.verticalCenter = "middle";
//pieChartTemplateICU.innerRadius = am4core.percent(60);
pieChartTemplateICU.width = 60;
pieChartTemplateICU.height = 60;
//var pieTitle = pieChartTemplate.titles.create();
//pieTitle.text = "{name}";
//pieTitle.fill = am4core.color("#fff");
var pieSeriesTemplateICU = pieChartTemplateICU.series.push(new am4charts.PieSeries);
pieSeriesTemplateICU.dataFields.category = "category";
pieSeriesTemplateICU.dataFields.value = "value";
pieSeriesTemplateICU.slices.template.propertyFields.fill = "color";
pieSeriesTemplateICU.labels.template.disabled = true;
pieSeriesTemplateICU.ticks.template.disabled = true;


// Ventilators Pie Chart

// Create an image series that will hold pie charts
var pieSeriesVentilator = ammap.series.push(new am4maps.MapImageSeries());
var pieTemplateVentilator = pieSeriesVentilator.mapImages.template;
pieTemplateVentilator.propertyFields.latitude = "latitude"; //FIX THIS LATER
pieTemplateVentilator.propertyFields.longitude = "longitude";
pieSeriesVentilator.fill = am4core.color("#73be58");
pieSeriesVentilator.data = icu;
pieSeriesVentilator.dataFields.id = "id";
pieSeriesVentilator.dataFields.name = "name";
pieSeriesVentilator.name = "Ventilators";
var pieChartTemplateVentilator = pieTemplateVentilator.createChild(am4charts.PieChart);
pieChartTemplateVentilator.adapter.add("data", function(data, target) {
  if (target.dataItem) {
    return target.dataItem.dataContext.pieDataVentilators;
  }
  else {
    return [];
  }
});
//pieChartTemplate.propertyFields.width = 1;
//pieChartTemplate.propertyFields.height = 1;
pieChartTemplateVentilator.nonScaling = true;
pieChartTemplateVentilator.horizontalCenter = "middle";
pieChartTemplateVentilator.verticalCenter = "middle";
//pieChartTemplateVentilator.innerRadius = am4core.percent(60);
pieChartTemplateVentilator.width = 60;
pieChartTemplateVentilator.height = 60;
//var pieTitle = pieChartTemplate.titles.create();
//pieTitle.text = "{name}";
//pieTitle.fill = am4core.color("#fff");
var pieSeriesTemplateVentilator = pieChartTemplateVentilator.series.push(new am4charts.PieSeries);
pieSeriesTemplateVentilator.dataFields.category = "category";
pieSeriesTemplateVentilator.dataFields.value = "value";
pieSeriesTemplateVentilator.slices.template.propertyFields.fill = "color";
pieSeriesTemplateVentilator.labels.template.disabled = true;
pieSeriesTemplateVentilator.ticks.template.disabled = true;


/*
//Government Series
var govSeries = ammap.series.push(new am4maps.MapImageSeries());
var govSeriesTemplate = govSeries.mapImages.template;
var marker = govSeriesTemplate.createChild(am4core.Sprite);
govSeries.name = "Hospitals";
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
govSeriesTemplate.tooltipHTML = "<b>{name} | {city}, {state}</b></br></br><b>Type:</b> {type}</br><b>Address:</b> {address}</br>(click for directions)";
govSeriesTemplate.applyOnClones = true;
*/
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
ammap.legend.valign = "middle";
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

//LEGEND ACTIONS

pieSeries.events.on("shown", function() {
  pieSeriesBed.hide();
  pieSeriesICU.hide();
  pieSeriesVentilator.hide();
});

pieSeriesBed.events.on("shown", function() {
  pieSeries.hide();
  pieSeriesICU.hide();
  pieSeriesVentilator.hide();
});

pieSeriesICU.events.on("shown", function() {
  pieSeries.hide();
  pieSeriesBed.hide();
  pieSeriesVentilator.hide();
});

pieSeriesVentilator.events.on("shown", function() {
  pieSeries.hide();
  pieSeriesBed.hide();
  pieSeriesICU.hide();
});
// Set up GMap centering
//ammap.events.on("zoomlevelchanged", updateMapPosition);
//ammap.events.on("mappositionchanged", updateMapPosition);
//ammap.events.on("scaleratiochanged", updateMapPosition);

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


populateLabs(icu);

/*govSeriesTemplate.events.on("hit", function(ev) {
  //getLabLocation(ev.target.dataItem.dataContext.place_id);
  console.log("PID:" + ev.target.dataItem.dataContext.place_id);
  ammap.closeAllPopups();
  ammap.openPopup("<b>"+ ev.target.dataItem.dataContext.name +" | "+ ev.target.dataItem.dataContext.city + ", " + ev.target.dataItem.dataContext.state + "</b></br></br><b>Type:</b>" + ev.target.dataItem.dataContext.type + "</br><b>Address:</b>" + ev.target.dataItem.dataContext.address + "</br><a onclick='getLabLocation(\"" + ev.target.dataItem.dataContext.place_id + "\")'><button>Get Directions</button></a> | <a target='_blank' href='https://www.google.com/maps/place/?q=" + ev.target.dataItem.dataContext.name + ev.target.dataItem.dataContext.address + "'><b><button>Open in Google Maps</button></b></a>", "Lab Details");
});
pvtSeriesTemplate.events.on("hit", function(ev) {
  ammap.closeAllPopups();
  ammap.openPopup("<b>"+ ev.target.dataItem.dataContext.name +" | "+ ev.target.dataItem.dataContext.city + ", " + ev.target.dataItem.dataContext.state + "</b></br></br><b>Type:</b>" + ev.target.dataItem.dataContext.type + "</br><b>Address:</b>" + ev.target.dataItem.dataContext.address + "</br><a onclick='getLabLocation(\"" + ev.target.dataItem.dataContext.place_id + "\")'><button>Get Directions</button></a> | <a target='_blank' href='https://www.google.com/maps/place/?q=" + ev.target.dataItem.dataContext.name + ev.target.dataItem.dataContext.address + "'><b><button>Open in Google Maps</button></b></a>", "Lab Details");
});
colSeriesTemplate.events.on("hit", function(ev) {
  ammap.closeAllPopups();
 ammap.openPopup("<b>"+ ev.target.dataItem.dataContext.name +" | "+ ev.target.dataItem.dataContext.city + ", " + ev.target.dataItem.dataContext.state + "</b></br></br><b>Type:</b>" + ev.target.dataItem.dataContext.type + "</br><b>Address:</b>" + ev.target.dataItem.dataContext.address + "</br><a onclick='getLabLocation(\"" + ev.target.dataItem.dataContext.place_id + "\")'><button>Get Directions</button></a> | <a target='_blank' href='https://www.google.com/maps/place/?q=" + ev.target.dataItem.dataContext.name + ev.target.dataItem.dataContext.address + "'><b><button>Open in Google Maps</button></b></a>", "Lab Details");
});
*/

//Adding functions
  // what happens when a lab is rolled-over
  function rollOverLab(place,type) {
    resetHover();

    if(type=="GOV"){
        govSeries.dataItems.each(function(dataItem) {
          if(dataItem.dataContext.place_id == place){
          console.log(dataItem);
          dataItem.mapImage.isHover = true;
         }
        })
    }
    else if(type=="PRIVATE"){
        pvtSeries.dataItems.each(function(dataItem) {
          if(dataItem.dataContext.place_id == place){
          console.log(dataItem);
          dataItem.mapImage.isHover = true;
         }
        })
    }
    else if(type=="COLLECTION"){
        colSeries.dataItems.each(function(dataItem) {
          if(dataItem.dataContext.place_id == place){
          console.log(dataItem);
          dataItem.mapImage.isHover = true;
         }
        })
    }

  }


  function resetHover() {
  polygonSeries.mapPolygons.each(function(polygon) {
    polygon.isHover = false;
  })

  /*govSeries.dataItems.each(function(dataItem) {
    dataItem.mapImage.isHover = false;
  })*/
}

function addComma(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

/* Formatting function for row details - modify as you need */
function format ( d,id ) {
    // `d` is the original data object for the row
    return '<table class="additionalinfo" cellpadding="5" cellspacing="0" border="0" style="float:right;"><thead style="display:table-header-group;"><th style="border-bottom:none;""></th><th style="border-bottom: 1px solid #ff8726;">Public</th><th style="border-bottom: 1px solid #ff8726;">Private</th><th style="border-bottom: 1px solid #ff8726;">Total</th></thead>'+
                '<tr>'+
            '<td style="border-top:none;width:125px;border:none;"><b>Ventilators</b></td>'+
            '<td>' + addComma(icu[id].publicVentilators) + '</td>'+
            '<td>' + addComma(icu[id].privateVentilators) + '</td>'+
            '<td>' + addComma(icu[id].totalVentilators) + '</td>'+
        '</tr>'+
        '<tr>'+
            '<td style="border-top:none;width:125px;border:none;"><b>ICU Beds</b></td>'+
            '<td>' + addComma(icu[id].publicICU) + '</td>'+
            '<td>' + addComma(icu[id].privateICU) +'</td>' +
            '<td>' + addComma(icu[id].totalICU) +'</td>' +
        '</tr>'+
        '<tr>'+
            '<td style="border-top:none;width:125px;border:none;"><b>Hospital Beds</b></td>'+
            '<td>' + addComma(icu[id].publicBeds) +'</td>'+
            '<td>' + addComma(icu[id].privateBeds) +'</td>'+
            '<td>' + addComma(icu[id].totalBeds) +'</td>'+
        '</tr>'+
        '<tr>'+
            '<td style="border-top:none;width:125px;border:none;"><b>Hospitals</b></td>'+
            '<td style="border-bottom:1px solid #ff8726">' + addComma(icu[id].publicHospitals) +'</td>'+
            '<td style="border-bottom:1px solid #ff8726">' + addComma(icu[id].privateHospitals) +'</td>'+
            '<td style="border-bottom:1px solid #ff8726">' + addComma(icu[id].totalHospitals) +'</td>'+
        '</tr>'+
    '</table>';
}

$(document).ready(function() {

  pieSeriesBed.hide();
  pieSeriesICU.hide();
  pieSeriesVentilator.hide();

  var table = $("#areas").DataTable();
    // Add event listener for opening and closing details
    $('#areas tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
        var id = tr.attr("class").split(' ')[0];
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data(),id) ).show();
            tr.addClass('shown');
        }
    } );
 
    $('a.toggle-vis').on( 'click', function (e) {
        e.preventDefault();
          //Disable other columns
          table.columns( [2, 3,4,5,6,7,8,9,10,11,12,13] ).visible( false );

        var res = $(this).attr('data-column').split(" ");
        var x = res.length-1;
        for(i=0;i<res.length;i++){

          // Toggle the visibility
                  // Get the column API object
        var column = table.column( res[i] );
        column.visible(true);
        if(i==x){
            table
      .order( [ res[i], 'desc' ] )
      .draw();
          }
        }
 
    } );
    $("a.amcharts-ampopup-close").trigger("click");
} );


  // what happens when a country is rolled-over
  function rollOverCountry(mapPolygon) {

    resetHover();
    if (mapPolygon) {
      mapPolygon.isHover = true;

      // make bubble hovered too
     /* var image = bubbleSeries.getImageById(mapPolygon.dataItem.id);
      if (image) {
        image.dataItem.dataContext.name = mapPolygon.dataItem.dataContext.name;
        image.isHover = true;
      }*/
    }
  }

    // what happens when a country is rolled-out
  function rollOutCountry(mapPolygon) {
    //var image = bubbleSeries.getImageById(mapPolygon.dataItem.id)

    resetHover();
    /*if (image) {
      image.isHover = false;
    }*/
  }

function populateLabs(list) {
  var table = $("#areas tbody");
  //table.find(".area").remove();
  for (var i = 0; i < list.length; i++) {
    var lab = list[i];
    var tr = $("<tr>").addClass(""+i).data({"areaid": lab.id,"type": lab.name}).appendTo(table).on("click", function() {
     // getLabLocation($(this).data("labname"));
    }).hover(function() {

         rollOverCountry(polygonSeries.getPolygonById($(this).data("areaid")));

    });
    $("<td>").addClass("details-control").appendTo(tr);
    $("<td>").appendTo(tr).data("name", lab.name).html(lab.name);
    $("<td>").addClass("type").appendTo(tr).html(addComma(lab.publicHospitals));
    $("<td>").addClass("city").appendTo(tr).html(addComma(lab.privateHospitals));
    $("<td>").addClass("state").appendTo(tr).html(addComma(lab.totalHospitals));
    $("<td>").addClass("type").appendTo(tr).html(addComma(lab.publicBeds));
    $("<td>").addClass("city").appendTo(tr).html(addComma(lab.privateBeds));
    $("<td>").addClass("state").appendTo(tr).html(addComma(lab.totalBeds));
    $("<td>").addClass("type").appendTo(tr).html(addComma(lab.publicICU));
    $("<td>").addClass("city").appendTo(tr).html(addComma(lab.privateICU));
    $("<td>").addClass("state").appendTo(tr).html(addComma(lab.totalICU));
    $("<td>").addClass("type").appendTo(tr).html(addComma(lab.publicVentilators));
    $("<td>").addClass("city").appendTo(tr).html(addComma(lab.privateVentilators));
    $("<td>").addClass("state").appendTo(tr).html(addComma(lab.totalVentilators));
  }

  $("#areas").DataTable({
    "paging": false,
    "select": true,
    "buttons": [
        'copy', 'excel', 'pdf'
    ],
    "columnDefs": [ {
        "targets": [0], // column index (start from 0)
        "orderable": false, // set orderable false for selected columns
     },
     { "visible": false, "targets": [5, 6, 7, 8, 9, 10, 11, 12, 13] }]
  }).column("4")
    .order("desc")
    .draw();
}