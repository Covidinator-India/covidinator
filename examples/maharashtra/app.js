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
    'Pune' : 9429408,
    'Mumbai' : 12442373,
    'Nagpur' : 4653570,
    'Ahmadnagar' : 4543159,
    'Thane' : 8070032,
    'Raigarh' : 2634200,
    'Yavatmal' : 2772348,
    'Aurangabad' : 3701282,
    'Ratnagiri' : 1615069,
    'Palghar' : 2990116,
    'Sangli' : 2822143,
    'Satara' : 3003741,
    'Sindhudurg' : 849651,
    'Gondiya' : 1322507,
    'Kolhapur' : 3876001,
    'Other States*' : 11,
    'Jalgaon' : 4229917,
    'Buldana' : 2586258,
    'Nashik' : 6107187,
    'Osmanabad' : 1657576,
    'Washim' : 1197160,
    'Hingoli' : 1177345,
    'Amravati' : 2888445,
    'Latur' : 2454196,
    'Jalna' : 1959046,
    'Parbhani' : 1836086,
    'Akola' : 1813906,
    'Bid' : 2585049,
    'Solapur' : 4317756,
    'Dhule' : 2050862,
    'Nanded' : 3361292,
    'Chandrapur' : 2204307,
    'Nandurbar' : 1648295,
    'Unknown' : 552
  }



  var numberFormatter = new am4core.NumberFormatter();
  var backgroundColor = am4core.color("#1e2128");
  var activeColor = am4core.color("#ff8726");
  var confirmedColor = am4core.color("#d21a1a");


  // for an easier access by key
  var colors = {confirmed: confirmedColor};

  var countryColor = am4core.color("#3b3b3b");
  var countryStrokeColor = am4core.color("#000000");
  var buttonStrokeColor = am4core.color("#ffffff");
  var countryHoverColor = am4core.color("#1b1b1b");
  var activeCountryColor = am4core.color("#0f0f0f");

  var currentIndex;
  var currentCountry = "Pune";

  var currentPolygon;

  var countryDataTimeout;

  var currentType;

  var currentTypeName;

  var sliderAnimation;

  var perCapita = false;


  //////////////////////////////////////////////////////////////////////////////
  // PREPARE DATA
  //////////////////////////////////////////////////////////////////////////////

  // make a map of country indexes for later use
  var countryIndexMap = covid_maharashtra;
  covid_maharashtra.forEach(element => console.log("'"+element.id+"' : "+element.confirmed+"," ));


  // function that returns current slide
  // if index is not set, get last slide
