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

    // Load dashboard data from backend
    loadDashboardStatistics();

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
   REAL DATABASE NOTIFICATIONS
========================================================= */

let notificationData = [];
let notificationUnreadCount = 0;


/* =========================================================
   INITIALIZE NOTIFICATIONS
========================================================= */

function initializeNotifications() {

    if (!notificationBtn) {
        return;
    }

    // Load notifications immediately
    loadNotifications();

    // Refresh notifications every 30 seconds
    setInterval(
        loadNotifications,
        30000
    );

    // Open notification panel
    notificationBtn.addEventListener(
        "click",
        () => {

            showNotificationPanel();

        }
    );

}


/* =========================================================
   LOAD NOTIFICATIONS FROM BACKEND
========================================================= */

async function loadNotifications() {

    try {

        const response =
            await fetch(
                "/api/notifications",
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!response.ok) {

            console.error(
                "Failed to load notifications:",
                response.status
            );

            return;

        }


        const data =
            await response.json();


        if (!data.success) {

            console.error(
                "Notification API error:",
                data.message
            );

            return;

        }


        notificationData =
            Array.isArray(
                data.notifications
            )
                ? data.notifications
                : [];


        notificationUnreadCount =
            Number(
                data.unreadCount || 0
            );


        updateNotificationBadge();


    } catch (error) {

        console.error(
            "Notification loading error:",
            error
        );

    }

}


/* =========================================================
   UPDATE NOTIFICATION BADGE
========================================================= */

function updateNotificationBadge() {

    if (!notificationBtn) {
        return;
    }


    // Look for an existing badge
    let badge =
        notificationBtn.querySelector(
            ".notification-badge"
        );


    /*
       Create badge if it doesn't exist.
    */

    if (
        notificationUnreadCount > 0 &&
        !badge
    ) {

        badge =
            document.createElement(
                "span"
            );

        badge.className =
            "notification-badge";

        notificationBtn.appendChild(
            badge
        );

    }


    /*
       Update badge count.
    */

    if (badge) {

        if (
            notificationUnreadCount > 0
        ) {

            badge.textContent =
                notificationUnreadCount > 99
                    ? "99+"
                    : notificationUnreadCount;

            badge.style.display =
                "flex";

        } else {

            badge.style.display =
                "none";

        }

    }

}


/* =========================================================
   NOTIFICATION ICON
========================================================= */

function getNotificationIcon(
    type,
    title
) {

    const text =
        `${type || ""} ${title || ""}`
            .toLowerCase();


    if (
        text.includes("completed") ||
        text.includes("medical")
    ) {

        return {
            className: "green",
            icon: "fa-file-medical"
        };

    }


    if (
        text.includes("confirmed")
    ) {

        return {
            className: "green",
            icon: "fa-circle-check"
        };

    }


    if (
        text.includes("cancel")
    ) {

        return {
            className: "orange",
            icon: "fa-calendar-xmark"
        };

    }


    if (
        text.includes("appointment")
    ) {

        return {
            className: "blue",
            icon: "fa-calendar-check"
        };

    }


    return {
        className: "blue",
        icon: "fa-bell"
    };

}


/* =========================================================
   FORMAT NOTIFICATION TIME
========================================================= */

