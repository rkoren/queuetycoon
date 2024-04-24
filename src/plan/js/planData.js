const selectElement = document.getElementById('parkSelect');
const tableBody = document.getElementById('tableBody');

function getParks() {
    if (selectElement.childElementCount === 0) {
        fetch('https://api.themeparks.wiki/v1/destinations')
            .then(response => response.json())
            .then(data => {
                if (data.destinations && data.destinations.length > 0) {
                    const allParks = [];
                    data.destinations.forEach(destination => {
                        allParks.push(...destination.parks);
                    });

                    allParks.sort((a, b) => a.name.localeCompare(b.name));

                    allParks.forEach(park => {
                        const option = document.createElement('option');
                        option.value = park.id;
                        option.text = park.name;
                        selectElement.appendChild(option);
                    });

                    const lastSelectedValue = localStorage.getItem('selectedParkId');
                    if (!lastSelectedValue) {
                        // default to Alton Towers?
                        selectElement.value = allParks[0].id;
                    } else {
                        selectElement.value = lastSelectedValue;
                    }
                } else {
                    console.error('No destinations found in the API response.');
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }
}

function getLastUsedParkId() {
    return localStorage.getItem('selectedParkId');
}

function handleSelectChange() {
    localStorage.setItem('selectedParkId', selectElement.value);
}

selectElement.addEventListener('change', handleSelectChange);
getParks();
