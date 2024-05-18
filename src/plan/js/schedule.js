var currentParkId;

function initializeDatepicker() {
  $('#datepicker').datepicker('destroy');
  $('#datepicker').datepicker({
    format: 'yyyy-mm-dd',
    startDate: new Date(),
    autoclose: true,
  });

  $('#datepicker').on('changeDate', function(e) {
    var selectedDate = e.date;
    checkParkSchedule(selectedDate, currentParkId);
  });
}  

function checkParkSchedule(date, parkId) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  // adjust to mm
  var monthStr = month < 10 ? '0' + month : month;
  var day = date.getDate();
  // adjust to dd
  var dayStr = day < 10 ? '0' + day : day;
  var formattedDate = year + '-' + monthStr + '-' + dayStr;

  $.ajax({
    url: 'https://api.themeparks.wiki/v1/entity/' + parkId + '/schedule/' + year + '/' + monthStr,
    method: 'GET',
    success: function(response) {
      var dates = response.schedule;
      const foundDate = dates.find(day => {
        return day.date === formattedDate && day.type === "OPERATING";
      });

      if (foundDate !== undefined) {
        return true;
      } else {
        alert("Cannot confirm park is open on this date!");
        return false;
      }
    },
    error: function() {
      console.log('Error occurred while fetching park schedule');
    }
  });
}

$(document).ready(function(){
  currentParkId = getLastUsedParkId();
  initializeDatepicker();
});
       
  