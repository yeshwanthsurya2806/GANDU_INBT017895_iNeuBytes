// ======================================================
// PulseCare Healthcare Management System
// history.js
//
// This file is responsible for:
// • Retrieving all booked appointments
// • Displaying appointment history
// • Showing the most recent appointments first
// ======================================================


// ==============================
// GET PAGE ELEMENT
// ==============================
const historyContainer = document.getElementById("historyContainer");


// ==============================
// GET APPOINTMENTS
// ==============================
const appointments = getAppointments();


// ==============================
// CHECK IF APPOINTMENTS EXIST
// ==============================
if (appointments.length === 0) {

    historyContainer.innerHTML = `

        <div class="empty-history">

            <h2>No Appointments Found</h2>

            <p>
                You haven't booked any appointments yet.
            </p>

            <a
                href="doctors.html"
                class="btn-primary"
            >
                Book Now
            </a>

        </div>

    `;

}


// ==============================
// DISPLAY APPOINTMENT HISTORY
// ==============================
else {

    // Display latest appointments first
    [...appointments]
        .reverse()
        .forEach((appointment) => {

            historyContainer.innerHTML += `

                <div class="history-card">

                    <div class="history-top">

                        <h3>
                            ${appointment.doctorName}
                        </h3>

                        <span>
                            ${appointment.status}
                        </span>

                    </div>

                    <p>

                        <strong>Booking ID:</strong>

                        ${appointment.bookingId}

                    </p>

                    <p>

                        <strong>Patient:</strong>

                        ${appointment.patientName}

                    </p>

                    <p>

                        <strong>Department:</strong>

                        ${appointment.department}

                    </p>

                    <p>

                        <strong>Date:</strong>

                        ${appointment.date}

                    </p>

                    <p>

                        <strong>Time:</strong>

                        ${appointment.time}

                    </p>

                    <p>

                        <strong>Consultation Fee:</strong>

                        ₹${appointment.fee}

                    </p>

                </div>

            `;

        });

}