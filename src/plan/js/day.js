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
    option.value= `${dayOfWeek}`;
    option.text = `Average ${dayOfWeek} (this year)`;
    selectElement.add(option);
}

function updateSelectOptions(selectedDate) {
    const selectElement = document.getElementById('dayOfWeekSelect');
    const dayOfWeek = getDayOfWeek(selectedDate);

    var option = selectElement.options[2];
    option.value= `${dayOfWeek}`;
    option.text = `Last ${dayOfWeek}`;

    var option = selectElement.options[3];
    option.value= `${dayOfWeek}`;
    option.text = `Average ${dayOfWeek} (this year)`;
}

// Listener for datepicker change
document.getElementById('datepicker').addEventListener('changeDate', function() {
    const selectedDate = this.value;
    console.log(selectedDate);
    updateSelectOptions(selectedDate);
});

// Initialize with current day
initializeSelectOptions(new Date());