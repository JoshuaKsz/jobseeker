const express = require("express");
const flash = require('connect-flash');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');
const jobseekerRoutes = require('./routes/jobseeker');
const companyRoutes = require('./routes/company');
const { defineAssociations } = require('./associations');
const sequelize = require('./database');
const session = require('express-session');
const multer = require('multer');
const app = express();
const path = require('path');
const fs = require('fs');

const AuthController = require("./controllers/AuthController");

app.use(express.static(path.join(__dirname,'public')))



app.use(session({
    secret: 'your_secret_key', // Change to a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(flash());
// app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true }));


app.use('/login', authRoutes);
app.use((req, res, next) => {
    console.log('Session Role:', req.session.role); // Debug untuk mengecek role
    res.locals.role = req.session.role || ''; // Simpan role di res.locals
    res.locals.checkUser = req.session.email || ''; // Simpan email di res.locals
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});
app.post('/clear-flash', (req, res) => {
    req.flash('error'); // Hapus flash message 'error'
    req.flash('success'); // Hapus flash message 'success'
    res.sendStatus(200);
  });
// Routes after session middleware
app.use('/', dashboardRoutes);
app.use('/', authRoutes);
app.use('/', jobseekerRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes);
app.use('/jobseeker', jobseekerRoutes);
app.use("/company", companyRoutes);
defineAssociations();
sequelize.sync().then(() => {
    const port = 8080;
    app.listen(port, () => {
        if (port != 8080) {
            console.log("Server running on port http://localhost:" + port);
        } else {
            console.log("Server running on port http://localhost");
        }
    });
}).catch(err => {
    console.error('Error syncing the database:', err);
});


app.get('/download/:fileName', (req, res) => {
    const fileName = req.params.fileName;

    const filePath = path.join(__dirname, 'test', fileName);

    // Check file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist
            console.log('File does not exist:', filePath);
            return res.status(404).send('File not found');
        }

        // If file exists
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.log('Error downloading the file', err);
                res.status(500).send('Could not download the file');
            }
        });
    });

});




//cd "C:\Users\LENOVO\Downloads\SEMESTER 5\jobseeker-main" jangan dihapus biar aku bisa tinggal copas pake nodemon

