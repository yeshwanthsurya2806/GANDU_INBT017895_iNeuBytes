/* =========================================================
   PULSECARE HEALTHCARE MANAGEMENT DASHBOARD
   doctors.js

   DATABASE VERSION

   Doctor Management:
   - Display doctors
   - Search
   - Department filter
   - Status filter
   - Add doctor
   - Edit doctor
   - Delete doctor
   - Form validation
   - SQLite / Backend API
========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const doctorSearch =
    document.getElementById(
        "doctorSearch"
    );


const doctorDepartmentFilter =
    document.getElementById(
        "doctorDepartmentFilter"
    );


const doctorStatusFilter =
    document.getElementById(
        "doctorStatusFilter"
    );


const doctorsTable =
    document.getElementById(
        "doctorsTable"
    );


const doctorEmptyState =
    document.getElementById(
        "doctorEmptyState"
    );


const doctorResultsInfo =
    document.getElementById(
        "doctorResultsInfo"
    );


/* =========================================================
   STATISTICS
========================================================= */

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


/* =========================================================
   ADD / EDIT MODAL
========================================================= */

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


/* =========================================================
   FORM FIELDS
========================================================= */

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


/* =========================================================
   DELETE MODAL
========================================================= */

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


/*
    IMPORTANT:

    This array is only temporary frontend state.

    It is NOT LocalStorage.

    Real data comes from:
        /api/admin/doctors

    Database:
        SQLite
*/

let doctorsData = [];

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
   INITIALIZE DOCTOR PAGE
========================================================= */

async function initializeDoctorPage() {

    initializeDoctorSearch();

    initializeDoctorFilters();

    initializeDoctorModal();

    initializeDoctorDelete();

    await loadDepartmentsForDoctorForm();

    await loadDoctorsFromDatabase();

}

/* =========================================================
   LOAD DEPARTMENTS FOR DOCTOR FORM
========================================================= */

async function loadDepartmentsForDoctorForm() {

    try {

        const response =
            await fetch(
                "/api/admin/departments",
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load departments"
            );

        }


        const departments =
            Array.isArray(data.departments)
                ? data.departments
                : [];


        // -------------------------------------------------
        // DOCTOR FORM DEPARTMENT DROPDOWN
        // -------------------------------------------------

        if (doctorDepartment) {

            doctorDepartment.innerHTML = `
                <option value="">
                    Select Department
                </option>
            `;


            departments
                .filter(
                    department =>
                        department.status !== "Inactive"
                )
                .forEach(
                    department => {

                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            department.name;


                        option.textContent =
                            department.name;


                        doctorDepartment.appendChild(
                            option
                        );

                    }
                );

        }


        // -------------------------------------------------
        // DOCTOR DEPARTMENT FILTER
        // -------------------------------------------------

        if (doctorDepartmentFilter) {

            doctorDepartmentFilter.innerHTML = `
                <option value="All">
                    All Departments
                </option>
            `;


            departments
                .filter(
                    department =>
                        department.status !== "Inactive"
                )
                .forEach(
                    department => {

                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            department.name;


                        option.textContent =
                            department.name;


                        doctorDepartmentFilter
                            .appendChild(
                                option
                            );

                    }
                );

        }


    } catch (error) {

        console.error(
            "Load departments for doctors error:",
            error
        );


        if (doctorDepartment) {

            doctorDepartment.innerHTML = `
                <option value="">
                    Failed to load departments
                </option>
            `;

        }

    }

}

/* =========================================================
   LOAD DOCTORS FROM DATABASE
========================================================= */

async function loadDoctorsFromDatabase() {

    try {

        const response =
            await fetch(
                "/api/admin/doctors",
                {
                    method: "GET",

                    credentials: "include"
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load doctors"
            );

        }


        /*
            Store database result
            in frontend memory.
        */

        doctorsData =
            Array.isArray(
                data.doctors
            )
                ? data.doctors
                : [];


        renderDoctors();

        updateDoctorStatistics();


    } catch (error) {

        console.error(
            "Load doctors error:",
            error
        );


        doctorsData = [];


        renderDoctors();

        updateDoctorStatistics();


        showToast(
            "Error",
            error.message ||
                "Failed to load doctors from database.",
            "error"
        );

    }

}


/* =========================================================
   GET DOCTOR BY ID
========================================================= */

function getDoctorByIdLocal(id) {

    return doctorsData.find(
        doctor =>
            String(
                doctor.id
            ) ===
            String(id)
    ) || null;

}


