
var objects = [];

$(document).ready(function() {


  console.log('Ready!');
  $('#tableDiv').hide();


  var currentLocation = window.location.href;

  console.log(currentLocation);
  console.log(String(currentLocation).split('='));
  var searchVal = String(currentLocation).split('=')[1];

  doSearch(searchVal);

  /*$('#content').on('click', function(){
    var searchVal = $('#inputSearch').val();
    console.log(searchVal);
    doSearch(searchVal);
  });*/

});

function predicatBy(prop){
   return function(a,b){
      if( parseInt(a[prop]) > parseInt(b[prop])){
          return 1;
      }else if( parseInt(a[prop]) < parseInt(b[prop]) ){
          return -1;
      }
      return 0;
   }
}

//Usage
//yourArray.sort( predicatBy("age") );


function doSearch(searchVal) {
  console.log('clicked');

  //window.location.href = "/results/" + searchVal;
  console.log('Test!');
  //Cleaning results table for new searches
  $('#tableDiv table tbody tr').remove();

  searchAmazon(searchVal);
  searcheBay(searchVal);
  searchBestBuy(searchVal);


  if ($('#chbxShoes').prop('checked')) {
    search(searchVal + ' shoes');
  } else {
    search(searchVal);
  }
}

function search(searchVal) {

  var spans = '';
  var urls = ['6pm', 'Swappa'];

  $.each(urls, function(i, url) {
    $.ajax({
      type: "GET",
      url: "/scrape/" + searchVal + ',' + url
    }).done(function(response) {

      $.each(response, function(index, item) {
        //console.log(response);
        if (index <= 10) {
          objects.push({
            title: item.title,
            url: item.url,
            imageUrl: item.image,
            price: item.price,
            website: item.website

          });
        }

      });
      completeTable(objects);

    });

  });

}

function completeTable(objects) {

  if (objects.length > 0) {


    console.log(objects.sort( predicatBy("price") ));


    var spans = '';
    //console.log(objects);
    $.each(objects, function(i, item) {
      //console.log(item);
      spans += '<li class="wrapper-3">';
      spans += '<div class="row">';
      spans += '<div class="large-4 small-12 columns">'
      spans += '<figure><img src="' + item.imageUrl + '"/></figure>'
      spans += '</div>'

      //title div
      spans += '<div class="large-5 small-8 columns">'
      spans += '<div class="col-middle">';
      spans += '<h2 class="text secondary"><a href="' + item.url + '" target="blank" >'+item.title+'</a></h2>';
      spans += '</div>';
      spans += '</div>';

      //Price
      spans += '<div class="large-3 small-4 columns">';
      spans += '<div class="col-right">';
      spans += '<p class="value primary">' + item.price + '</p>';
      spans += '<h4>' +item.website+'</h4>'
      spans += '<a href="' + item.url + '" target="blank" class="input button red secondary responsive" >View Item</a>';
      spans += '</div>';

      spans += '</div>';
      spans += '</li>';

    });

    $('#results').append(spans);
    $('#spanResults').text(' ' + $('#results').children().length);

  }

}

function searchAmazon(searchVal) {

  var spans = '';
  var image, title, price, url;

  $.ajax({
    type: "GET",
    url: '/amazon/' + searchVal
  }).done(function(response) {
      console.log(response);
    //    console.log(response.Items.Item[0].OfferSummary.LowestNewPrice.FormattedPrice);
    $.each(response.Items.Item, function(i, item) {

      if(item.MediumImage != undefined)
        image = item.MediumImage.URL;

      if(item.OfferSummary.LowestNewPrice != undefined)
        price = item.OfferSummary.LowestNewPrice.FormattedPrice;

      if(item.ItemAttributes != undefined)
        title = item.ItemAttributes.Title;

      if(item != undefined)
        url = item.DetailPageURL;

      objects.push({
        imageUrl: image,
        title: title,
        price: price,
        url: url,
        website: 'Amazon'
      });
    });
    completeTable(objects);
  });

}

function searcheBay(searchVal) {

  var url = "http://svcs.ebay.com/services/search/FindingService/v1";
  url += "?OPERATION-NAME=findItemsByKeywords";
  url += "&SERVICE-VERSION=1.0.0";
  url += "&SECURITY-APPNAME=EdGuzSof-a355-4c61-a5f3-f007ee44a00c";
  url += "&GLOBAL-ID=EBAY-US";
  url += "&RESPONSE-DATA-FORMAT=JSON";
  url += "&callback=showeBayResults";
  url += "&REST-PAYLOAD";
  url += "&keywords=" + searchVal;
  url += "&paginationInput.entriesPerPage=10";

  $.ajax({
    type: "GET",
    url: url
  }).done(function(response) {
    console.log('Result::Success');
  }).fail(function() {
    console.error('Something wrong happened');

  });

}

function showeBayResults(root) {
  var items = root.findItemsByKeywordsResponse[0].searchResult[0].item || [];


  $.each(items, function(i, item) {
    objects.push({
      imageUrl: item.galleryURL,
      title: item.title,
      price: '$' + item.sellingStatus[0].currentPrice[0].__value__,
      url: item.viewItemURL,
      website: 'eBay'
    });

  });
  completeTable(objects);
}

function searchBestBuy(searchVal){

  var APIKEY = 'pmsvxvvm28xfk7hfqck7rffq';


  $.ajax({
    type: "GET",
    url: '//api.bestbuy.com/v1/products(name='+ searchVal + '*)',
    data: {
      format: 'json',
      apiKey: APIKEY
    }
  }).done(function(response){
    $.each(response.products, function(i, item){
      objects.push({
        title : item.name,
        price : '$' + item.salePrice,
        url: item.url,
        imageUrl: item.mediumImage,
        website: 'Best Buy'
      });
    });

    completeTable(objects);
    console.log(response);


  });

}
