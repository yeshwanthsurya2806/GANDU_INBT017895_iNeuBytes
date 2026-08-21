/* =========================================================
   PULSECARE HEALTHCARE MANAGEMENT DASHBOARD
   main.js

   GLOBAL APPLICATION CONTROLLER

   Handles:
   - Sidebar
   - Mobile navigation
   - Active navigation
   - Notifications
   - Global search
   - Logout
   - Toast notifications
   - Escape key
   - Shared UI interactions
   ========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById(
        "sidebarOverlay"
    );

const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

const notificationBtn =
    document.getElementById(
        "notificationBtn"
    );

const globalSearchBtn =
    document.getElementById(
        "globalSearchBtn"
    );

const settingsLink =
    document.getElementById(
        "settingsLink"
    );

const toastContainer =
    document.getElementById(
        "toastContainer"
    );


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeMain();

    }
);


/* =========================================================
   MAIN INITIALIZER
========================================================= */

function initializeMain() {

    initializeSidebar();

    initializeNavigation();

    initializeNotifications();

    initializeGlobalSearch();

    initializeLogout();

    initializeSettings();

    initializeKeyboardShortcuts();

    initializeResponsiveBehavior();

}


/* =========================================================
   SIDEBAR
========================================================= */

function initializeSidebar() {

    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            openSidebar
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );

    }

}


/* =========================================================
   OPEN SIDEBAR
========================================================= */

function openSidebar() {

    if (sidebar) {

        sidebar.classList.add(
            "active"
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.add(
            "active"
        );

    }


    document.body.classList.add(
        "sidebar-open"
    );

}


/* =========================================================
   CLOSE SIDEBAR
========================================================= */

function closeSidebar() {

    if (sidebar) {

        sidebar.classList.remove(
            "active"
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.remove(
            "active"
        );

    }


    document.body.classList.remove(
        "sidebar-open"
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function initializeNavigation() {

    const links =
        document.querySelectorAll(
            ".sidebar-link"
        );


    links.forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    /*
                       Settings is not a real page
                       yet, so don't navigate.
                    */

                    if (
                        link.id ===
                        "settingsLink"
                    ) {

                        event.preventDefault();

                        return;

                    }


                    /*
                       Close mobile sidebar
                       after navigation.
                    */

                    closeSidebar();

                }
            );

        }
    );

}


/* =========================================================
   ACTIVE PAGE
========================================================= */

