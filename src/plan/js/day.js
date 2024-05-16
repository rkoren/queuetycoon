function getDayOfWeek(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(date).getDay()];
}

function initializeSelectOptions() {
    const currentDate = new Date();
    const currentDayOfWeek = getDayOfWeek(currentDate);
    const selectElement = document.getElementById('dayOfWeekSelect');
    const option = document.createElement('option');
    option.text = `Last ${currentDayOfWeek}`;
    selectElement.add(option);
}

function updateSelectOptions(selectedDate) {
    const selectElement = document.getElementById('dayOfWeekSelect');
    const dayOfWeek = getDayOfWeek(selectedDate);
    var option = document.createElement('option');
    option.text = `Last ${dayOfWeek}`;
    selectElement.add(option);

    option = document.createElement('option');
    option.text = `Average ${dayOfWeek} (this year)`;
    selectElement.add(option);
}

// Listener for datepicker change
document.getElementById('datepicker').addEventListener('change', function() {
    const selectedDate = this.value;
    updateSelectOptions(selectedDate);
});

// Initialize with current day
updateSelectOptions(new Date());