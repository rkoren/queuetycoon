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
}

selectElement.addEventListener('change', handleSelectChange);
getParks();

var modal = document.getElementById("rideModal");
var assignRidesBtn = document.getElementById("assignRidesBtn");
var addMealsBtn = document.getElementById("addMealsBtn");
var addShowsBtn = document.getElementById("addShowsBtn");

// <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// open the modal onclick
assignRidesBtn.onclick = function() {
  fetch(`https://api.themeparks.wiki/v1/entity/${currentParkId}/children`)
  .then(response => response.json())
  .then(data => {
    console.log('Fetched Data:', data);
    createForm(data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
  modal.style.display = "block";
}

// close the modal on span click
span.onclick = function() {
    modal.style.display = "none";
}

// close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function createForm(rideData) {
    const formContent = document.getElementById('rideList');
    rideData.children.forEach(child => {
        const div = document.createElement('div');
        div.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = child.name;
        label.htmlFor = `input-${child.id}`;

        const input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.max = 10;
        input.id = `input-${child.id}`;
        input.name = child.id; // The id will be stored as the input name

        div.appendChild(label);
        div.appendChild(input);
        formContent.appendChild(div);
    });
}

// submit form
document.getElementById("rideForm").onsubmit = function(event) {
    event.preventDefault();
    var formData = new FormData(this);
    var rides = {};
    formData.forEach((value, key) => {
        rides[key] = value;
    });
    console.log("Form Data Submitted: ", rides);

    // save the form data to local storage or send it to a server
    localStorage.setItem("rideAssignments", JSON.stringify(rides));

    // close the modal
    modal.style.display = "none";
}

// load form data if available
window.onload = function() {
    var savedRides = JSON.parse(localStorage.getItem("rideAssignments"));
    if (savedRides) {
        for (const [key, value] of Object.entries(savedRides)) {
            document.getElementById(key).value = value;
        }
    }
}

addMealsBtn.onclick = function() {
    alert("Add Meals functionality to be implemented");
}

addShowsBtn.onclick = function() {
    alert("Add Shows functionality to be implemented");
}  