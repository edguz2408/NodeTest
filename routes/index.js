var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');



/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});


router.get('/scrape/:url', function(req, res) {
    var url = req.params.url;
    console.log(url);
    request(url, function(error, response, html) {
      if (!error) {
        var $ = cheerio.load(html);
        
        var objs = [];
        var title, price, url;
        
        $('.s-item-container').each(function(i, element) {
          var data = $(element);

          if (data.find('h2.s-access-title').length > 0)
            title = data.find('h2.s-access-title').text();

          if (data.find('span.a-color-price').length > 0)
            price = data.find('span.a-color-price').eq(0).text();

          if (data.find('a.a-link-normal').length > 0)
            url = data.find('a.a-link-normal').attr('href');


          objs.push({
            'title': title,
            'price': price,
            'url': url
          });


        });

        $('.sresult').each(function(i, element) {
          var data = $(element);

          if (data.find('a.vip').length > 0)
            title = data.find('a.vip').text();

          objs.push({
            'title': title,
            'price': 0,
            'url': 'N/A'
          });

        });
        
        res.json(objs);

      }
        
    });
   

});




module.exports = router;
