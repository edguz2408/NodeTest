var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/scrape', function(req, res){
  
  url = 'http://www.amazon.com/s/ref=nb_sb_ss_c_0_9?url=search-alias%3Daps&field-keywords=hdmi+cable&sprefix=chromecast%2Caps%2C209';
  
  request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var title, price;
			var objs = [];
			//var json = { title : "", price : ""};
      
      //res.send(html);
      
      $('.a-size-medium, .a-color-price').each(function(i, element) {
        /*var data = $(element);
        title = data.text();
        json.title = title;*/
        
        var json {title : element.text(), price : element.text()}
        objs.push(json);
        
      });
      
      /*$('.a-size-base').filter(function() {
        var data = $(this);
        price = data.text();
        json.price = price;
      });*/
		
		}

		fs.writeFile('output.json', JSON.stringify(objs, null, 4), function(err){
        	console.log('File successfully written! - Check your project directory for the output.json file');
        })

      res.json(objs);
    })
  
  
});

module.exports = router;
