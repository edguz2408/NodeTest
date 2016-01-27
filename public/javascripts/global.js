$(document).ready(function() {
  console.log('Ready!');

  $('#content').on('click', '#btnSearch', search);

});

function search() {

  var searchVal = $('#inputSearch').val();

  $.ajax({
    type: "GET",
    url: "/scrape/" + searchVal
  }).done(function(response) {
    var tableContent = '';

    $.each(response, function() {

      if (this.title != null) {
        tableContent += '<tr>';
        tableContent += '<td>' + this.title + '</td>';
        tableContent += '<td>' + this.price + '</td>';
        tableContent += '<td><a href=' + this.url + '>View Item</a></td>';
        tableContent += '</tr>';
      }

    });
    $('#tableDiv table tbody').html(tableContent);
    //console.log(tableContent);

  });

}
