$(document).ready(function() {
  console.log('Ready!');

  $('#content').on('click', '#btnSearch', search);

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
    $('#tableDiv table tbody').html(tableContent);
    console.log(tableContent);

  });

});



}
