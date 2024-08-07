const selectElement = document.getElementById('parkSelect');
const tableBody = document.getElementById('tableBody');
let sortDirection = {
    0: 'asc',
    1: 'asc',
    2: 'asc'
};

function getParks() {
    if (selectElement.childElementCount === 0) {
        fetch('https://api.themeparks.wiki/v1/destinations')
            .then(response => response.json())
            .then(data => {
                if (data.destinations && data.destinations.length > 0) {
                    const allParks = [];
                    data.destinations.forEach(destination => {
                        if (destination.parks.length == 1) {
                            allParks.push(...destination.parks)
                        } else {
                            destination.parks.forEach(park => {
                                const modifiedName = park.name === destination.name ? park.name : `${destination.name} - ${park.name}`;
                                park.name = modifiedName
                                allParks.push(park);
                            });
                        }
                    });

                    allParks.sort((a, b) => a.name.localeCompare(b.name));

                    allParks.forEach(optionData => {
                        const option = document.createElement('option');
                        option.value = optionData.id;
                        option.text = optionData.name;
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

function populateWaitTable(selectedParkId) {
    tableBody.innerHTML = '';

    var parkOpen = false
    fetch(`https://api.themeparks.wiki/v1/entity/${selectedParkId}/schedule`)
        .then(response => response.json())
        .then(data => {
            if (data.schedule && data.schedule.length > 0) {
                const rn = new Date();
                const currentSchedule = data.schedule.filter(schedule => schedule.type && schedule.type == "OPERATING");
                if (currentSchedule.length > 0) {
                    const openingTime = new Date(currentSchedule[0].openingTime);
                    const closingTime = new Date(currentSchedule[0].closingTime);
                    if (rn >= openingTime && rn <= closingTime) {
                        parkOpen = true;
                    }
                }
            }
            fetch(`https://api.themeparks.wiki/v1/entity/${selectedParkId}/live`)
                .then(response => response.json())
                .then(data => {
                    if (data.liveData && data.liveData.length > 0) {
                        var items = data.liveData.filter(item => item.entityType && item.entityType == "ATTRACTION");
                        if (parkOpen) {
                            items = items.filter(item => item.queue);
                            items.forEach(item => {
                                var q = item.queue;
                                const row = tableBody.insertRow();
                                row.insertCell(0).textContent = item.name;
                                row.insertCell(1).textContent = item.status;
                                if (typeof q.STANDBY === 'object') {
                                    if (q.STANDBY.waitTime === null) {
                                        row.insertCell(2).textContent = "N/A";
                                    } else {
                                        row.insertCell(2).textContent = q.STANDBY.waitTime;
                                    }
                                } else {
                                    if (Object.keys(q).length === 0 || item.status === "CLOSED") {
                                        row.insertCell(2).textContent = "N/A";
                                    } else if (typeof q.BOARDING_GROUP === 'object') {
                                        bg = q.BOARDING_GROUP
                                        row.insertCell(2).textContent = "Groups " + bg.currentGroupStart + "-" + bg.currentGroupEnd;
                                    } else {
                                        row.insertCell(2).textContent = "Unknown :P";
                                    }
                                }
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

function sortTable(columnIndex) {
    const rows = Array.from(tableBody.rows);
    const isNumeric = columnIndex === 2; // Wait Time is numeric

    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex].innerText;
        const cellB = rowB.cells[columnIndex].innerText;

        if (isNumeric) {
            const parsedA = parseInt(cellA);
            const parsedB = parseInt(cellB);
            const numA = Number.isNaN(parsedA) ? -1 : parsedA;
            const numB = Number.isNaN(parsedB) ? -1 : parsedB;
            return sortDirection[columnIndex] === 'asc'
                ? numA - numB
                : numB - numA;
        } else {
            return sortDirection[columnIndex] === 'asc'
                ? cellA.localeCompare(cellB)
                : cellB.localeCompare(cellA);
        }
    });

    // Toggle the sorting direction
    sortDirection[columnIndex] = sortDirection[columnIndex] === 'asc' ? 'desc' : 'asc';

    // Clear existing rows
    tableBody.innerHTML = '';

    // Append the sorted rows
    tableBody.append(...rows);

    // Update header class
    document.querySelectorAll('th').forEach(th => th.classList.remove('ascending', 'descending'));
    document.querySelectorAll('th')[columnIndex].classList.add(sortDirection[columnIndex] === 'asc' ? 'ascending' : 'descending');
}
