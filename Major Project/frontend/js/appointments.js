/* =========================================================
   PULSECARE HEALTHCARE MANAGEMENT DASHBOARD
   appointments.js

   Appointment Management:
   - Display appointments
   - Search
   - Status filter
   - Date filter
   - Add appointment
   - Edit appointment
   - View appointment
   - Delete appointment
   - Update status
   - Form validation
   - LocalStorage
   ========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const appointmentSearch =
    document.getElementById("appointmentSearch");

const appointmentStatusFilter =
    document.getElementById("appointmentStatusFilter");

const appointmentDateFilter =
    document.getElementById("appointmentDateFilter");

const clearAppointmentFilters =
    document.getElementById("clearAppointmentFilters");

const appointmentsTable =
    document.getElementById("appointmentsTable");

const appointmentEmptyState =
    document.getElementById("appointmentEmptyState");

const appointmentResultsInfo =
    document.getElementById("appointmentResultsInfo");


/* =========================================================
   STATISTICS
========================================================= */

const appointmentTotalCount =
    document.getElementById(
        "appointmentTotalCount"
    );

const appointmentPendingCount =
    document.getElementById(
        "appointmentPendingCount"
    );

const appointmentConfirmedCount =
    document.getElementById(
        "appointmentConfirmedCount"
    );

const appointmentCompletedCount =
    document.getElementById(
        "appointmentCompletedCount"
    );


/* =========================================================
   ADD / EDIT MODAL
========================================================= */

const addAppointmentBtn =
    document.getElementById(
        "addAppointmentBtn"
    );

const appointmentModalOverlay =
    document.getElementById(
        "appointmentModalOverlay"
    );

const appointmentModalTitle =
    document.getElementById(
        "appointmentModalTitle"
    );

const appointmentModalClose =
    document.getElementById(
        "appointmentModalClose"
    );

const appointmentCancelBtn =
    document.getElementById(
        "appointmentCancelBtn"
    );

const appointmentForm =
    document.getElementById(
        "appointmentForm"
    );


/* =========================================================
   FORM FIELDS
========================================================= */

const appointmentId =
    document.getElementById(
        "appointmentId"
    );

const appointmentPatient =
    document.getElementById(
        "appointmentPatient"
    );

const appointmentDoctor =
    document.getElementById(
        "appointmentDoctor"
    );

const appointmentDate =
    document.getElementById(
        "appointmentDate"
    );

const appointmentTime =
    document.getElementById(
        "appointmentTime"
    );

const appointmentStatus =
    document.getElementById(
        "appointmentStatus"
    );

const appointmentFee =
    document.getElementById(
        "appointmentFee"
    );

const appointmentReason =
    document.getElementById(
        "appointmentReason"
    );

const appointmentNotes =
    document.getElementById(
        "appointmentNotes"
    );


/* =========================================================
   DELETE MODAL
========================================================= */

const appointmentDeleteOverlay =
    document.getElementById(
        "appointmentDeleteOverlay"
    );

const appointmentDeleteClose =
    document.getElementById(
        "appointmentDeleteClose"
    );

const appointmentDeleteCancel =
    document.getElementById(
        "appointmentDeleteCancel"
    );

const appointmentDeleteConfirm =
    document.getElementById(
        "appointmentDeleteConfirm"
    );

const appointmentDeleteMessage =
    document.getElementById(
        "appointmentDeleteMessage"
    );


/* =========================================================
   VIEW MODAL
========================================================= */

const appointmentViewOverlay =
    document.getElementById(
        "appointmentViewOverlay"
    );

const appointmentViewClose =
    document.getElementById(
        "appointmentViewClose"
    );

const appointmentViewDone =
    document.getElementById(
        "appointmentViewDone"
    );

const appointmentViewContent =
    document.getElementById(
        "appointmentViewContent"
    );


/* =========================================================
   STATE
========================================================= */

let appointmentToDelete = null;

/* =========================================================
   DATABASE APPOINTMENT STATE
========================================================= */

let appointmentsData = [];

/* =========================================================
   LOAD APPOINTMENTS FROM DATABASE
========================================================= */

