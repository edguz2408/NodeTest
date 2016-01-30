$(document).ready(function() {
  console.log('Ready!');
  $('#tableDiv').hide();
  $('#content').on('click', '#btnSearch', doSearch);

});

function doSearch() {
  var searchVal = $('#inputSearch').val();

  //Cleaning results table for new searches
  $('#tableDiv table tbody tr').remove();

  searchAmazon(searchVal);
  searcheBay(searchVal);
}

function search() {

  var searchVal = $('#inputSearch').val();

  var tableContent = '';
  var urls = [1, 2];

  $.each(urls, function(i, url) {
    $.ajax({
      type: "GET",
      url: "/scrape/" + searchVal + ',' + i
    }).done(function(response) {

      $.each(response, function(index) {

        if (this.title != null) {
          tableContent += '<tr>';
          if (this.website == 'Amazon') {
            tableContent += '<td><img srcset="' + this.image + '"/></td>';
            tableContent += '<td>' + this.title + '</td>';
            tableContent += '<td>' + this.price + '</td>';
            tableContent += '<td><a href=' + this.url + '>View Item</a></td>';
            tableContent += '<td>' + this.website + '</td>';
            tableContent += '</tr>';
          } else if (index < 20) {

            tableContent += '<td><img src="' + this.image + '"/></td>';
            tableContent += '<td>' + this.title + '</td>';
            tableContent += '<td>' + this.price + '</td>';
            tableContent += '<td><a href=' + this.url + '>View Item</a></td>';
            tableContent += '<td>' + this.website + '</td>';
            tableContent += '</tr>';

          }


        }

      });
      $('#tableDiv').show();
      $('#tableDiv table tbody').html(tableContent);
      //console.log(tableContent);

    });

  });

}

function completeTable(objects) {

  if (objects.length > 0) {
    var tableContent = '';
    console.log(objects);
    $.each(objects, function(i, item) {
      console.log(item);
      tableContent += '<tr>';
      tableContent += '<td><img src="' + item.imageUrl + '"/></td>';
      tableContent += '<td>' + item.title + '</td>';
      tableContent += '<td>' + item.price + '</td>';
      tableContent += '<td><a href="' + item.url + '" target="blank">View Item</a></td>';
      tableContent += '</tr>';

    });
    $('#tableDiv table tbody').append(tableContent);
    $('#tableDiv').show();

  }

}

function searchAmazon(searchVal) {

  var tableContent = '';
  var objects = [];
  $.ajax({
    type: "GET",
    url: '/amazon/' + searchVal
  }).done(function(response) {
    //  console.log(response);
    //    console.log(response.Items.Item[0].OfferSummary.LowestNewPrice.FormattedPrice);
    $.each(response.Items.Item, function(i, item) {

      objects.push({
        imageUrl: item.MediumImage.URL,
        title: item.ItemAttributes.Title,
        price: item.OfferSummary.LowestNewPrice.FormattedPrice,
        url: item.DetailPageURL
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
  }).fail(function(){
    console.error('Something wrong happened'); 

  });

}

function showeBayResults(root) {
  var items = root.findItemsByKeywordsResponse[0].searchResult[0].item || [];
  var objects = [];


  $.each(items, function(i, item) {
    objects.push({
      imageUrl: item.galleryURL,
      title: item.title,
      price: '$' + item.sellingStatus[0].currentPrice[0].__value__,
      url: item.viewItemURL
    });

  });
  completeTable(objects);
}
