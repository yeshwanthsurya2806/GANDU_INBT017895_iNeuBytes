// ======================================================
// PULSECARE AUTHENTICATION GUARD
// ======================================================

(function () {

    "use strict";


    // --------------------------------------------------
    // PAGE CONFIGURATION
    // --------------------------------------------------

    const currentPage =
        window.location.pathname.split("/").pop().toLowerCase();


    const publicPages = [
        "",
        "login.html",
        "register.html",
        "signup.html"
    ];


    // --------------------------------------------------
    // CHECK AUTHENTICATION
    // --------------------------------------------------

    async function checkAuthentication() {

        try {

            const response = await fetch("/api/auth/me", {
                method: "GET",
                credentials: "include",
                cache: "no-store"
            });


            const data = await response.json();


            // ------------------------------------------
            // USER IS LOGGED IN
            // ------------------------------------------

            if (response.ok && data.success && data.user) {

                window.PulseCareUser = data.user;

                console.log(
                    "✅ Authenticated:",
                    data.user.name,
                    "| Role:",
                    data.user.role
                );

                return true;
            }


            // ------------------------------------------
            // USER IS NOT LOGGED IN
            // ------------------------------------------

            console.warn("⚠️ Authentication required");

            redirectToLogin();

            return false;

        } catch (error) {

            console.error(
                "Authentication check failed:",
                error
            );

            redirectToLogin();

            return false;
        }
    }


    // --------------------------------------------------
    // REDIRECT TO LOGIN
    // --------------------------------------------------

    function redirectToLogin() {

        if (currentPage === "login.html") {
            return;
        }

        window.location.replace("login.html");
    }


    // --------------------------------------------------
    // LOGOUT
    // --------------------------------------------------

    async function logout() {

        try {

            const response = await fetch(
                "/api/auth/logout",
                {
                    method: "POST",
                    credentials: "include",
                    cache: "no-store"
                }
            );


            const data = await response.json();


            if (data.success) {

                console.log(
                    "✅ Logged out successfully"
                );

                // Clear local information
                sessionStorage.clear();

                // Prevent returning to dashboard
                window.location.replace("login.html");

                return;
            }


            console.error(
                "Logout failed:",
                data.message
            );

        } catch (error) {

            console.error(
                "Logout request failed:",
                error
            );

            // Even if request fails,
            // send user to login.
            window.location.replace("login.html");
        }
    }


    // --------------------------------------------------
    // PROTECT PAGE
    // --------------------------------------------------

    if (!publicPages.includes(currentPage)) {

        checkAuthentication();

    }


    // --------------------------------------------------
    // EXPOSE LOGOUT
    // --------------------------------------------------

    window.PulseCareAuth = {
        checkAuthentication,
        logout
    };


})();