/*  function getSlideData(index) {
    if (index == undefined) {
      index = covid_maharashtra.length - 1;
    }

    var data = covid_maharashtra[index];

    // augment with names CHECK THIS FOR ID
    for (var i = 0; i < data.length; i++) {
      data[i].name = data[i].id;
    }

    return data;
  }*/

  // get slide data
  //var slideData = getSlideData();

  // as we will be modifying raw data, make a copy
  var mapData = JSON.parse(JSON.stringify(countryIndexMap));

  var max = { confirmed: 0};
  var maxPC = { confirmed: 0};



  // END OF DATA

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
  container.tooltip.background.stroke = activeColor;
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
  mapChart.seriesContainer.background.events.on("over", resetHover);
  mapChart.seriesContainer.background.fillOpacity = 0;
  mapChart.zoomEasing = am4core.ease.sinOut;

  // https://www.amcharts.com/docs/v4/chart-types/map/#Map_data
  // you can use more accurate world map or map of any other country - a wide selection of maps available at: https://github.com/amcharts/amcharts4-geodata
  //mapChart.geodata = am4geodata_worldIndiaLow;
  mapChart.geodataSource.url = "deps/amcharts4-geodata/MH_districts.json";

  // Set projection
  // https://www.amcharts.com/docs/v4/chart-types/map/#Setting_projection
  // instead of Miller, you can use Mercator or many other projections available: https://www.amcharts.com/demos/map-using-d3-projections/
  mapChart.projection = new am4maps.projections.Miller();
  mapChart.panBehavior = "move";

  // when map is globe, beackground is made visible
  mapChart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.05;
  mapChart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#ffffff");
  mapChart.backgroundSeries.hidden = true;


  // Map polygon series (defines how country areas look and behave)
  var polygonSeries = new am4maps.MapPolygonSeries();
    polygonSeries.useGeodata = true;
  mapChart.series.push(polygonSeries);
  //var polygonSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
  polygonSeries.dataFields.id = "id";
  polygonSeries.dataFields.value = "confirmedPC";
  polygonSeries.interpolationDuration = 0;
  polygonSeries.useGeodata = true;
  polygonSeries.nonScalingStroke = true;
  polygonSeries.strokeWidth = 0.5;
  // this helps to place bubbles in the visual middle of the area
  polygonSeries.calculateVisualCenter = true;
  polygonSeries.data = mapData;

  var polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.fill = countryColor;
  polygonTemplate.fillOpacity = 1
  polygonTemplate.stroke = countryStrokeColor;
  polygonTemplate.strokeOpacity = 0.15
  polygonTemplate.setStateOnChildren = true;
  polygonTemplate.tooltipPosition = "fixed";
  polygonTemplate.tooltipText = "{name}";

  polygonTemplate.events.on("hit", handleCountryHit);
  polygonTemplate.events.on("over", handleCountryOver);
  polygonTemplate.events.on("out", handleCountryOut);


  polygonSeries.heatRules.push({
    "target": polygonTemplate,
    "property": "fill",
    "min": countryColor,
    "max": countryColor,
    "dataField": "value"
  })

  /*mapChart.events.on("ready", function(ev) {
    mapChart.zoomToMapObject(polygonSeries.getPolygonById("IN-MH"));
  });*/

  // you can have pacific - centered map if you set this to -154.8
  mapChart.deltaLongitude = 20;
  //mapChart.deltaLatitude = 78;