async function loadAppointmentsFromDatabase() {

    try {

        const response =
            await fetch(
                "/api/admin/appointments",
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.message ||
                "Failed to load appointments"
            );

        }


        appointmentsData =
            Array.isArray(
                result.appointments
            )
                ? result.appointments
                : [];


        renderAppointments();

        updateAppointmentStatistics();


    } catch (error) {

        console.error(
            "Load appointments error:",
            error
        );


        appointmentsData = [];


        renderAppointments();

        updateAppointmentStatistics();


        showToast(
            "Error",
            error.message ||
                "Failed to load appointments from database.",
            "error"
        );

    }

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeAppointmentPage();

    }
);


/* =========================================================
   INITIALIZE PAGE
========================================================= */

async function initializeAppointmentPage() {

    populatePatientOptions();

    populateDoctorOptions();

    initializeAppointmentSearch();

    initializeAppointmentFilters();

    initializeAppointmentModal();

    initializeAppointmentDelete();

    initializeAppointmentView();

    await loadAppointmentsFromDatabase();

}


/* =========================================================
   GET FILTERED APPOINTMENTS
========================================================= */

function getFilteredAppointments() {

    const appointments =
        appointmentsData;


    const searchTerm =
        appointmentSearch
            ? appointmentSearch.value
                .trim()
                .toLowerCase()
            : "";


    const status =
        appointmentStatusFilter
            ? appointmentStatusFilter.value
            : "All";


    const selectedDate =
        appointmentDateFilter
            ? appointmentDateFilter.value
            : "";


    return appointments.filter(
        appointment => {


            /* =========================
               SEARCH
            ========================= */

            const patientName =
                getPatientName(
                    appointment.patientId,
                    appointment.patientName
                );


            const doctorName =
                getDoctorName(
                    appointment.doctorId,
                    appointment.doctorName
                );


            const department =
                appointment.department ||
                getAppointmentDepartment(
                    appointment.doctorId
                );


            const matchesSearch =

                !searchTerm ||

                patientName
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                doctorName
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                department
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                String(
                    appointment.reason || ""
                )
                    .toLowerCase()
                    .includes(searchTerm);


            /* =========================
               STATUS
            ========================= */

            const matchesStatus =

                status === "All" ||

                appointment.status ===
                    status;


            /* =========================
               DATE
            ========================= */

            const matchesDate =

                !selectedDate ||

                appointment.date ===
                    selectedDate;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesDate
            );

        }
    );

}


/* =========================================================
   RENDER APPOINTMENTS
========================================================= */

