// =========================================================
// PULSECARE AUTHENTICATION MIDDLEWARE
// =========================================================


// =========================================================
// REQUIRE LOGIN
// =========================================================

function requireAuth(req, res, next) {

    if (!req.session || !req.session.user) {

        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });

    }

    next();
}


// =========================================================
// ROLE AUTHORIZATION
// =========================================================

function requireRole(...allowedRoles) {

    return (req, res, next) => {

        if (!req.session || !req.session.user) {

            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });

        }

        const userRole = req.session.user.role;

        if (!allowedRoles.includes(userRole)) {

            return res.status(403).json({
                success: false,
                message: "Access denied"
            });

        }

        next();
    };
}


// =========================================================
// EXPORT
// =========================================================

module.exports = {
    requireAuth,
    requireRole
};