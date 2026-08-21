/* =========================================================
   PULSECARE HEALTHCARE MANAGEMENT DASHBOARD
   reports.js

   Reports & Analytics:
   - Patient statistics
   - Doctor statistics
   - Appointment statistics
   - Revenue calculation
   - Appointment status chart
   - Department distribution chart
   - Revenue by department
   - Patient demographics
   - Department performance table
   - Print report
   ========================================================= */


/* =========================================================
   CHART REFERENCES
========================================================= */

let appointmentStatusChart = null;

let departmentDistributionChart = null;

let revenueDepartmentChart = null;

let patientGenderChart = null;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const reportPatientCount =
    document.getElementById(
        "reportPatientCount"
    );

const reportDoctorCount =
    document.getElementById(
        "reportDoctorCount"
    );

const reportAppointmentCount =
    document.getElementById(
        "reportAppointmentCount"
    );

const reportRevenue =
    document.getElementById(
        "reportRevenue"
    );


const performanceConfirmed =
    document.getElementById(
        "performanceConfirmed"
    );

const performancePending =
    document.getElementById(
        "performancePending"
    );

const performanceCompleted =
    document.getElementById(
        "performanceCompleted"
    );

const performanceCancelled =
    document.getElementById(
        "performanceCancelled"
    );

const performanceCompletionRate =
    document.getElementById(
        "performanceCompletionRate"
    );

const performanceAverageFee =
    document.getElementById(
        "performanceAverageFee"
    );


const departmentReportTable =
    document.getElementById(
        "departmentReportTable"
    );


const reportGeneratedDate =
    document.getElementById(
        "reportGeneratedDate"
    );

const reportFooterDate =
    document.getElementById(
        "reportFooterDate"
    );


const refreshReportsBtn =
    document.getElementById(
        "refreshReportsBtn"
    );

const printReportBtn =
    document.getElementById(
        "printReportBtn"
    );


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeReports();

    }
);


/* =========================================================
   INITIALIZE REPORT PAGE
========================================================= */

function initializeReports() {

    updateReportSummary();

    updateAppointmentPerformance();

    renderDepartmentReport();

    createAppointmentStatusChart();

    createDepartmentDistributionChart();

    createRevenueDepartmentChart();

    createPatientGenderChart();

    updateReportDates();

    initializeReportButtons();

}


/* =========================================================
   GET DATA
========================================================= */

function getReportData() {

    const patients =
        typeof getPatients ===
        "function"
            ? getPatients()
            : [];


    const doctors =
        typeof getDoctors ===
        "function"
            ? getDoctors()
            : [];


    const appointments =
        typeof getAppointments ===
        "function"
            ? getAppointments()
            : [];


    const departments =
        typeof getDepartments ===
        "function"
            ? getDepartments()
            : [];


    return {

        patients,

        doctors,

        appointments,

        departments

    };

}


/* =========================================================
   SUMMARY
========================================================= */

function updateReportSummary() {

    const {

        patients,

        doctors,

        appointments

    } = getReportData();


    const totalRevenue =
        appointments.reduce(
            (
                total,
                appointment
            ) => {

                /*
                   Revenue is counted only
                   for completed or confirmed
                   appointments.
                */

                if (
                    appointment.status ===
                        "Cancelled"
                ) {

                    return total;

                }


                return (

                    total +

                    Number(
                        appointment.fee ||
                        0
                    )

                );

            },
            0
        );


    if (reportPatientCount) {

        reportPatientCount.textContent =
            patients.length;

    }


    if (reportDoctorCount) {

        reportDoctorCount.textContent =
            doctors.length;

    }


    if (reportAppointmentCount) {

        reportAppointmentCount.textContent =
            appointments.length;

    }


    if (reportRevenue) {

        reportRevenue.textContent =
            formatCurrency(
                totalRevenue
            );

    }

}


/* =========================================================
   APPOINTMENT PERFORMANCE
========================================================= */

