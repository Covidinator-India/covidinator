const axios = require('axios');
fs = require('fs');

//var states = require('./states_daily');
//console.log(typeof states.getStates);
//states.getStats();

var covid_total_timeline  = [];
var covid_world_timeline  = [];
var india_states_daily  = [];
var currentdate = formatDate(new Date());

async function makeGetRequest() {
  
  let res = await axios.get('https://api.covid19india.org/data.json');

  let data = res.data;
	    var array = [];

	for(var i = 0; i < data.cases_time_series.length; i++) {
	    var obj = data.cases_time_series[i];
	    if(formatDate(data.cases_time_series[i].date+"2020")>"2020-03-15"){
	    Object.assign(array, [{confirmed: parseInt(obj.totalconfirmed),"deaths":parseInt(obj.totaldeceased),"recovered":parseInt(obj.totalrecovered),"date":formatDate(data.cases_time_series[i].date+"2020")}]);
	    var newArr = covid_total_timeline.concat(array);
	    covid_total_timeline = newArr;
	  }
	}
	var lastentry = covid_total_timeline.length-1;
	var lastdate = covid_total_timeline[lastentry].date;
	//console.log(currentdate);
	//console.log(data.statewise[0].confirmed);
	if (lastdate<currentdate){
		Object.assign(array, [{confirmed: parseInt(data.statewise[0].confirmed),"deaths":parseInt(data.statewise[0].deaths),"recovered":parseInt(data.statewise[0].recovered),"date":currentdate}]);
	    var newArr = covid_total_timeline.concat(array);
	    covid_total_timeline = newArr;
	}
	//console.log(covid_total_timeline[lastentry].date);
	//console.log(covid_total_timeline[34]);


		fs.writeFile('../data/js/india_total_timeline.js', 'var covid_total_timeline = '+ JSON.stringify(covid_total_timeline), function (err) {
		  if (err) return console.log(err);
		  //console.log('Hello World > helloworld.txt');
		});
}

async function getStateStats() {
  
  let res = await axios.get('https://api.covid19india.org/states_daily.json');

  let data = res.data;
  var confirmed = [];
  var recovered = [];
  var deceased = [];

  console.log(data.states_daily);

	for(var i = 0; i < data.states_daily.length; i++) {
	    var obj = data.states_daily[i];
	    if (obj.status=="Confirmed"){
	    	for (let [key, value] of Object.entries(obj)) {
			  if((key!="date") && (key !="status") && (key!="tt")){
			  		//console.log(`${key}: ${value}`);
			var array = [];
			Object.assign(array, [{confirmed: value,id:"IN-"+key.toUpperCase(),date:formatDate(obj.date)}]);
		    var newArr = confirmed.concat(array);
		    confirmed = newArr;
			  }
			}
	    }
	    else if (obj.status=="Recovered"){
				    	for (let [key, value] of Object.entries(obj)) {
						  if((key!="date") && (key !="status")){
						  		//console.log(`${key}: ${value}`);
						var array = [];
						Object.assign(array, [{recovered: value,id:"IN-"+key.toUpperCase(),date:formatDate(obj.date)}]);
					    var newArr = recovered.concat(array);
					    recovered = newArr;
						  }
						}
				    }

	    else if (obj.status=="Deceased"){
		    	for (let [key, value] of Object.entries(obj)) {
				  if((key!="date") && (key !="status")){
				  		//console.log(`${key}: ${value}`);
				var array = [];
				Object.assign(array, [{deceased: value,id:"IN-"+key.toUpperCase(),date:formatDate(obj.date)}]);
			    var newArr = deceased.concat(array);
			    deceased = newArr;
				  }
				}
		    }


	}
		//console.log((confirmed[1038]));
		//console.log((recovered[1038]));
		//console.log((deceased[1038]));
		var x=0;
		var list = [];
		var listbuffer = [];
		var covidarray = [];
		for(var z = 0; z < confirmed.length; z++){
			if(x==38){
				x=0;
				Object.assign(covidarray, [{"date": confirmed[z].date,"list":list}]);
			    var newArr = india_states_daily.concat(covidarray);
			    india_states_daily = newArr;
			list = [];
			}
			else if(x<=37){
				Object.assign(listbuffer, [{"confirmed": confirmed[z].confirmed,"deaths":deceased[z].deceased,"recovered":recovered[z].recovered,"id":confirmed[z].id}]);
			    var newArr = list.concat(listbuffer);
			    list = newArr;
			    x=x+1;
			}
		}
		//console.log(covid_world_timeline);
		//		fs.writeFile('india_world_timeline.js', 'var covid_world_timeline = '+JSON.stringify(covid_world_timeline), function (err) {
		  //if (err) return console.log(err);
		  //console.log('Hello World > helloworld.txt');
		//});

		fs.writeFile('../data/js/india_states_daily.js', 'var covid_world_timeline = '+JSON.stringify(india_states_daily), function (err) {
		  if (err) return console.log(err);
		  //console.log('Hello World > helloworld.txt');
		});
}