function renderAppointments() {

    if (!appointmentsTable) {

        return;

    }


    const appointments =
        getFilteredAppointments();


    appointmentsTable.innerHTML = "";


    /* EMPTY STATE */

    if (appointments.length === 0) {

        if (appointmentEmptyState) {

            appointmentEmptyState.style.display =
                "block";

        }


        if (appointmentResultsInfo) {

            appointmentResultsInfo.textContent =
                "Showing 0 appointments";

        }

        return;

    }


    if (appointmentEmptyState) {

        appointmentEmptyState.style.display =
            "none";

    }


    /* SORT BY DATE + TIME */

    appointments.sort(
        (a, b) => {

            const first =
                new Date(
                    `${a.date}T${a.time || "00:00"}`
                );

            const second =
                new Date(
                    `${b.date}T${b.time || "00:00"}`
                );

            return first - second;

        }
    );


    /* CREATE ROWS */

    appointments.forEach(
        appointment => {

            const row =
                document.createElement(
                    "tr"
                );


            const patientName =
                getPatientName(
                    appointment.patientId,
                    appointment.patientName
                );


            const doctorName =
                getDoctorName(
                    appointment.doctorId,
                    appointment.doctorName
                );


            const department =
                appointment.department ||
                getAppointmentDepartment(
                    appointment.doctorId
                );


            const statusClass =
                getAppointmentStatusClass(
                    appointment.status
                );


            row.innerHTML = `

                <!-- PATIENT -->

                <td>

                    <div class="table-user">

                        <div class="table-avatar">

                            ${getInitials(
                                patientName
                            )}

                        </div>

                        <div>

                            <strong>

                                ${escapeHTML(
                                    patientName
                                )}

                            </strong>

                            <span>

                                ${
                                    appointment.patientId
                                        ? escapeHTML(
                                            appointment.patientId
                                        )
                                        : "Patient"
                                }

                            </span>

                        </div>

                    </div>

                </td>


                <!-- DOCTOR -->

                <td>

                    <div class="appointment-doctor-cell">

                        <strong>

                            ${escapeHTML(
                                doctorName
                            )}

                        </strong>

                        <span>

                            ${escapeHTML(
                                department || "General"
                            )}

                        </span>

                    </div>

                </td>


                <!-- DATE + TIME -->

                <td>

                    <div class="appointment-date-cell">

                        <strong>

                            ${formatAppointmentDate(
                                appointment.date
                            )}

                        </strong>

                        <span>

                            ${formatAppointmentTime(
                                appointment.time
                            )}

                        </span>

                    </div>

                </td>


                <!-- DEPARTMENT -->

                <td>

                    <span class="department-badge">

                        ${escapeHTML(
                            department || "General"
                        )}

                    </span>

                </td>


                <!-- REASON -->

                <td>

                    <span
                        class="reason-cell"
                        title="${escapeHTML(
                            appointment.reason || ""
                        )}"
                    >

                        ${escapeHTML(
                            truncateText(
                                appointment.reason ||
                                "Consultation",
                                35
                            )
                        )}

                    </span>

                </td>


                <!-- STATUS -->

                <td>

                    <select
                        class="status-select ${statusClass}"
                        data-id="${appointment.id}"
                    >

                        <option
                            value="Pending"
                            ${
                                appointment.status ===
                                "Pending"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Pending
                        </option>

                        <option
                            value="Confirmed"
                            ${
                                appointment.status ===
                                "Confirmed"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Confirmed
                        </option>

                        <option
                            value="Completed"
                            ${
                                appointment.status ===
                                "Completed"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Completed
                        </option>

                        <option
                            value="Cancelled"
                            ${
                                appointment.status ===
                                "Cancelled"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Cancelled
                        </option>

                    </select>

                </td>


                <!-- ACTIONS -->

                <td>

                    <div class="action-buttons">


                        <button
                            type="button"
                            class="action-button view"
                            title="View Appointment"
                            data-action="view"
                            data-id="${appointment.id}"
                        >

                            <i class="fa-solid fa-eye"></i>

                        </button>


                        <button
                            type="button"
                            class="action-button edit"
                            title="Edit Appointment"
                            data-action="edit"
                            data-id="${appointment.id}"
                        >

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            type="button"
                            class="action-button delete"
                            title="Delete Appointment"
                            data-action="delete"
                            data-id="${appointment.id}"
                        >

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>

            `;


            appointmentsTable.appendChild(
                row
            );

        }
    );


    if (appointmentResultsInfo) {

        appointmentResultsInfo.textContent =

            `Showing ${appointments.length} appointment` +

            `${appointments.length !== 1 ? "s" : ""}`;

    }


    initializeAppointmentActions();

    initializeStatusSelectors();

}


/* =========================================================
   POPULATE PATIENT OPTIONS
========================================================= */

