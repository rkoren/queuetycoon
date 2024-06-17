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
    const selectedParkId = selectElement.value;
    localStorage.setItem('selectedParkId', selectedParkId);
    currentParkId = selectedParkId;
    populateRideForm(currentParkId);
}

selectElement.addEventListener('change', handleSelectChange);
getParks();

var rideModal = document.getElementById("rideModal");
var mealModal = document.getElementById("mealModal");
var assignRidesBtn = document.getElementById("assignRidesBtn");
var addMealsBtn = document.getElementById("addMealsBtn");
var addShowsBtn = document.getElementById("addShowsBtn");

var rideSpan = document.getElementsByClassName("close")[0];
var mealSpan = document.getElementsByClassName("close")[1];

assignRidesBtn.onclick = function() {
    populateRideForm(currentParkId);
    rideModal.style.display = "block";
}

addMealsBtn.onclick = function() {
    mealModal.style.display = "block";
}

rideSpan.onclick = function() {
    rideModal.style.display = "none";
}

mealSpan.onclick = function() {
    mealModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == rideModal) {
        rideModal.style.display = "none";
    } else if (event.target == mealModal) {
        mealModal.style.display = "none";
    }
}

function populateRideForm(currentParkId) {
    fetch(`https://api.themeparks.wiki/v1/entity/${currentParkId}/children`)
    .then(response => response.json())
    .then(data => {
        console.log('Fetched Data:', data);
        createRideForm(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function createRideForm(rideData) {
    const formContent = document.getElementById('rideList');
    formContent.innerHTML = '';

    const rowContainer = document.createElement('div');
    rowContainer.className = 'row-container';
    formContent.appendChild(rowContainer);

    const rides = rideData.children.filter(child => child.entityType === "ATTRACTION");
    const ridesPerRow = 6;

    rides
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((child, index) => {
            if (index > 0 && index % ridesPerRow === 0) {
                const newRowContainer = document.createElement('div');
                newRowContainer.className = 'row-container';
                formContent.appendChild(newRowContainer);
            }

            const div = document.createElement('div');
            div.className = 'ride-item';

            const label = document.createElement('label');
            label.textContent = child.name;
            label.htmlFor = `${child.id}`;

            const input = document.createElement('input');
            input.type = 'number';
            input.min = 0;
            input.max = 10;
            input.value = 0;
            input.id = `${child.id}`;

            div.appendChild(label);
            div.appendChild(input);
            formContent.lastChild.appendChild(div);
    });

    const lastRow = formContent.lastChild;
    const itemsInLastRow = rides.length % ridesPerRow;
    
    if (itemsInLastRow > 0) {
        for (let i = 0; i < ridesPerRow - itemsInLastRow; i++) {
            const fillerDiv = document.createElement('div');
            fillerDiv.className = 'ride-item filler';
            lastRow.appendChild(fillerDiv);
        }
    }
}

// submit Ride Form
document.getElementById("rideForm").onsubmit = function(event) {
    event.preventDefault();
    var formData = new FormData(this);
    var rides = {};
    formData.forEach((value, key) => {
        rides[key] = value;
    });
    console.log("Form Data Submitted: ", rides);

    localStorage.setItem("rideAssignments", JSON.stringify(rides));
    rideModal.style.display = "none";
}

// submit Meal Form
document.getElementById("mealForm").onsubmit = function(event) {
    event.preventDefault();
    var formData = new FormData(this);
    var meals = {};
    formData.forEach((value, key) => {
        meals[key] = value;
    });
    console.log("Form Data Submitted: ", meals);
    
    localStorage.setItem("mealAssignments", JSON.stringify(meals));
    mealModal.style.display = "none";
}

// load form data if available
window.onload = function() {
    var savedRides = JSON.parse(localStorage.getItem("rideAssignments"));
    var savedMeals = JSON.parse(localStorage.getItem("mealAssignments"))
    if (savedRides) {
        for (const [key, value] of Object.entries(savedRides)) {
            document.getElementById(key).value = value;
        }
    }
}

addShowsBtn.onclick = function() {
    alert("Add Shows functionality to be implemented");
}