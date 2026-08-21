/* =========================================================
   PULSECARE HEALTHCARE MANAGEMENT DASHBOARD
   departments.js

   Department Management:
   - Display departments
   - Search departments
   - Status filter
   - Add department
   - Edit department
   - Delete department
   - Assign department head
   - Calculate doctor count
   - Calculate patient count
   - LocalStorage CRUD
   ========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const departmentSearch =
    document.getElementById("departmentSearch");

const departmentStatusFilter =
    document.getElementById(
        "departmentStatusFilter"
    );

const clearDepartmentFilters =
    document.getElementById(
        "clearDepartmentFilters"
    );

const departmentsTable =
    document.getElementById(
        "departmentsTable"
    );

const departmentEmptyState =
    document.getElementById(
        "departmentEmptyState"
    );

const departmentResultsInfo =
    document.getElementById(
        "departmentResultsInfo"
    );


/* =========================================================
   STATISTICS
========================================================= */

const departmentTotalCount =
    document.getElementById(
        "departmentTotalCount"
    );

const departmentActiveCount =
    document.getElementById(
        "departmentActiveCount"
    );

const departmentDoctorCount =
    document.getElementById(
        "departmentDoctorCount"
    );

const departmentPatientCount =
    document.getElementById(
        "departmentPatientCount"
    );


/* =========================================================
   MODAL ELEMENTS
========================================================= */

const addDepartmentBtn =
    document.getElementById(
        "addDepartmentBtn"
    );

const departmentModalOverlay =
    document.getElementById(
        "departmentModalOverlay"
    );

const departmentModalTitle =
    document.getElementById(
        "departmentModalTitle"
    );

const departmentModalClose =
    document.getElementById(
        "departmentModalClose"
    );

const departmentCancelBtn =
    document.getElementById(
        "departmentCancelBtn"
    );

const departmentForm =
    document.getElementById(
        "departmentForm"
    );


/* =========================================================
   FORM ELEMENTS
========================================================= */

const departmentId =
    document.getElementById(
        "departmentId"
    );

const departmentName =
    document.getElementById(
        "departmentName"
    );

const departmentHead =
    document.getElementById(
        "departmentHead"
    );

const departmentStatus =
    document.getElementById(
        "departmentStatus"
    );

const departmentDescription =
    document.getElementById(
        "departmentDescription"
    );


/* =========================================================
   DELETE MODAL
========================================================= */

const departmentDeleteOverlay =
    document.getElementById(
        "departmentDeleteOverlay"
    );

const departmentDeleteClose =
    document.getElementById(
        "departmentDeleteClose"
    );

const departmentDeleteCancel =
    document.getElementById(
        "departmentDeleteCancel"
    );

const departmentDeleteConfirm =
    document.getElementById(
        "departmentDeleteConfirm"
    );

const departmentDeleteMessage =
    document.getElementById(
        "departmentDeleteMessage"
    );


/* =========================================================
   STATE
========================================================= */

let departmentToDelete = null;


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeDepartmentPage();

    }
);


/* =========================================================
   INITIALIZE PAGE
========================================================= */

function initializeDepartmentPage() {

    populateDepartmentHeads();

    renderDepartments();

    updateDepartmentStatistics();

    initializeDepartmentSearch();

    initializeDepartmentFilters();

    initializeDepartmentModal();

    initializeDepartmentDelete();

}


/* =========================================================
   GET DEPARTMENTS
========================================================= */

function getDepartmentList() {

    if (
        typeof getDepartments ===
        "function"
    ) {

        return getDepartments();

    }


    return [];

}


/* =========================================================
   GET FILTERED DEPARTMENTS
========================================================= */

function getFilteredDepartments() {

    const departments =
        getDepartmentList();


    const searchTerm =
        departmentSearch
            ? departmentSearch.value
                .trim()
                .toLowerCase()
            : "";


    const status =
        departmentStatusFilter
            ? departmentStatusFilter.value
            : "All";


    return departments.filter(
        department => {


            const name =
                String(
                    department.name ||
                    ""
                )
                    .toLowerCase();


            const head =
                String(
                    department.headName ||
                    department.head ||
                    ""
                )
                    .toLowerCase();


            const description =
                String(
                    department.description ||
                    ""
                )
                    .toLowerCase();


            const matchesSearch =

                !searchTerm ||

                name.includes(
                    searchTerm
                ) ||

                head.includes(
                    searchTerm
                ) ||

                description.includes(
                    searchTerm
                );


            const matchesStatus =

                status === "All" ||

                department.status ===
                    status;


            return (
                matchesSearch &&
                matchesStatus
            );

        }
    );

}


