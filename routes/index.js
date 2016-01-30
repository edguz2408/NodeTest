var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var aws = require("aws-lib");
var util = require('util');
var OperationHelper = require('apac').OperationHelper;


/* GET home page. */
router.get('/home', function(req, res, next) {
 // amazon();
  res.render('index', {
    title: 'Express'
  });
});

function amazon(keywords) {
  var prodAdv = aws.createProdAdvClient('AKIAJ52XGI37HZLUCGVQ', 'f13XFjpExe67oYqoMtuMq8lfNyzbABag3XM9d6gL', 'jlopezseguros-20');
  var searchParam = 'All';
  var options = {SearchIndex: searchParam, Keywords : keywords};
  console.log(keywords);
  prodAdv.call("ItemSearch", options, function(err, result){
    //console.log(result.Items.Item[0]);
    return(result);
  });
}

router.get('/amazon/:searchVal', function(req, res) {

 /* var keywords = req.params.searchVal;
  var opHelper = new OperationHelper({
	awsId : 'AKIAJ52XGI37HZLUCGVQ',
	awsSecret: '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',
	assocId: 'jlopezseguros-20'
  });
  
  opHelper.execute('ItemSearch', {
	'SearchIndex': 'All',
	'Keywords': keywords,
	'ResponseGroup': 'ItemAttributes,Offers'
  }, function(err, result) {
     	console.log(result.Items);
        res.send(result);
     
  });*/

  var param = req.params.searchVal;
  var prodAdv =  aws.createProdAdvClient('AKIAJ52XGI37HZLUCGVQ', 'f13XFjpExe67oYqoMtuMq8lfNyzbABag3XM9d6gL', 'jlopezseguros-20');
  var searchParam = 'All'; 
  var keywords = param;
  var options = {SearchIndex: searchParam, Keywords : keywords, ResponseGroup: 'ItemAttributes,Offers,Images'};
  //var results = [];

  prodAdv.call("ItemSearch", options, function(err, result){
	console.log(result.Items.Item[0].ASIN);
  	res.send(result);
	//var results = [];
//	for(var item in result.Items.Item){
//		console.log('Item::' +item);
//		console.log('ASIN::'+item.ASIN);
		//var itemOptions = {IdType: "ASIN", ItemId: result.Items.Item[0].ASIN};
		
		//prodAdv.call("ItemLookup", itemOptions, function(err, ItemResult){
			//console.log('Result::' + item );
			//console.log(ItemResult);
			//res.send(ItemResult);
			//results.push(ItemResult);
			
		//});
	});
	//}
	//console.log('Results::' + results);
	//res.send(results);*/
  });

 

//});

router.get('/scrape/:searchVal', function(req, res) {

  var values = String(req.params.searchVal).split(',');
  var search = values[0];
  var index = parseInt(values[1]);
  var urls = ['http://www.amazon.com/s/ref=nb_sb_ss_c_0_9?url=search-alias%3Daps&field-keywords=' + search,
    'http://www.ebay.com/sch/i.html?_from=R40&_trksid=p2050601.m570.l1311.R1.TR12.TRC2.A0.H0.Xwact.TRS0&_nkw=' + search
  ];

  console.log(search);
  console.log(index);
  console.log(urls[index]);

  request(urls[index], function(error, response, html) {
    if (!error) {

      var $ = cheerio.load(html);

      var objs = [];
      var title, price, url, image;

      $('li.s-result-item').each(function(i, element) {
        var data = $(element);

        if (data.find('h2.s-access-title').length > 0)
          title = data.find('h2.s-access-title').text();

        if (data.find('span.a-color-price').length > 0)
          price = data.find('span.a-color-price').eq(0).text();

        if (data.find('a.a-link-normal').length > 0){
          url = data.find('a.a-link-normal').attr('href');
        }
        image = data.find('img.s-access-image').attr('srcset');

        objs.push({
          'title': title,
          'price': price,
          'url': url,
          'website': 'Amazon',
          'image': image
        });


      });

      $('li.sresult').each(function(i, element) {
        var data = $(element);

        if (data.find('a.vip').length > 0){
          title = data.find('a.vip').text();
          url = data.find('a.vip').attr('href');
        }


        if(data.find('li.lvprice')){
          $('li.lvprice').find('div.medprc').remove();
          price = data.find('li.lvprice span.bold').eq(0).text();
        }

        if(data.find('a img.img').length > 0){
          image = data.find('img.img').attr('src');
        }

        objs.push({
          'title': title,
          'price': price,
          'url': url,
          'website': 'eBay',
          'image': image
        });

      });

      res.json(objs);

    }

  });


});




module.exports = router;