function populatePatientOptions() {

    if (!appointmentPatient) {

        return;

    }


    const patients =
        getPatients();


    appointmentPatient.innerHTML = `

        <option value="">
            Select Patient
        </option>

    `;


    patients.forEach(
        patient => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                patient.id;


            option.textContent =
                `${patient.name} — ${patient.phone}`;


            appointmentPatient.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   POPULATE DOCTOR OPTIONS
========================================================= */

function populateDoctorOptions() {

    if (!appointmentDoctor) {

        return;

    }


    const doctors =
        getDoctors();


    appointmentDoctor.innerHTML = `

        <option value="">
            Select Doctor
        </option>

    `;


    doctors
        .filter(
            doctor =>
                doctor.status !==
                "Inactive"
        )
        .forEach(
            doctor => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    doctor.id;


                option.textContent =

                    `${doctor.name} — ` +

                    `${doctor.department}`;


                appointmentDoctor.appendChild(
                    option
                );

            }
        );

}


/* =========================================================
   GET PATIENT NAME
========================================================= */

function getPatientName(
    id,
    fallback
) {

    if (id) {

        const patient =
            getPatientById(id);


        if (patient) {

            return patient.name;

        }

    }


    return fallback ||
        "Unknown Patient";

}


/* =========================================================
   GET DOCTOR NAME
========================================================= */

function getDoctorName(
    id,
    fallback
) {

    if (id) {

        const doctor =
            getDoctorById(id);


        if (doctor) {

            return doctor.name;

        }

    }


    return fallback ||
        "Unknown Doctor";

}


/* =========================================================
   GET DEPARTMENT
========================================================= */

function getAppointmentDepartment(
    doctorId
) {

    if (!doctorId) {

        return "";

    }


    const doctor =
        getDoctorById(
            doctorId
        );


    return doctor
        ? doctor.department
        : "";

}


/* =========================================================
   SEARCH
========================================================= */

function initializeAppointmentSearch() {

    if (!appointmentSearch) {

        return;

    }


    appointmentSearch.addEventListener(
        "input",
        renderAppointments
    );

}


/* =========================================================
   FILTERS
========================================================= */

function initializeAppointmentFilters() {

    if (appointmentStatusFilter) {

        appointmentStatusFilter.addEventListener(
            "change",
            renderAppointments
        );

    }


    if (appointmentDateFilter) {

        appointmentDateFilter.addEventListener(
            "change",
            renderAppointments
        );

    }


    if (clearAppointmentFilters) {

        clearAppointmentFilters.addEventListener(
            "click",
            () => {

                if (appointmentSearch) {

                    appointmentSearch.value =
                        "";

                }


                if (appointmentStatusFilter) {

                    appointmentStatusFilter.value =
                        "All";

                }


                if (appointmentDateFilter) {

                    appointmentDateFilter.value =
                        "";

                }


                renderAppointments();

            }
        );

    }

}


/* =========================================================
   APPOINTMENT STATISTICS
========================================================= */

function updateAppointmentStatistics() {

    const appointments =
        appointmentsData;


    const pending =
        appointments.filter(
            appointment =>
                appointment.status ===
                "Pending"
        ).length;


    const confirmed =
        appointments.filter(
            appointment =>
                appointment.status ===
                "Confirmed"
        ).length;


    const completed =
        appointments.filter(
            appointment =>
                appointment.status ===
                "Completed"
        ).length;


    if (appointmentTotalCount) {

        appointmentTotalCount.textContent =
            appointments.length;

    }


    if (appointmentPendingCount) {

        appointmentPendingCount.textContent =
            pending;

    }


    if (appointmentConfirmedCount) {

        appointmentConfirmedCount.textContent =
            confirmed;

    }


    if (appointmentCompletedCount) {

        appointmentCompletedCount.textContent =
            completed;

    }

}


/* =========================================================
   APPOINTMENT ACTIONS
========================================================= */

function initializeAppointmentActions() {

    const buttons =
        document.querySelectorAll(
            "#appointmentsTable .action-button"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.action;

                    const id =
                        button.dataset.id;


                    if (
                        action === "view"
                    ) {

                        viewAppointment(id);

                    }

                    else if (
                        action === "edit"
                    ) {

                        editAppointment(id);

                    }

                    else if (
                        action === "delete"
                    ) {

                        openDeleteAppointment(id);

                    }

                }
            );

        }
    );

}


/* =========================================================
   STATUS SELECTORS
========================================================= */

async function initializeStatusSelectors() {

    const selectors =
        document.querySelectorAll(
            ".status-select"
        );


    selectors.forEach(
        selector => {

            selector.addEventListener(
                "change",
                async () => {

                    const id =
                        selector.dataset.id;

                    const newStatus =
                        selector.value;


                    try {

                        const response =
                            await fetch(
                                `/api/admin/appointments/${id}`,
                                {

                                    method: "PUT",

                                    credentials:
                                        "include",

                                    headers: {

                                        "Content-Type":
                                            "application/json"

                                    },

                                    body:
                                        JSON.stringify({

                                            status:
                                                newStatus

                                        })

                                }
                            );


                        const result =
                            await response.json();


                        if (
                            !response.ok ||
                            !result.success
                        ) {

                            throw new Error(
                                result.message ||
                                "Failed to update appointment status"
                            );

                        }


                        showToast(
                            "Status Updated",
                            `Appointment status changed to ${newStatus}.`,
                            "success"
                        );


                        /*
                         * Reload the latest
                         * data from SQLite.
                         */

                        await loadAppointmentsFromDatabase();


                    } catch (error) {

                        console.error(
                            "Update appointment status error:",
                            error
                        );


                        showToast(
                            "Error",
                            error.message ||
                                "Failed to update appointment status.",
                            "error"
                        );


                        /*
                         * Restore the value
                         * from the database.
                         */

                        await loadAppointmentsFromDatabase();

                    }

                }
            );

        }
    );

}


