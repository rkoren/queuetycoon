// Reference to the select element
const selector = document.getElementById('parkSelect');

// Reference to the table body
const tableBody = document.getElementById('tableBody');

// Add event listener to the select element
selector.addEventListener('change', () => {
  // Clear existing table rows
  tableBody.innerHTML = '';

  // Get the selected park ID
  const selectedParkId = selectElement.value
  var parkOpen = false
  fetch(`https://api.themeparks.wiki/v1/entity/${selectedParkId}/schedule`)
    .then(response => response.json())
    .then(data => {
      if (data.schedule && data.schedule.length > 0) {
        // Get the current time
        const rn = new Date();
        const currentSchedule = data.schedule.filter(schedule => schedule.type && schedule.type == "OPERATING")[0];
        // Extract opening and closing times from the JSON
        const openingTime = new Date(currentSchedule.openingTime);
        const closingTime = new Date(currentSchedule.closingTime);
        if(rn >= openingTime && rn <= closingTime) {
          parkOpen = true
        }
      }
      // Fetch data from the live API based on the selected park ID
      fetch(`https://api.themeparks.wiki/v1/entity/${selectedParkId}/live`)
        .then(response => response.json())
        .then(data => {
          // Check if data is available
          if (data.liveData && data.liveData.length > 0) {
            // Filter attractions only
            var items = data.liveData.filter(item => item.entityType && item.entityType == "ATTRACTION");

            if(parkOpen){
              // Filter items with WaitTimes
              items = items.filter(item => item.queue && item.queue.STANDBY.waitTime !== null);

              // Populate the table with relevant information
              items.forEach(item => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = item.name;
                row.insertCell(1).textContent = item.status;
                row.insertCell(2).textContent = item.queue.STANDBY.waitTime.toString()
              });
            } else {
              items.forEach(item => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = item.name;
                row.insertCell(1).textContent = "Closed";
                row.insertCell(2).textContent = "Closed";
              });
            }
          } else {
            console.error('No data found for the selected park.');
          }
        })
      .catch(error => console.error('Error fetching live data:', error));
    })
    .catch(error => console.error('Error fetching schedule data:', error));
});
