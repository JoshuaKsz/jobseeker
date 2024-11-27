const express = require("express");
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');
const jobseekerRoutes = require('./routes/jobseeker');
const sequelize = require('./database');
const session = require('express-session');

const app = express();
const path = require('path');
const AuthController = require("./controllers/AuthController");

app.use(express.static(path.join(__dirname,'public')))



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


app.use('/login', authRoutes);
app.use((req, res, next) => {
    console.log('Session Role:', req.session.role); // Debug untuk mengecek role
    res.locals.role = req.session.role || ''; // Simpan role di res.locals
    res.locals.checkUser = req.session.email || ''; // Simpan email di res.locals
    next();
});

// Routes after session middleware
app.use('/', dashboardRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes);
app.use('/jobseeker', jobseekerRoutes);

sequelize.sync().then(() => {
    const port = 3000;
    app.listen(port, () => {
        console.log("Server running on port http://localhost:" + port);
    });
}).catch(err => {
    console.error('Error syncing the database:', err);
});

//cd "C:\Users\LENOVO\Downloads\SEMESTER 5\jobseeker-main" jangan dihapus biar aku bisa tinggal copas pake nodemon

