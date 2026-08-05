// ======================================================
// PulseCare Healthcare Management System
// booking.js
//
// This file is responsible for:
// • Reading the selected doctor from the URL
// • Displaying doctor information
// • Loading available time slots
// • Updating booking summary
// • Saving appointment details
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
// DOM ELEMENTS
// ==============================
const doctorBox = document.getElementById("selectedDoctor");
const slotSelect = document.getElementById("timeSlot");
const dateInput = document.getElementById("appointmentDate");
const bookingForm = document.getElementById("bookingForm");

const summaryDoctor = document.getElementById("summaryDoctor");
const summaryFee = document.getElementById("summaryFee");
const summaryDate = document.getElementById("summaryDate");
const summaryTime = document.getElementById("summaryTime");


// ==============================
// CHECK VALID DOCTOR
// ==============================
if (!selectedDoctor) {

    doctorBox.innerHTML = `
        <div class="error-card">

            <h2>Doctor Not Found</h2>

            <p>
                Please return to the doctors page and select a valid doctor.
            </p>

            <a href="doctors.html" class="btn-primary">
                View Doctors
            </a>

        </div>
    `;

} else {

    displayDoctorDetails();
    loadTimeSlots();
    updateBookingSummary();

}


// ==============================
// DISPLAY DOCTOR DETAILS
// ==============================
function displayDoctorDetails() {

    doctorBox.innerHTML = `

        <div class="booking-doctor-image">

            <img
                src="${selectedDoctor.image}"
                alt="${selectedDoctor.name}"
            >

        </div>

        <div class="booking-doctor-info">

            <span class="department-badge">
                ${selectedDoctor.department}
            </span>

            <h2>${selectedDoctor.name}</h2>

            <p class="doctor-qualification">
                🎓 ${selectedDoctor.qualification}
            </p>

            <div class="doctor-booking-details">

                <p>
                    ⭐ <strong>${selectedDoctor.rating}</strong> Rating
                </p>

                <p>
                    💼 <strong>${selectedDoctor.experience}</strong> Experience
                </p>

                <p>
                    💰 Consultation Fee
                    <strong>₹${selectedDoctor.fee}</strong>
                </p>

            </div>

            <div class="clinic-info">

                <span>🏥</span>

                <div>

                    <strong>${selectedDoctor.hospital || "PulseCare Medical Center"}</strong>

                    <p>${selectedDoctor.location || "Vellore"}</p>

                </div>

            </div>

        </div>

    `;

}


// ==============================
// LOAD AVAILABLE TIME SLOTS
// ==============================
function loadTimeSlots() {

    slotSelect.innerHTML = `
        <option value="">
            Select Time Slot
        </option>
    `;

    selectedDoctor.availableSlots.forEach((slot) => {

        const option = document.createElement("option");

        option.value = slot;
        option.textContent = slot;

        slotSelect.appendChild(option);

    });

}


// ==============================
// UPDATE BOOKING SUMMARY
// ==============================
function updateBookingSummary() {

    summaryDoctor.textContent = selectedDoctor.name;
    summaryFee.textContent = `₹${selectedDoctor.fee}`;

}


// ==============================
// DATE CHANGE
// ==============================
dateInput.addEventListener("change", () => {

    summaryDate.textContent = dateInput.value || "-";

});


// ==============================
// TIME SLOT CHANGE
// ==============================
slotSelect.addEventListener("change", () => {

    summaryTime.textContent = slotSelect.value || "-";

});


// ==============================
// BOOK APPOINTMENT
// ==============================
bookingForm.addEventListener("submit", (event) => {

    event.preventDefault();

    if (!dateInput.value || !slotSelect.value) {

        alert("Please select both appointment date and time slot.");

        return;

    }

    const appointment = {

        bookingId: `PC-${Date.now()}`,

        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        department: selectedDoctor.department,

        fee: selectedDoctor.fee,

        patientName: document.getElementById("patientName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,

        date: dateInput.value,
        time: slotSelect.value,

        symptoms: document.getElementById("symptoms").value,

        bookedOn: new Date().toLocaleString(),

        status: "Confirmed"

    };

    saveAppointment(appointment);

    localStorage.setItem(
        "currentAppointment",
        JSON.stringify(appointment)
    );

    window.location.href = "summary.html";

});