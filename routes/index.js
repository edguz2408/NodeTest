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

var results = [];

  
router.get('/scrape/:searchParam', function(req, res, next) {
 
 var urls = ['http://www.amazon.com/s/ref=nb_sb_ss_c_0_9?url=search-alias%3Daps&field-keywords=' + req.params.searchParam,
    'http://www.ebay.com/sch/i.html?_from=R40&_trksid=p2050601.m570.l1311.R1.TR12.TRC2.A0.H0.Xwact.TRS0&_nkw=' + req.params.searchParam
  ];
  
    request(urls[0], function(error, response, html) {
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
        
        callback(objs, res);

      }
        
    });
   

});




module.exports = router;
