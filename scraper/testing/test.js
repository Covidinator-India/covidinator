var fs = require('fs'),
    path = require('path'),    
    filePath = path.join(__dirname, 'toscrape.html'),
    cheerio = require('cheerio'),
    axios = require('axios');

fs.readFile(filePath, {encoding: 'utf-8'}, async function(err,data){
    if (!err) {
        //console.log('received data: ' + data);

    let $ = cheerio.load(data);
    let list = [];
    let badgeo = [];
    //let title = $('#hs-hotspot-id-66');
    //console.log(title.text());
    //$('.hs-tab-list-item').each(function (i, e) {
      //  centers[i] = $(this).$('.hs-place-summary').text();
    //});

      const centers = $('.hs-tab-list-item');

      // We now loop through all the elements found
      for (let i = 0; i < centers.length; i++) {
        // Since the URL is within the span element, we can use the find method
        // To get all span elements with the `s1` class that are contained inside the
        // pre element. We select the first such element we find (since we have seen that the first span
        // element contains the URL)
        var name = $(centers[i]).find('h3')[0];
        var address = $(centers[i]).find('.hs-address');
        var type = $(centers[i]).find('a');
        //const address = $(centers[i]).find('hs-address')[0];

        // We proceed, only if the element exists
        if (name) {
          // We wrap the span in `$` to create another cheerio instance of only the span
          // and use the `text` method to get only the text (ignoring the HTML)
          // of the span element
          name = $(name).text();
          address = address.text();
          if(type.attr('href').includes('15-government-laboratories')){
            type = "GOV";
          }
          else if(type.attr('href').includes('16-private-laboratories')){
            type = "PRIVATE";
          }
          else if(type.attr('href').includes('17-collection-sites')){
            type = "COLLECTION";
          }

          // We then print the text on to the console
          console.log(name);
          console.log(address);
          console.log(type);
          var pincode = address.match("\\d{6}");
          list.push({name:name.trim(),address:address.trim(),type:type,pin:pincode,city:"",state:"",lat:"",lng:"",place_id:"",geo:""});
        }
      }

      for (let i = 0; i < list.length; i++) {
       await getPIN(i,list[i].pin);
       await geocode(i,list[i].address);
      }

      async function getPIN(i,pin){
        let res = await axios.get('https://pintasticapi.in/pincode?code='+pin).then(resp=>{
        let data = resp.data;
       // console.log(data);
        list[i].city = data.city;
        list[i].state = data.state;
        console.log(list[i]);
        })  
        .catch(error=>{

        });
           }

      async function geocode(i,address){
        //let address = "AIIMS Campus Rd, Saket Nagar, Habib Ganj, 462026 Bhopal, Madhya Pradesh , India";
        let res = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?address='+ address + '&key=AIzaSyA7j6wovH2E8kDPUJAe85UYMhA1-pl4Tzw').then(resp=>{
        let data = resp.data;
       // console.log(data);
        if(data.status=="OK"){
            list[i].lat = data.results[0].geometry.location.lat;
            list[i].lng = data.results[0].geometry.location.lng;
            list[i].place_id = data.results[0].place_id;
            list[i].geo = "OK";
          }
          else if(data.status !="OK") {
            list[i].geo = {error:"failed",message: data.status};
          }
        console.log(list[i]);
        })  
        .catch(error=>{

        });
        }


      fs.writeFile('../../data/js/india_test_centers.js', 'var test_centers = '+ JSON.stringify(list), function (err) {
          if (err) return console.log(err);
          //console.log('Hello World > helloworld.txt');
        });

    //console.log(centers);

    } else {
        console.log(err);
    }
});