/* =========================================================
   OPEN ADD APPOINTMENT
========================================================= */

function openAddAppointmentModal() {

    resetAppointmentForm();

    populatePatientOptions();

    populateDoctorOptions();


    if (appointmentModalTitle) {

        appointmentModalTitle.textContent =
            "New Appointment";

    }


    if (appointmentModalOverlay) {

        appointmentModalOverlay.classList.add(
            "active"
        );

    }


    setTimeout(
        () => {

            if (appointmentPatient) {

                appointmentPatient.focus();

            }

        },
        100
    );

}


/* =========================================================
   EDIT APPOINTMENT
========================================================= */

/* =========================================================
   EDIT APPOINTMENT
========================================================= */

function editAppointment(id) {

    const appointment =
        appointmentsData.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!appointment) {

        showToast(
            "Error",
            "Appointment could not be found.",
            "error"
        );

        return;

    }


    /* Populate dropdowns */

    populatePatientOptions();

    populateDoctorOptions();


    /* Appointment ID */

    appointmentId.value =
        appointment.id;


    /* Patient */

    appointmentPatient.value =
        appointment.patientId || "";


    /* Doctor */

    appointmentDoctor.value =
        appointment.doctorId || "";


    /* Date */

    appointmentDate.value =
        appointment.date || "";


    /* Time */

    appointmentTime.value =
        appointment.time || "";


    /* Status */

    appointmentStatus.value =
        appointment.status ||
        "Pending";


    /* Consultation Fee */

    appointmentFee.value =
        appointment.fee ?? "";


    /* Reason */

    appointmentReason.value =
        appointment.reason || "";


    /* Notes */

    appointmentNotes.value =
        appointment.notes || "";


    /* Modal title */

    if (appointmentModalTitle) {

        appointmentModalTitle.textContent =
            "Edit Appointment";

    }


    /* Open modal */

    if (appointmentModalOverlay) {

        appointmentModalOverlay.classList.add(
            "active"
        );

    }

}


/* =========================================================
   INITIALIZE MODAL
========================================================= */

function initializeAppointmentModal() {

    if (addAppointmentBtn) {

        addAppointmentBtn.addEventListener(
            "click",
            openAddAppointmentModal
        );

    }


    if (appointmentModalClose) {

        appointmentModalClose.addEventListener(
            "click",
            closeAppointmentModal
        );

    }


    if (appointmentCancelBtn) {

        appointmentCancelBtn.addEventListener(
            "click",
            closeAppointmentModal
        );

    }


    if (appointmentModalOverlay) {

        appointmentModalOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    appointmentModalOverlay
                ) {

                    closeAppointmentModal();

                }

            }
        );

    }


    if (appointmentForm) {

        appointmentForm.addEventListener(
            "submit",
            handleAppointmentSubmit
        );

    }


    /* Auto-fill fee when doctor changes */

    if (appointmentDoctor) {

        appointmentDoctor.addEventListener(
            "change",
            () => {

                const doctor =
                    getDoctorById(
                        appointmentDoctor.value
                    );


                if (
                    doctor &&
                    appointmentFee
                ) {

                    appointmentFee.value =
                        doctor.fee || "";

                }

            }
        );

    }

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeAppointmentModal() {

    if (appointmentModalOverlay) {

        appointmentModalOverlay.classList.remove(
            "active"
        );

    }


    resetAppointmentForm();

}


/* =========================================================
   RESET FORM
========================================================= */

