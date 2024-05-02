$(document).ready(function(){
    function initializeDatepicker(parkId) {
      $('#datepicker').datepicker({
        format: 'yyyy-mm-dd',
        startDate: new Date(),
        autoclose: true,
        beforeShowDay: function(date){
          return isParkOpen(date, parkId);
        }
      });
    }
    // Let's re-use to instead just issue a warning if we can't confirm the park will be open
    // Schedule data not always complete
    function isParkOpen(date, parkId) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1
      // adjust to mm
      var month = month < 10 ? '0' + month : month;
      var day = date.getDate();
      // adjust to dd
      var day = day < 10 ? '0' + day : day;
  
      return $.ajax({
        url: 'https://api.themeparks.wiki/v1/entity/' + parkId + '/schedule/' + year + '/' + month,
        method: 'GET',
        async: false,
        success: function(response) {
          var openDates = response.dates;
          var formattedDate = year + '-' + month + '-' + day;
          if (openDates.includes(formattedDate)) {
            // Park open
            return {enabled: true};
          } else {
            // Park not open
            return {enabled: false};
          }
        },
        error: function() {
          console.log('Error occurred while fetching park schedule');
        }
      });
    }
  
    initializeDatepicker('7502308a-de08-41a3-b997-961f8275ab3c');
  });
  