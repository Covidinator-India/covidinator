var axios = require('axios');

 async function geocode(){
  let address = "Basement Hospital Building, #82, E.P.I.P. Area, Whitefield, 560066 Bangalore, Karnataka, India";
  let res = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?address='+ JSON.stringify(address) + '&key=AIzaSyA7j6wovH2E8kDPUJAe85UYMhA1-pl4Tzw');
        let data = res.data;
        console.log(data);
        //console.log(data.results[0].geometry.location.lat);
        //console.log(data.results[0].geometry.location.lng);
        //console.log(data.results[0].place_id);
        }
geocode();        

//https://maps.googleapis.com/maps/api/geocode/json?address=Basement Hospital Building, #82, E.P.I.P. Area, Whitefield, 560066 Bangalore, Karnataka, India&key=AIzaSyA7j6wovH2E8kDPUJAe85UYMhA1-pl4Tzw