function resetAppointmentForm() {

    if (!appointmentForm) {

        return;

    }


    appointmentForm.reset();


    if (appointmentId) {

        appointmentId.value =
            "";

    }


    if (appointmentStatus) {

        appointmentStatus.value =
            "Pending";

    }

}


/* =========================================================
   SUBMIT APPOINTMENT
========================================================= */

async function handleAppointmentSubmit(
    event
) {

    event.preventDefault();


    const validation =
        validateAppointmentForm();


    if (!validation.valid) {

        showToast(
            "Validation Error",
            validation.message,
            "error"
        );

        return;

    }


    const patient =
        getPatientById(
            appointmentPatient.value
        );


    const doctor =
        getDoctorById(
            appointmentDoctor.value
        );


    const data = {

        patientId:
            appointmentPatient.value,

        patientName:
            patient
                ? patient.name
                : "",

        doctorId:
            appointmentDoctor.value,

        doctorName:
            doctor
                ? doctor.name
                : "",

        department:
            doctor
                ? doctor.department
                : "",

        date:
            appointmentDate.value,

        time:
            appointmentTime.value,

        status:
            appointmentStatus.value,

        fee:
            Number(
                appointmentFee.value ||
                (doctor
                    ? doctor.fee
                    : 0)
            ),

        reason:
            appointmentReason.value.trim(),

        notes:
            appointmentNotes.value.trim()

    };


        /* =====================================================
       EDIT APPOINTMENT
    ===================================================== */

    if (
        appointmentId &&
        appointmentId.value
    ) {

        try {

            const response =
                await fetch(
                    `/api/admin/appointments/${appointmentId.value}`,
                    {

                        method: "PUT",

                        credentials: "include",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                status:
                                    data.status,

                                appointment_date:
                                    data.date,

                                appointment_time:
                                    data.time,

                                reason:
                                    data.reason,

                                notes:
                                    data.notes,

                                consultation_fee:
                                    data.fee

                            })

                    }
                );


            const result =
                await response.json();


            if (
                !response.ok ||
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    "Failed to update appointment"
                );

            }


            showToast(
                "Appointment Updated",
                "Appointment has been updated successfully.",
                "success"
            );


            closeAppointmentModal();


            /*
             * Reload appointments
             * from SQLite.
             */

            await loadAppointmentsFromDatabase();


        } catch (error) {

            console.error(
                "Update appointment error:",
                error
            );


            showToast(
                "Error",
                error.message ||
                    "Failed to update appointment.",
                "error"
            );

        }


        return;

    }


    /* =====================================================
       CREATE APPOINTMENT
    ===================================================== */

    try {

        const response =
            await fetch(
                "/api/admin/appointments",
                {

                    method: "POST",

                    credentials: "include",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            patientId:
                                data.patientId,

                            doctorId:
                                data.doctorId,

                            date:
                                data.date,

                            time:
                                data.time,

                            status:
                                data.status,

                            fee:
                                data.fee,

                            reason:
                                data.reason,

                            notes:
                                data.notes

                        })

                }
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.message ||
                "Failed to create appointment"
            );

        }


        showToast(
            "Appointment Created",
            "New appointment has been scheduled successfully.",
            "success"
        );


        closeAppointmentModal();


        /*
         * IMPORTANT:
         * Reload from SQLite instead of
         * adding to localStorage.
         */

        await loadAppointmentsFromDatabase();


    } catch (error) {

        console.error(
            "Create appointment error:",
            error
        );


        showToast(
            "Error",
            error.message ||
                "Failed to create appointment.",
            "error"
        );

    }


    closeAppointmentModal();

    renderAppointments();

    updateAppointmentStatistics();

}


/* =========================================================
   VALIDATE FORM
========================================================= */

function validateAppointmentForm() {

    const patient =
        appointmentPatient.value;

    const doctor =
        appointmentDoctor.value;

    const date =
        appointmentDate.value;

    const time =
        appointmentTime.value;

    const reason =
        appointmentReason.value.trim();


    if (!patient) {

        return {
            valid: false,
            message:
                "Please select a patient."
        };

    }


    if (!doctor) {

        return {
            valid: false,
            message:
                "Please select a doctor."
        };

    }


    if (!date) {

        return {
            valid: false,
            message:
                "Please select an appointment date."
        };

    }


    if (!time) {

        return {
            valid: false,
            message:
                "Please select an appointment time."
        };

    }


    if (!reason) {

        return {
            valid: false,
            message:
                "Please enter the reason for the visit."
        };

    }


    return {
        valid: true,
        message: ""
    };

}


