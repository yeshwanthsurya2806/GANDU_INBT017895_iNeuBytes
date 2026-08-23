// =========================================================
// PULSECARE PATIENT DASHBOARD
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    initializePatientDashboard();
});


// =========================================================
// INITIALIZE
// =========================================================

async function initializePatientDashboard() {

    try {

        await loadPatientDashboard();

        await loadPatientMedicalRecords();

    } catch (error) {

        console.error(
            "Patient dashboard initialization error:",
            error
        );

        showPatientError(
            error.message ||
            "Unable to load patient dashboard."
        );
    }
}


// =========================================================
// DASHBOARD
// =========================================================

async function loadPatientDashboard() {

    const data = await apiRequest(
        "/api/patient/dashboard"
    );


    const patient =
        data.patient || {};


    const statistics =
        data.statistics || {};


    const appointments =
        Array.isArray(data.appointments)
            ? data.appointments
            : [];


    // -------------------------------------------------
    // PATIENT NAME
    // -------------------------------------------------

    setText(
        "patientWelcome",
        `Welcome back, ${patient.name || "Patient"} 👋`
    );


    // -------------------------------------------------
    // STATISTICS
    // -------------------------------------------------

    setText(
        "patientTotalAppointments",
        statistics.totalAppointments ?? 0
    );


    setText(
        "patientPendingAppointments",
        statistics.pendingAppointments ?? 0
    );


    setText(
        "patientConfirmedAppointments",
        statistics.confirmedAppointments ?? 0
    );


    setText(
        "patientCompletedAppointments",
        statistics.completedAppointments ?? 0
    );


    // -------------------------------------------------
    // UPCOMING APPOINTMENTS
    // -------------------------------------------------

    renderUpcomingAppointments(
        appointments
    );
}


// =========================================================
// UPCOMING APPOINTMENTS
// =========================================================

function renderUpcomingAppointments(
    appointments
) {

    const container =
        document.getElementById(
            "patientAppointments"
        );


    if (!container) {

        console.error(
            "patientAppointments container not found."
        );

        return;
    }


    // -------------------------------------------------
    // REMOVE COMPLETED / CANCELLED
    // -------------------------------------------------

    const upcoming =
        appointments.filter(
            appointment =>
                appointment.status !== "Completed" &&
                appointment.status !== "Cancelled"
        );


    // -------------------------------------------------
    // EMPTY STATE
    // -------------------------------------------------

    if (upcoming.length === 0) {

        container.innerHTML = `
            <div class="patient-empty">

                <i class="fa-regular fa-calendar"></i>

                <p>
                    No upcoming appointments.
                </p>

            </div>
        `;

        return;
    }


    // -------------------------------------------------
    // SORT
    // -------------------------------------------------

    upcoming.sort(
        (a, b) => {

            const dateA =
                `${a.appointment_date || ""} ${a.appointment_time || ""}`;

            const dateB =
                `${b.appointment_date || ""} ${b.appointment_time || ""}`;

            return dateA.localeCompare(
                dateB
            );
        }
    );


    // -------------------------------------------------
    // RENDER
    // -------------------------------------------------

    container.innerHTML =
        upcoming
            .slice(0, 8)
            .map(
                appointment =>
                    createPatientAppointmentHTML(
                        appointment
                    )
            )
            .join("");
}


// =========================================================
// APPOINTMENT HTML
// =========================================================

