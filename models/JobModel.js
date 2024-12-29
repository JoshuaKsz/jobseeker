const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const Company = require('./CompanyModel') // Import model Company
const JobApplication = require('./JobApplicationModel');


const Job = sequelize.define('Job', {
    jobId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Company',
            key: 'companyId'
        }
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    requirements: {
        type: DataTypes.TEXT
    },
    benefits: {
        type: DataTypes.TEXT
    },
    salary: {
        type: DataTypes.INTEGER
    },
    dateOpened: {
        type: DataTypes.DATE
    },
    dateExpired: {
        type: DataTypes.DATE
    },
    industry: {
        type: DataTypes.STRING(100)
    }
}, {
    tableName: 'job',
    timestamps: false
});

module.exports = Job;