/* =========================================================
   GET FILTERED DOCTORS
========================================================= */

function getFilteredDoctors() {

    const doctors =
        doctorsData;


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

            /* -----------------------------------------
               SEARCH
            ----------------------------------------- */

            const matchesSearch =
                !searchTerm ||

                String(
                    doctor.name || ""
                )
                    .toLowerCase()
                    .includes(
                        searchTerm
                    )

                ||

                String(
                    doctor.department || ""
                )
                    .toLowerCase()
                    .includes(
                        searchTerm
                    )

                ||

                String(
                    doctor.qualification || ""
                )
                    .toLowerCase()
                    .includes(
                        searchTerm
                    )

                ||

                String(
                    doctor.email || ""
                )
                    .toLowerCase()
                    .includes(
                        searchTerm
                    );


            /* -----------------------------------------
               DEPARTMENT FILTER
            ----------------------------------------- */

            const matchesDepartment =
                department === "All" ||

                String(
                    doctor.department || ""
                ) ===
                String(
                    department
                );


            /* -----------------------------------------
               STATUS FILTER
            ----------------------------------------- */

            const matchesStatus =
                status === "All" ||

                String(
                    doctor.status || ""
                ) ===
                String(
                    status
                );


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


    doctorsTable.innerHTML =
        "";


    /* -----------------------------------------
       EMPTY STATE
    ----------------------------------------- */

    if (
        doctors.length === 0
    ) {

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


    /* -----------------------------------------
       HIDE EMPTY STATE
    ----------------------------------------- */

    if (doctorEmptyState) {

        doctorEmptyState.style.display =
            "none";

    }


    /* -----------------------------------------
       CREATE TABLE ROWS
    ----------------------------------------- */

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
                            doctor.department ||
                            "General"
                        )}

                    </span>

                </td>


                <td>

                    ${escapeHTML(
                        doctor.qualification ||
                        "-"
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        formatExperience(
                            doctor.experience
                        )
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
                        class="
                            status-badge
                            ${getStatusClass(
                                doctor.status
                            )}
                        "
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

                            <i
                                class="fa-solid fa-eye"
                            ></i>

                        </button>


                        <button
                            type="button"
                            class="action-button edit"
                            title="Edit Doctor"
                            data-action="edit"
                            data-id="${doctor.id}"
                        >

                            <i
                                class="fa-solid fa-pen"
                            ></i>

                        </button>


                        <button
                            type="button"
                            class="action-button delete"
                            title="Delete Doctor"
                            data-action="delete"
                            data-id="${doctor.id}"
                        >

                            <i
                                class="fa-solid fa-trash"
                            ></i>

                        </button>

                    </div>

                </td>

            `;


            doctorsTable.appendChild(
                row
            );

        }
    );


    /* -----------------------------------------
       RESULTS INFO
    ----------------------------------------- */

    if (doctorResultsInfo) {

        doctorResultsInfo.textContent =

            `Showing ${doctors.length} doctor` +

            (
                doctors.length !== 1
                    ? "s"
                    : ""
            );

    }


    initializeDoctorActions();

}


/* =========================================================
   INITIALIZE ACTION BUTTONS
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
                        action ===
                        "view"
                    ) {

                        viewDoctor(id);

                    }


                    else if (
                        action ===
                        "edit"
                    ) {

                        editDoctor(id);

                    }


                    else if (
                        action ===
                        "delete"
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
        getDoctorByIdLocal(
            id
        );


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

        `Name: ${doctor.name || "-"}\n` +

        `Department: ${
            doctor.department || "-"
        }\n` +

        `Qualification: ${
            doctor.qualification || "-"
        }\n` +

        `Experience: ${
            formatExperience(
                doctor.experience
            )
        }\n` +

        `Consultation Fee: ₹${
            doctor.fee || 0
        }\n` +

        `Phone: ${
            doctor.phone || "-"
        }\n` +

        `Email: ${
            doctor.email || "-"
        }\n` +

        `Status: ${
            doctor.status || "-"
        }`

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
        doctorsData;


    /* -----------------------------------------
       TOTAL DOCTORS
    ----------------------------------------- */

    if (doctorTotalCount) {

        doctorTotalCount.textContent =
            doctors.length;

    }


    /* -----------------------------------------
       ACTIVE DOCTORS
    ----------------------------------------- */

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


    /* -----------------------------------------
       DEPARTMENTS
    ----------------------------------------- */

    const departments =
        new Set(
            doctors
                .map(
                    doctor =>
                        doctor.department
                )
                .filter(Boolean)
        );


    if (doctorDepartmentCount) {

        doctorDepartmentCount.textContent =
            departments.size;

    }


    /* -----------------------------------------
       AVERAGE FEE
    ----------------------------------------- */

    const totalFee =
        doctors.reduce(
            (
                total,
                doctor
            ) => {

                return (
                    total +
                    Number(
                        doctor.fee || 0
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
   EDIT DOCTOR
========================================================= */

function editDoctor(id) {

    const doctor =
        getDoctorByIdLocal(
            id
        );


    if (!doctor) {

        showToast(
            "Error",
            "Doctor record could not be found.",
            "error"
        );

        return;

    }


    if (doctorId) {

        doctorId.value =
            doctor.id;

    }


    if (doctorName) {

        doctorName.value =
            doctor.name || "";

    }


    if (doctorDepartment) {

        doctorDepartment.value =
            doctor.department || "";

    }


    if (doctorStatus) {

        doctorStatus.value =
            doctor.status || "Active";

    }


    if (doctorQualification) {

        doctorQualification.value =
            doctor.qualification || "";

    }


    if (doctorExperience) {

        doctorExperience.value =
            doctor.experience || "";

    }


    if (doctorFee) {

        doctorFee.value =
            doctor.fee || 0;

    }


    if (doctorPhone) {

        doctorPhone.value =
            doctor.phone || "";

    }


    if (doctorEmail) {

        doctorEmail.value =
            doctor.email || "";

    }


    /*
        Rating is currently not stored
        in the SQLite doctors table.

        Keep the UI value at 5 for now.
    */

    if (doctorRating) {

        doctorRating.value =
            doctor.rating || 5;

    }


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

        doctorId.value =
            "";

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

async function handleDoctorSubmit(
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


    /* -----------------------------------------
       FORM DATA
    ----------------------------------------- */

    const data = {

        name:
            doctorName.value.trim(),

        department:
            doctorDepartment.value,

        status:
            doctorStatus.value,

        qualification:
            doctorQualification.value.trim(),

        /*
            Database expects experience
            as a number.
        */

        experience:
            Number(
                doctorExperience.value
            ) || 0,

        fee:
            Number(
                doctorFee.value
            ) || 0,

        phone:
            doctorPhone.value.trim(),

        email:
            doctorEmail.value.trim(),

        rating:
            Number(
                doctorRating.value
            ) || 5

    };


    try {

        /* =================================================
           UPDATE EXISTING DOCTOR
        ================================================= */

        if (
            doctorId &&
            doctorId.value
        ) {

            const response =
                await fetch(
                    `/api/admin/doctors/${doctorId.value}`,
                    {

                        method: "PUT",

                        credentials:
                            "include",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                data
                            )

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
                    "Failed to update doctor"
                );

            }


            showToast(
                "Doctor Updated",
                "Doctor information has been updated successfully.",
                "success"
            );

        }


        /* =================================================
           ADD NEW DOCTOR
        ================================================= */

        else {

            const response =
                await fetch(
                    "/api/admin/doctors",
                    {

                        method: "POST",

                        credentials:
                            "include",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                data
                            )

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
                    "Failed to create doctor"
                );

            }


            showToast(
                "Doctor Added",
                "Doctor has been added to the database successfully.",
                "success"
            );


            /*
                The backend creates a doctor
                login account with a temporary
                password.

                Show credentials once.
            */

            if (
                result.temporaryPassword
            ) {

                alert(

                    `Doctor account created successfully!\n\n` +

                    `Login Email: ${
                        data.email
                    }\n` +

                    `Temporary Password: ${
                        result.temporaryPassword
                    }\n\n` +

                    `Please save these credentials.`

                );

            }

        }


        /* -----------------------------------------
           CLOSE MODAL
        ----------------------------------------- */

        closeDoctorModal();


        /* -----------------------------------------
           RELOAD FROM SQLITE
        ----------------------------------------- */

        await loadDoctorsFromDatabase();


    } catch (error) {

        console.error(
            "Save doctor error:",
            error
        );


        showToast(
            "Error",
            error.message ||
                "Failed to save doctor.",
            "error"
        );

    }

}


/* =========================================================
   VALIDATE FORM
========================================================= */

function validateDoctorForm() {

    const name =
        doctorName
            ? doctorName.value.trim()
            : "";


    const department =
        doctorDepartment
            ? doctorDepartment.value
            : "";


    const qualification =
        doctorQualification
            ? doctorQualification.value.trim()
            : "";


    const experience =
        doctorExperience
            ? doctorExperience.value.trim()
            : "";


    const fee =
        doctorFee
            ? Number(
                doctorFee.value
            )
            : NaN;


    const phone =
        doctorPhone
            ? doctorPhone.value.trim()
            : "";


    const email =
        doctorEmail
            ? doctorEmail.value.trim()
            : "";


    const rating =
        doctorRating
            ? Number(
                doctorRating.value
            )
            : 5;


    /* -----------------------------------------
       NAME
    ----------------------------------------- */

    if (!name) {

        return {

            valid: false,

            message:
                "Please enter the doctor's name."

        };

    }


    if (
        name.length < 3
    ) {

        return {

            valid: false,

            message:
                "Doctor name must contain at least 3 characters."

        };

    }


    /* -----------------------------------------
       DEPARTMENT
    ----------------------------------------- */

    if (!department) {

        return {

            valid: false,

            message:
                "Please select a department."

        };

    }


    /* -----------------------------------------
       QUALIFICATION
    ----------------------------------------- */

    if (!qualification) {

        return {

            valid: false,

            message:
                "Please enter the doctor's qualification."

        };

    }


    /* -----------------------------------------
       EXPERIENCE
    ----------------------------------------- */

    if (!experience) {

        return {

            valid: false,

            message:
                "Please enter the doctor's experience."

        };

    }


    if (
        Number.isNaN(
            Number(experience)
        ) ||
        Number(experience) < 0
    ) {

        return {

            valid: false,

            message:
                "Experience must be a valid number."

        };

    }


    /* -----------------------------------------
       FEE
    ----------------------------------------- */

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


    /* -----------------------------------------
       PHONE
    ----------------------------------------- */

    if (
        !/^[0-9]{10}$/.test(
            phone
        )
    ) {

        return {

            valid: false,

            message:
                "Phone number must contain exactly 10 digits."

        };

    }


    /* -----------------------------------------
       EMAIL
    ----------------------------------------- */

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


    /* -----------------------------------------
       RATING
    ----------------------------------------- */

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
   OPEN DELETE DOCTOR
========================================================= */

function openDeleteDoctor(id) {

    const doctor =
        getDoctorByIdLocal(
            id
        );


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

            `You are about to delete ${
                doctor.name
            }. ` +

            `This action cannot be undone.`;

    }


    if (doctorDeleteOverlay) {

        doctorDeleteOverlay.classList.add(
            "active"
        );

    }

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

async function confirmDeleteDoctor() {

    if (!doctorToDelete) {
        return;
    }


    const doctor =
        getDoctorByIdLocal(
            doctorToDelete
        );


    try {

        const response =
            await fetch(
                `/api/admin/doctors/${doctorToDelete}`,
                {

                    method: "DELETE",

                    credentials:
                        "include"

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
                "Failed to delete doctor"
            );

        }


        closeDeleteDoctor();


        showToast(
            "Doctor Deleted",

            doctor
                ? `${doctor.name} has been removed successfully.`
                : "Doctor has been removed successfully.",

            "success"
        );


        await loadDoctorsFromDatabase();


    } catch (error) {

        console.error(
            "Delete doctor error:",
            error
        );


        showToast(
            "Error",
            error.message ||
                "Failed to delete doctor.",
            "error"
        );

    }

}


/* =========================================================
   FORMAT NUMBER
========================================================= */

function formatNumber(
    number
) {

    return Number(
        number || 0
    ).toLocaleString(
        "en-IN"
    );

}


/* =========================================================
   FORMAT EXPERIENCE
========================================================= */

function formatExperience(
    experience
) {

    if (
        experience === null ||
        experience === undefined ||
        experience === ""
    ) {

        return "-";

    }


    const value =
        Number(
            experience
        );


    if (
        !Number.isNaN(value)
    ) {

        return (
            value === 1
                ? "1 Year"
                : `${value} Years`
        );

    }


    return String(
        experience
    );

}


/* =========================================================
   STATUS CLASS
========================================================= */

function getStatusClass(
    status
) {

    switch (
        String(
            status
        ).toLowerCase()
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

function getInitials(
    name
) {

    if (!name) {

        return "DR";

    }


    const parts =
        String(
            name
        )
            .trim()
            .split(
                /\s+/
            );


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

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(
        value
    )

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
            event.key ===
            "Escape"
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

    openDeleteDoctor,

    loadDoctorsFromDatabase

};