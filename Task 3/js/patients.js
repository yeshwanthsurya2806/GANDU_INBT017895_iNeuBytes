/* =========================================================
   PULSECARE HEALTHCARE MANAGEMENT DASHBOARD
   patients.js

   Patient Management:
   - Display patients
   - Search patients
   - Gender filter
   - Blood group filter
   - Add patient
   - Edit patient
   - Delete patient
   - View patient
   - Form validation
   - LocalStorage CRUD
   ========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const patientSearch =
    document.getElementById("patientSearch");

const patientGenderFilter =
    document.getElementById("patientGenderFilter");

const patientBloodFilter =
    document.getElementById("patientBloodFilter");

const patientsTable =
    document.getElementById("patientsTable");

const patientEmptyState =
    document.getElementById("patientEmptyState");

const patientResultsInfo =
    document.getElementById("patientResultsInfo");


/* =========================================================
   STATISTICS ELEMENTS
========================================================= */

const patientTotalCount =
    document.getElementById("patientTotalCount");

const patientMaleCount =
    document.getElementById("patientMaleCount");

const patientFemaleCount =
    document.getElementById("patientFemaleCount");

const patientAverageAge =
    document.getElementById("patientAverageAge");


/* =========================================================
   MODAL ELEMENTS
========================================================= */

const addPatientBtn =
    document.getElementById("addPatientBtn");

const patientModalOverlay =
    document.getElementById("patientModalOverlay");

const patientModalTitle =
    document.getElementById("patientModalTitle");

const patientModalClose =
    document.getElementById("patientModalClose");

const patientCancelBtn =
    document.getElementById("patientCancelBtn");

const patientForm =
    document.getElementById("patientForm");


/* =========================================================
   FORM ELEMENTS
========================================================= */

const patientId =
    document.getElementById("patientId");

const patientName =
    document.getElementById("patientName");

const patientAge =
    document.getElementById("patientAge");

const patientGender =
    document.getElementById("patientGender");

const patientBloodGroup =
    document.getElementById("patientBloodGroup");

const patientDepartment =
    document.getElementById("patientDepartment");

const patientPhone =
    document.getElementById("patientPhone");

const patientEmail =
    document.getElementById("patientEmail");

const patientAddress =
    document.getElementById("patientAddress");


/* =========================================================
   DELETE MODAL
========================================================= */

const patientDeleteOverlay =
    document.getElementById(
        "patientDeleteOverlay"
    );

const patientDeleteClose =
    document.getElementById(
        "patientDeleteClose"
    );

const patientDeleteCancel =
    document.getElementById(
        "patientDeleteCancel"
    );

const patientDeleteConfirm =
    document.getElementById(
        "patientDeleteConfirm"
    );

const patientDeleteMessage =
    document.getElementById(
        "patientDeleteMessage"
    );


/* =========================================================
   STATE
========================================================= */

let patientToDelete = null;


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializePatientPage();

    }
);


/* =========================================================
   INITIALIZE PATIENT PAGE
========================================================= */

function initializePatientPage() {

    renderPatients();

    updatePatientStatistics();

    initializePatientSearch();

    initializePatientFilters();

    initializePatientModal();

    initializePatientDelete();

}


/* =========================================================
   GET FILTERED PATIENTS
========================================================= */

function getFilteredPatients() {

    const patients =
        getPatients();


    const searchTerm =
        patientSearch
            ? patientSearch.value
                .trim()
                .toLowerCase()
            : "";


    const gender =
        patientGenderFilter
            ? patientGenderFilter.value
            : "All";


    const bloodGroup =
        patientBloodFilter
            ? patientBloodFilter.value
            : "All";


    return patients.filter(
        patient => {


            /* -------------------------
               SEARCH
            ------------------------- */

            const matchesSearch =

                !searchTerm ||

                String(patient.name)
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                String(patient.phone)
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                String(patient.email)
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                String(patient.address)
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                String(patient.department)
                    .toLowerCase()
                    .includes(searchTerm);


            /* -------------------------
               GENDER
            ------------------------- */

            const matchesGender =

                gender === "All" ||

                patient.gender === gender;


            /* -------------------------
               BLOOD GROUP
            ------------------------- */

            const matchesBloodGroup =

                bloodGroup === "All" ||

                patient.bloodGroup ===
                    bloodGroup;


            return (
                matchesSearch &&
                matchesGender &&
                matchesBloodGroup
            );

        }
    );

}


/* =========================================================
   RENDER PATIENTS
========================================================= */

