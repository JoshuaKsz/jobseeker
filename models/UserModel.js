const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Adjust the path as needed

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'users', 
    timestamps: false,
});

module.exports = User;