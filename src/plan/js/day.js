function getDayOfWeek(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(date).getDay()];
}

function updateSelectOptions(selectedDate) {
    const selectElement = document.getElementById('dayOfWeekSelect');
    <option>(Day of Week) Season Average</option>
    if (selectedDate) {
        const dayOfWeek = getDayOfWeek(selectedDate);
        var option = document.createElement('option');
        option.text = `Last ${dayOfWeek}`;
        selectElement.add(option);

        option = document.createElement('option');
        option.text = `Average ${dayOfWeek} (this year)`;
        selectElement.add(option);
    }
}

// Listener for datepicker change
document.getElementById('datepicker').addEventListener('change', function() {
    const selectedDate = this.value;
    updateSelectOptions(selectedDate);
});

// Initialize with datepicker value
updateSelectOptions(document.getElementById('datepicker').value);