/* =========================================================
   RENDER DEPARTMENTS
========================================================= */

function renderDepartments() {

    if (!departmentsTable) {

        return;

    }


    const departments =
        getFilteredDepartments();


    departmentsTable.innerHTML =
        "";


    /* EMPTY */

    if (
        departments.length ===
        0
    ) {

        if (departmentEmptyState) {

            departmentEmptyState.style.display =
                "block";

        }


        if (departmentResultsInfo) {

            departmentResultsInfo.textContent =
                "Showing 0 departments";

        }

        return;

    }


    if (departmentEmptyState) {

        departmentEmptyState.style.display =
            "none";

    }


    departments.forEach(
        department => {

            const row =
                document.createElement(
                    "tr"
                );


            const doctorCount =
                getDepartmentDoctorCount(
                    department.name
                );


            const patientCount =
                getDepartmentPatientCount(
                    department.name
                );


            const headName =
                getDepartmentHeadName(
                    department
                );


            const statusClass =
                department.status ===
                "Active"
                    ? "success"
                    : "danger";


            row.innerHTML = `

                <!-- DEPARTMENT -->

                <td>

                    <div class="table-user">

                        <div class="table-avatar department-avatar">

                            ${getDepartmentInitials(
                                department.name
                            )}

                        </div>

                        <div>

                            <strong>

                                ${escapeHTML(
                                    department.name
                                )}

                            </strong>

                            <span>

                                Department

                            </span>

                        </div>

                    </div>

                </td>


                <!-- HEAD -->

                <td>

                    <div class="appointment-doctor-cell">

                        <strong>

                            ${escapeHTML(
                                headName ||
                                "Not Assigned"
                            )}

                        </strong>

                        <span>

                            ${
                                headName
                                    ? "Department Head"
                                    : "No head assigned"
                            }

                        </span>

                    </div>

                </td>


                <!-- DOCTORS -->

                <td>

                    <strong>

                        ${doctorCount}

                    </strong>

                </td>


                <!-- PATIENTS -->

                <td>

                    <strong>

                        ${patientCount}

                    </strong>

                </td>


                <!-- STATUS -->

                <td>

                    <span
                        class="status-badge ${statusClass}"
                    >

                        ${escapeHTML(
                            department.status ||
                            "Active"
                        )}

                    </span>

                </td>


                <!-- DESCRIPTION -->

                <td>

                    <span
                        class="reason-cell"
                        title="${escapeHTML(
                            department.description ||
                            ""
                        )}"
                    >

                        ${escapeHTML(
                            truncateText(
                                department.description ||
                                "No description",
                                40
                            )
                        )}

                    </span>

                </td>


                <!-- ACTIONS -->

                <td>

                    <div class="action-buttons">


                        <button
                            type="button"
                            class="action-button view"
                            title="View Department"
                            data-action="view"
                            data-id="${department.id}"
                        >

                            <i class="fa-solid fa-eye"></i>

                        </button>


                        <button
                            type="button"
                            class="action-button edit"
                            title="Edit Department"
                            data-action="edit"
                            data-id="${department.id}"
                        >

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            type="button"
                            class="action-button delete"
                            title="Delete Department"
                            data-action="delete"
                            data-id="${department.id}"
                        >

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>

            `;


            departmentsTable.appendChild(
                row
            );

        }
    );


    if (departmentResultsInfo) {

        departmentResultsInfo.textContent =

            `Showing ${departments.length} department` +

            `${
                departments.length !== 1
                    ? "s"
                    : ""
            }`;

    }


    initializeDepartmentActions();

}


/* =========================================================
   DEPARTMENT DOCTOR COUNT
========================================================= */