function renderPatients() {

    if (!patientsTable) {

        return;

    }


    const patients =
        getFilteredPatients();


    patientsTable.innerHTML = "";


    /* -------------------------
       EMPTY STATE
    ------------------------- */

    if (patients.length === 0) {

        if (patientEmptyState) {

            patientEmptyState.style.display =
                "block";

        }


        if (patientResultsInfo) {

            patientResultsInfo.textContent =
                "Showing 0 patients";

        }

        return;

    }


    if (patientEmptyState) {

        patientEmptyState.style.display =
            "none";

    }


    /* -------------------------
       CREATE TABLE ROWS
    ------------------------- */

    patients.forEach(
        patient => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <!-- PATIENT -->

                <td>

                    <div class="table-user">

                        <div class="table-avatar">

                            ${getInitials(
                                patient.name
                            )}

                        </div>

                        <div>

                            <strong>

                                ${escapeHTML(
                                    patient.name
                                )}

                            </strong>

                            <span>

                                ${escapeHTML(
                                    patient.id
                                )}

                            </span>

                        </div>

                    </div>

                </td>


                <!-- AGE / GENDER -->

                <td>

                    <strong>

                        ${patient.age}

                    </strong>

                    <span class="table-secondary">

                        ${escapeHTML(
                            patient.gender
                        )}

                    </span>

                </td>


                <!-- BLOOD GROUP -->

                <td>

                    <span class="blood-badge">

                        ${escapeHTML(
                            patient.bloodGroup ||
                            "-"
                        )}

                    </span>

                </td>


                <!-- PHONE -->

                <td>

                    ${escapeHTML(
                        patient.phone
                    )}

                </td>


                <!-- DEPARTMENT -->

                <td>

                    ${
                        patient.department
                            ? `
                                <span class="department-badge">

                                    ${escapeHTML(
                                        patient.department
                                    )}

                                </span>
                              `
                            : `
                                <span class="muted-text">
                                    Not assigned
                                </span>
                              `
                    }

                </td>


                <!-- EMAIL -->

                <td>

                    <span class="email-cell">

                        ${escapeHTML(
                            patient.email
                        )}

                    </span>

                </td>


                <!-- ACTIONS -->

                <td>

                    <div class="action-buttons">


                        <button
                            type="button"
                            class="action-button view"
                            title="View Patient"
                            data-action="view"
                            data-id="${patient.id}"
                        >

                            <i class="fa-solid fa-eye"></i>

                        </button>


                        <button
                            type="button"
                            class="action-button edit"
                            title="Edit Patient"
                            data-action="edit"
                            data-id="${patient.id}"
                        >

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            type="button"
                            class="action-button delete"
                            title="Delete Patient"
                            data-action="delete"
                            data-id="${patient.id}"
                        >

                            <i class="fa-solid fa-trash"></i>

                        </button>


                    </div>

                </td>

            `;


            patientsTable.appendChild(
                row
            );

        }
    );


    if (patientResultsInfo) {

        patientResultsInfo.textContent =

            `Showing ${patients.length} patient` +

            `${patients.length !== 1 ? "s" : ""}`;

    }


    initializePatientActions();

}


/* =========================================================
   ACTION BUTTONS
========================================================= */

function initializePatientActions() {

    const buttons =
        document.querySelectorAll(
            "#patientsTable .action-button"
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

                        viewPatient(id);

                    }

                    else if (
                        action === "edit"
                    ) {

                        editPatient(id);

                    }

                    else if (
                        action === "delete"
                    ) {

                        openDeletePatient(id);

                    }

                }
            );

        }
    );

}


/* =========================================================
   VIEW PATIENT
========================================================= */

function viewPatient(id) {

    const patient =
        getPatientById(id);


    if (!patient) {

        showToast(
            "Error",
            "Patient record could not be found.",
            "error"
        );

        return;

    }


    alert(

        `Patient Details\n\n` +

        `Name: ${patient.name}\n` +

        `Age: ${patient.age}\n` +

        `Gender: ${patient.gender}\n` +

        `Blood Group: ${patient.bloodGroup}\n` +

        `Phone: ${patient.phone}\n` +

        `Email: ${patient.email}\n` +

        `Department: ${
            patient.department || "Not assigned"
        }\n` +

        `Address: ${
            patient.address || "Not provided"
        }`

    );

}


/* =========================================================
   SEARCH
========================================================= */

function initializePatientSearch() {

    if (!patientSearch) {

        return;

    }


    patientSearch.addEventListener(
        "input",
        () => {

            renderPatients();

        }
    );

}


/* =========================================================
   FILTERS
========================================================= */

function initializePatientFilters() {

    if (patientGenderFilter) {

        patientGenderFilter.addEventListener(
            "change",
            () => {

                renderPatients();

            }
        );

    }


    if (patientBloodFilter) {

        patientBloodFilter.addEventListener(
            "change",
            () => {

                renderPatients();

            }
        );

    }

}


/* =========================================================
   PATIENT STATISTICS
========================================================= */

function updatePatientStatistics() {

    const patients =
        getPatients();


    /* TOTAL */

    if (patientTotalCount) {

        patientTotalCount.textContent =
            patients.length;

    }


    /* MALE */

    const malePatients =
        patients.filter(
            patient =>
                patient.gender ===
                "Male"
        );


    if (patientMaleCount) {

        patientMaleCount.textContent =
            malePatients.length;

    }


    /* FEMALE */

    const femalePatients =
        patients.filter(
            patient =>
                patient.gender ===
                "Female"
        );


    if (patientFemaleCount) {

        patientFemaleCount.textContent =
            femalePatients.length;

    }


    /* AVERAGE AGE */

    const totalAge =
        patients.reduce(
            (
                total,
                patient
            ) => {

                return (
                    total +
                    Number(
                        patient.age
                    )
                );

            },
            0
        );


    const averageAge =
        patients.length
            ? Math.round(
                totalAge /
                patients.length
            )
            : 0;


    if (patientAverageAge) {

        patientAverageAge.textContent =
            `${averageAge} yrs`;

    }

}


/* =========================================================
   OPEN ADD PATIENT MODAL
========================================================= */

function openAddPatientModal() {

    resetPatientForm();


    if (patientModalTitle) {

        patientModalTitle.textContent =
            "Add Patient";

    }


    if (patientModalOverlay) {

        patientModalOverlay.classList.add(
            "active"
        );

    }


    setTimeout(
        () => {

            if (patientName) {

                patientName.focus();

            }

        },
        100
    );

}


/* =========================================================
   EDIT PATIENT
========================================================= */

function editPatient(id) {

    const patient =
        getPatientById(id);


    if (!patient) {

        showToast(
            "Error",
            "Patient record could not be found.",
            "error"
        );

        return;

    }


    patientId.value =
        patient.id;

    patientName.value =
        patient.name;

    patientAge.value =
        patient.age;

    patientGender.value =
        patient.gender;

    patientBloodGroup.value =
        patient.bloodGroup;

    patientDepartment.value =
        patient.department || "";

    patientPhone.value =
        patient.phone;

    patientEmail.value =
        patient.email;

    patientAddress.value =
        patient.address || "";


    if (patientModalTitle) {

        patientModalTitle.textContent =
            "Edit Patient";

    }


    patientModalOverlay.classList.add(
        "active"
    );


    setTimeout(
        () => {

            if (patientName) {

                patientName.focus();

            }

        },
        100
    );

}


/* =========================================================
   INITIALIZE MODAL
========================================================= */

function initializePatientModal() {

    if (addPatientBtn) {

        addPatientBtn.addEventListener(
            "click",
            openAddPatientModal
        );

    }


    if (patientModalClose) {

        patientModalClose.addEventListener(
            "click",
            closePatientModal
        );

    }


    if (patientCancelBtn) {

        patientCancelBtn.addEventListener(
            "click",
            closePatientModal
        );

    }


    if (patientModalOverlay) {

        patientModalOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    patientModalOverlay
                ) {

                    closePatientModal();

                }

            }
        );

    }


    if (patientForm) {

        patientForm.addEventListener(
            "submit",
            handlePatientSubmit
        );

    }

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closePatientModal() {

    if (patientModalOverlay) {

        patientModalOverlay.classList.remove(
            "active"
        );

    }


    resetPatientForm();

}


/* =========================================================
   RESET FORM
========================================================= */

function resetPatientForm() {

    if (!patientForm) {

        return;

    }


    patientForm.reset();


    if (patientId) {

        patientId.value =
            "";

    }

}


/* =========================================================
   SUBMIT PATIENT FORM
========================================================= */

function handlePatientSubmit(
    event
) {

    event.preventDefault();


    const validation =
        validatePatientForm();


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
            patientName.value.trim(),

        age:
            Number(
                patientAge.value
            ),

        gender:
            patientGender.value,

        bloodGroup:
            patientBloodGroup.value,

        department:
            patientDepartment.value,

        phone:
            patientPhone.value.trim(),

        email:
            patientEmail.value.trim(),

        address:
            patientAddress.value.trim()

    };


    /* EDIT */

    if (
        patientId &&
        patientId.value
    ) {

        updatePatient(
            patientId.value,
            data
        );


        showToast(
            "Patient Updated",
            "Patient information has been updated successfully.",
            "success"
        );

    }


    /* CREATE */

    else {

        addPatient(
            data
        );


        showToast(
            "Patient Added",
            "New patient has been registered successfully.",
            "success"
        );

    }


    closePatientModal();

    renderPatients();

    updatePatientStatistics();

}


/* =========================================================
   VALIDATE PATIENT FORM
========================================================= */

function validatePatientForm() {

    const name =
        patientName.value.trim();

    const age =
        Number(
            patientAge.value
        );

    const gender =
        patientGender.value;

    const bloodGroup =
        patientBloodGroup.value;

    const phone =
        patientPhone.value.trim();

    const email =
        patientEmail.value.trim();


    /* NAME */

    if (!name) {

        return {
            valid: false,
            message:
                "Please enter the patient's name."
        };

    }


    if (name.length < 3) {

        return {
            valid: false,
            message:
                "Patient name must contain at least 3 characters."
        };

    }


    /* AGE */

    if (
        Number.isNaN(age) ||
        age < 1 ||
        age > 120
    ) {

        return {
            valid: false,
            message:
                "Please enter a valid age between 1 and 120."
        };

    }


    /* GENDER */

    if (!gender) {

        return {
            valid: false,
            message:
                "Please select the patient's gender."
        };

    }


    /* BLOOD GROUP */

    if (!bloodGroup) {

        return {
            valid: false,
            message:
                "Please select the patient's blood group."
        };

    }


    /* PHONE */

    if (
        !/^[0-9]{10}$/.test(phone)
    ) {

        return {
            valid: false,
            message:
                "Phone number must contain exactly 10 digits."
        };

    }


    /* EMAIL */

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


    return {
        valid: true,
        message: ""
    };

}


/* =========================================================
   OPEN DELETE MODAL
========================================================= */

function openDeletePatient(id) {

    const patient =
        getPatientById(id);


    if (!patient) {

        showToast(
            "Error",
            "Patient record could not be found.",
            "error"
        );

        return;

    }


    patientToDelete =
        id;


    if (patientDeleteMessage) {

        patientDeleteMessage.textContent =

            `You are about to delete ${patient.name}. ` +

            `This action cannot be undone.`;

    }


    if (patientDeleteOverlay) {

        patientDeleteOverlay.classList.add(
            "active"
        );

    }

}


/* =========================================================
   CLOSE DELETE MODAL
========================================================= */

function closeDeletePatient() {

    patientToDelete =
        null;


    if (patientDeleteOverlay) {

        patientDeleteOverlay.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   INITIALIZE DELETE
========================================================= */

function initializePatientDelete() {

    if (patientDeleteClose) {

        patientDeleteClose.addEventListener(
            "click",
            closeDeletePatient
        );

    }


    if (patientDeleteCancel) {

        patientDeleteCancel.addEventListener(
            "click",
            closeDeletePatient
        );

    }


    if (patientDeleteOverlay) {

        patientDeleteOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    patientDeleteOverlay
                ) {

                    closeDeletePatient();

                }

            }
        );

    }


    if (patientDeleteConfirm) {

        patientDeleteConfirm.addEventListener(
            "click",
            confirmDeletePatient
        );

    }

}


/* =========================================================
   CONFIRM DELETE
========================================================= */

function confirmDeletePatient() {

    if (!patientToDelete) {

        return;

    }


    const patient =
        getPatientById(
            patientToDelete
        );


    deletePatient(
        patientToDelete
    );


    closeDeletePatient();


    showToast(
        "Patient Deleted",
        patient
            ? `${patient.name} has been removed successfully.`
            : "Patient has been removed successfully.",
        "success"
    );


    renderPatients();

    updatePatientStatistics();

}


/* =========================================================
   INITIALS
========================================================= */

function getInitials(name) {

    if (!name) {

        return "PT";

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

            closePatientModal();

            closeDeletePatient();

        }

    }
);


/* =========================================================
   GLOBAL API
========================================================= */

window.PulseCarePatients = {

    renderPatients,

    updatePatientStatistics,

    openAddPatientModal,

    editPatient,

    viewPatient,

    openDeletePatient

};