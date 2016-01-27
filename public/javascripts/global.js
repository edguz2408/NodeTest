$(document).ready(function() {
  console.log('Ready!');

  $('#content').on('click', '#btnSearch', search);

});

function search() {

  var searchVal = $('#inputSearch').val();
   var urls = ['http://www.amazon.com/s/ref=nb_sb_ss_c_0_9?url=search-alias%3Daps&field-keywords=' + searchVal,
    'http://www.ebay.com/sch/i.html?_from=R40&_trksid=p2050601.m570.l1311.R1.TR12.TRC2.A0.H0.Xwact.TRS0&_nkw=' + searchVal
  ];
  var tableContent = '';

$.each(urls, function(i, url) {
    $.ajax({
    type: "GET",
    url: "/scrape/" + url
  }).done(function(response) {

    $.each(response, function() {

      if (this.title != null) {
        tableContent += '<tr>';
        tableContent += '<td>' + this.title + '</td>';
        tableContent += '<td>' + this.price + '</td>';
        tableContent += '<td><a href=' + this.url + '>View Item</a></td>';
        tableContent += '</tr>';
      }

    });

  });
  
});

 $('#tableDiv table tbody').html(tableContent);

}
