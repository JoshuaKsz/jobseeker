// middleware/auth.js
const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    next(); // Proceed to the next middleware/route handler if authenticated
};

module.exports = authMiddleware;
