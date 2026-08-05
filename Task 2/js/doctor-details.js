// ======================================================
// PulseCare Healthcare Management System
// doctor-details.js
//
// This file is responsible for:
// • Reading the doctor ID from the URL
// • Finding the selected doctor
// • Displaying complete doctor information
// ======================================================

// ==============================
// GET URL PARAMETERS
// ==============================
const params = new URLSearchParams(window.location.search);
const doctorId = Number(params.get("id"));

// ==============================
// FIND SELECTED DOCTOR
// ==============================
const selectedDoctor = doctors.find(
    doctor => doctor.id === doctorId
);

// ==============================
// GET DOCTOR DETAILS CONTAINER
// ==============================
const detailsContainer = document.getElementById("doctorDetails");

// ==============================
// DISPLAY DOCTOR DETAILS
// ==============================
if (selectedDoctor) {

    detailsContainer.innerHTML = `

        <div class="doctor-details-card">

            <div class="doctor-left">

                <img
                    src="${selectedDoctor.image}"
                    alt="${selectedDoctor.name}"
                >

            </div>

            <div class="doctor-right">

                <span class="department-badge">
                    ${selectedDoctor.department}
                </span>

                <h2>${selectedDoctor.name}</h2>

                <div class="doctor-meta">

                    <p>⭐ ${selectedDoctor.rating}</p>

                    <p>🎓 ${selectedDoctor.qualification}</p>

                    <p>💼 ${selectedDoctor.experience}</p>

                    <p>💰 ₹${selectedDoctor.fee}</p>

                </div>

                <a
                    href="booking.html?id=${selectedDoctor.id}"
                    class="btn-primary"
                >
                    Book Appointment
                </a>

            </div>

        </div>

        <!-- About Doctor -->

        <div class="info-card">

            <h3>About Doctor</h3>

            <p>${selectedDoctor.about}</p>

        </div>

        <!-- Available Time Slots -->

        <div class="info-card">

            <h3>Available Time Slots</h3>

            <div class="slots">

                ${selectedDoctor.availableSlots
                    .map(slot => `<span>${slot}</span>`)
                    .join("")}

            </div>

        </div>

    `;

}

// ==============================
// INVALID DOCTOR ID
// ==============================
else {

    detailsContainer.innerHTML = `

        <div class="error-card">

            <h2>Doctor Not Found</h2>

            <p>
                The requested doctor profile could not be found.
            </p>

            <a href="doctors.html" class="btn-primary">
                Back to Doctors
            </a>

        </div>

    `;

}