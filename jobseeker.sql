CREATE DATABASE IF NOT EXISTS jobseeker; 

USE jobseeker;

-- Membuat tabel Account
CREATE TABLE IF NOT EXISTS Account (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Job Seeker', 'Company', 'Admin') NOT NULL
);

-- Membuat tabel Job Seeker
CREATE TABLE IF NOT EXISTS jobSeeker (
    jobSeekerId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    jobSeekerName VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    city VARCHAR(100),
    country VARCHAR(100),
    about_skill TEXT,
    education TEXT,
    experience TEXT,
    socialMedia VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES Account(userId) 
);

-- Membuat tabel Company
CREATE TABLE IF NOT EXISTS company (
    companyId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    companyName VARCHAR(255),
    industry VARCHAR(100),
    phone VARCHAR(15),
    city VARCHAR(100),
    country VARCHAR(100),
    email VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES Account(userId) ON DELETE CASCADE
);

-- Membuat tabel Job
CREATE TABLE IF NOT EXISTS job (
    jobId INT AUTO_INCREMENT PRIMARY KEY,
    companyId INT,
    jobTitle VARCHAR(255) NOT NULL,
    requirements TEXT,
    benefits TEXT,
    salary INT,
    dateOpened DATE,
    dateExpired DATE,
    industry VARCHAR(100),
    FOREIGN KEY (companyId) REFERENCES Company(companyId)
);

-- Membuat tabel Job Application
CREATE TABLE IF NOT EXISTS jobApplication (
    applicationId INT AUTO_INCREMENT PRIMARY KEY,
    jobSeekerId INT,
    jobId INT,
    applicationStatus ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    File VARCHAR(255),
    applyDate DATE,
    FOREIGN KEY (jobSeekerId) REFERENCES jobSeeker(jobSeekerId),
    FOREIGN KEY (jobId) REFERENCES job(jobId)
);