/* =========================================================
   VIEW APPOINTMENT
========================================================= */

function viewAppointment(id) {

    const appointment =
        appointmentsData.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!appointment) {

        showToast(
            "Error",
            "Appointment could not be found.",
            "error"
        );

        return;

    }


    const patientName =
        getPatientName(
            appointment.patientId,
            appointment.patientName
        );


    const doctorName =
        getDoctorName(
            appointment.doctorId,
            appointment.doctorName
        );


    const department =
        appointment.department ||
        getAppointmentDepartment(
            appointment.doctorId
        );


    if (appointmentViewContent) {

        appointmentViewContent.innerHTML = `

            <div class="appointment-detail-grid">


                <div class="detail-item">

                    <span>
                        Patient
                    </span>

                    <strong>
                        ${escapeHTML(
                            patientName
                        )}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Doctor
                    </span>

                    <strong>
                        ${escapeHTML(
                            doctorName
                        )}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Department
                    </span>

                    <strong>
                        ${escapeHTML(
                            department ||
                            "General"
                        )}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Date
                    </span>

                    <strong>
                        ${formatAppointmentDate(
                            appointment.date
                        )}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Time
                    </span>

                    <strong>
                        ${formatAppointmentTime(
                            appointment.time
                        )}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Consultation Fee
                    </span>

                    <strong>
                        ₹${Number(
                            appointment.fee || 0
                        ).toLocaleString(
                            "en-IN"
                        )}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Status
                    </span>

                    <strong>

                        <span class="status-badge ${getAppointmentStatusClass(
                            appointment.status
                        )}">

                            ${escapeHTML(
                                appointment.status
                            )}

                        </span>

                    </strong>

                </div>


                <div class="detail-item detail-full">

                    <span>
                        Reason for Visit
                    </span>

                    <strong>
                        ${escapeHTML(
                            appointment.reason ||
                            "Not specified"
                        )}
                    </strong>

                </div>


                <div class="detail-item detail-full">

                    <span>
                        Additional Notes
                    </span>

                    <strong>
                        ${escapeHTML(
                            appointment.notes ||
                            "No additional notes"
                        )}
                    </strong>

                </div>

            </div>

        `;

    }


    if (appointmentViewOverlay) {

        appointmentViewOverlay.classList.add(
            "active"
        );

    }

}


/* =========================================================
   INITIALIZE VIEW MODAL
========================================================= */

function initializeAppointmentView() {

    if (appointmentViewClose) {

        appointmentViewClose.addEventListener(
            "click",
            closeAppointmentView
        );

    }


    if (appointmentViewDone) {

        appointmentViewDone.addEventListener(
            "click",
            closeAppointmentView
        );

    }


    if (appointmentViewOverlay) {

        appointmentViewOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    appointmentViewOverlay
                ) {

                    closeAppointmentView();

                }

            }
        );

    }

}


/* =========================================================
   CLOSE VIEW
========================================================= */

