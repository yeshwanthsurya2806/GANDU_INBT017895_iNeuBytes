const express = require("express");
const db = require("../config/database");
const { requireRole } = require("../middleware/auth");

const router = express.Router();


// =========================================================
// GET NOTIFICATIONS
// GET /api/notifications
// =========================================================

router.get(
    "/",
    requireRole("patient", "doctor", "admin"),
    (req, res) => {

        try {

            const notifications = db.prepare(`
                SELECT
                    id,
                    title,
                    message,
                    type,
                    is_read,
                    created_at
                FROM notifications
                WHERE user_id = ?
                ORDER BY created_at DESC
                LIMIT 50
            `).all(req.session.user.id);

            const unreadCount = db.prepare(`
                SELECT COUNT(*) AS count
                FROM notifications
                WHERE user_id = ?
                AND is_read = 0
            `).get(req.session.user.id);

            return res.json({
                success: true,
                notifications,
                unreadCount: unreadCount.count
            });

        } catch (error) {

            console.error(
                "Get notifications error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load notifications"
            });
        }
    }
);


// =========================================================
// MARK SINGLE NOTIFICATION AS READ
// PATCH /api/notifications/:id/read
// =========================================================

router.patch(
    "/:id/read",
    requireRole("patient", "doctor", "admin"),
    (req, res) => {

        try {

            const result = db.prepare(`
                UPDATE notifications
                SET is_read = 1
                WHERE id = ?
                AND user_id = ?
            `).run(
                req.params.id,
                req.session.user.id
            );

            if (result.changes === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Notification not found"
                });
            }

            return res.json({
                success: true,
                message: "Notification marked as read"
            });

        } catch (error) {

            console.error(
                "Mark notification read error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to update notification"
            });
        }
    }
);


// =========================================================
// MARK ALL NOTIFICATIONS AS READ
// PATCH /api/notifications/read-all
// =========================================================

router.patch(
    "/read-all",
    requireRole("patient", "doctor", "admin"),
    (req, res) => {

        try {

            db.prepare(`
                UPDATE notifications
                SET is_read = 1
                WHERE user_id = ?
            `).run(
                req.session.user.id
            );

            return res.json({
                success: true,
                message: "All notifications marked as read"
            });

        } catch (error) {

            console.error(
                "Mark all notifications read error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to update notifications"
            });
        }
    }
);


module.exports = router;