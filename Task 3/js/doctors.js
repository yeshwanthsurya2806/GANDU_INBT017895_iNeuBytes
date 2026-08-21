/* =========================================================
   PULSECARE HEALTHCARE MANAGEMENT DASHBOARD
   doctors.js

   Doctor Management:
   - Display doctors
   - Search
   - Department filter
   - Status filter
   - Add doctor
   - Edit doctor
   - Delete doctor
   - Form validation
   - LocalStorage CRUD
   ========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const doctorSearch =
    document.getElementById("doctorSearch");

const doctorDepartmentFilter =
    document.getElementById(
        "doctorDepartmentFilter"
    );

const doctorStatusFilter =
    document.getElementById(
        "doctorStatusFilter"
    );

const doctorsTable =
    document.getElementById("doctorsTable");

const doctorEmptyState =
    document.getElementById(
        "doctorEmptyState"
    );

const doctorResultsInfo =
    document.getElementById(
        "doctorResultsInfo"
    );


/* Statistics */

const doctorTotalCount =
    document.getElementById(
        "doctorTotalCount"
    );

const doctorActiveCount =
    document.getElementById(
        "doctorActiveCount"
    );

const doctorDepartmentCount =
    document.getElementById(
        "doctorDepartmentCount"
    );

const doctorAverageFee =
    document.getElementById(
        "doctorAverageFee"
    );


/* Add/Edit modal */

const addDoctorBtn =
    document.getElementById(
        "addDoctorBtn"
    );

const doctorModalOverlay =
    document.getElementById(
        "doctorModalOverlay"
    );

const doctorModalTitle =
    document.getElementById(
        "doctorModalTitle"
    );

const doctorModalClose =
    document.getElementById(
        "doctorModalClose"
    );

const doctorCancelBtn =
    document.getElementById(
        "doctorCancelBtn"
    );

const doctorForm =
    document.getElementById(
        "doctorForm"
    );


/* Form fields */

const doctorId =
    document.getElementById(
        "doctorId"
    );

const doctorName =
    document.getElementById(
        "doctorName"
    );

const doctorDepartment =
    document.getElementById(
        "doctorDepartment"
    );

const doctorStatus =
    document.getElementById(
        "doctorStatus"
    );

const doctorQualification =
    document.getElementById(
        "doctorQualification"
    );

const doctorExperience =
    document.getElementById(
        "doctorExperience"
    );

const doctorFee =
    document.getElementById(
        "doctorFee"
    );

const doctorPhone =
    document.getElementById(
        "doctorPhone"
    );

const doctorEmail =
    document.getElementById(
        "doctorEmail"
    );

const doctorRating =
    document.getElementById(
        "doctorRating"
    );


/* Delete modal */

const doctorDeleteOverlay =
    document.getElementById(
        "doctorDeleteOverlay"
    );

const doctorDeleteClose =
    document.getElementById(
        "doctorDeleteClose"
    );

const doctorDeleteCancel =
    document.getElementById(
        "doctorDeleteCancel"
    );

const doctorDeleteConfirm =
    document.getElementById(
        "doctorDeleteConfirm"
    );

const doctorDeleteMessage =
    document.getElementById(
        "doctorDeleteMessage"
    );


/* =========================================================
   STATE
========================================================= */

let doctorToDelete = null;


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeDoctorPage();

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

function initializeDoctorPage() {

    renderDoctors();

    updateDoctorStatistics();

    initializeDoctorSearch();

    initializeDoctorFilters();

    initializeDoctorModal();

    initializeDoctorDelete();

}


/* =========================================================
   GET FILTERED DOCTORS
========================================================= */

