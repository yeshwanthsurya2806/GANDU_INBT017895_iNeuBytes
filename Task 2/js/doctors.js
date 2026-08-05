// ======================================================
// PulseCare Healthcare Management System
// doctors.js
//
// This file is responsible for:
// • Displaying all doctors
// • Searching doctors by name
// • Filtering doctors by department
// ======================================================

// ==============================
// DOM ELEMENTS
// ==============================
const doctorContainer = document.getElementById("doctorContainer");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

// ==============================
// GLOBAL VARIABLES
// ==============================
let currentDepartment = "All";

// ==============================
// DISPLAY DOCTORS
// ==============================
function displayDoctors(doctorList) {

    // Clear previous doctor cards
    doctorContainer.innerHTML = "";

    // Show message if no doctors are found
    if (doctorList.length === 0) {
        doctorContainer.innerHTML = `
            <div class="no-results">
                <h2>No Doctors Found</h2>
                <p>Try searching with a different name or department.</p>
            </div>
        `;
        return;
    }

    // Generate doctor cards
    doctorList.forEach((doctor) => {

        doctorContainer.innerHTML += `
            <div class="doctor-list-card">

                <img src="${doctor.image}" alt="${doctor.name}">

                <div class="doctor-info">

                    <h3>${doctor.name}</h3>

                    <p><strong>${doctor.department}</strong></p>

                    <p>${doctor.qualification}</p>

                    <p>${doctor.experience} Experience</p>

                    <p>⭐ ${doctor.rating}</p>

                    <p>Consultation Fee: ₹${doctor.fee}</p>

                    <div class="doctor-buttons">

                        <a href="doctor-details.html?id=${doctor.id}" class="btn-outline">
                            View Profile
                        </a>

                        <a href="booking.html?id=${doctor.id}" class="btn">
                            Book Appointment
                        </a>

                    </div>

                </div>

            </div>
        `;

    });

}

// ==============================
// FILTER DOCTORS
// ==============================
function filterDoctors() {

    const searchText = searchInput.value.trim().toLowerCase();

    const filteredDoctors = doctors.filter((doctor) => {

        const matchesSearch =
            doctor.name.toLowerCase().includes(searchText);

        const matchesDepartment =
            currentDepartment === "All" ||
            doctor.department === currentDepartment;

        return matchesSearch && matchesDepartment;

    });

    displayDoctors(filteredDoctors);

}

// ==============================
// SEARCH EVENT
// ==============================
searchInput.addEventListener("input", filterDoctors);

// ==============================
// DEPARTMENT FILTER EVENTS
// ==============================
filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        // Remove active class from all buttons
        filterButtons.forEach((btn) =>
            btn.classList.remove("active")
        );

        // Highlight selected button
        button.classList.add("active");

        // Update current department
        currentDepartment = button.dataset.department;

        // Refresh doctor list
        filterDoctors();

    });

});

// ==============================
// INITIAL PAGE LOAD
// ==============================
displayDoctors(doctors);