function formatNotificationTime(
    createdAt
) {

    if (!createdAt) {
        return "";
    }


    const date =
        new Date(
            createdAt
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return createdAt;

    }


    const now =
        new Date();


    const difference =
        Math.floor(
            (
                now.getTime() -
                date.getTime()
            ) / 1000
        );


    if (difference < 60) {
        return "Just now";
    }


    if (difference < 3600) {

        const minutes =
            Math.floor(
                difference / 60
            );

        return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

    }


    if (difference < 86400) {

        const hours =
            Math.floor(
                difference / 3600
            );

        return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

    }


    if (difference < 604800) {

        const days =
            Math.floor(
                difference / 86400
            );

        return `${days} day${days !== 1 ? "s" : ""} ago`;

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
   ESCAPE HTML
========================================================= */

function escapeNotificationHTML(
    value
) {

    return String(
        value ?? ""
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
   SHOW NOTIFICATION PANEL
========================================================= */

async function showNotificationPanel() {

    const existingPanel =
        document.getElementById(
            "notificationPanel"
        );


    /*
       Toggle panel.
    */

    if (existingPanel) {

        existingPanel.remove();

        return;

    }


    /*
       Refresh before opening.
    */

    await loadNotifications();


    const panel =
        document.createElement(
            "div"
        );


    panel.id =
        "notificationPanel";

    panel.className =
        "notification-panel";


    /*
       Generate notification items.
    */

    let notificationHTML = "";


    if (
        notificationData.length === 0
    ) {

        notificationHTML = `

            <div
                class="notification-empty"
                style="
                    padding:30px 20px;
                    text-align:center;
                    color:#64748b;
                "
            >

                <i
                    class="fa-regular fa-bell-slash"
                    style="
                        font-size:28px;
                        margin-bottom:10px;
                        display:block;
                    "
                ></i>

                <strong>
                    No notifications
                </strong>

                <p
                    style="
                        margin:6px 0 0;
                        font-size:13px;
                    "
                >
                    You're all caught up.
                </p>

            </div>

        `;

    } else {

        notificationHTML =
            notificationData
                .map(
                    notification => {

                        const icon =
                            getNotificationIcon(
                                notification.type,
                                notification.title
                            );


                        const unreadClass =
                            Number(
                                notification.is_read
                            ) === 0
                                ? " unread"
                                : "";


                        return `

                            <div
                                class="notification-item${unreadClass}"
                                data-notification-id="${escapeNotificationHTML(notification.id)}"
                                style="
                                    cursor:pointer;
                                    ${Number(notification.is_read) === 0
                                        ? "background:#f8fbff;"
                                        : ""}
                                "
                            >

                                <div
                                    class="notification-icon ${icon.className}"
                                >

                                    <i
                                        class="fa-solid ${icon.icon}"
                                    ></i>

                                </div>


                                <div>

                                    <strong>
                                        ${escapeNotificationHTML(
                                            notification.title
                                        )}
                                    </strong>


                                    <p>
                                        ${escapeNotificationHTML(
                                            notification.message
                                        )}
                                    </p>


                                    <small>
                                        ${escapeNotificationHTML(
                                            formatNotificationTime(
                                                notification.created_at
                                            )
                                        )}
                                    </small>

                                </div>

                            </div>

                        `;

                    }
                )
                .join("");

    }


    panel.innerHTML = `

        <div
            class="notification-panel-header"
        >

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


        <div
            class="notification-list"
        >

            ${notificationHTML}

        </div>


        <div
            class="notification-panel-footer"
        >

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


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

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


    /* =====================================================
       MARK INDIVIDUAL NOTIFICATION AS READ
    ===================================================== */

    const notificationItems =
        panel.querySelectorAll(
            "[data-notification-id]"
        );


    notificationItems.forEach(
        item => {

            item.addEventListener(
                "click",
                async () => {

                    const id =
                        item.dataset
                            .notificationId;


                    try {

                        const response =
                            await fetch(
                                `/api/notifications/${id}/read`,
                                {
                                    method: "PATCH",
                                    credentials: "include"
                                }
                            );


                        if (
                            response.ok
                        ) {

                            const notification =
                                notificationData.find(
                                    n =>
                                        String(n.id) ===
                                        String(id)
                                );


                            if (
                                notification
                            ) {

                                notification.is_read =
                                    1;

                            }


                            notificationUnreadCount =
                                Math.max(
                                    0,
                                    notificationUnreadCount - 1
                                );


                            updateNotificationBadge();


                            item.style.background =
                                "";


                            item.classList.remove(
                                "unread"
                            );

                        }

                    } catch (error) {

                        console.error(
                            "Mark notification read error:",
                            error
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       MARK ALL AS READ
    ===================================================== */

    const clearBtn =
        document.getElementById(
            "clearNotifications"
        );


    if (clearBtn) {

        clearBtn.addEventListener(
            "click",
            async () => {

                try {

                    const response =
                        await fetch(
                            "/api/notifications/read-all",
                            {
                                method: "PATCH",
                                credentials: "include"
                            }
                        );


                    const data =
                        await response.json();


                    if (
                        response.ok &&
                        data.success
                    ) {

                        notificationData =
                            notificationData.map(
                                notification => ({
                                    ...notification,
                                    is_read: 1
                                })
                            );


                        notificationUnreadCount =
                            0;


                        updateNotificationBadge();


                        /*
                           Refresh panel.
                        */

                        panel.remove();


                        showToast(
                            "Notifications",
                            "All notifications marked as read.",
                            "success"
                        );

                    }

                } catch (error) {

                    console.error(
                        "Mark all notifications read error:",
                        error
                    );

                    showToast(
                        "Error",
                        "Failed to update notifications.",
                        "error"
                    );

                }

            }
        );

    }


    /* =====================================================
       CLOSE WHEN CLICKING OUTSIDE
    ===================================================== */

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

async function handleLogout() {

    const confirmed = confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmed) {
        return;
    }

    try {

        await window.PulseCareAuth.logout();

    } catch (error) {

        console.error(
            "Logout failed:",
            error
        );

        window.location.replace("login.html");
    }
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
   DASHBOARD STATISTICS
   Loads real statistics from the backend API
========================================================= */

async function loadDashboardStatistics() {

    // Only run on the dashboard page
    const dashboardStats =
        document.getElementById("dashboardStats");

    if (!dashboardStats) {
        return;
    }

    try {

        const response = await fetch(
            "/api/admin/dashboard",
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            console.error(
                "Dashboard API error:",
                data
            );

            return;
        }

        const statistics =
            data.statistics || {};

        /*
         * Update Doctors
         */
        const totalDoctors =
            document.getElementById(
                "totalDoctors"
            );

        if (totalDoctors) {

            totalDoctors.textContent =
                statistics.totalDoctors ?? 0;

        }


        /*
         * Update Patients
         */
        const totalPatients =
            document.getElementById(
                "totalPatients"
            );

        if (totalPatients) {

            totalPatients.textContent =
                statistics.totalPatients ?? 0;

        }


        /*
         * Update Appointments
         */
        const totalAppointments =
            document.getElementById(
                "totalAppointments"
            );

        if (totalAppointments) {

            totalAppointments.textContent =
                statistics.totalAppointments ?? 0;

        }


        /*
         * Update Departments
         */
        const totalDepartments =
            document.getElementById(
                "totalDepartments"
            );

        if (totalDepartments) {

            totalDepartments.textContent =
                statistics.totalDepartments ?? 0;

        }


        console.log(
            "✅ Dashboard statistics loaded:",
            statistics
        );

    } catch (error) {

        console.error(
            "❌ Failed to load dashboard statistics:",
            error
        );

    }

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

    setActiveNavigation,

    loadDashboardStatistics

};