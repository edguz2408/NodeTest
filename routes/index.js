var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var aws = require("aws-lib");
var util = require('util');
//var OperationHelper = require('apac').OperationHelper;


/* GET home page. */
router.get('/home', function(req, res, next) {
  // amazon();
  res.render('index', {
    title: 'Express'
  });
});

router.get('/results/', function(req, res){
  var searchVal = req.body.inputSearch;
  console.log(searchVal);
  res.render('results', {
    searchParam : searchVal
  });
});

function amazon(keywords) {
  var prodAdv = aws.createProdAdvClient('AKIAJ52XGI37HZLUCGVQ', 'f13XFjpExe67oYqoMtuMq8lfNyzbABag3XM9d6gL', 'jlopezseguros-20');
  var searchParam = 'All';
  var options = {
    SearchIndex: searchParam,
    Keywords: keywords,
    Title: keywords
  };
  console.log(keywords);
  prodAdv.call("ItemSearch", options, function(err, result) {
    //console.log(result.Items.Item[0]);
    return (result);
  });
}

router.get('/amazon/:searchVal', function(req, res) {

  var param = req.params.searchVal;
  var prodAdv = aws.createProdAdvClient('AKIAJ52XGI37HZLUCGVQ', 'f13XFjpExe67oYqoMtuMq8lfNyzbABag3XM9d6gL', 'jlopezseguros-20');
  var searchParam = 'All';
  var keywords = param;
  var options = {
    SearchIndex: searchParam,
    Keywords: keywords,
    ResponseGroup: 'ItemAttributes,Offers,Images',
    VariationPage: 1
  };
  //var results = [];

  prodAdv.call("ItemSearch", options, function(err, result) {
    //console.log(result.Items.Item[0].ASIN);
    res.send(result);
  });

});

router.get('/scrape/:searchVal', function(req, res) {

  var values = String(req.params.searchVal).split(',');
  var search = values[0];;
  var index = values[1];

  var url;
  var containerClass;
  var priceClass;
  var titleClass;
  var urlClass;
  var imageClass;
  var productClass;

  switch (index) {
    case '6pm':
      url = 'http://www.6pm.com/' + search;
      containerClass = '.product';
      priceClass = 'span.price-6pm';
      titleClass = 'span.brandName';
      urlClass = '.product';
      imageClass = 'img.productImg';
      productClass = 'span.productName'
      break;
   case 'Swappa':
     url = 'https://swappa.com/search?q=' + search;
     containerClass = '.search_device_cell';
     priceClass = 'div.buttons a.btn-default';
     titleClass = 'div.title';
     urlClass = 'div.title a';
     imageClass = 'div.image img';
     break;

  }


  var object = {url: url, container: containerClass,
                price: priceClass, title: titleClass,
                url: urlClass, image: imageClass,
                res: res, scrape: url, product: productClass
              };


  scrape(object);


});

function scrape(object){



  request(object.scrape, function(error, response, html) {
    if (!error) {

      var $ = cheerio.load(html);

      var objs = [];
      var title, price, url, image, website;
      var partialUrl = String(object.scrape).split('com/');
      console.log(partialUrl);

      $(object.container).each(function(i, element) {
        var data = $(element);

        if (data.find(object.title).length > 0){
          title = data.find(object.title).text();
          if(object.product != undefined){
            title += '-'
            title += data.find(object.product).text();
          }

        }

        if (data.find(object.price).length > 0)
          price = data.find(object.price).text();


        if(data.attr('href') != undefined){
          //6pm
          url = partialUrl[0] + 'com/' + data.attr('href');
          website = '6pm';
        }else{
          //Swappa
          url = partialUrl[0] + 'com/' + data.find(object.url).attr('href');
          website = 'Swappa';
        }

        image = data.find(object.image).attr('src');

        if(price != undefined){
          objs.push({
            'title': title,
            'price': price,
            'url': url,
            'website': website,
            'image': image
          });
        }

      });

      object.res.json(objs);

    }

  });

}




module.exports = router;