/*
  // polygon states
  var polygonHoverState = polygonTemplate.states.create("hover");
  polygonHoverState.transitionDuration = 1400;
  polygonHoverState.properties.fill = countryHoverColor;

  var polygonActiveState = polygonTemplate.states.create("active")
  polygonActiveState.properties.fill = activeCountryColor;
*/
/*
  // Bubble series
  var bubbleSeries = mapChart.series.push(new am4maps.MapImageSeries());
  bubbleSeries.data = JSON.parse(JSON.stringify(mapData));

  bubbleSeries.dataFields.value = "confirmed";
  bubbleSeries.dataFields.id = "id";

  // adjust tooltip
  bubbleSeries.tooltip.animationDuration = 0;
  bubbleSeries.tooltip.showInViewport = false;
  bubbleSeries.tooltip.background.fillOpacity = 0.2;
  bubbleSeries.tooltip.getStrokeFromObject = true;
  bubbleSeries.tooltip.getFillFromObject = false;
  bubbleSeries.tooltip.background.fillOpacity = 0.2;
  bubbleSeries.tooltip.background.fill = am4core.color("#000000");

  var imageTemplate = bubbleSeries.mapImages.template;
  // if you want bubbles to become bigger when zoomed, set this to false
  imageTemplate.nonScaling = true;
  imageTemplate.strokeOpacity = 0;
  imageTemplate.fillOpacity = 0.55;
  imageTemplate.tooltipText = "{name}: [bold]{value}[/]";
  imageTemplate.applyOnClones = true;

  imageTemplate.events.on("over", handleImageOver);
  imageTemplate.events.on("out", handleImageOut);
  imageTemplate.events.on("hit", handleImageHit);

  // this is needed for the tooltip to point to the top of the circle instead of the middle
  imageTemplate.adapter.add("tooltipY", function(tooltipY, target) {
    return -target.children.getIndex(0).radius;
  })

  // When hovered, circles become non-opaque  
  var imageHoverState = imageTemplate.states.create("hover");
  imageHoverState.properties.fillOpacity = 1;

  // add circle inside the image
  var circle = imageTemplate.createChild(am4core.Circle);
  var circle2 = imageTemplate.createChild(am4core.Circle);
  circle2.applyOnClones = true;
  // this makes the circle to pulsate a bit when showing it
  circle.hiddenState.properties.scale = 0.0001;
  circle.hiddenState.transitionDuration = 2000;
  circle.defaultState.transitionDuration = 2000;
  //circle.defaultState.transitionEasing = am4core.ease.elasticOut;
  // later we set fill color on template (when changing what type of data the map should show) and all the clones get the color because of this
  circle.applyOnClones = true;

  //circle animation

  // later we set fill color on template (when changing what type of data the map should show) and all the clones get the color because of this
  //circle2.applyOnClones = true;
  circle2.events.on("inited", function(event){
  animateBullet(event.target);
  })


  function animateBullet(circle) {
      var animation = circle.animate([{ property: "scale", from: 1, to: 1.3 }, { property: "opacity", from: 1, to: 0 }], 1000, am4core.ease.circleOut);
      animation.events.on("animationended", function(event){
        animateBullet(event.target.object);
      })
  }

  // heat rule makes the bubbles to be of a different width. Adjust min/max for smaller/bigger radius of a bubble
  bubbleSeries.heatRules.push({
    "target": circle,
    "property": "radius",
    "min": 3,
    "max": 30,
    "dataField": "value"
  })

    bubbleSeries.heatRules.push({
    "target": circle2,
    "property": "radius",
    "min": 3,
    "max": 30,
    "dataField": "value"
  })

  // when data items validated, hide 0 value bubbles (because min size is set)
  bubbleSeries.events.on("dataitemsvalidated", function() {
    bubbleSeries.dataItems.each((dataItem) => {
      var mapImage = dataItem.mapImage;
      var circle = mapImage.children.getIndex(0);
      var circle2 = mapImage.children.getIndex(1);
      if (mapImage.dataItem.confirmed == 0) {
        circle.hide(0);
        circle2.hide(0);
      }
      else if (circle.isHidden || circle.isHiding) {
        circle.show();
        circle2.show();
      }
    })
  })

  // this places bubbles at the visual center of a country
  imageTemplate.adapter.add("latitude", function(latitude, target) {
    var polygon = polygonSeries.getPolygonById(target.dataItem.id);
    if (polygon) {
      target.disabled = false;
      return polygon.visualLatitude;
    }
    else {
      target.disabled = true;
    }
    return latitude;
  })

  imageTemplate.adapter.add("longitude", function(longitude, target) {
    var polygon = polygonSeries.getPolygonById(target.dataItem.id);
    if (polygon) {
      target.disabled = false;
      return polygon.visualLongitude;
    }
    else {
      target.disabled = true;
    }
    return longitude;
  })
*/
  // END OF MAP  

  // top title
  var title = mapChart.titles.create();
  title.fontSize = "1.5em";
  title.text = "COVID-19 Spread in Maharashtra";
  title.align = "left";
  title.horizontalCenter = "left";
  title.marginLeft = 20;
  title.paddingBottom = 10;
  title.fill = am4core.color("#ffffff");
  title.y = 20;


  // switch between absolute and per capita
  var absolutePerCapitaSwitch = mapChart.createChild(am4core.SwitchButton);
  absolutePerCapitaSwitch.align = "center"
  absolutePerCapitaSwitch.y = 15;
  absolutePerCapitaSwitch.leftLabel.text = "Absolute";
  absolutePerCapitaSwitch.leftLabel.fill = am4core.color("#ffffff");
  absolutePerCapitaSwitch.rightLabel.fill = am4core.color("#ffffff");
  absolutePerCapitaSwitch.rightLabel.text = "Per Capita";
  absolutePerCapitaSwitch.rightLabel.interactionsEnabled = true;
  absolutePerCapitaSwitch.rightLabel.tooltipText = "When calculating max value, countries with population less than 100.000 are not included."
  absolutePerCapitaSwitch.verticalCenter = "top";


  absolutePerCapitaSwitch.events.on("toggled", function() {
    if (absolutePerCapitaSwitch.isActive) {
      //bubbleSeries.hide(0);
      perCapita = true;
      //bubbleSeries.interpolationDuration = 0;
      polygonSeries.heatRules.getIndex(0).max = colors[currentType];
      polygonSeries.heatRules.getIndex(0).maxValue = maxPC[currentType];
      polygonSeries.mapPolygons.template.applyOnClones = true;

      sizeSlider.hide()
      filterSlider.hide();
      sizeLabel.hide();
      filterLabel.hide();

      updateCountryTooltip();

    } else {
      perCapita = false;
      polygonSeries.interpolationDuration = 0;
      //bubbleSeries.interpolationDuration = 000;
      //bubbleSeries.show();
      polygonSeries.heatRules.getIndex(0).max = countryColor;
      polygonSeries.mapPolygons.template.tooltipText = undefined;
      sizeSlider.show()
      filterSlider.show();
      sizeLabel.show();
      filterLabel.show();
    }
    polygonSeries.mapPolygons.each(function(mapPolygon) {
      mapPolygon.fill = mapPolygon.fill;
      mapPolygon.defaultState.properties.fill = undefined;
    })
  })


  // buttons & chart container
  var buttonsAndChartContainer = container.createChild(am4core.Container);
  buttonsAndChartContainer.layout = "vertical";
  buttonsAndChartContainer.height = am4core.percent(8); // make this bigger if you want more space for the chart
  buttonsAndChartContainer.width = am4core.percent(100);
  buttonsAndChartContainer.valign = "bottom";

  // country name and buttons container
  var nameAndButtonsContainer = buttonsAndChartContainer.createChild(am4core.Container)
  nameAndButtonsContainer.width = am4core.percent(100);
  nameAndButtonsContainer.padding(0, 10, 5, 20);
  nameAndButtonsContainer.layout = "horizontal";

  // name of a country and date label
  var countryName = nameAndButtonsContainer.createChild(am4core.Label);
  countryName.fontSize = "1.1em";
  countryName.fill = am4core.color("#ffffff");
  countryName.valign = "middle";

  // buttons container (active/confirmed/recovered/deaths)
  var buttonsContainer = nameAndButtonsContainer.createChild(am4core.Container);
  buttonsContainer.layout = "grid";
  buttonsContainer.width = am4core.percent(100);
  buttonsContainer.x = 10;
  buttonsContainer.contentAlign = "right";



