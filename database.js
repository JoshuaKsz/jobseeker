const mysql = require('mysql2');
const { Sequelize } = require('sequelize');

// Create a connection to the database
const sequelize = new Sequelize(
    'jobseeker', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql',
});

const authenticate = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

authenticate();

module.exports = sequelize;
