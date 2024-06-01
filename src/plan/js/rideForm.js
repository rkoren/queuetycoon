var modal = document.getElementById("rideModal");

var assignRidesBtn = document.getElementById("assignRidesBtn");
var addMealsBtn = document.getElementById("addMealsBtn");
var addShowsBtn = document.getElementById("addShowsBtn");

// <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// open the modal onclick
assignRidesBtn.onclick = function() {
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