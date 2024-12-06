const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database'); 

const JobSeeker = sequelize.define('JobSeeker', {
    jobSeekerId: {
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
    jobSeekerName: {
        type: DataTypes.STRING,
        allowNull: true
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
    about_skill: {
        type: DataTypes.TEXT
    },
    education: {
        type: DataTypes.TEXT
    },
    experience: {
        type: DataTypes.TEXT
    },
    socialMedia: {
        type: DataTypes.STRING(255)
    }
}, {
    tableName: 'jobSeeker',
    timestamps: false
});

module.exports = JobSeeker;