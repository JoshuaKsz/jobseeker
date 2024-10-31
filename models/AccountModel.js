const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database'); 

const Account = sequelize.define('Account', {
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Job Seeker', 'Company', 'Admin'),
        allowNull: false
    }
}, {
    tableName: 'Account', 
    timestamps: false
});


module.exports = Account;
