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
                    populateWaitTable(selectElement.value);
                } else {
                    console.error('No destinations found in the API response.');
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }
}

function saveSelectedParkId(selectedParkId) {
    localStorage.setItem('selectedParkId', selectedParkId);
}

function getLastUsedParkId() {
    return localStorage.getItem('selectedParkId');
}

// Populate the Queue data table based on park
function populateWaitTable(selectedParkId) {
    tableBody.innerHTML = '';

    var parkOpen = false
    fetch(`https://api.themeparks.wiki/v1/entity/${selectedParkId}/schedule`)
        .then(response => response.json())
        .then(data => {
            if (data.schedule && data.schedule.length > 0) {
                const rn = new Date();
                const currentSchedule = data.schedule.filter(schedule => schedule.type && schedule.type == "OPERATING")[0];
                const openingTime = new Date(currentSchedule.openingTime);
                const closingTime = new Date(currentSchedule.closingTime);
                if (rn >= openingTime && rn <= closingTime) {
                    parkOpen = true;
                }
            }
            fetch(`https://api.themeparks.wiki/v1/entity/${selectedParkId}/live`)
                .then(response => response.json())
                .then(data => {
                    if (data.liveData && data.liveData.length > 0) {
                        var items = data.liveData.filter(item => item.entityType && item.entityType == "ATTRACTION");
                        if (parkOpen) {
                            items = items.filter(item => item.queue && item.queue.STANDBY.waitTime !== null);
                            items.forEach(item => {
                                const row = tableBody.insertRow();
                                row.insertCell(0).textContent = item.name;
                                row.insertCell(1).textContent = item.status;
                                row.insertCell(2).textContent = item.queue.STANDBY.waitTime.toString();
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
}

function handleSelectChange() {
    saveSelectedParkId(selectElement.value);
    populateWaitTable(selectElement.value);
}

selectElement.addEventListener('change', handleSelectChange);
getParks();
