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




// Themes begin
am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dark);
// Themes end

am4core.ready(function() {

  var populations = {
'IN-JK' : 12267032,
'IN-TG' : 35003674,
'IN-AP' : 49577103,
'IN-GJ' : 60439692,
'IN-AR' : 1383727,
'IN-AS' : 31205576,
'IN-SK' : 610577,
'IN-WB' : 91276115,
'IN-UT' : 10086292,
'IN-UP' : 199812341,
'IN-BR' : 104099452,
'IN-NL' : 1978502,
'IN-MN' : 2570390,
'IN-MZ' : 1097206,
'IN-TR' : 3673917,
'IN-ML' : 2966889,
'IN-PB' : 27743338,
'IN-RJ' : 68548437,
'IN-LA' : 274000,
'IN-HP' : 6864602,
'IN-OR' : 41974218,
'IN-DD' : 243247,
'IN-MH' : 112374333,
'IN-GA' : 1458545,
'IN-KA' : 61095297,
'IN-KL' : 33406061,
'IN-PY' : 1247953,
'IN-TN' : 72147030,
'IN-LD' : 64473,
'IN-AN' : 380581,
'IN-JH' : 32988134,
'IN-DL' : 16787941,
'IN-DN' : 344000,
'IN-CH' : 1055450,
'IN-MP' : 72626809,
'IN-CT' : 25545198,
'IN-HR' : 25351462
  }


//////////////////////////////////////////////////////////////////////////////
// LAYOUT & CHARTS
//////////////////////////////////////////////////////////////////////////////

// main container
// https://www.amcharts.com/docs/v4/concepts/svg-engine/containers/
var container = am4core.create("chartdiv", am4core.Container);
container.width = am4core.percent(100);
container.height = am4core.percent(100);

container.tooltip = new am4core.Tooltip();
container.tooltip.background.fill = am4core.color("#000000");
//container.tooltip.background.stroke = activeColor;
container.tooltip.fontSize = "0.9em";
container.tooltip.getFillFromObject = false;
container.tooltip.getStrokeFromObject = false;


// MAP CHART 
// https://www.amcharts.com/docs/v4/chart-types/map/
var mapChart = container.createChild(am4maps.MapChart);
mapChart.height = am4core.percent(80);
mapChart.zoomControl = new am4maps.ZoomControl();
mapChart.zoomControl.align = "right";
mapChart.zoomControl.marginRight = 15;
mapChart.zoomControl.valign = "middle";
mapChart.homeZoomLevel = 2;
mapChart.homeGeoPoint = { longitude: 160, latitude: 20 };

// by default minus button zooms out by one step, but we modify the behavior so when user clicks on minus, the map would fully zoom-out and show world data
//mapChart.zoomControl.minusButton.events.on("hit", showWorld);
// clicking on a "sea" will also result a full zoom-out
//mapChart.seriesContainer.background.events.on("hit", showWorld);
//mapChart.seriesContainer.background.events.on("over", resetHover);
mapChart.seriesContainer.background.fillOpacity = 0;
mapChart.zoomEasing = am4core.ease.sinOut;

// https://www.amcharts.com/docs/v4/chart-types/map/#Map_data
// you can use more accurate world map or map of any other country - a wide selection of maps available at: https://github.com/amcharts/amcharts4-geodata
//mapChart.geodata = am4geodata_worldIndiaLow;
mapChart.geodataSource.url = "deps/amcharts4-geodata/india_with_ladakh.json";

// Set projection
// https://www.amcharts.com/docs/v4/chart-types/map/#Setting_projection
// instead of Miller, you can use Mercator or many other projections available: https://www.amcharts.com/demos/map-using-d3-projections/
mapChart.projection = new am4maps.projections.Miller();
mapChart.panBehavior = "move";

// when map is globe, beackground is made visible
mapChart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.05;
mapChart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#ffffff");
mapChart.backgroundSeries.hidden = true;

var title = mapChart.titles.create();
title.text = "[bold font-size: 20]Hospital Beds in India[/]\nsource: PIB Press Release (1539877)";
title.textAlign = "middle";

var mapData = [
        {
        "id": "IN-AP",
        "name": "Andhra Pradesh",
        "ruralHospitals": 193,
        "ruralBeds": 6480,
        "urbanHospitals": 65,
        "urbanBeds": 16658,
        "totalHospitals": 258,
        "totalBeds": 23138,
        "asOn": "2017-01-01T00:00:00.000Z"
      },
      {
        "id": "IN-AR",
        "name": "Arunachal Pradesh",
        "ruralHospitals": 208,
        "ruralBeds": 2136,
        "urbanHospitals": 10,
        "urbanBeds": 268,
        "totalHospitals": 218,
        "totalBeds": 2404,
        "asOn": "2017-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-AS",
        "name": "Assam",
        "ruralHospitals": 1176,
        "ruralBeds": 10944,
        "urbanHospitals": 50,
        "urbanBeds": 6198,
        "totalHospitals": 1226,
        "totalBeds": 17142,
        "asOn": "2017-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-BR",
        "name": "Bihar",
        "ruralHospitals": 930,
        "ruralBeds": 6083,
        "urbanHospitals": 103,
        "urbanBeds": 5936,
        "totalHospitals": 1033,
        "totalBeds": 12019,
        "asOn": "2016-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-CT",
        "name": "Chhattisgarh",
        "ruralHospitals": 169,
        "ruralBeds": 5070,
        "urbanHospitals": 45,
        "urbanBeds": 4342,
        "totalHospitals": 214,
        "totalBeds": 9412,
        "asOn": "2016-01-01T00:00:00.000Z"
      },
      {
        "id": "IN-GA",
        "name": "Goa",
        "ruralHospitals": 17,
        "ruralBeds": 1405,
        "urbanHospitals": 25,
        "urbanBeds": 1608,
        "totalHospitals": 42,
        "totalBeds": 3013,
        "asOn": "2017-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-GJ",
        "name": "Gujarat",
        "ruralHospitals": 364,
        "ruralBeds": 11715,
        "urbanHospitals": 122,
        "urbanBeds": 20565,
        "totalHospitals": 486,
        "totalBeds": 32280,
        "asOn": "2016-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-HR",
        "name": "Haryana",
        "ruralHospitals": 609,
        "ruralBeds": 6690,
        "urbanHospitals": 59,
        "urbanBeds": 4550,
        "totalHospitals": 668,
        "totalBeds": 11240,
        "asOn": "2016-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-HP",
        "name": "Himachal Pradesh",
        "ruralHospitals": 705,
        "ruralBeds": 5665,
        "urbanHospitals": 96,
        "urbanBeds": 6734,
        "totalHospitals": 801,
        "totalBeds": 12399,
        "asOn": "2017-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-JK",
        "name": "Jammu & Kashmir",
        "ruralHospitals": 56,
        "ruralBeds": 7234,
        "urbanHospitals": 76,
        "urbanBeds": 4417,
        "totalHospitals": 132,
        "totalBeds": 11651,
        "asOn": "2016-12-30T00:00:00.000Z"
      },
      {
        "id": "IN-JH",
        "name": "Jharkhand",
        "ruralHospitals": 519,
        "ruralBeds": 5842,
        "urbanHospitals": 36,
        "urbanBeds": 4942,
        "totalHospitals": 555,
        "totalBeds": 10784,
        "asOn": "2015-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-KA",
        "name": "Karnataka",
        "ruralHospitals": 2471,
        "ruralBeds": 21072,
        "urbanHospitals": 374,
        "urbanBeds": 49093,
        "totalHospitals": 2845,
        "totalBeds": 70165,
        "asOn": "2017-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-KL",
        "name": "Kerala",
        "ruralHospitals": 981,
        "ruralBeds": 16865,
        "urbanHospitals": 299,
        "urbanBeds": 21139,
        "totalHospitals": 1280,
        "totalBeds": 38004,
        "asOn": "2017-01-01T00:00:00.000Z"
      },
      {
        "id": "IN-MP",
        "name": "Madhya Pradesh",
        "ruralHospitals": 334,
        "ruralBeds": 10020,
        "urbanHospitals": 117,
        "urbanBeds": 18819,
        "totalHospitals": 451,
        "totalBeds": 28839,
        "asOn": "2016-01-01T00:00:00.000Z"
      },
      {
        "id": "IN-MH",
        "name": "Maharashtra",
        "ruralHospitals": 273,
        "ruralBeds": 12398,
        "urbanHospitals": 438,
        "urbanBeds": 39048,
        "totalHospitals": 711,
        "totalBeds": 51446,
        "asOn": "2015-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-MN",
        "name": "Manipur",
        "ruralHospitals": 23,
        "ruralBeds": 730,
        "urbanHospitals": 7,
        "urbanBeds": 697,
        "totalHospitals": 30,
        "totalBeds": 1427,
        "asOn": "2014-01-01T00:00:00.000Z"
      },
      {
        "id": "IN-ML",
        "name": "Meghalaya",
        "ruralHospitals": 143,
        "ruralBeds": 1970,
        "urbanHospitals": 14,
        "urbanBeds": 2487,
        "totalHospitals": 157,
        "totalBeds": 4457,
        "asOn": "2017-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-MZ",
        "name": "Mizoram",
        "ruralHospitals": 56,
        "ruralBeds": 604,
        "urbanHospitals": 34,
        "urbanBeds": 1393,
        "totalHospitals": 90,
        "totalBeds": 1997,
        "asOn": "2017-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-NL",
        "name": "Nagaland",
        "ruralHospitals": 21,
        "ruralBeds": 630,
        "urbanHospitals": 15,
        "urbanBeds": 1250,
        "totalHospitals": 36,
        "totalBeds": 1880,
        "asOn": "2015-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-OR",
        "name": "Odisha",
        "ruralHospitals": 1655,
        "ruralBeds": 6339,
        "urbanHospitals": 149,
        "urbanBeds": 12180,
        "totalHospitals": 1804,
        "totalBeds": 18519,
        "asOn": "2017-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-PB",
        "name": "Punjab",
        "ruralHospitals": 510,
        "ruralBeds": 5805,
        "urbanHospitals": 172,
        "urbanBeds": 12128,
        "totalHospitals": 682,
        "totalBeds": 17933,
        "asOn": "2017-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-RJ",
        "name": "Rajasthan",
        "ruralHospitals": 602,
        "ruralBeds": 21088,
        "urbanHospitals": 150,
        "urbanBeds": 10760,
        "totalHospitals": 752,
        "totalBeds": 31848,
        "asOn": "2016-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-SK",
        "name": "Sikkim",
        "ruralHospitals": 24,
        "ruralBeds": 260,
        "urbanHospitals": 9,
        "urbanBeds": 1300,
        "totalHospitals": 33,
        "totalBeds": 1560,
        "asOn": "2017-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-TN",
        "name": "Tamil Nadu",
        "ruralHospitals": 692,
        "ruralBeds": 40179,
        "urbanHospitals": 525,
        "urbanBeds": 37353,
        "totalHospitals": 1217,
        "totalBeds": 77532,
        "asOn": "2017-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-TG",
        "name": "Telangana",
        "ruralHospitals": 802,
        "ruralBeds": 7668,
        "urbanHospitals": 61,
        "urbanBeds": 13315,
        "totalHospitals": 863,
        "totalBeds": 20983,
        "asOn": "2017-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-TR",
        "name": "Tripura",
        "ruralHospitals": 99,
        "ruralBeds": 1140,
        "urbanHospitals": 56,
        "urbanBeds": 3277,
        "totalHospitals": 155,
        "totalBeds": 4417,
        "asOn": "2017-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-UP",
        "name": "Uttar Pradesh",
        "ruralHospitals": 4442,
        "ruralBeds": 39104,
        "urbanHospitals": 193,
        "urbanBeds": 37156,
        "totalHospitals": 4635,
        "totalBeds": 76260,
        "asOn": "2017-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-UT",
        "name": "Uttarakhand",
        "ruralHospitals": 410,
        "ruralBeds": 3284,
        "urbanHospitals": 50,
        "urbanBeds": 5228,
        "totalHospitals": 460,
        "totalBeds": 8512,
        "asOn": "2015-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-WB",
        "name": "West Bengal",
        "ruralHospitals": 1272,
        "ruralBeds": 19684,
        "urbanHospitals": 294,
        "urbanBeds": 58882,
        "totalHospitals": 1566,
        "totalBeds": 78566,
        "asOn": "2015-01-01T00:00:00.000Z"
      },
      {
        "id": "IN-AN",
        "name": "Andaman & Nicobar Islands",
        "ruralHospitals": 27,
        "ruralBeds": 575,
        "urbanHospitals": 3,
        "urbanBeds": 500,
        "totalHospitals": 30,
        "totalBeds": 1075,
        "asOn": "2016-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-CH",
        "name": "Chandigarh",
        "ruralHospitals": 0,
        "ruralBeds": 0,
        "urbanHospitals": 4,
        "urbanBeds": 778,
        "totalHospitals": 4,
        "totalBeds": 778,
        "asOn": "2016-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-DN",
        "name": "Dadra & Nagar Haveli",
        "ruralHospitals": 10,
        "ruralBeds": 273,
        "urbanHospitals": 1,
        "urbanBeds": 316,
        "totalHospitals": 11,
        "totalBeds": 589,
        "asOn": "2017-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-DD",
        "name": "Daman & Diu",
        "ruralHospitals": 5,
        "ruralBeds": 240,
        "urbanHospitals": 0,
        "urbanBeds": 0,
        "totalHospitals": 5,
        "totalBeds": 240,
        "asOn": "2015-12-31T00:00:00.000Z"
      },
      {
        "id": "IN-DL",
        "name": "Delhi",
        "ruralHospitals": 0,
        "ruralBeds": 0,
        "urbanHospitals": 109,
        "urbanBeds": 24383,
        "totalHospitals": 109,
        "totalBeds": 24383,
        "asOn": "2015-01-01T00:00:00.000Z"
      },
      {
        "id": "IN-LD",
        "name": "Lakshadweep",
        "ruralHospitals": 9,
        "ruralBeds": 300,
        "urbanHospitals": 0,
        "urbanBeds": 0,
        "totalHospitals": 9,
        "totalBeds": 300,
        "asOn": "2016-01-01T00:00:00.000Z"
      },
      {
        "id": "IN-PY",
        "name": "Puducherry",
        "ruralHospitals": 3,
        "ruralBeds": 96,
        "urbanHospitals": 11,
        "urbanBeds": 3473,
        "totalHospitals": 14,
        "totalBeds": 3569,
        "asOn": "2016-01-01T00:00:00.000Z"
      },
      {
        "id": "IN-IN",
        "name": "INDIA (total)",
        "ruralHospitals": 39620,
        "ruralBeds": 559176,
        "urbanHospitals": 7544,
        "urbanBeds": 862346,
        "totalHospitals": 47164,
        "totalBeds": 1421522,
        "asOn": "2016-01-01T00:00:00.000Z"
      }
];

populateStates(mapData);

// Create map polygon series
var polygonSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
//polygonSeries.exclude = ["AQ"];
polygonSeries.dataFields.id = "id";
polygonSeries.dataFields.value = "totalBeds";
polygonSeries.interpolationDuration = 0;
polygonSeries.useGeodata = true;
polygonSeries.nonScalingStroke = true;
polygonSeries.strokeWidth = 0.5;
polygonSeries.calculateVisualCenter = true;
polygonSeries.data = mapData;

var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.fill = am4core.color("#1b943e");
polygonTemplate.fillOpacity = 0.8;
//polygonTemplate.fillOpacity = 1
//polygonTemplate.stroke = countryStrokeColor;
//polygonTemplate.strokeOpacity = 0.15
polygonTemplate.setStateOnChildren = true;
polygonTemplate.tooltipPosition = "fixed";
polygonTemplate.events.on("over", handleCountryOver);


var imageSeries = mapChart.series.push(new am4maps.MapImageSeries());
imageSeries.data = mapData;
imageSeries.dataFields.value = "totalBeds";
imageSeries.dataFields.urban = "urbanBeds";
imageSeries.dataFields.rural = "ruralBeds";

var imageTemplate = imageSeries.mapImages.template;
imageTemplate.nonScaling = true;

var circle = imageTemplate.createChild(am4core.Circle);
circle.fillOpacity = 0.7;
//circle.fill = am4core.color("#1b943e");
circle.stroke = am4core.color("#000");
circle.strokeWidth = 0.5;
circle.tooltipText = "[font-size:12px]{name}[/]\nTotal: [bold]{value}[/] beds \nUrban: [bold]{urban}[/] beds\nRural: [bold]{rural}[/] beds";

var label = imageTemplate.createChild(am4core.Label);
label.text = "{value}";
label.fill = am4core.color("#fff");
label.verticalCenter = "middle";
label.horizontalCenter = "middle";
label.nonScaling = false;


imageSeries.heatRules.push({
  "target": circle,
  "property": "radius",
  "min": 30,
  "max": 50,
  "dataField": "value"
})

imageTemplate.adapter.add("latitude", function(latitude, target) {
  var polygon = polygonSeries.getPolygonById(target.dataItem.dataContext.id);
  if(polygon){
    return polygon.visualLatitude;
   }
   return latitude;
})

imageTemplate.adapter.add("longitude", function(longitude, target) {
  var polygon = polygonSeries.getPolygonById(target.dataItem.dataContext.id);
  if(polygon){
    return polygon.visualLongitude;
   }
   return longitude;
})

  // what happens when a country is rolled-over
  function rollOverCountry(mapPolygon) {

    //resetHover();
    if (mapPolygon) {
      mapPolygon.isHover = true;

      // make bubble hovered too
      var image = imageSeries.getImageById(mapPolygon.dataItem.id);
      if (image) {
        image.dataItem.dataContext.name = mapPolygon.dataItem.dataContext.name;
        image.isHover = true;
      }
    }
  }

  function handleCountryOver(event) {
    rollOverCountry(event.target);
  }

  function populateStates(list) {
    var table = $("#areas tbody");
    table.find(".area").remove();
    for (var i = 0; i < list.length; i++) {
      var area = list[i];
      var tr = $("<tr>").addClass("area").data("areaid", area.id).appendTo(table).on("click", function() {
        selectCountry(polygonSeries.getPolygonById($(this).data("areaid")));
      }).hover(function() {
        rollOverCountry(polygonSeries.getPolygonById($(this).data("areaid")));
      });
      $("<td>").appendTo(tr).data("areaid", area.name).html(area.name);
      $("<td>").addClass("value").appendTo(tr).html(area.ruralBeds);
      $("<td>").addClass("value").appendTo(tr).html(area.urbanBeds);
      $("<td>").addClass("value").appendTo(tr).html(area.totalBeds);
    }
    $("#areas").DataTable({
      "paging": false,
      "select": true
    }).column("1")
      .order("desc")
      .draw();;
  }

})