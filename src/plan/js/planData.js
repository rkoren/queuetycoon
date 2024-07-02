const selectElement = document.getElementById('parkSelect');
const tableBody = document.getElementById('tableBody');
const addMealButton = document.getElementById('addMealButton');

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
    populateMealForm(currentParkId);
}

selectElement.addEventListener('change', handleSelectChange);
getParks();

var rideModal = document.getElementById("rideModal");
var mealModal = document.getElementById("mealModal");
var assignRidesBtn = document.getElementById("assignRidesBtn");
var mealsModalBtn = document.getElementById("mealsModalBtn");
var showsModalBtn = document.getElementById("showsModalBtn");

var rideSpan = document.getElementsByClassName("close")[0];
var mealSpan = document.getElementsByClassName("close")[1];

assignRidesBtn.onclick = function() {
    populateRideForm(currentParkId);
    rideModal.style.display = "block";
}

mealsModalBtn.onclick = function() {
    populateMealForm(currentParkId);
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

function populateMealForm(currentParkId) {
    fetch(`https://api.themeparks.wiki/v1/entity/${currentParkId}/children`)
    .then(response => response.json())
    .then(data => {
        console.log('Fetched Data:', data);
        createMealForm(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function createMealForm(parkData) {
    const formContent = document.getElementById('mealContainer');
    formContent.innerHTML = '';

    const mealContainer = document.createElement('div');
    mealContainer.className = 'meal-container';
    formContent.appendChild(mealContainer);

    restaurants = parkData.children
        .filter(child => child.entityType === 'RESTAURANT')
        .map(restaurant => restaurant.name);

    console.log('Populated restaurants:', restaurants);
}

const maxMeals = 6;
let mealCount = 0;

var restaurants = [];

function addMeal() {
    if (mealCount >= maxMeals) {
        alert("Whoa, I think that's meals enough for today");
        return;
    }

    const mealContainer = document.getElementById('mealContainer');
    const mealDiv = document.createElement('div');
    mealDiv.classList.add('meal-entry', 'mb-3');
    mealDiv.innerHTML = `
        <label for="restaurantSelect_${mealCount}">Restaurant:</label>
        <select class="form-control mb-6" id="restaurantSelect_${mealCount}">
            ${restaurants.map(restaurant => `<option value="${restaurant}">${restaurant}</option>`).join('')}
            <option value="custom">Other</option>
        </select>
        <label for="time_${mealCount}">Time:</label>
        <input class="form-control mb-6" type="time" id="time_${mealCount}" />
        <label for="duration_${mealCount}">Duration (minutes):</label>
        <input class="form-control mb-6" type="number" id="duration_${mealCount}" value="60" min="0" max="120"/>
        <button type="button" class="btn btn-danger removeMealButton">Remove</button>
        <hr>
    `;
    
    mealContainer.appendChild(mealDiv);

    mealDiv.querySelector('.removeMealButton').addEventListener('click', function() {
        mealDiv.remove();
        mealCount--;
    });

    mealCount++;
}

document.getElementById('addMealButton').addEventListener('click', addMeal);

document.getElementById('submitMealsButton').addEventListener('click', () => {
    const meals = [];
    let isValid = true;
    let errorMessage = '';

    for (let i = 0; i < mealCount; i++) {
        const restaurant = document.getElementById(`restaurantSelect_${i}`).value;
        const time = document.getElementById(`time_${i}`).value;
        const duration = document.getElementById(`duration_${i}`).value;

        if (!restaurant || !time || !duration) {
            isValid = false;
            errorMessage = 'All fields must be filled out.';
            break;
        }

        const startTime = new Date(`1970-01-01T${time}:00Z`).getTime();
        const endTime = startTime + duration * 60 * 1000;

        for (const meal of meals) {
            const existingStartTime = new Date(`1970-01-01T${meal.time}:00Z`).getTime();
            const existingEndTime = existingStartTime + meal.duration * 60 * 1000;

            if ((startTime < existingEndTime && startTime >= existingStartTime) || (endTime <= existingEndTime && endTime > existingStartTime)) {
                isValid = false;
                errorMessage = 'Meal times cannot overlap.';
                break;
            }
        }

        if (!isValid) break;
        meals.push({ restaurant, time, duration });
    }

    if (isValid) {
        console.log('Submitted meals:', meals);
        localStorage.setItem("mealAssignments", JSON.stringify(meals));
        mealModal.style.display = "none";
    } else {
        alert(errorMessage);
    }
});

window.onload = function() {
    var savedRides = JSON.parse(localStorage.getItem("rideAssignments"));
    var savedMeals = JSON.parse(localStorage.getItem("mealAssignments"))
    if (savedRides) {
        for (const [key, value] of Object.entries(savedRides)) {
            document.getElementById(key).value = value;
        }
    }
    if (savedMeals) {
        savedMeals.forEach((meal, index) => {
            addMeal();
            document.getElementById(`restaurantSelect_${index}`).value = meal.restaurant;
            document.getElementById(`time_${index}`).value = meal.time;
            document.getElementById(`duration_${index}`).value = meal.duration;
        });
    }
}

showsModalBtn.onclick = function() {
    alert("Add Shows functionality to be implemented");
}