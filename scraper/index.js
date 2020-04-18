const axios = require('axios');
fs = require('fs');

//var states = require('./states_daily');
//console.log(typeof states.getStates);
//states.getStats();

var covid_total_timeline  = [];
var covid_world_timeline  = [];
var india_states_daily  = [];

async function makeGetRequest() {
  
  let res = await axios.get('https://api.covid19india.org/data.json');

  let data = res.data;
  //console.log(data.cases_time_series);

	for(var i = 0; i < data.cases_time_series.length; i++) {
	    var obj = data.cases_time_series[i];
	    var array = [];
	    if(formatDate(data.cases_time_series[i].date+"2020")>"2020-03-15"){

	   
	    Object.assign(array, [{confirmed: parseInt(obj.totalconfirmed),"deaths":parseInt(obj.totaldeceased),"recovered":parseInt(obj.totalrecovered),"date":formatDate(data.cases_time_series[i].date+"2020")}]);
	    var newArr = covid_total_timeline.concat(array);
	    covid_total_timeline = newArr;
	  }
	}
		//console.log((covid_total_timeline));
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


	    //console.log(formatDate(obj.date));
	    //console.log(data.states_daily.length);
	    /*if (obj.status=="Confirmed"){
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
		    }*/


	
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
		//		fs.writeFile('india_world_timeline.js', 'var covid_world_timeline = '+JSON.stringify(covid_world_timeline), function (err) {
		  //if (err) return console.log(err);
		  //console.log('Hello World > helloworld.txt');
		//});

		fs.writeFile('../data/js/india_states_timeline.js', 'var covid_world_timeline = '+JSON.stringify(covid_world_timeline), function (err) {
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