function getFilteredDoctors() {

    const doctors =
        getDoctors();


    const searchTerm =
        doctorSearch
            ? doctorSearch.value
                .trim()
                .toLowerCase()
            : "";


    const department =
        doctorDepartmentFilter
            ? doctorDepartmentFilter.value
            : "All";


    const status =
        doctorStatusFilter
            ? doctorStatusFilter.value
            : "All";


    return doctors.filter(
        doctor => {


            /* Search */

            const matchesSearch =

                !searchTerm ||

                String(doctor.name)
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                String(doctor.department)
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                String(doctor.qualification)
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                String(doctor.email)
                    .toLowerCase()
                    .includes(searchTerm);


            /* Department */

            const matchesDepartment =

                department === "All" ||

                doctor.department ===
                    department;


            /* Status */

            const matchesStatus =

                status === "All" ||

                doctor.status ===
                    status;


            return (
                matchesSearch &&
                matchesDepartment &&
                matchesStatus
            );

        }
    );

}


/* =========================================================
   RENDER DOCTORS
========================================================= */

function renderDoctors() {

    if (!doctorsTable) {

        return;

    }


    const doctors =
        getFilteredDoctors();


    doctorsTable.innerHTML = "";


    /* Empty */

    if (doctors.length === 0) {

        if (doctorEmptyState) {

            doctorEmptyState.style.display =
                "block";

        }


        if (doctorResultsInfo) {

            doctorResultsInfo.textContent =
                "Showing 0 doctors";

        }

        return;

    }


    /* Hide empty state */

    if (doctorEmptyState) {

        doctorEmptyState.style.display =
            "none";

    }


    /* Generate rows */

    doctors.forEach(
        doctor => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <div class="table-user">

                        <div class="table-avatar">

                            ${getInitials(
                                doctor.name
                            )}

                        </div>

                        <div>

                            <strong>

                                ${escapeHTML(
                                    doctor.name
                                )}

                            </strong>

                            <span>

                                ${escapeHTML(
                                    doctor.email
                                )}

                            </span>

                        </div>

                    </div>

                </td>


                <td>

                    <span class="department-badge">

                        ${escapeHTML(
                            doctor.department
                        )}

                    </span>

                </td>


                <td>

                    ${escapeHTML(
                        doctor.qualification
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        doctor.experience
                    )}

                </td>


                <td>

                    <strong>

                        ₹${formatNumber(
                            doctor.fee
                        )}

                    </strong>

                </td>


                <td>

                    <span
                        class="status-badge
                        ${getStatusClass(
                            doctor.status
                        )}"
                    >

                        ${escapeHTML(
                            doctor.status
                        )}

                    </span>

                </td>


                <td>

                    <div class="action-buttons">


                        <button
                            type="button"
                            class="action-button view"
                            title="View Doctor"
                            data-action="view"
                            data-id="${doctor.id}"
                        >

                            <i class="fa-solid fa-eye"></i>

                        </button>


                        <button
                            type="button"
                            class="action-button edit"
                            title="Edit Doctor"
                            data-action="edit"
                            data-id="${doctor.id}"
                        >

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            type="button"
                            class="action-button delete"
                            title="Delete Doctor"
                            data-action="delete"
                            data-id="${doctor.id}"
                        >

                            <i class="fa-solid fa-trash"></i>

                        </button>


                    </div>

                </td>

            `;


            doctorsTable.appendChild(
                row
            );

        }
    );


    /* Results */

    if (doctorResultsInfo) {

        doctorResultsInfo.textContent =

            `Showing ${doctors.length} doctor` +

            `${doctors.length !== 1 ? "s" : ""}`;

    }


    initializeDoctorActions();

}


/* =========================================================
   DOCTOR ACTION BUTTONS
========================================================= */

function initializeDoctorActions() {

    const buttons =
        document.querySelectorAll(
            ".action-button"
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

                        viewDoctor(id);

                    }


                    else if (
                        action === "edit"
                    ) {

                        editDoctor(id);

                    }


                    else if (
                        action === "delete"
                    ) {

                        openDeleteDoctor(id);

                    }

                }
            );

        }
    );

}


/* =========================================================
   VIEW DOCTOR
========================================================= */

function viewDoctor(id) {

    const doctor =
        getDoctorById(id);


    if (!doctor) {

        showToast(
            "Error",
            "Doctor record could not be found.",
            "error"
        );

        return;

    }


    alert(

        `Doctor Details\n\n` +

        `Name: ${doctor.name}\n` +

        `Department: ${doctor.department}\n` +

        `Qualification: ${doctor.qualification}\n` +

        `Experience: ${doctor.experience}\n` +

        `Consultation Fee: ₹${doctor.fee}\n` +

        `Phone: ${doctor.phone}\n` +

        `Email: ${doctor.email}\n` +

        `Rating: ${doctor.rating}\n` +

        `Status: ${doctor.status}`

    );

}


/* =========================================================
   SEARCH
========================================================= */

function initializeDoctorSearch() {

    if (!doctorSearch) {

        return;

    }


    doctorSearch.addEventListener(
        "input",
        () => {

            renderDoctors();

        }
    );

}


/* =========================================================
   FILTERS
========================================================= */

function initializeDoctorFilters() {

    if (doctorDepartmentFilter) {

        doctorDepartmentFilter.addEventListener(
            "change",
            () => {

                renderDoctors();

            }
        );

    }


    if (doctorStatusFilter) {

        doctorStatusFilter.addEventListener(
            "change",
            () => {

                renderDoctors();

            }
        );

    }

}


/* =========================================================
   DOCTOR STATISTICS
========================================================= */

function updateDoctorStatistics() {

    const doctors =
        getDoctors();


    /* Total */

    if (doctorTotalCount) {

        doctorTotalCount.textContent =
            doctors.length;

    }


    /* Active */

    const activeDoctors =
        doctors.filter(
            doctor =>
                doctor.status ===
                "Active"
        );


    if (doctorActiveCount) {

        doctorActiveCount.textContent =
            activeDoctors.length;

    }


    /* Departments */

    const departments =
        new Set(
            doctors.map(
                doctor =>
                    doctor.department
            )
        );


    if (doctorDepartmentCount) {

        doctorDepartmentCount.textContent =
            departments.size;

    }


    /* Average fee */

    const totalFee =
        doctors.reduce(
            (
                total,
                doctor
            ) => {

                return (
                    total +
                    Number(
                        doctor.fee
                    )
                );

            },
            0
        );


    const averageFee =
        doctors.length
            ? Math.round(
                totalFee /
                doctors.length
            )
            : 0;


    if (doctorAverageFee) {

        doctorAverageFee.textContent =
            `₹${formatNumber(
                averageFee
            )}`;

    }

}


/* =========================================================
   OPEN ADD DOCTOR MODAL
========================================================= */

function openAddDoctorModal() {

    if (!doctorModalOverlay) {

        return;

    }


    resetDoctorForm();


    if (doctorModalTitle) {

        doctorModalTitle.textContent =
            "Add Doctor";

    }


    doctorModalOverlay.classList.add(
        "active"
    );


    setTimeout(
        () => {

            if (doctorName) {

                doctorName.focus();

            }

        },
        100
    );

}


/* =========================================================
   OPEN EDIT DOCTOR MODAL
========================================================= */

function editDoctor(id) {

    const doctor =
        getDoctorById(id);


    if (!doctor) {

        showToast(
            "Error",
            "Doctor record could not be found.",
            "error"
        );

        return;

    }


    doctorId.value =
        doctor.id;

    doctorName.value =
        doctor.name;

    doctorDepartment.value =
        doctor.department;

    doctorStatus.value =
        doctor.status;

    doctorQualification.value =
        doctor.qualification;

    doctorExperience.value =
        doctor.experience;

    doctorFee.value =
        doctor.fee;

    doctorPhone.value =
        doctor.phone;

    doctorEmail.value =
        doctor.email;

    doctorRating.value =
        doctor.rating;


    if (doctorModalTitle) {

        doctorModalTitle.textContent =
            "Edit Doctor";

    }


    doctorModalOverlay.classList.add(
        "active"
    );


    setTimeout(
        () => {

            if (doctorName) {

                doctorName.focus();

            }

        },
        100
    );

}


/* =========================================================
   INITIALIZE MODAL
========================================================= */

function initializeDoctorModal() {

    if (addDoctorBtn) {

        addDoctorBtn.addEventListener(
            "click",
            openAddDoctorModal
        );

    }


    if (doctorModalClose) {

        doctorModalClose.addEventListener(
            "click",
            closeDoctorModal
        );

    }


    if (doctorCancelBtn) {

        doctorCancelBtn.addEventListener(
            "click",
            closeDoctorModal
        );

    }


    if (doctorModalOverlay) {

        doctorModalOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    doctorModalOverlay
                ) {

                    closeDoctorModal();

                }

            }
        );

    }


    if (doctorForm) {

        doctorForm.addEventListener(
            "submit",
            handleDoctorSubmit
        );

    }

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeDoctorModal() {

    if (!doctorModalOverlay) {

        return;

    }


    doctorModalOverlay.classList.remove(
        "active"
    );


    resetDoctorForm();

}


/* =========================================================
   RESET FORM
========================================================= */

function resetDoctorForm() {

    if (!doctorForm) {

        return;

    }


    doctorForm.reset();


    if (doctorId) {

        doctorId.value = "";

    }


    if (doctorStatus) {

        doctorStatus.value =
            "Active";

    }


    if (doctorRating) {

        doctorRating.value =
            "5";

    }


    if (doctorModalTitle) {

        doctorModalTitle.textContent =
            "Add Doctor";

    }

}


/* =========================================================
   SUBMIT DOCTOR FORM
========================================================= */

function handleDoctorSubmit(
    event
) {

    event.preventDefault();


    const validation =
        validateDoctorForm();


    if (!validation.valid) {

        showToast(
            "Validation Error",
            validation.message,
            "error"
        );

        return;

    }


    const data = {

        name:
            doctorName.value.trim(),

        department:
            doctorDepartment.value,

        status:
            doctorStatus.value,

        qualification:
            doctorQualification.value.trim(),

        experience:
            doctorExperience.value.trim(),

        fee:
            Number(
                doctorFee.value
            ),

        phone:
            doctorPhone.value.trim(),

        email:
            doctorEmail.value.trim(),

        rating:
            Number(
                doctorRating.value
            )

    };


    /* EDIT */

    if (
        doctorId &&
        doctorId.value
    ) {

        updateDoctor(
            doctorId.value,
            data
        );


        showToast(
            "Doctor Updated",
            "Doctor information has been updated successfully.",
            "success"
        );

    }


    /* ADD */

    else {

        addDoctor(
            data
        );


        showToast(
            "Doctor Added",
            "New doctor has been added successfully.",
            "success"
        );

    }


    closeDoctorModal();

    renderDoctors();

    updateDoctorStatistics();

}


/* =========================================================
   VALIDATE FORM
========================================================= */

function validateDoctorForm() {

    const name =
        doctorName.value.trim();

    const department =
        doctorDepartment.value;

    const qualification =
        doctorQualification.value.trim();

    const experience =
        doctorExperience.value.trim();

    const fee =
        Number(
            doctorFee.value
        );

    const phone =
        doctorPhone.value.trim();

    const email =
        doctorEmail.value.trim();

    const rating =
        Number(
            doctorRating.value
        );


    if (!name) {

        return {
            valid: false,
            message:
                "Please enter the doctor's name."
        };

    }


    if (name.length < 3) {

        return {
            valid: false,
            message:
                "Doctor name must contain at least 3 characters."
        };

    }


    if (!department) {

        return {
            valid: false,
            message:
                "Please select a department."
        };

    }


    if (!qualification) {

        return {
            valid: false,
            message:
                "Please enter the doctor's qualification."
        };

    }


    if (!experience) {

        return {
            valid: false,
            message:
                "Please enter the doctor's experience."
        };

    }


    if (
        Number.isNaN(fee) ||
        fee < 0
    ) {

        return {
            valid: false,
            message:
                "Please enter a valid consultation fee."
        };

    }


    if (
        !/^[0-9]{10}$/.test(phone)
    ) {

        return {
            valid: false,
            message:
                "Phone number must contain exactly 10 digits."
        };

    }


    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email)
    ) {

        return {
            valid: false,
            message:
                "Please enter a valid email address."
        };

    }


    if (
        Number.isNaN(rating) ||
        rating < 0 ||
        rating > 5
    ) {

        return {
            valid: false,
            message:
                "Rating must be between 0 and 5."
        };

    }


    return {
        valid: true,
        message: ""
    };

}


/* =========================================================
   DELETE DOCTOR
========================================================= */

function openDeleteDoctor(id) {

    const doctor =
        getDoctorById(id);


    if (!doctor) {

        showToast(
            "Error",
            "Doctor record could not be found.",
            "error"
        );

        return;

    }


    doctorToDelete =
        id;


    if (doctorDeleteMessage) {

        doctorDeleteMessage.textContent =

            `You are about to delete ${doctor.name}. ` +

            `This action cannot be undone.`;

    }


    doctorDeleteOverlay.classList.add(
        "active"
    );

}


/* =========================================================
   CLOSE DELETE MODAL
========================================================= */

function closeDeleteDoctor() {

    doctorToDelete =
        null;


    if (doctorDeleteOverlay) {

        doctorDeleteOverlay.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   INITIALIZE DELETE
========================================================= */

function initializeDoctorDelete() {

    if (doctorDeleteClose) {

        doctorDeleteClose.addEventListener(
            "click",
            closeDeleteDoctor
        );

    }


    if (doctorDeleteCancel) {

        doctorDeleteCancel.addEventListener(
            "click",
            closeDeleteDoctor
        );

    }


    if (doctorDeleteOverlay) {

        doctorDeleteOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    doctorDeleteOverlay
                ) {

                    closeDeleteDoctor();

                }

            }
        );

    }


    if (doctorDeleteConfirm) {

        doctorDeleteConfirm.addEventListener(
            "click",
            confirmDeleteDoctor
        );

    }

}


/* =========================================================
   CONFIRM DELETE
========================================================= */

function confirmDeleteDoctor() {

    if (!doctorToDelete) {

        return;

    }


    const doctor =
        getDoctorById(
            doctorToDelete
        );


    deleteDoctor(
        doctorToDelete
    );


    closeDeleteDoctor();


    showToast(
        "Doctor Deleted",
        doctor
            ? `${doctor.name} has been removed successfully.`
            : "Doctor has been removed successfully.",
        "success"
    );


    renderDoctors();

    updateDoctorStatistics();

}


/* =========================================================
   FORMAT NUMBER
========================================================= */

function formatNumber(number) {

    return Number(
        number || 0
    ).toLocaleString(
        "en-IN"
    );

}


/* =========================================================
   STATUS CLASS
========================================================= */

function getStatusClass(status) {

    switch (
        String(status)
            .toLowerCase()
    ) {

        case "active":

            return "success";

        case "inactive":

            return "danger";

        case "pending":

            return "warning";

        default:

            return "neutral";

    }

}


/* =========================================================
   INITIALS
========================================================= */

function getInitials(name) {

    if (!name) {

        return "DR";

    }


    const parts =
        name
            .trim()
            .split(/\s+/);


    if (
        parts.length === 1
    ) {

        return parts[0]
            .substring(0, 2)
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
            event.key === "Escape"
        ) {

            closeDoctorModal();

            closeDeleteDoctor();

        }

    }
);


/* =========================================================
   GLOBAL API
========================================================= */

window.PulseCareDoctors = {

    renderDoctors,

    updateDoctorStatistics,

    openAddDoctorModal,

    editDoctor,

    viewDoctor,

    openDeleteDoctor

};