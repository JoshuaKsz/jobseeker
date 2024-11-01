const express = require("express");
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');
const sequelize = require('./database');
const session = require('express-session');

const app = express();



app.use(session({
    secret: 'your_secret_key', // Change to a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes);


sequelize.sync().then(() => {
    const port = 80;
    app.listen(port, () => {
        console.log("Server running on port http://localhost:" + port);
    });
}).catch(err => {
    console.error('Error syncing the database:', err);
});