function getDepartmentDoctorCount(
    departmentName
) {

    if (
        typeof getDoctors !==
        "function"
    ) {

        return 0;

    }


    const doctors =
        getDoctors();


    return doctors.filter(
        doctor =>

            String(
                doctor.department ||
                ""
            ).toLowerCase() ===

            String(
                departmentName ||
                ""
            ).toLowerCase()

    ).length;

}


/* =========================================================
   DEPARTMENT PATIENT COUNT
========================================================= */

function getDepartmentPatientCount(
    departmentName
) {

    if (
        typeof getPatients !==
        "function"
    ) {

        return 0;

    }


    const patients =
        getPatients();


    return patients.filter(
        patient =>

            String(
                patient.department ||
                ""
            ).toLowerCase() ===

            String(
                departmentName ||
                ""
            ).toLowerCase()

    ).length;

}


/* =========================================================
   TOTAL DEPARTMENT DOCTORS
========================================================= */

function getTotalDepartmentDoctors() {

    if (
        typeof getDoctors !==
        "function"
    ) {

        return 0;

    }


    return getDoctors().length;

}


/* =========================================================
   TOTAL DEPARTMENT PATIENTS
========================================================= */

function getTotalDepartmentPatients() {

    if (
        typeof getPatients !==
        "function"
    ) {

        return 0;

    }


    return getPatients().length;

}


/* =========================================================
   DEPARTMENT HEAD NAME
========================================================= */

function getDepartmentHeadName(
    department
) {

    if (
        department.headName
    ) {

        return department.headName;

    }


    if (
        department.head
    ) {

        return department.head;

    }


    if (
        department.headId &&
        typeof getDoctorById ===
            "function"
    ) {

        const doctor =
            getDoctorById(
                department.headId
            );


        if (doctor) {

            return doctor.name;

        }

    }


    return "";

}


/* =========================================================
   POPULATE DEPARTMENT HEADS
========================================================= */

