// associations.js
const Account = require('./models/AccountModel');
const Company = require('./models/CompanyModel');
const Job = require('./models/JobModel');
const JobApplication = require('./models/JobApplicationModel');
const JobSeeker = require('./models/JobSeekerModel');

function defineAssociations() {
  // Relasi antara Company dan Job
  Company.hasMany(Job, { foreignKey: 'companyId', onDelete: 'CASCADE' });
  Job.belongsTo(Company, { foreignKey: 'companyId' });

  // Relasi antara JobSeeker dan Account
  JobSeeker.belongsTo(Account, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Account.hasOne(JobSeeker, { foreignKey: 'userId', onDelete: 'CASCADE' });

  // Relasi antara Company dan Account
  Company.belongsTo(Account, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Account.hasOne(Company, { foreignKey: 'userId', onDelete: 'CASCADE' });

  // Relasi antara JobApplication dan JobSeeker
  JobApplication.belongsTo(JobSeeker, { foreignKey: 'jobSeekerId' });
  JobSeeker.hasMany(JobApplication, { foreignKey: 'jobSeekerId' });

  // Relasi antara JobApplication dan Job
  JobApplication.belongsTo(Job, { foreignKey: 'jobId' });
  Job.hasMany(JobApplication, { foreignKey: 'jobId' });
}

module.exports = { defineAssociations };