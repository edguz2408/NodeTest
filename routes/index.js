var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var j = $.noConflict();

j(document).ready(function() {
  j(document).on('click', '#btnSearch', search);
});

function search(){
  
  //url = 'http://www.imdb.com/title/tt1229340/';
  
  var searchValue = j('#inputSearch').val();
  url = 'http://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=' + searchValue;
  
  request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
      console.log(html);

			var title, release, rating;
			var json = { title : "", release : "", rating : ""};

			$('.header').filter(function(){
		        var data = $(this);
		        title = data.children().first().text();
		        release = data.children().last().children().text();

		        json.title = title;
		        json.release = release;
	        })

	        $('.star-box-giga-star').filter(function(){
	        	var data = $(this);
	        	rating = data.text();

	        	json.rating = rating;
	        })
		}

		fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
        	console.log('File successfully written! - Check your project directory for the output.json file');
        })

      res.send(JSON.stringify(json));
      })
  
  
}

module.exports = router;
