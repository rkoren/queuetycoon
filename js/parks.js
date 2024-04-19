// Reference to the select element
const selectElement = document.getElementById('parkSelect');

// Fetch data from the API
fetch('https://api.themeparks.wiki/v1/destinations')
    .then(response => response.json())
    .then(data => {
    // Check if the data contains destinations
    if (data.destinations && data.destinations.length > 0) {
      // Collect all parks from all destinations
      const allParks = [];
      data.destinations.forEach(destination => {
        allParks.push(...destination.parks);
      });

      // Sort parks alphabetically by name
      allParks.sort((a, b) => a.name.localeCompare(b.name));

      // Populate the select element with sorted options
      allParks.forEach(park => {
        const option = document.createElement('option');
        option.value = park.id;
        option.text = park.name;
        if (park.name == "Carowinds") {
          option.selected = "selected";
        }
        selectElement.appendChild(option);
      });
    } else {
      console.error('No destinations found in the API response.');
    }
  })
  .catch(error => console.error('Error fetching data:', error));