function populateDepartmentHeads() {

    if (!departmentHead) {

        return;

    }


    let doctors = [];


    if (
        typeof getDoctors ===
        "function"
    ) {

        doctors =
            getDoctors();

    }


    departmentHead.innerHTML = `

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

                    `${doctor.department || "General"}`;


                departmentHead.appendChild(
                    option
                );

            }
        );

}


/* =========================================================
   STATISTICS
========================================================= */

function updateDepartmentStatistics() {

    const departments =
        getDepartmentList();


    const active =
        departments.filter(
            department =>
                department.status ===
                "Active"
        );


    if (departmentTotalCount) {

        departmentTotalCount.textContent =
            departments.length;

    }


    if (departmentActiveCount) {

        departmentActiveCount.textContent =
            active.length;

    }


    if (departmentDoctorCount) {

        departmentDoctorCount.textContent =
            getTotalDepartmentDoctors();

    }


    if (departmentPatientCount) {

        departmentPatientCount.textContent =
            getTotalDepartmentPatients();

    }

}


/* =========================================================
   SEARCH
========================================================= */

function initializeDepartmentSearch() {

    if (!departmentSearch) {

        return;

    }


    departmentSearch.addEventListener(
        "input",
        () => {

            renderDepartments();

        }
    );

}


/* =========================================================
   FILTERS
========================================================= */

function initializeDepartmentFilters() {

    if (departmentStatusFilter) {

        departmentStatusFilter.addEventListener(
            "change",
            () => {

                renderDepartments();

            }
        );

    }


    if (clearDepartmentFilters) {

        clearDepartmentFilters.addEventListener(
            "click",
            () => {

                if (departmentSearch) {

                    departmentSearch.value =
                        "";

                }


                if (
                    departmentStatusFilter
                ) {

                    departmentStatusFilter.value =
                        "All";

                }


                renderDepartments();

            }
        );

    }

}


/* =========================================================
   ACTION BUTTONS
========================================================= */

function initializeDepartmentActions() {

    const buttons =
        document.querySelectorAll(
            "#departmentsTable .action-button"
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
                        action ===
                        "view"
                    ) {

                        viewDepartment(
                            id
                        );

                    }

                    else if (
                        action ===
                        "edit"
                    ) {

                        editDepartment(
                            id
                        );

                    }

                    else if (
                        action ===
                        "delete"
                    ) {

                        openDeleteDepartment(
                            id
                        );

                    }

                }
            );

        }
    );

}


/* =========================================================
   VIEW DEPARTMENT
========================================================= */

function viewDepartment(id) {

    const department =
        getDepartmentById(
            id
        );


    if (!department) {

        showToast(
            "Error",
            "Department could not be found.",
            "error"
        );

        return;

    }


    const doctorCount =
        getDepartmentDoctorCount(
            department.name
        );


    const patientCount =
        getDepartmentPatientCount(
            department.name
        );


    const headName =
        getDepartmentHeadName(
            department
        );


    alert(

        `Department Details\n\n` +

        `Name: ${department.name}\n` +

        `Head: ${
            headName ||
            "Not Assigned"
        }\n` +

        `Doctors: ${doctorCount}\n` +

        `Patients: ${patientCount}\n` +

        `Status: ${
            department.status ||
            "Active"
        }\n\n` +

        `Description: ${
            department.description ||
            "No description"
        }`

    );

}


/* =========================================================
   OPEN ADD DEPARTMENT MODAL
========================================================= */

function openAddDepartmentModal() {

    resetDepartmentForm();

    populateDepartmentHeads();


    if (departmentModalTitle) {

        departmentModalTitle.textContent =
            "Add Department";

    }


    if (departmentModalOverlay) {

        departmentModalOverlay.classList.add(
            "active"
        );

    }


    setTimeout(
        () => {

            if (departmentName) {

                departmentName.focus();

            }

        },
        100
    );

}


/* =========================================================
   EDIT DEPARTMENT
========================================================= */

function editDepartment(id) {

    const department =
        getDepartmentById(
            id
        );


    if (!department) {

        showToast(
            "Error",
            "Department could not be found.",
            "error"
        );

        return;

    }


    populateDepartmentHeads();


    departmentId.value =
        department.id;


    departmentName.value =
        department.name || "";


    departmentStatus.value =
        department.status ||
        "Active";


    departmentDescription.value =
        department.description ||
        "";


    if (
        department.headId
    ) {

        departmentHead.value =
            department.headId;

    }


    else {

        departmentHead.value =
            "";

    }


    if (departmentModalTitle) {

        departmentModalTitle.textContent =
            "Edit Department";

    }


    departmentModalOverlay.classList.add(
        "active"
    );


    setTimeout(
        () => {

            if (departmentName) {

                departmentName.focus();

            }

        },
        100
    );

}


/* =========================================================
   INITIALIZE MODAL
========================================================= */

function initializeDepartmentModal() {

    if (addDepartmentBtn) {

        addDepartmentBtn.addEventListener(
            "click",
            openAddDepartmentModal
        );

    }


    if (departmentModalClose) {

        departmentModalClose.addEventListener(
            "click",
            closeDepartmentModal
        );

    }


    if (departmentCancelBtn) {

        departmentCancelBtn.addEventListener(
            "click",
            closeDepartmentModal
        );

    }


    if (departmentModalOverlay) {

        departmentModalOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    departmentModalOverlay
                ) {

                    closeDepartmentModal();

                }

            }
        );

    }


    if (departmentForm) {

        departmentForm.addEventListener(
            "submit",
            handleDepartmentSubmit
        );

    }

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeDepartmentModal() {

    if (departmentModalOverlay) {

        departmentModalOverlay.classList.remove(
            "active"
        );

    }


    resetDepartmentForm();

}


/* =========================================================
   RESET FORM
========================================================= */

function resetDepartmentForm() {

    if (!departmentForm) {

        return;

    }


    departmentForm.reset();


    if (departmentId) {

        departmentId.value =
            "";

    }


    if (departmentStatus) {

        departmentStatus.value =
            "Active";

    }

}


/* =========================================================
   SUBMIT DEPARTMENT
========================================================= */

function handleDepartmentSubmit(
    event
) {

    event.preventDefault();


    const validation =
        validateDepartmentForm();


    if (!validation.valid) {

        showToast(
            "Validation Error",
            validation.message,
            "error"
        );

        return;

    }


    const selectedDoctor =
        departmentHead.value &&
        typeof getDoctorById ===
            "function"

            ? getDoctorById(
                departmentHead.value
            )

            : null;


    const data = {

        name:
            departmentName.value
                .trim(),

        headId:
            departmentHead.value ||
            "",

        headName:
            selectedDoctor
                ? selectedDoctor.name
                : "",

        status:
            departmentStatus.value,

        description:
            departmentDescription.value
                .trim()

    };


    /* EDIT */

    if (
        departmentId &&
        departmentId.value
    ) {

        updateDepartment(
            departmentId.value,
            data
        );


        showToast(
            "Department Updated",
            "Department information has been updated successfully.",
            "success"
        );

    }


    /* CREATE */

    else {

        addDepartment(
            data
        );


        showToast(
            "Department Added",
            "New department has been created successfully.",
            "success"
        );

    }


    closeDepartmentModal();

    renderDepartments();

    updateDepartmentStatistics();

}


/* =========================================================
   VALIDATE FORM
========================================================= */

function validateDepartmentForm() {

    const name =
        departmentName.value.trim();

    const description =
        departmentDescription.value.trim();


    if (!name) {

        return {

            valid: false,

            message:
                "Please enter the department name."

        };

    }


    if (
        name.length < 3
    ) {

        return {

            valid: false,

            message:
                "Department name must contain at least 3 characters."

        };

    }


    if (!description) {

        return {

            valid: false,

            message:
                "Please enter a department description."

        };

    }


    if (
        description.length < 10
    ) {

        return {

            valid: false,

            message:
                "Department description must contain at least 10 characters."

        };

    }


    return {

        valid: true,

        message: ""

    };

}


/* =========================================================
   OPEN DELETE
========================================================= */

function openDeleteDepartment(
    id
) {

    const department =
        getDepartmentById(
            id
        );


    if (!department) {

        showToast(
            "Error",
            "Department could not be found.",
            "error"
        );

        return;

    }


    departmentToDelete =
        id;


    if (departmentDeleteMessage) {

        departmentDeleteMessage.textContent =

            `You are about to delete ${department.name}. ` +

            `This action cannot be undone.`;

    }


    if (departmentDeleteOverlay) {

        departmentDeleteOverlay.classList.add(
            "active"
        );

    }

}


/* =========================================================
   CLOSE DELETE
========================================================= */

function closeDeleteDepartment() {

    departmentToDelete =
        null;


    if (departmentDeleteOverlay) {

        departmentDeleteOverlay.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   INITIALIZE DELETE
========================================================= */

function initializeDepartmentDelete() {

    if (departmentDeleteClose) {

        departmentDeleteClose.addEventListener(
            "click",
            closeDeleteDepartment
        );

    }


    if (departmentDeleteCancel) {

        departmentDeleteCancel.addEventListener(
            "click",
            closeDeleteDepartment
        );

    }


    if (departmentDeleteOverlay) {

        departmentDeleteOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    departmentDeleteOverlay
                ) {

                    closeDeleteDepartment();

                }

            }
        );

    }


    if (departmentDeleteConfirm) {

        departmentDeleteConfirm.addEventListener(
            "click",
            confirmDeleteDepartment
        );

    }

}


/* =========================================================
   CONFIRM DELETE
========================================================= */

function confirmDeleteDepartment() {

    if (!departmentToDelete) {

        return;

    }


    const department =
        getDepartmentById(
            departmentToDelete
        );


    deleteDepartment(
        departmentToDelete
    );


    closeDeleteDepartment();


    showToast(
        "Department Deleted",
        department
            ? `${department.name} has been removed successfully.`
            : "Department deleted successfully.",
        "success"
    );


    renderDepartments();

    updateDepartmentStatistics();

}


/* =========================================================
   INITIALS
========================================================= */

function getDepartmentInitials(
    name
) {

    if (!name) {

        return "DP";

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
        text.length <=
        length
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
   HTML ESCAPE
========================================================= */

function escapeHTML(
    value
) {

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
            event.key !==
            "Escape"
        ) {

            return;

        }


        closeDepartmentModal();

        closeDeleteDepartment();

    }
);


/* =========================================================
   GLOBAL API
========================================================= */

window.PulseCareDepartments = {

    renderDepartments,

    updateDepartmentStatistics,

    openAddDepartmentModal,

    editDepartment,

    viewDepartment,

    openDeleteDepartment

};