function updateAppointmentPerformance() {

    const {

        appointments

    } = getReportData();


    const confirmed =
        appointments.filter(
            appointment =>
                appointment.status ===
                "Confirmed"
        ).length;


    const pending =
        appointments.filter(
            appointment =>
                appointment.status ===
                "Pending"
        ).length;


    const completed =
        appointments.filter(
            appointment =>
                appointment.status ===
                "Completed"
        ).length;


    const cancelled =
        appointments.filter(
            appointment =>
                appointment.status ===
                "Cancelled"
        ).length;


    const total =
        appointments.length;


    const completionRate =
        total > 0
            ? (
                completed /
                total
            ) * 100
            : 0;


    const validAppointments =
        appointments.filter(
            appointment =>
                appointment.status !==
                "Cancelled"
        );


    const averageFee =
        validAppointments.length > 0

            ? validAppointments.reduce(
                (
                    total,
                    appointment
                ) => {

                    return (

                        total +

                        Number(
                            appointment.fee ||
                            0
                        )

                    );

                },
                0
            ) /
            validAppointments.length

            : 0;


    if (performanceConfirmed) {

        performanceConfirmed.textContent =
            confirmed;

    }


    if (performancePending) {

        performancePending.textContent =
            pending;

    }


    if (performanceCompleted) {

        performanceCompleted.textContent =
            completed;

    }


    if (performanceCancelled) {

        performanceCancelled.textContent =
            cancelled;

    }


    if (performanceCompletionRate) {

        performanceCompletionRate.textContent =
            `${completionRate.toFixed(1)}%`;

    }


    if (performanceAverageFee) {

        performanceAverageFee.textContent =
            formatCurrency(
                averageFee
            );

    }

}


/* =========================================================
   APPOINTMENT STATUS CHART
========================================================= */