function createPatientAppointmentHTML(
    appointment
) {

    const doctorName =
        appointment.doctor_name ||
        "Doctor";


    const initials =
        getInitials(
            doctorName.replace(
                /^Dr\.\s*/i,
                ""
            )
        );


    const status =
        appointment.status ||
        "Pending";


    const statusClass =
        status
            .toLowerCase()
            .replace(/\s+/g, "-");


    const specialization =
        appointment.specialization ||
        appointment.department ||
        "Healthcare Professional";


    return `
        <div class="patient-appointment">

            <div class="patient-doctor-info">

                <div class="doctor-avatar">
                    ${escapeHTML(initials)}
                </div>


                <div>

                    <strong>
                        ${escapeHTML(doctorName)}
                    </strong>

                    <span>
                        ${escapeHTML(
                            specialization
                        )}
                    </span>

                    ${
                        appointment.department
                            ? `
                                <span>
                                    ${escapeHTML(
                                        appointment.department
                                    )}
                                </span>
                            `
                            : ""
                    }

                </div>

            </div>


            <div class="appointment-meta">

                <strong>
                    ${formatDate(
                        appointment.appointment_date
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        appointment.appointment_time ||
                        ""
                    )}
                </span>

                <span
                    class="status-badge status-${escapeHTML(
                        statusClass
                    )}"
                >
                    ${escapeHTML(status)}
                </span>

            </div>

        </div>
    `;
}


// =========================================================
// MEDICAL RECORDS
// =========================================================

async function loadPatientMedicalRecords() {

    const container =
        document.getElementById(
            "patientMedicalRecords"
        );


    if (!container) {

        console.error(
            "patientMedicalRecords container not found."
        );

        return;
    }


    container.innerHTML = `
        <div class="patient-empty">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <p>
                Loading medical records...
            </p>

        </div>
    `;


    try {

        const data =
            await apiRequest(
                "/api/patient/medical-records"
            );


        const records =
            data.records || [];


        if (records.length === 0) {

            container.innerHTML = `
                <div class="patient-empty">

                    <i class="fa-solid fa-file-medical"></i>

                    <p>
                        No medical records available yet.
                    </p>

                </div>
            `;

            return;
        }


        container.innerHTML =
            records
                .slice(0, 10)
                .map(
                    record =>
                        createMedicalRecordHTML(
                            record
                        )
                )
                .join("");


    } catch (error) {

        console.error(
            "Patient medical records error:",
            error
        );


        container.innerHTML = `
            <div class="patient-empty">

                <i class="fa-solid fa-circle-exclamation"></i>

                <p>
                    Unable to load medical records.
                </p>

            </div>
        `;
    }
}


// =========================================================
// MEDICAL RECORD HTML
// =========================================================

function createMedicalRecordHTML(
    record
) {

    const doctorName =
        record.doctor_name ||
        "Doctor";


    const diagnosis =
        record.diagnosis ||
        "Consultation completed";


    const prescription =
        record.prescription ||
        "No prescription provided";


    const notes =
        record.notes ||
        "No additional notes";


    return `
        <div class="medical-record">

            <div class="medical-record-top">

                <div>

                    <strong>
                        ${escapeHTML(
                            doctorName
                        )}
                    </strong>

                    <br>

                    <small>
                        ${escapeHTML(
                            record.specialization ||
                            record.department ||
                            "Medical Consultation"
                        )}
                    </small>

                </div>


                <small>
                    ${formatDate(
                        record.created_at
                    )}
                </small>

            </div>


            <p>
                <strong>
                    Diagnosis:
                </strong>

                ${escapeHTML(
                    diagnosis
                )}
            </p>


            <p>
                <strong>
                    Prescription:
                </strong>

                ${escapeHTML(
                    prescription
                )}
            </p>


            <p>
                <strong>
                    Notes:
                </strong>

                ${escapeHTML(
                    notes
                )}
            </p>

        </div>
    `;
}


// =========================================================
// BOOKING MODAL
// =========================================================

async function openBookingModal() {

    const modal =
        document.getElementById(
            "bookingModal"
        );


    if (!modal) {
        return;
    }


    modal.style.display = "flex";


    await loadBookingDepartments();
}


function closeBookingModal() {

    const modal =
        document.getElementById(
            "bookingModal"
        );


    if (modal) {
        modal.style.display = "none";
    }
}


// =========================================================
// LOAD DEPARTMENTS
// =========================================================

