module.exports = {
  getStats: function () {
  	fs = require('fs');
    var states_list  = [];
	fs.readFile('india_finalised_unedited.json', function (err, data) {
	  if (err) throw err;
	  console.log(JSON.parse(data));
	  data = JSON.parse(data);
	  console.log("var am4geodata_data_states_us = { ");
	  	for(var i = 0; i < data['features'].length; i++) {
	  		console.log( "'" + data.features[i].id +"' : '" + data.features[i].properties.name + "',");
	    //var obj = data.features[i];
	    //var array = [];
	    //Object.assign(array, [{confirmed: obj.totalconfirmed,deaths:obj.totaldeceased,recovered:obj.totalrecovered,date:formatDate(data.cases_time_series[i].date+"2020")}]);
	    //var newArr = covid_total_timeline.concat(array);
	    //covid_total_timeline = newArr;
		}
		console.log("};")
	});
			
  },
  formatDate: function () {
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
};

var zemba = function () {
}