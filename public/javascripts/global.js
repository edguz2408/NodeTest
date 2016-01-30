$(document).ready(function() {
  console.log('Ready!');
  $('#tableDiv').hide();
  $('#content').on('click', '#btnSearch', searchAmazon);

});

function search() {

  var searchVal = $('#inputSearch').val();

  var tableContent = '';
  var urls = [1,2];

$.each(urls, function(i, url) {
    $.ajax({
    type: "GET",
    url: "/scrape/" + searchVal + ',' + i
  }).done(function(response) {

    $.each(response, function(index) {

      if (this.title != null) {
        tableContent += '<tr>';
        if(this.website == 'Amazon'){
          tableContent += '<td><img srcset="' + this.image + '"/></td>';
          tableContent += '<td>' + this.title + '</td>';
          tableContent += '<td>' + this.price + '</td>';
          tableContent += '<td><a href=' + this.url + '>View Item</a></td>';
          tableContent += '<td>' + this.website + '</td>';
          tableContent += '</tr>';
        } else if(index < 20){

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

 searchAmazon();

}

function searchAmazon(){
  var searchVal = $('#inputSearch').val();
  var tableContent = '';
  $.ajax({
    type:"GET",
    url : '/amazon/' + searchVal
  }).done(function(response){
   //  console.log(response);
 //    console.log(response.Items.Item[0].OfferSummary.LowestNewPrice.FormattedPrice);
     $.each(response.Items.Item, function(i, item){
	 console.log(item);
     	 tableContent += '<tr>';
	 tableContent += '<td><img src="' + item.MediumImage.URL + '"/></td>';
	 tableContent += '<td>' + item.ItemAttributes.Title + '</td>';         
        tableContent += '<td>' + item.OfferSummary.LowestNewPrice.FormattedPrice + '</td>';
         tableContent += '<td><a href="' + item.DetailPageURL + '">View Item</a></td>';
	 tableContent += '</tr>';
     });

     $('#tableDiv').show();
     $('#tableDiv table tbody').html(tableContent);

  });

}