function closeAppointmentView() {

    if (appointmentViewOverlay) {

        appointmentViewOverlay.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   OPEN DELETE
========================================================= */

/* =========================================================
   OPEN DELETE
========================================================= */

function openDeleteAppointment(id) {

    const appointment =
        appointmentsData.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!appointment) {

        showToast(
            "Error",
            "Appointment could not be found.",
            "error"
        );

        return;

    }


    appointmentToDelete =
        id;


    const patientName =
        getPatientName(
            appointment.patientId,
            appointment.patientName
        );


    if (appointmentDeleteMessage) {

        appointmentDeleteMessage.textContent =

            `You are about to delete the appointment ` +

            `for ${patientName}. This action cannot be undone.`;

    }


    if (appointmentDeleteOverlay) {

        appointmentDeleteOverlay.classList.add(
            "active"
        );

    }

}


/* =========================================================
   CLOSE DELETE
========================================================= */

function closeDeleteAppointment() {

    appointmentToDelete =
        null;


    if (appointmentDeleteOverlay) {

        appointmentDeleteOverlay.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   INITIALIZE DELETE
========================================================= */

function initializeAppointmentDelete() {

    if (appointmentDeleteClose) {

        appointmentDeleteClose.addEventListener(
            "click",
            closeDeleteAppointment
        );

    }


    if (appointmentDeleteCancel) {

        appointmentDeleteCancel.addEventListener(
            "click",
            closeDeleteAppointment
        );

    }


    if (appointmentDeleteOverlay) {

        appointmentDeleteOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    appointmentDeleteOverlay
                ) {

                    closeDeleteAppointment();

                }

            }
        );

    }


    if (appointmentDeleteConfirm) {

        appointmentDeleteConfirm.addEventListener(
            "click",
            confirmDeleteAppointment
        );

    }

}


/* =========================================================
   CONFIRM DELETE
========================================================= */

/* =========================================================
   CONFIRM DELETE
========================================================= */

async function confirmDeleteAppointment() {

    if (!appointmentToDelete) {

        return;

    }


    const appointment =
        appointmentsData.find(
            item =>
                String(item.id) ===
                String(appointmentToDelete)
        );


    try {

        const response =
            await fetch(
                `/api/admin/appointments/${appointmentToDelete}`,
                {

                    method: "DELETE",

                    credentials: "include"

                }
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.message ||
                "Failed to delete appointment"
            );

        }


        closeDeleteAppointment();


        showToast(
            "Appointment Deleted",
            appointment
                ? `${appointment.patientName || "Appointment"} has been removed successfully.`
                : "Appointment has been removed successfully.",
            "success"
        );


        /*
         * Reload the latest data
         * directly from SQLite.
         */

        await loadAppointmentsFromDatabase();


    } catch (error) {

        console.error(
            "Delete appointment error:",
            error
        );


        showToast(
            "Error",
            error.message ||
                "Failed to delete appointment.",
            "error"
        );

    }

}


/* =========================================================
   STATUS CLASS
========================================================= */

function getAppointmentStatusClass(
    status
) {

    switch (
        String(status)
            .toLowerCase()
    ) {

        case "confirmed":

            return "success";

        case "completed":

            return "info";

        case "cancelled":

            return "danger";

        case "pending":

            return "warning";

        default:

            return "neutral";

    }

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatAppointmentDate(
    dateString
) {

    if (!dateString) {

        return "-";

    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   TIME FORMAT
========================================================= */

function formatAppointmentTime(
    timeString
) {

    if (!timeString) {

        return "-";

    }


    const parts =
        timeString.split(":");


    if (parts.length < 2) {

        return timeString;

    }


    let hour =
        Number(parts[0]);

    const minute =
        parts[1];


    const period =
        hour >= 12
            ? "PM"
            : "AM";


    hour =
        hour % 12 ||
        12;


    return `${hour}:${minute} ${period}`;

}


/* =========================================================
   TRUNCATE TEXT
========================================================= */

function truncateText(
    text,
    length
) {

    if (!text) {

        return "";

    }


    if (
        text.length <= length
    ) {

        return text;

    }


    return (
        text.substring(
            0,
            length
        ) + "..."
    );

}


/* =========================================================
   INITIALS
========================================================= */

function getInitials(name) {

    if (!name) {

        return "PC";

    }


    const parts =
        name
            .trim()
            .split(/\s+/);


    if (
        parts.length === 1
    ) {

        return parts[0]
            .substring(
                0,
                2
            )
            .toUpperCase();

    }


    return (

        parts[0][0] +

        parts[
            parts.length - 1
        ][0]

    ).toUpperCase();

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   KEYBOARD SUPPORT
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        closeAppointmentModal();

        closeAppointmentView();

        closeDeleteAppointment();

    }
);


/* =========================================================
   GLOBAL API
========================================================= */

window.PulseCareAppointments = {

    renderAppointments,

    updateAppointmentStatistics,

    openAddAppointmentModal,

    editAppointment,

    viewAppointment,

    openDeleteAppointment

};