async function getStateStatsTimeline() {
  
  let res = await axios.get('https://api.covid19india.org/states_daily.json');

  let data = res.data;
  var confirmed = [];
  var recovered = [];
  var deceased = [];

  //console.log(data.states_daily);

	for(var i = 0, d = 1; i < data.states_daily.length; i++) {
	    	var obj = data.states_daily[i];
				if(d==1){
			    	for (let [key, value] of Object.entries(obj)) {
					  if((key!="date") && (key !="status") && (key!="tt")){
					  		//console.log(`${key}: ${value}`);
					var array = [];
					if(value==""){
						value=0;
					}
					Object.assign(array, [{confirmed: parseInt(value),id:"IN-"+key.toUpperCase(),date:formatDate(obj.date)}]);
				    var newArr = confirmed.concat(array);
				    confirmed = newArr;
					  }
					}
	    		 d++;
	    	}
	    	else if(d==2){
			    	for (let [key, value] of Object.entries(obj)) {
					  if((key!="date") && (key !="status") && (key!="tt")){
					  		//console.log(`${key}: ${value}`);
					var array = [];
					if(value==""){
						value=0;
					}
					Object.assign(array, [{recovered: parseInt(value),id:"IN-"+key.toUpperCase(),date:formatDate(obj.date)}]);
				    var newArr = recovered.concat(array);
				    recovered = newArr;
					  }
					}
	    		d++;
	    	}
	    	else if(d==3){
				    	for (let [key, value] of Object.entries(obj)) {
					  if((key!="date") && (key !="status") && (key!="tt")){
					  		//console.log(`${key}: ${value}`);
					var array = [];
					if(value==""){
						value=0;
					}
					Object.assign(array, [{deceased: parseInt(value),id:"IN-"+key.toUpperCase(),date:formatDate(obj.date)}]);
				    var newArr = deceased.concat(array);
				    deceased = newArr;
					  }
					}
	    		d=1;
	    	}
	   
	}
	
		//console.log((parseInt(confirmed[38].confirmed)+parseInt(confirmed[75].confirmed)));
		//console.log((confirmed[74]));
		//console.log((confirmed[111]));
		//console.log(JSON.stringify(confirmed));

		//compound values - diff of 37
		var n = 0;
		for(var b = 0; b < confirmed.length-37; b++){
			n = b + 37;
			//console.log("n="+n);
			if(n<=confirmed.length){
			confirmed[n].confirmed=parseInt(confirmed[b].confirmed) + parseInt(confirmed[n].confirmed);
			recovered[n].recovered=parseInt(recovered[b].recovered) + parseInt(recovered[n].recovered);
			deceased[n].deceased=parseInt(deceased[b].deceased) + parseInt(deceased[n].deceased);
			}
		}

		var x=0;
		var list = [];
		var listbuffer = [];
		var covidarray = [];
		for(var z = 0; z < confirmed.length; z++){
			if(x==38){
				x=0;
				Object.assign(covidarray, [{"date": confirmed[z].date,"list":list}]);
			    var newArr = covid_world_timeline.concat(covidarray);
			    covid_world_timeline = newArr;
			list = [];
			}
			else if(x<=37){
				Object.assign(listbuffer, [{"confirmed": confirmed[z].confirmed,"deaths":deceased[z].deceased,"recovered":recovered[z].recovered,"id":confirmed[z].id}]);
			    var newArr = list.concat(listbuffer);
			    list = newArr;
			    x=x+1;
			}
		}
		//console.log(covid_world_timeline);
		var lastentry = covid_world_timeline.length-1;
		console.log(covid_world_timeline[lastentry].date);
		//if stats not updated
		if (covid_world_timeline[lastentry].date<currentdate){
			//console.log("test");
			let res = await axios.get('https://api.covid19india.org/data.json');

		    let data = res.data;
		    list=[];
		    //console.log(data.statewise.length);

		    for(var m = 0; m < data.statewise.length; m++) {
		    	var obj = data.statewise[m];
		    	//console.log(obj.active);
		    	if(obj.statecode !="TT"){
				Object.assign(listbuffer, [{"confirmed": parseInt(obj.confirmed),"deaths":parseInt(obj.deaths),"recovered":parseInt(obj.recovered),"id":"IN-"+obj.statecode}]);
			    var newArr = list.concat(listbuffer);
			    list = newArr;
				}
		    }

			    Object.assign(covidarray, [{"date": currentdate,"list":list}]);
			    var newArr = covid_world_timeline.concat(covidarray);
			    covid_world_timeline = newArr;

		}

		//		fs.writeFile('india_world_timeline.js', 'var covid_world_timeline = '+JSON.stringify(covid_world_timeline), function (err) {
		  //if (err) return console.log(err);
		  //console.log('Hello World > helloworld.txt');
		//});

		fs.writeFile('../data/js/india_states_timeline.js', 'var covid_world_timeline = '+JSON.stringify(covid_world_timeline), function (err) {
		  if (err) return console.log(err);
		  //console.log('Hello World > helloworld.txt');
		});
}

async function getMaharashtra() {
  
  let res = await axios.get('https://api.covid19india.org/v2/state_district_wise.json');

  let data = res.data;
  var districts = [];
  //console.log(data.cases_time_series);
  	for(var i = 0; i < data.length; i++) {
	for (let [key, value] of Object.entries(data[i])) {
	  if(value=="Maharashtra"){
	  		//console.log(`${key}: ${value}`);
		var array = [];
		var z;
		for(var x = 0; x < data[i].districtData.length; x++){
			if(data[i].districtData[x].confirmed==0){
				z = "green";
			}
			else if(data[i].districtData[x].confirmed <=20){
				z = "yellow";
			}
			else if(data[i].districtData[x].confirmed <=100){
				z = "orange";
			}
			else {
				z = "red";
			}
			districts.push({id:data[i].districtData[x].district,confirmed:data[i].districtData[x].confirmed,zone:z})
		}
		//array.push(data[i].districtData);
		//console.log(districts);
		}
	}
}
		//console.log((covid_total_timeline));
		fs.writeFile('../data/js/MH_districts.js', 'var covid_maharashtra = '+ JSON.stringify(districts), function (err) {
		  if (err) return console.log(err);
		  //console.log('Hello World > helloworld.txt');
		});
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
//getStateStats();
getStateStatsTimeline();
makeGetRequest();
getMaharashtra();