//refresh data
    var index = Math.round((covid_maharashtra.length - 1) * 1);
    updateMapData(countryIndexMap[index]);
    updateTotals(index);


  // bubble size slider
  var sizeSlider = container.createChild(am4core.Slider);
  sizeSlider.orientation = "vertical";
  sizeSlider.height = am4core.percent(12);
  sizeSlider.marginLeft = 25;
  sizeSlider.align = "left";
  sizeSlider.valign = "top";
  sizeSlider.verticalCenter = "middle";
  sizeSlider.opacity = 0.7;
  sizeSlider.background.fill = am4core.color("#ffffff");
  sizeSlider.adapter.add("y", function(y, target) {
    return container.pixelHeight * (1 - buttonsAndChartContainer.percentHeight / 100) * 0.25;
  })

  sizeSlider.startGrip.background.fill = activeColor;
  sizeSlider.startGrip.background.fillOpacity = 0.8;
  sizeSlider.startGrip.background.strokeOpacity = 0;
  sizeSlider.startGrip.icon.stroke = am4core.color("#ffffff");
  sizeSlider.startGrip.background.states.getKey("hover").properties.fill = activeColor;
  sizeSlider.startGrip.background.states.getKey("down").properties.fill = activeColor;
  sizeSlider.horizontalCenter = "middle";


  sizeSlider.events.on("rangechanged", function() {
    sizeSlider.startGrip.scale = 0.75 + sizeSlider.start;
   // bubbleSeries.heatRules.getIndex(0).max = 30 + sizeSlider.start * 100;
    //bubbleSeries.heatRules.getIndex(1).max = 30 + sizeSlider.start * 100;
   /* circle.clones.each(function(clone) {
      clone.radius = clone.radius;
    })
    circle2.clones.each(function(clone) {
      clone.radius = clone.radius;
    })*/
  })


  var sizeLabel = container.createChild(am4core.Label);
  sizeLabel.text = "max bubble size *";
  sizeLabel.fill = am4core.color("#ffffff");
  sizeLabel.rotation = 90;
  sizeLabel.fontSize = "10px";
  sizeLabel.fillOpacity = 0.5;
  sizeLabel.horizontalCenter = "middle";
  sizeLabel.align = "left"
  sizeLabel.paddingBottom = 40;
  sizeLabel.tooltip.setBounds({ x: 0, y: 0, width: 200000, height: 200000 })
  sizeLabel.tooltip.label.wrap = true;
  sizeLabel.tooltip.label.maxWidth = 300;
  sizeLabel.tooltipText = "Some states have so many cases that bubbles for states with smaller values often look the same even if there is a significant difference between them. This slider can be used to increase maximum size of a bubble so that when you zoom in to a region with relatively small values you could compare them anyway."
  sizeLabel.fill = am4core.color("#ffffff");

  sizeLabel.adapter.add("y", function(y, target) {
    return container.pixelHeight * (1 - buttonsAndChartContainer.percentHeight / 100) * 0.25;
  })


  // bubble size slider
  var filterSlider = container.createChild(am4core.Slider);
  filterSlider.orientation = "vertical";
  filterSlider.height = am4core.percent(28);
  filterSlider.marginLeft = 25;
  filterSlider.align = "left";
  filterSlider.valign = "top";
  filterSlider.verticalCenter = "middle";
  filterSlider.opacity = 0.7;
  filterSlider.background.fill = am4core.color("#ffffff");
  filterSlider.adapter.add("y", function(y, target) {
    return container.pixelHeight * (1 - buttonsAndChartContainer.percentHeight / 100) * 0.7;
  })

  filterSlider.startGrip.background.fill = activeColor;
  filterSlider.startGrip.background.fillOpacity = 0.8;
  filterSlider.startGrip.background.strokeOpacity = 0;
  filterSlider.startGrip.icon.stroke = am4core.color("#ffffff");
  filterSlider.startGrip.background.states.getKey("hover").properties.fill = confirmedColor;
  filterSlider.startGrip.background.states.getKey("down").properties.fill = confirmedColor;
  filterSlider.horizontalCenter = "middle";
  filterSlider.start = 1;


  filterSlider.events.on("rangechanged", function() {
    var maxValue = maxPC[currentType];
   /* if (!isNaN(maxValue) && bubbleSeries.inited) {
      bubbleSeries.heatRules.getIndex(0).maxValue = maxValue;
      bubbleSeries.heatRules.getIndex(1).maxValue = maxValue;
      circle.clones.each(function(clone) {
        if (clone.dataItem.value > maxValue) {
          clone.dataItem.hide();
        }
        else {
          clone.dataItem.show();
        }
        clone.radius = clone.radius;
      })
        circle2.clones.each(function(clone) {
        if (clone.dataItem.value > maxValue) {
          clone.dataItem.hide();
        }
        else {
          clone.dataItem.show();
        }
        clone.radius = clone.radius;
      })
    }*/
  })


  var filterLabel = container.createChild(am4core.Label);
  filterLabel.text = "filter max values *";
  filterLabel.rotation = 90;
  filterLabel.fontSize = "10px";
  filterLabel.fill = am4core.color("#ffffff");
  filterLabel.fontSize = "0.8em";
  filterLabel.fillOpacity = 0.5;
  filterLabel.horizontalCenter = "middle";
  filterLabel.align = "left"
  filterLabel.paddingBottom = 40;
  filterLabel.tooltip.label.wrap = true;
  filterLabel.tooltip.label.maxWidth = 300;
  filterLabel.tooltipText = "This filter allows to remove states with many cases from the map so that it would be possible to compare states with smaller number of cases."
  filterLabel.fill = am4core.color("#ffffff");

  filterLabel.adapter.add("y", function(y, target) {
    return container.pixelHeight * (1 - buttonsAndChartContainer.percentHeight / 100) * 0.7;
  })


  //remove bubble filers since bubbles are removed anyway
  sizeSlider.hide()
  filterSlider.hide();
  sizeLabel.hide();
  filterLabel.hide();

  // BUTTONS
  // create buttons

  var confirmedButton = addButton("confirmed", confirmedColor);


  var buttons = {  confirmed: confirmedButton };

  // add button
  function addButton(name, color) {
    var button = buttonsContainer.createChild(am4core.Button)
    button.label.valign = "middle"
    button.label.fill = am4core.color("#ffffff");
    //button.label.fontSize = "11px";
    button.background.cornerRadius(30, 30, 30, 30);
    button.background.strokeOpacity = 0.3
    button.background.fillOpacity = 0;
    button.background.stroke = buttonStrokeColor;
    button.background.padding(2, 3, 2, 3);
    button.states.create("active");
    button.setStateOnChildren = true;

    var activeHoverState = button.background.states.create("hoverActive");
    activeHoverState.properties.fillOpacity = 0;

    var circle = new am4core.Circle();
    circle.radius = 8;
    circle.fillOpacity = 0.3;
    circle.fill = buttonStrokeColor;
    circle.strokeOpacity = 0;
    circle.valign = "middle";
    circle.marginRight = 5;
    button.icon = circle;

    // save name to dummy data for later use
    button.dummyData = name;

    var circleActiveState = circle.states.create("active");
    circleActiveState.properties.fill = color;
    circleActiveState.properties.fillOpacity = 0.5;

    button.events.on("hit", handleButtonClick);

    return button;
  }

  // handle button clikc
  function handleButtonClick(event) {
    // we saved name to dummy data
    changeDataType(event.target.dummyData);
  }

  // change data type (active/confirmed/recovered/deaths)
  function changeDataType(name) {
    currentType = name;
    currentTypeName = name;
    if (name != "deaths") {
      currentTypeName += " cases";
    }

    //bubbleSeries.mapImages.template.tooltipText = "[bold]{name}: {value}[/] [font-size:10px]\n" + "confirmed";

    // make button active
    var activeButton = buttons[name];
    activeButton.isActive = true;
    // make other buttons inactive
    for (var key in buttons) {
      if (buttons[key] != activeButton) {
        buttons[key].isActive = false;
      }
    }
    // tell series new field name
    //bubbleSeries.dataFields.value = name;
    //polygonSeries.dataFields.value = name + "PC";

    //bubbleSeries.dataItems.each(function(dataItem) {
      //dataItem.setValue("value", dataItem.dataContext["confirmed"]);
    //})

    /*polygonSeries.dataItems.each(function(dataItem) {
      dataItem.setValue("value", dataItem.dataContext[currentType + "PC"]);
      dataItem.mapPolygon.defaultState.properties.fill = undefined;
    })
*/

    // change color of bubbles
    // setting colors on mapImage for tooltip colors
    //bubbleSeries.mapImages.template.fill = colors[name];
    //bubbleSeries.mapImages.template.stroke = colors[name];
    // first child is circle
    //bubbleSeries.mapImages.template.children.getIndex(0).fill = colors[name];



    // update heat rule's maxValue
    //bubbleSeries.heatRules.getIndex(0).maxValue = maxPC[currentType];
    polygonSeries.heatRules.getIndex(0).maxValue = maxPC[currentType];
    if (perCapita) {
      polygonSeries.heatRules.getIndex(0).max = colors[name];
      updateCountryTooltip();
    }
  }

  // select a country
  function selectCountry(mapPolygon) {
    resetHover();
    polygonSeries.hideTooltip();

    // if the same country is clicked show world
    if (currentPolygon == mapPolygon) {
      currentPolygon.isActive = false;
      currentPolygon = undefined;
      //showWorld();
      return;
    }
    // save current polygon
    currentPolygon = mapPolygon;
    var countryIndex = countryIndexMap[mapPolygon.dataItem.id];
    //console.log(countryIndex);
    currentCountry = mapPolygon.dataItem.dataContext.id;
    //console.log(currentCountry);
    // make others inactive
    polygonSeries.mapPolygons.each(function(polygon) {
      polygon.isActive = false;
    })

    // clear timeout if there is one
    if (countryDataTimeout) {
      clearTimeout(countryDataTimeout);
    }
    // we delay change of data for better performance (so that data is not changed whil zooming)
    countryDataTimeout = setTimeout(function() {
      setCountryData(countryIndex);
    }, 1000); // you can adjust number, 1000 is one second

    updateTotals(currentIndex);
    updateCountryName();

    mapPolygon.isActive = true;
    

      mapChart.zoomToMapObject(mapPolygon, getZoomLevel(mapPolygon));
  }

  // change line chart data to the selected countries  CHECK HERE
  function setCountryData(countryIndex) {
          //Get Key function
      Object.prototype.getKeyByValue = function( value ) {
          for( var prop in this ) {
              if( this.hasOwnProperty( prop ) ) {
                   if( this[ prop ] === value )
                       return prop;
              }
          }
      }
    var state = countryIndexMap.getKeyByValue(countryIndex);
      //console.log(state);
    // instead of setting whole data array, we modify current raw data so that a nice animation would happen
    var countryData = []

    updateTotals(currentIndex);
  }


  // what happens when a country is rolled-over
  function rollOverCountry(mapPolygon) {

    resetHover();
    if (mapPolygon) {
      mapPolygon.isHover = true;

      // make bubble hovered too
     // var image = bubbleSeries.getImageById(mapPolygon.dataItem.id);
      /*if (image) {
        image.dataItem.dataContext.name = mapPolygon.dataItem.dataContext.id;
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

  // rotate and zoom
  function rotateAndZoom(mapPolygon) {
    polygonSeries.hideTooltip();
    var animation = mapChart.animate([{ property: "deltaLongitude", to: -mapPolygon.visualLongitude }, { property: "deltaLatitude", to: -mapPolygon.visualLatitude }], 1000)
    animation.events.on("animationended", function() {
      mapChart.zoomToMapObject(mapPolygon, getZoomLevel(mapPolygon));
    })
  }

  // calculate zoom level (default is too close)
  function getZoomLevel(mapPolygon) {
    var w = mapPolygon.polygon.bbox.width;
    var h = mapPolygon.polygon.bbox.width;
    // change 2 to smaller walue for a more close zoom
    return Math.min(mapChart.seriesWidth / (w * 2), mapChart.seriesHeight / (h * 2))
  }

  // show world data
  function showWorld() {
    currentCountry = "Pune";
    currentPolygon = undefined;
    resetHover();

    if (countryDataTimeout) {
      clearTimeout(countryDataTimeout);
    }

    // make all inactive
    polygonSeries.mapPolygons.each(function(polygon) {
      polygon.isActive = false;
    })

    updateCountryName();

    updateTotals(currentIndex);
    mapChart.goHome();
  }

  // updates country name and date
  function updateCountryName() {
    var currentDate = new Date();
    countryName.text = currentCountry + ", " + mapChart.dateFormatter.format(currentDate, "MMM dd, yyyy");
  }

  // update total values in buttons
  function updateTotals(index) {
    if (!isNaN(index)) {
      var di = covid_maharashtra[index];
      updateCountryName();
      currentIndex = index;
    }
  }

  // update map data
  function updateMapData(data) {
    //modifying instead of setting new data for a nice animation
    //bubbleSeries.dataItems.each(function(dataItem) {
      //dataItem.dataContext.confirmed = 0;
    //})

    maxPC = {confirmed: 0};

    for (var i = 0; i < data.length; i++) {
      var di = data[i];
      //var image = bubbleSeries.getImageById(di.id);
      var polygon = polygonSeries.getPolygonById(di.id);

     // if (image) {
     //   var population = Number(populations[image.dataItem.dataContext.id]);

  //      image.dataItem.dataContext.confirmed = di.confirmed;
    //  }

      if (polygon) {
        polygon.dataItem.dataContext.confirmedPC = di.confirmed / population * 1000000;

        if (population > 100000) {
          if (polygon.dataItem.dataContext.confirmedPC > maxPC.confirmed) {
            maxPC.confirmed = polygon.dataItem.dataContext.confirmedPC;
          }
        }
      }

      //bubbleSeries.heatRules.getIndex(0).maxValue = maxPC[currentType];
      //bubbleSeries.heatRules.getIndex(1).maxValue = maxPC[currentType];
      polygonSeries.heatRules.getIndex(0).maxValue = maxPC[currentType];

      //bubbleSeries.invalidateRawData();
      polygonSeries.invalidateRawData();
    }
  }

  // capitalize first letter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  function handleImageOver(event) {
    rollOverCountry(polygonSeries.getPolygonById(event.target.dataItem.id));
  }

  function handleImageOut(event) {
    rollOutCountry(polygonSeries.getPolygonById(event.target.dataItem.id));
  }

  function handleImageHit(event) {
    selectCountry(polygonSeries.getPolygonById(event.target.dataItem.id));
  }

  function handleCountryHit(event) {
    selectCountry(event.target);
  }

  function handleCountryOver(event) {
    rollOverCountry(event.target);
  }

  function handleCountryOut(event) {
    rollOutCountry(event.target);
  }

  function resetHover() {
    polygonSeries.mapPolygons.each(function(polygon) {
      polygon.isHover = false;
    })

    //bubbleSeries.mapImages.each(function(image) {
      //image.isHover = false;
    //})
  }

  container.events.on("layoutvalidated", function() {
    updateTotals(currentIndex);
  });

  // set initial data and names
  updateCountryName();
  changeDataType("confirmed");
  populateCountries(countryIndexMap);


  function updateCountryTooltip() {
    polygonSeries.mapPolygons.template.tooltipText = "[bold]{name}: {value.formatNumber('#.')}[/]\n[font-size:10px]" + currentTypeName + " per million"
  }

  //Number with Commas for Population Formatting

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  /**
   * Country/state list on the right
   */

  function populateCountries(list) {
    var table = $("#areas tbody");
    table.find(".area").remove();
    for (var i = 0; i < list.length; i++) {
      var area = list[i];
      var tr = $("<tr>").addClass("area").data("areaid", area.id).appendTo(table).on("click", function() {
        selectCountry(polygonSeries.getPolygonById($(this).data("areaid")));
      }).hover(function() {
        rollOverCountry(polygonSeries.getPolygonById($(this).data("areaid")));
      });
            if(area.zone=="red"){
              $("<td>").addClass("red").appendTo(tr).html(area.zone.toUpperCase());
      }
      else if(area.zone=="orange"){
              $("<td>").addClass("orange").appendTo(tr).html(area.zone.toUpperCase());
      }
      else if(area.zone=="yellow"){
              $("<td>").addClass("yellow").appendTo(tr).html(area.zone.toUpperCase());
      }
      else if(area.zone=="green"){
              $("<td>").addClass("green").appendTo(tr).html(area.zone.toUpperCase());
      }

      $("<td>").appendTo(tr).data("areaid", area.id).html(area.id);
      $("<td>").addClass("value").appendTo(tr).html(area.confirmed);
      $("<td>").addClass("value").appendTo(tr).html(numberWithCommas(populations[area.id]));
    }
    $("#areas").DataTable({
      "paging": false,
      "select": true,
    'columnDefs': [ {
        'targets': [3], // column index (start from 0)
        'orderable': false, // set orderable false for selected columns
     }]}).column("2")
      .order("desc")
      .draw();;
  }


});