var currentParkId;

function initializeDatepicker() {
  $('#datepicker').datepicker('destroy');
  $('#datepicker').datepicker({
    format: 'yyyy-mm-dd',
    startDate: new Date(),
    autoclose: true,
  });

  $("#datepicker").val(formatDate(new Date()));


  $('#datepicker').on('changeDate', function(e) {
    checkParkSchedule(e.date, currentParkId);
    updateSelectOptions(e.date)
  });
}

function formatDate(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  // adjust to mm
  var monthStr = month < 10 ? '0' + month : month;
  var day = date.getDate();
  // adjust to dd
  var dayStr = day < 10 ? '0' + day : day;
  var formattedDate = year + '-' + monthStr + '-' + dayStr;
  return formattedDate
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

function getDayOfWeek(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(date).getDay()];
}

function initializeSelectOptions() {
  const selectElement = document.getElementById('dayOfWeekSelect');
  const dayOfWeek = getDayOfWeek(new Date());
  var option = document.createElement('option');
  option.value= `${dayOfWeek}`;
  option.text = `Last ${dayOfWeek}`;
  selectElement.add(option);

  option = document.createElement('option');
  option.value= "Yesterday";
  option.text = "Yesterday (Or last day of operation)";
  selectElement.add(option);

  option = document.createElement('option');
  option.value= `${dayOfWeek}`;
  option.text = `Average ${dayOfWeek} (This year)`;
  selectElement.add(option);
}

function updateSelectOptions(selectedDate) {
  const selectElement = document.getElementById('dayOfWeekSelect');
  const dayOfWeek = getDayOfWeek(selectedDate);

  var option = selectElement.options[0];
  option.value= `${dayOfWeek}`;
  option.text = `Last ${dayOfWeek}`;

  var option = selectElement.options[2];
  option.value= `${dayOfWeek}`;
  option.text = `Average ${dayOfWeek} (This year)`;
}

// Listener for datepicker change
document.getElementById('datepicker').addEventListener('changeDate', function() {
  const selectedDate = this.value;
  console.log(selectedDate);
  updateSelectOptions(selectedDate);
});

// Initialize with current day
initializeSelectOptions(new Date());