function setActiveNavigation() {

    const currentPage =
        window.location
            .pathname
            .split("/")
            .pop();


    const links =
        document.querySelectorAll(
            ".sidebar-link"
        );


    links.forEach(
        link => {

            const href =
                link.getAttribute(
                    "href"
                );


            if (
                !href ||
                href === "#"
            ) {

                return;

            }


            const linkPage =
                href
                    .split("/")
                    .pop();


            link.classList.remove(
                "active"
            );


            if (
                linkPage ===
                currentPage
            ) {

                link.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function initializeNotifications() {

    if (!notificationBtn) {

        return;

    }


    notificationBtn.addEventListener(
        "click",
        () => {

            showNotificationPanel();

        }
    );

}


/* =========================================================
   NOTIFICATION PANEL
========================================================= */

function showNotificationPanel() {

    const existingPanel =
        document.getElementById(
            "notificationPanel"
        );


    /*
       Toggle existing panel.
    */

    if (existingPanel) {

        existingPanel.remove();

        return;

    }


    const panel =
        document.createElement(
            "div"
        );


    panel.id =
        "notificationPanel";


    panel.className =
        "notification-panel";


    panel.innerHTML = `

        <div class="notification-panel-header">

            <div>

                <strong>
                    Notifications
                </strong>

                <span>
                    Recent activity
                </span>

            </div>

            <button
                type="button"
                class="notification-close"
                id="notificationClose"
            >

                ×

            </button>

        </div>


        <div class="notification-list">


            <div class="notification-item">

                <div class="notification-icon blue">

                    <i class="fa-solid fa-calendar-check"></i>

                </div>

                <div>

                    <strong>
                        Appointment Update
                    </strong>

                    <p>
                        A new appointment has been scheduled.
                    </p>

                    <small>
                        Recently
                    </small>

                </div>

            </div>


            <div class="notification-item">

                <div class="notification-icon green">

                    <i class="fa-solid fa-user-plus"></i>

                </div>

                <div>

                    <strong>
                        New Patient
                    </strong>

                    <p>
                        A patient record was recently added.
                    </p>

                    <small>
                        Recently
                    </small>

                </div>

            </div>


            <div class="notification-item">

                <div class="notification-icon orange">

                    <i class="fa-solid fa-clock"></i>

                </div>

                <div>

                    <strong>
                        Pending Appointment
                    </strong>

                    <p>
                        Some appointments still need confirmation.
                    </p>

                    <small>
                        Today
                    </small>

                </div>

            </div>


        </div>


        <div class="notification-panel-footer">

            <button
                type="button"
                id="clearNotifications"
            >

                Mark all as read

            </button>

        </div>

    `;


    document.body.appendChild(
        panel
    );


    /*
       Close button
    */

    const closeBtn =
        document.getElementById(
            "notificationClose"
        );


    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            () => {

                panel.remove();

            }
        );

    }


    /*
       Mark all as read
    */

    const clearBtn =
        document.getElementById(
            "clearNotifications"
        );


    if (clearBtn) {

        clearBtn.addEventListener(
            "click",
            () => {

                panel.remove();

                showToast(
                    "Notifications",
                    "All notifications marked as read.",
                    "success"
                );

            }
        );

    }


    /*
       Close when clicking outside.
    */

    setTimeout(
        () => {

            document.addEventListener(
                "click",
                closeNotificationOutside
            );

        },
        0
    );


    function closeNotificationOutside(
        event
    ) {

        if (

            !panel.contains(
                event.target
            ) &&

            !notificationBtn.contains(
                event.target
            )

        ) {

            panel.remove();

            document.removeEventListener(
                "click",
                closeNotificationOutside
            );

        }

    }

}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

function initializeGlobalSearch() {

    if (!globalSearchBtn) {

        return;

    }


    globalSearchBtn.addEventListener(
        "click",
        openGlobalSearch
    );

}


/* =========================================================
   GLOBAL SEARCH MODAL
========================================================= */

function openGlobalSearch() {

    const existing =
        document.getElementById(
            "globalSearchOverlay"
        );


    if (existing) {

        existing.remove();

        return;

    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "globalSearchOverlay";


    overlay.className =
        "global-search-overlay";


    overlay.innerHTML = `

        <div class="global-search-modal">

            <div class="global-search-header">

                <div>

                    <span class="section-label">
                        QUICK SEARCH
                    </span>

                    <h2>
                        Search PulseCare
                    </h2>

                </div>


                <button
                    type="button"
                    class="modal-close"
                    id="globalSearchClose"
                >

                    ×

                </button>

            </div>


            <div class="global-search-input">

                <i class="fa-solid fa-magnifying-glass"></i>

                <input
                    type="text"
                    id="globalSearchInput"
                    placeholder="Search patients, doctors, appointments..."
                    autocomplete="off"
                >

            </div>


            <div
                class="global-search-results"
                id="globalSearchResults"
            >

                <div class="global-search-empty">

                    <i class="fa-solid fa-magnifying-glass"></i>

                    <p>
                        Start typing to search.
                    </p>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    const input =
        document.getElementById(
            "globalSearchInput"
        );


    const close =
        document.getElementById(
            "globalSearchClose"
        );


    if (input) {

        input.focus();


        input.addEventListener(
            "input",
            () => {

                performGlobalSearch(
                    input.value
                );

            }
        );

    }


    if (close) {

        close.addEventListener(
            "click",
            () => {

                overlay.remove();

            }
        );

    }


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                overlay
            ) {

                overlay.remove();

            }

        }
    );

}


/* =========================================================
   PERFORM GLOBAL SEARCH
========================================================= */

function performGlobalSearch(
    query
) {

    const results =
        document.getElementById(
            "globalSearchResults"
        );


    if (!results) {

        return;

    }


    const searchTerm =
        query
            .trim()
            .toLowerCase();


    if (!searchTerm) {

        results.innerHTML = `

            <div class="global-search-empty">

                <i class="fa-solid fa-magnifying-glass"></i>

                <p>
                    Start typing to search.
                </p>

            </div>

        `;

        return;

    }


    const allResults = [];


    /*
       SEARCH PATIENTS
    */

    if (
        typeof getPatients ===
        "function"
    ) {

        getPatients()
            .forEach(
                patient => {

                    const searchable =

                        `${patient.name || ""} ` +

                        `${patient.email || ""} ` +

                        `${patient.phone || ""}`;


                    if (
                        searchable
                            .toLowerCase()
                            .includes(
                                searchTerm
                            )
                    ) {

                        allResults.push({

                            type:
                                "Patient",

                            icon:
                                "fa-user",

                            title:
                                patient.name,

                            subtitle:
                                patient.phone ||
                                patient.email ||
                                "Patient",

                            url:
                                "patients.html"

                        });

                    }

                }
            );

    }


    /*
       SEARCH DOCTORS
    */

    if (
        typeof getDoctors ===
        "function"
    ) {

        getDoctors()
            .forEach(
                doctor => {

                    const searchable =

                        `${doctor.name || ""} ` +

                        `${doctor.department || ""} ` +

                        `${doctor.email || ""}`;


                    if (
                        searchable
                            .toLowerCase()
                            .includes(
                                searchTerm
                            )
                    ) {

                        allResults.push({

                            type:
                                "Doctor",

                            icon:
                                "fa-user-doctor",

                            title:
                                doctor.name,

                            subtitle:
                                doctor.department ||
                                "Doctor",

                            url:
                                "doctors.html"

                        });

                    }

                }
            );

    }


    /*
       SEARCH APPOINTMENTS
    */

    if (
        typeof getAppointments ===
        "function"
    ) {

        getAppointments()
            .forEach(
                appointment => {

                    const searchable =

                        `${appointment.patientName || ""} ` +

                        `${appointment.doctorName || ""} ` +

                        `${appointment.department || ""} ` +

                        `${appointment.reason || ""}`;


                    if (
                        searchable
                            .toLowerCase()
                            .includes(
                                searchTerm
                            )
                    ) {

                        allResults.push({

                            type:
                                "Appointment",

                            icon:
                                "fa-calendar-check",

                            title:
                                appointment.patientName ||
                                "Appointment",

                            subtitle:
                                appointment.doctorName ||
                                "Appointment",

                            url:
                                "appointments.html"

                        });

                    }

                }
            );

    }


    /*
       SEARCH DEPARTMENTS
    */

    if (
        typeof getDepartments ===
        "function"
    ) {

        getDepartments()
            .forEach(
                department => {

                    const searchable =

                        `${department.name || ""} ` +

                        `${department.description || ""}`;


                    if (
                        searchable
                            .toLowerCase()
                            .includes(
                                searchTerm
                            )
                    ) {

                        allResults.push({

                            type:
                                "Department",

                            icon:
                                "fa-hospital",

                            title:
                                department.name,

                            subtitle:
                                department.description ||
                                "Department",

                            url:
                                "departments.html"

                        });

                    }

                }
            );

    }


    /*
       NO RESULTS
    */

    if (
        allResults.length ===
        0
    ) {

        results.innerHTML = `

            <div class="global-search-empty">

                <i class="fa-solid fa-circle-exclamation"></i>

                <h3>
                    No results found
                </h3>

                <p>
                    Try another search term.
                </p>

            </div>

        `;

        return;

    }


    /*
       LIMIT RESULTS
    */

    const limitedResults =
        allResults.slice(
            0,
            10
        );


    results.innerHTML =
        limitedResults
            .map(
                result => `

                    <a
                        href="${result.url}"
                        class="global-search-result"
                    >

                        <div class="global-search-result-icon">

                            <i class="fa-solid ${result.icon}"></i>

                        </div>

                        <div>

                            <span>
                                ${escapeHTML(
                                    result.type
                                )}
                            </span>

                            <strong>
                                ${escapeHTML(
                                    result.title
                                )}
                            </strong>

                            <p>
                                ${escapeHTML(
                                    result.subtitle
                                )}
                            </p>

                        </div>

                    </a>

                `
            )
            .join("");

}


/* =========================================================
   LOGOUT
========================================================= */

function initializeLogout() {

    if (!logoutBtn) {

        return;

    }


    logoutBtn.addEventListener(
        "click",
        handleLogout
    );

}


/* =========================================================
   HANDLE LOGOUT
========================================================= */

function handleLogout() {

    const confirmed =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmed) {

        return;

    }


    /*
       Demo application:
       simply return to dashboard.
    */

    showToast(
        "Logged Out",
        "You have been logged out of the demo.",
        "success"
    );


    setTimeout(
        () => {

            window.location.href =
                "index.html";

        },
        800
    );

}


/* =========================================================
   SETTINGS
========================================================= */

function initializeSettings() {

    if (!settingsLink) {

        return;

    }


    settingsLink.addEventListener(
        "click",
        event => {

            event.preventDefault();


            showToast(
                "Settings",
                "Settings module will be available in a future update.",
                "info"
            );

        }
    );

}


/* =========================================================
   RESPONSIVE BEHAVIOR
========================================================= */

function initializeResponsiveBehavior() {

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth >
                992
            ) {

                closeSidebar();

            }

        }
    );

}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

function initializeKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        event => {

            /*
               ESCAPE
            */

            if (
                event.key ===
                "Escape"
            ) {

                closeSidebar();


                const searchOverlay =
                    document.getElementById(
                        "globalSearchOverlay"
                    );


                if (searchOverlay) {

                    searchOverlay.remove();

                }


                const notificationPanel =
                    document.getElementById(
                        "notificationPanel"
                    );


                if (notificationPanel) {

                    notificationPanel.remove();

                }

            }


            /*
               CTRL + K
               Global search
            */

            if (
                event.ctrlKey &&
                event.key.toLowerCase() ===
                    "k"
            ) {

                event.preventDefault();

                openGlobalSearch();

            }

        }
    );

}


/* =========================================================
   TOAST NOTIFICATION
========================================================= */

function showToast(
    title,
    message,
    type = "success"
) {

    let container =
        document.getElementById(
            "toastContainer"
        );


    /*
       Create container if page
       doesn't already have one.
    */

    if (!container) {

        container =
            document.createElement(
                "div"
            );


        container.id =
            "toastContainer";


        container.className =
            "toast-container";


        document.body.appendChild(
            container
        );

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `toast toast-${type}`;


    const icon =
        getToastIcon(
            type
        );


    toast.innerHTML = `

        <div class="toast-icon">

            <i class="fa-solid ${icon}"></i>

        </div>

        <div class="toast-content">

            <strong>

                ${escapeHTML(
                    title
                )}

            </strong>

            <p>

                ${escapeHTML(
                    message
                )}

            </p>

        </div>

        <button
            type="button"
            class="toast-close"
            aria-label="Close"
        >

            ×

        </button>

    `;


    container.appendChild(
        toast
    );


    /*
       Close button
    */

    const closeButton =
        toast.querySelector(
            ".toast-close"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                removeToast(
                    toast
                );

            }
        );

    }


    /*
       Automatically remove.
    */

    setTimeout(
        () => {

            removeToast(
                toast
            );

        },
        4500
    );

}


/* =========================================================
   REMOVE TOAST
========================================================= */

function removeToast(
    toast
) {

    if (!toast) {

        return;

    }


    toast.classList.add(
        "toast-hide"
    );


    setTimeout(
        () => {

            if (
                toast.parentNode
            ) {

                toast.parentNode.removeChild(
                    toast
                );

            }

        },
        300
    );

}


/* =========================================================
   TOAST ICON
========================================================= */

function getToastIcon(
    type
) {

    switch (
        type
    ) {

        case "success":

            return "fa-circle-check";

        case "error":

            return "fa-circle-xmark";

        case "warning":

            return "fa-triangle-exclamation";

        case "info":

            return "fa-circle-info";

        default:

            return "fa-bell";

    }

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
   GLOBAL API
========================================================= */

window.PulseCareUI = {

    openSidebar,

    closeSidebar,

    showToast,

    openGlobalSearch,

    showNotificationPanel,

    setActiveNavigation

};