var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/scrape', function(req, res){
  
  url = 'http://www.imdb.com/title/tt1229340/';
  
  request(function(error, response, html){
    if(!error){
      
      var $ = cheerio.load(html);
      
      var title, release, rating;
      
      var json = {title : "", release : "", rating : ""};
      
      $('.header').filter(function() {
        
        var data = $(this);
        
        title = data.children().first().text();
        release = data.children().last().children().text();
        
        json.title = title;
        json.release = release;
        
        
         $('.star-box-giga-star').filter(function() {
          
          var data = $(this);
          
          rating = data.text();
          
          json.rating = rating;
        });
        
      });
    }
    
    fs.writeFile('output.json', JSON.stringify(json, null,4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    });
    
  });
  
  
});

module.exports = router;
