const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const JobSeeker = require('./JobSeekerModel');
const Job = require('./JobModel');
 
const JobApplication = sequelize.define('JobApplication', {
    applicationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    jobSeekerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'JobSeeker',
            key: 'jobSeekerId'
        }
    },
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Job', 
            key: 'jobId'
        }
    },
    applicationStatus: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending'
    },
    File: {
        type: DataTypes.STRING(255)
    },
    applyDate: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'jobApplication',
    timestamps: false
});

module.exports = JobApplication;