async function loadBookingDepartments() {

    const select =
        document.getElementById(
            "bookingDepartment"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Loading departments...
        </option>
    `;


    try {

        const data =
            await apiRequest(
                "/api/patient/departments"
            );


        const departments =
            data.departments || [];


        select.innerHTML = `
            <option value="">
                Select Department
            </option>
        `;


        departments.forEach(
            department => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    department.id;


                option.textContent =
                    department.name;


                select.appendChild(
                    option
                );
            }
        );


    } catch (error) {

        console.error(
            "Department loading error:",
            error
        );


        select.innerHTML = `
            <option value="">
                Unable to load departments
            </option>
        `;
    }
}


// =========================================================
// LOAD DOCTORS BY DEPARTMENT
// =========================================================

async function loadDoctorsByDepartment() {

    const departmentSelect =
        document.getElementById(
            "bookingDepartment"
        );


    const doctorSelect =
        document.getElementById(
            "bookingDoctor"
        );


    if (!departmentSelect || !doctorSelect) {
        return;
    }


    const departmentId =
        departmentSelect.value;


    doctorSelect.innerHTML = `
        <option value="">
            Loading doctors...
        </option>
    `;


    if (!departmentId) {

        doctorSelect.innerHTML = `
            <option value="">
                Select Doctor
            </option>
        `;

        return;
    }


    try {

        const data =
            await apiRequest(
                `/api/patient/doctors?department_id=${encodeURIComponent(
                    departmentId
                )}`
            );


        const doctors =
            data.doctors || [];


        doctorSelect.innerHTML = `
            <option value="">
                Select Doctor
            </option>
        `;


        doctors.forEach(
            doctor => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    doctor.id;


                option.textContent =
                    `${doctor.name} — ${
                        doctor.specialization ||
                        "Doctor"
                    }`;


                doctorSelect.appendChild(
                    option
                );
            }
        );


        if (doctors.length === 0) {

            doctorSelect.innerHTML = `
                <option value="">
                    No doctors available
                </option>
            `;
        }


    } catch (error) {

        console.error(
            "Doctor loading error:",
            error
        );


        doctorSelect.innerHTML = `
            <option value="">
                Unable to load doctors
            </option>
        `;
    }
}


// =========================================================
// BOOK APPOINTMENT
// =========================================================

async function bookAppointment(
    event
) {

    event.preventDefault();


    const doctorId =
        document.getElementById(
            "bookingDoctor"
        )?.value;


    const appointmentDate =
        document.getElementById(
            "bookingDate"
        )?.value;


    const appointmentTime =
        document.getElementById(
            "bookingTime"
        )?.value;


    const reason =
        document.getElementById(
            "bookingReason"
        )?.value.trim();


    if (
        !doctorId ||
        !appointmentDate ||
        !appointmentTime ||
        !reason
    ) {

        alert(
            "Please fill all appointment details."
        );

        return;
    }


    try {

        const data =
            await apiRequest(
                "/api/patient/appointments",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        doctor_id:
                            Number(doctorId),

                        appointment_date:
                            appointmentDate,

                        appointment_time:
                            appointmentTime,

                        reason:
                            reason

                    })
                }
            );


        alert(
            data.message ||
            "Appointment booked successfully."
        );


        closeBookingModal();


        document
            .getElementById(
                "bookingForm"
            )
            ?.reset();


        // IMPORTANT:
        // Reload the complete dashboard.
        await loadPatientDashboard();


    } catch (error) {

        console.error(
            "Booking error:",
            error
        );


        alert(
            error.message ||
            "Failed to book appointment."
        );
    }
}


// =========================================================
// PROFILE
// =========================================================

async function loadPatientProfile() {

    try {

        const data =
            await apiRequest(
                "/api/patient/profile"
            );


        const patient =
            data.patient || {};


        const message = [

            `Name: ${
                patient.name ||
                "Not provided"
            }`,

            `Email: ${
                patient.email ||
                "Not provided"
            }`,

            `Phone: ${
                patient.phone ||
                "Not provided"
            }`,

            `Gender: ${
                patient.gender ||
                "Not provided"
            }`,

            `Blood Group: ${
                patient.blood_group ||
                "Not provided"
            }`

        ].join("\n");


        alert(message);


    } catch (error) {

        console.error(
            "Profile error:",
            error
        );


        alert(
            error.message ||
            "Unable to load profile."
        );
    }
}


// =========================================================
// FIND DOCTOR
// =========================================================

async function loadDoctors() {

    try {

        await openBookingModal();


        const department =
            document.getElementById(
                "bookingDepartment"
            );


        if (department) {
            department.focus();
        }


    } catch (error) {

        console.error(
            "Find doctor error:",
            error
        );
    }
}


// =========================================================
// SCROLL TO MEDICAL RECORDS
// =========================================================

function scrollToRecords() {

    const section =
        document.getElementById(
            "medicalRecordsSection"
        );


    if (!section) {
        return;
    }


    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// =========================================================
// API HELPER
// =========================================================

async function apiRequest(
    url,
    options = {}
) {

    const response =
        await fetch(
            url,
            {
                credentials: "include",
                ...options
            }
        );


    let data = {};


    try {

        data =
            await response.json();

    } catch {

        data = {};

    }


    if (
        response.status === 401 ||
        response.status === 403
    ) {

        window.location.replace(
            "login.html"
        );


        throw new Error(
            data.message ||
            "Authentication required."
        );
    }


    if (
        !response.ok ||
        data.success === false
    ) {

        throw new Error(
            data.message ||
            "Request failed."
        );
    }


    return data;
}


// =========================================================
// LOGOUT
// =========================================================

async function logoutPatient() {

    const confirmed =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmed) {
        return;
    }


    try {

        if (
            window.PulseCareAuth &&
            typeof
                window.PulseCareAuth.logout ===
                "function"
        ) {

            await
                window.PulseCareAuth.logout();

            return;
        }


        const response =
            await fetch(
                "/api/auth/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Logout failed"
            );
        }


    } catch (error) {

        console.error(
            "Patient logout error:",
            error
        );


    } finally {

        window.location.replace(
            "login.html"
        );
    }
}


// =========================================================
// HELPERS
// =========================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ?? "";
    }
}


function getInitials(
    name
) {

    if (!name) {
        return "DR";
    }


    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(
            word =>
                word
                    .charAt(0)
                    .toUpperCase()
        )
        .join("");
}


function formatDate(
    date
) {

    if (!date) {
        return "Date unavailable";
    }


    // Handle YYYY-MM-DD directly
    // without timezone conversion.

    const match =
        String(date).match(
            /^(\d{4})-(\d{2})-(\d{2})$/
        );


    if (match) {

        const year =
            match[1];

        const month =
            Number(match[2]);

        const day =
            Number(match[3]);


        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];


        return `${day
            .toString()
            .padStart(2, "0")} ${
                months[month - 1]
            } ${year}`;
    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return String(date);
    }


    return parsed.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


function showPatientError(
    message
) {

    console.error(
        "Patient dashboard:",
        message
    );


    const records =
        document.getElementById(
            "patientMedicalRecords"
        );


    if (records) {

        records.innerHTML = `
            <div class="patient-empty">

                <i class="fa-solid fa-circle-exclamation"></i>

                <p>
                    ${escapeHTML(
                        message ||
                        "Something went wrong."
                    )}
                </p>

            </div>
        `;
    }
}


// =========================================================
// GLOBAL FUNCTIONS
// =========================================================

window.openBookingModal =
    openBookingModal;

window.closeBookingModal =
    closeBookingModal;

window.loadDoctorsByDepartment =
    loadDoctorsByDepartment;

window.bookAppointment =
    bookAppointment;

window.loadDoctors =
    loadDoctors;

window.scrollToRecords =
    scrollToRecords;

window.loadPatientProfile =
    loadPatientProfile;

window.loadPatientMedicalRecords =
    loadPatientMedicalRecords;

window.logoutPatient =
    logoutPatient;