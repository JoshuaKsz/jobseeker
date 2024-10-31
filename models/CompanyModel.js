const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const Company = sequelize.define('Company', {
    companyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Account',
            key: 'userId'
        }
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    industry: {
        type: DataTypes.STRING(100)
    },
    phone: {
        type: DataTypes.STRING(15)
    },
    city: {
        type: DataTypes.STRING(100)
    },
    country: {
        type: DataTypes.STRING(100)
    },
    email: {
        type: DataTypes.STRING(255)
    }
}, {
    tableName: 'company',
    timestamps: false
});

module.exports = Company;