function createAppointmentStatusChart() {

    const canvas =
        document.getElementById(
            "appointmentStatusChart"
        );


    if (
        !canvas ||
        typeof Chart ===
            "undefined"
    ) {

        return;

    }


    const {

        appointments

    } = getReportData();


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


    const cancelled =
        appointments.filter(
            appointment =>
                appointment.status ===
                "Cancelled"
        ).length;


    if (
        appointmentStatusChart
    ) {

        appointmentStatusChart.destroy();

    }


    appointmentStatusChart =
        new Chart(
            canvas,
            {

                type:
                    "doughnut",

                data: {

                    labels: [

                        "Pending",

                        "Confirmed",

                        "Completed",

                        "Cancelled"

                    ],

                    datasets: [

                        {

                            data: [

                                pending,

                                confirmed,

                                completed,

                                cancelled

                            ],

                            backgroundColor: [

                                "#F59E0B",

                                "#2563EB",

                                "#22C55E",

                                "#EF4444"

                            ],

                            borderWidth: 0

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "68%",

                    plugins: {

                        legend: {

                            position:
                                "bottom",

                            labels: {

                                usePointStyle:
                                    true,

                                padding:
                                    18

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================================
   DEPARTMENT DISTRIBUTION CHART
========================================================= */

function createDepartmentDistributionChart() {

    const canvas =
        document.getElementById(
            "departmentDistributionChart"
        );


    if (
        !canvas ||
        typeof Chart ===
            "undefined"
    ) {

        return;

    }


    const {

        departments,

        doctors

    } = getReportData();


    const labels = [];

    const values = [];


    departments.forEach(
        department => {

            labels.push(
                department.name
            );


            const count =
                doctors.filter(
                    doctor =>

                        String(
                            doctor.department ||
                            ""
                        ).toLowerCase() ===

                        String(
                            department.name ||
                            ""
                        ).toLowerCase()

                ).length;


            values.push(
                count
            );

        }
    );


    if (
        departmentDistributionChart
    ) {

        departmentDistributionChart.destroy();

    }


    departmentDistributionChart =
        new Chart(
            canvas,
            {

                type:
                    "bar",

                data: {

                    labels,

                    datasets: [

                        {

                            label:
                                "Doctors",

                            data:
                                values,

                            backgroundColor:
                                "#2563EB",

                            borderRadius:
                                8,

                            borderSkipped:
                                false

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                precision:
                                    0

                            }

                        }

                    },

                    plugins: {

                        legend: {

                            display:
                                false

                        }

                    }

                }

            }
        );

}


/* =========================================================
   REVENUE BY DEPARTMENT
========================================================= */

function createRevenueDepartmentChart() {

    const canvas =
        document.getElementById(
            "revenueDepartmentChart"
        );


    if (
        !canvas ||
        typeof Chart ===
            "undefined"
    ) {

        return;

    }


    const {

        departments,

        appointments

    } = getReportData();


    const labels = [];

    const values = [];


    departments.forEach(
        department => {

            labels.push(
                department.name
            );


            const revenue =
                appointments
                    .filter(
                        appointment =>

                            String(
                                appointment.department ||
                                ""
                            ).toLowerCase() ===

                            String(
                                department.name ||
                                ""
                            ).toLowerCase() &&

                            appointment.status !==
                                "Cancelled"

                    )
                    .reduce(
                        (
                            total,
                            appointment
                        ) => {

                            return (

                                total +

                                Number(
                                    appointment.fee ||
                                    0
                                )

                            );

                        },
                        0
                    );


            values.push(
                revenue
            );

        }
    );


    if (
        revenueDepartmentChart
    ) {

        revenueDepartmentChart.destroy();

    }


    revenueDepartmentChart =
        new Chart(
            canvas,
            {

                type:
                    "bar",

                data: {

                    labels,

                    datasets: [

                        {

                            label:
                                "Revenue",

                            data:
                                values,

                            backgroundColor:
                                "#06B6D4",

                            borderRadius:
                                8,

                            borderSkipped:
                                false

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                callback:
                                    value =>
                                        "₹" +
                                        Number(
                                            value
                                        ).toLocaleString(
                                            "en-IN"
                                        )

                            }

                        }

                    },

                    plugins: {

                        legend: {

                            display:
                                false

                        }

                    }

                }

            }
        );

}


/* =========================================================
   PATIENT GENDER CHART
========================================================= */

function createPatientGenderChart() {

    const canvas =
        document.getElementById(
            "patientGenderChart"
        );


    if (
        !canvas ||
        typeof Chart ===
            "undefined"
    ) {

        return;

    }


    const {

        patients

    } = getReportData();


    const male =
        patients.filter(
            patient =>
                String(
                    patient.gender ||
                    ""
                ).toLowerCase() ===
                "male"
        ).length;


    const female =
        patients.filter(
            patient =>
                String(
                    patient.gender ||
                    ""
                ).toLowerCase() ===
                "female"
        ).length;


    const other =
        patients.filter(
            patient => {

                const gender =
                    String(
                        patient.gender ||
                        ""
                    ).toLowerCase();


                return (
                    gender !==
                        "male" &&
                    gender !==
                        "female"
                );

            }
        ).length;


    if (
        patientGenderChart
    ) {

        patientGenderChart.destroy();

    }


    patientGenderChart =
        new Chart(
            canvas,
            {

                type:
                    "doughnut",

                data: {

                    labels: [

                        "Male",

                        "Female",

                        "Other"

                    ],

                    datasets: [

                        {

                            data: [

                                male,

                                female,

                                other

                            ],

                            backgroundColor: [

                                "#2563EB",

                                "#EC4899",

                                "#8B5CF6"

                            ],

                            borderWidth:
                                0

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "65%",

                    plugins: {

                        legend: {

                            position:
                                "bottom",

                            labels: {

                                usePointStyle:
                                    true,

                                padding:
                                    18

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================================
   DEPARTMENT REPORT TABLE
========================================================= */

function renderDepartmentReport() {

    if (!departmentReportTable) {

        return;

    }


    const {

        departments,

        doctors,

        patients,

        appointments

    } = getReportData();


    departmentReportTable.innerHTML =
        "";


    if (
        departments.length ===
        0
    ) {

        departmentReportTable.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="table-empty"
                >

                    No department data available.

                </td>

            </tr>

        `;

        return;

    }


    departments.forEach(
        department => {

            const departmentName =
                department.name;


            /* DOCTORS */

            const doctorCount =
                doctors.filter(
                    doctor =>

                        normalize(
                            doctor.department
                        ) ===

                        normalize(
                            departmentName
                        )

                ).length;


            /* PATIENTS */

            const patientCount =
                patients.filter(
                    patient =>

                        normalize(
                            patient.department
                        ) ===

                        normalize(
                            departmentName
                        )

                ).length;


            /* APPOINTMENTS */

            const departmentAppointments =
                appointments.filter(
                    appointment =>

                        normalize(
                            appointment.department
                        ) ===

                        normalize(
                            departmentName
                        )

                );


            const appointmentCount =
                departmentAppointments.length;


            /* COMPLETED */

            const completed =
                departmentAppointments.filter(
                    appointment =>
                        appointment.status ===
                        "Completed"
                ).length;


            /* REVENUE */

            const revenue =
                departmentAppointments
                    .filter(
                        appointment =>
                            appointment.status !==
                            "Cancelled"
                    )
                    .reduce(
                        (
                            total,
                            appointment
                        ) => {

                            return (

                                total +

                                Number(
                                    appointment.fee ||
                                    0
                                )

                            );

                        },
                        0
                    );


            /* COMPLETION RATE */

            const completionRate =

                appointmentCount > 0

                    ? (
                        completed /
                        appointmentCount
                    ) * 100

                    : 0;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <strong>

                        ${escapeHTML(
                            departmentName
                        )}

                    </strong>

                </td>


                <td>

                    ${doctorCount}

                </td>


                <td>

                    ${patientCount}

                </td>


                <td>

                    ${appointmentCount}

                </td>


                <td>

                    ${completed}

                </td>


                <td>

                    <strong>

                        ${formatCurrency(
                            revenue
                        )}

                    </strong>

                </td>


                <td>

                    <span class="status-badge ${
                        completionRate >= 70
                            ? "success"
                            : completionRate >= 40
                                ? "warning"
                                : "danger"
                    }">

                        ${completionRate.toFixed(1)}%

                    </span>

                </td>

            `;


            departmentReportTable.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   REPORT DATE
========================================================= */

function updateReportDates() {

    const now =
        new Date();


    const formatted =
        now.toLocaleDateString(
            "en-IN",
            {

                day:
                    "2-digit",

                month:
                    "long",

                year:
                    "numeric"

            }
        );


    if (reportGeneratedDate) {

        reportGeneratedDate.textContent =

            `Generated on ${formatted}`;

    }


    if (reportFooterDate) {

        reportFooterDate.textContent =

            `Report generated on ${formatted}`;

    }

}


/* =========================================================
   REFRESH REPORTS
========================================================= */

function refreshReports() {

    updateReportSummary();

    updateAppointmentPerformance();

    renderDepartmentReport();

    createAppointmentStatusChart();

    createDepartmentDistributionChart();

    createRevenueDepartmentChart();

    createPatientGenderChart();

    updateReportDates();


    showToast(
        "Reports Refreshed",
        "Analytics have been updated using the latest data.",
        "success"
    );

}


/* =========================================================
   PRINT REPORT
========================================================= */

function printReport() {

    window.print();

}


/* =========================================================
   BUTTON EVENTS
========================================================= */

function initializeReportButtons() {

    if (refreshReportsBtn) {

        refreshReportsBtn.addEventListener(
            "click",
            refreshReports
        );

    }


    if (printReportBtn) {

        printReportBtn.addEventListener(
            "click",
            printReport
        );

    }

}


/* =========================================================
   FORMAT CURRENCY
========================================================= */

function formatCurrency(
    amount
) {

    return (

        "₹" +

        Number(
            amount || 0
        ).toLocaleString(
            "en-IN",
            {

                maximumFractionDigits:
                    0

            }
        )

    );

}


/* =========================================================
   NORMALIZE TEXT
========================================================= */

function normalize(
    value
) {

    return String(
        value || ""
    )
        .trim()
        .toLowerCase();

}


/* =========================================================
   ESCAPE HTML
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
   GLOBAL REPORT API
========================================================= */

window.PulseCareReports = {

    refreshReports,

    printReport,

    updateReportSummary,

    updateAppointmentPerformance,

    renderDepartmentReport

};