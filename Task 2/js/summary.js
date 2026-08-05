// ======================================================
// PulseCare Healthcare Management System
// summary.js
//
// This file is responsible for:
// • Reading the latest booked appointment
// • Displaying appointment confirmation
// • Showing booking details
// ======================================================


// ==============================
// GET CURRENT APPOINTMENT
// ==============================
const appointment = JSON.parse(
    localStorage.getItem("currentAppointment")
);


// ==============================
// GET SUMMARY CARD
// ==============================
const summaryCard = document.getElementById("summaryCard");


// ==============================
// DISPLAY APPOINTMENT DETAILS
// ==============================
if (appointment) {

    summaryCard.innerHTML = `

        <div class="success-icon">

            🎉

        </div>

        <h1>

            Appointment Confirmed

        </h1>

        <p class="success-text">

            Your appointment has been booked successfully.

        </p>

        <div class="summary-info">

            <div>

                <span>Booking ID</span>

                <strong>${appointment.bookingId}</strong>

            </div>

            <div>

                <span>Doctor</span>

                <strong>${appointment.doctorName}</strong>

            </div>

            <div>

                <span>Patient</span>

                <strong>${appointment.patientName}</strong>

            </div>

            <div>

                <span>Date</span>

                <strong>${appointment.date}</strong>

            </div>

            <div>

                <span>Time</span>

                <strong>${appointment.time}</strong>

            </div>

            <div>

                <span>Consultation Fee</span>

                <strong>₹${appointment.fee}</strong>

            </div>

            <div>

                <span>Status</span>

                <strong class="confirmed">

                    🟢 ${appointment.status}

                </strong>

            </div>

        </div>

        <div class="summary-buttons">

            <a
                href="index.html"
                class="btn-primary"
            >
                Home
            </a>

            <a
                href="history.html"
                class="btn-primary"
            >
                Appointment History
            </a>

        </div>

    `;

}

// ==============================
// NO APPOINTMENT FOUND
// ==============================
else {

    summaryCard.innerHTML = `

        <div class="error-card">

            <h2>No Appointment Found</h2>

            <p>

                It looks like you haven't booked an appointment yet.

            </p>

            <a
                href="doctors.html"
                class="btn-primary"
            >
                Book Appointment
            </a>

        </div>

    `;

}