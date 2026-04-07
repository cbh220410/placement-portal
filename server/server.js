import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize, DataTypes, Op } from 'sequelize';

dotenv.config({ path: './.env' }); // Load environment variables

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

const padNumber = (value) => String(value).padStart(2, '0');

const toDisplayTime = (timeValue) => {
  if (!timeValue) return '';
  if (/am|pm/i.test(timeValue)) return timeValue;

  const [hourText = '00', minuteText = '00'] = String(timeValue).split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const normalizedHour = hour % 12 || 12;
  return `${normalizedHour}:${padNumber(minute)} ${suffix}`;
};

const to24HourTime = (timeValue) => {
  if (!timeValue) return '';

  const trimmed = String(timeValue).trim();
  if (!/am|pm/i.test(trimmed)) {
    const [hourText = '00', minuteText = '00'] = trimmed.split(':');
    return `${padNumber(Number(hourText))}:${padNumber(Number(minuteText))}`;
  }

  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return '';

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const suffix = match[3].toUpperCase();

  if (suffix === 'AM' && hour === 12) hour = 0;
  if (suffix === 'PM' && hour !== 12) hour += 12;

  return `${padNumber(hour)}:${padNumber(minute)}`;
};

const normalizeInterviewRecord = (interview) => {
  const base = interview.toJSON ? interview.toJSON() : interview;
  let resolvedDate = base.date || null;
  let resolvedTime = base.time || null;

  if ((!resolvedDate || !resolvedTime) && base.interviewDate) {
    const parsed = new Date(base.interviewDate);
    if (!Number.isNaN(parsed.getTime())) {
      resolvedDate = resolvedDate || `${parsed.getFullYear()}-${padNumber(parsed.getMonth() + 1)}-${padNumber(parsed.getDate())}`;
      resolvedTime = resolvedTime || toDisplayTime(`${padNumber(parsed.getHours())}:${padNumber(parsed.getMinutes())}`);
    }
  }

  return {
    ...base,
    date: resolvedDate,
    time: resolvedTime,
  };
};

// --- Database Connection (MySQL with Sequelize) ---
const sequelize = new Sequelize(
  process.env.DB_NAME || 'placementdb',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

// --- User Model ---
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'student',
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'users'
});

// --- Job Model ---
const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  employerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  employerEmail: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'jobs'
});

// --- Application Model ---
const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  studentEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'SUBMITTED',
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'applications'
});

// --- Interview Model ---
const Interview = sequelize.define('Interview', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  applicationId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  studentEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  interviewDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'SCHEDULED',
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'interviews'
});

// --- Database Sync ---
sequelize.authenticate()
  .then(() => {
    console.log('✅ MySQL connected successfully!');
    return sequelize.sync();
  })
  .then(() => {
    console.log('✅ Database tables synced!');
  })
  .catch(err => console.error('❌ Database error:', err));

// --- Test Route ---
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Placement System API is running successfully!' });
});

// --- DEBUG: Check all database data ---
app.get('/api/debug/data', async (req, res) => {
  try {
    const jobs = await Job.findAll();
    const applications = await Application.findAll();
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    
    console.log('=== DATABASE DEBUG ===');
    console.log(`Jobs: ${jobs.length}`, JSON.stringify(jobs, null, 2));
    console.log(`Applications: ${applications.length}`, JSON.stringify(applications, null, 2));
    
    // Group jobs by employer email
    const jobsByEmployer = {};
    jobs.forEach(job => {
      if (!jobsByEmployer[job.employerEmail]) {
        jobsByEmployer[job.employerEmail] = [];
      }
      jobsByEmployer[job.employerEmail].push({
        id: job.id,
        title: job.title,
        location: job.location,
        employerName: job.employerName,
        employerEmail: job.employerEmail
      });
    });
    
    res.status(200).json({
      jobsCount: jobs.length,
      jobs,
      jobsByEmployer,
      applicationsCount: applications.length,
      applications,
      usersCount: users.length,
      users: users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Debug error', error: error.message });
  }
});

// --- Student Signup Route ---
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;
    
    console.log('📝 New signup attempt:', { name, email, role });
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      role
    });
    
    console.log('✅ Student data saved to MySQL:', { id: newUser.id, name, email, role });
    res.status(201).json({ 
      id: newUser.id,
      name,
      email,
      role,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('❌ Signup error:', error.message);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

// --- Student Login Route ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt:', email);
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Simple password check (not hashed for demo)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    console.log('✅ Login successful:', email);
    res.status(200).json({ 
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'Login successful',
      token: 'sample_jwt_token'
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// --- Get all students ---
app.get('/api/students', async (req, res) => {
  try {
    const students = await User.findAll({ 
      where: { role: 'student' },
      attributes: { exclude: ['password'] }
    });
    console.log(`👥 Found ${students.length} students`);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// --- Get all users ---
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    console.log(`👥 Found ${users.length} users`);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// --- Post a new job ---
app.post('/api/jobs', async (req, res) => {
  try {
    const { title, description, requirements, location, employerName, employerEmail } = req.body;
    
    console.log('💼 New job posting:', { title, employerName, employerEmail });
    
    const newJob = await Job.create({
      title,
      description,
      requirements,
      location,
      employerName,
      employerEmail
    });
    
    console.log('✅ Job posted to MySQL:', { id: newJob.id, title, employerEmail });
    res.status(201).json({
      id: newJob.id,
      title,
      description,
      requirements,
      location,
      employerName,
      employerEmail,
      company: employerName,
      createdAt: newJob.createdAt,
      message: 'Job posted successfully'
    });
  } catch (error) {
    console.error('❌ Job posting error:', error.message);
    res.status(500).json({ message: 'Job posting failed', error: error.message });
  }
});

// --- Get all jobs ---
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.findAll();
    console.log(`💼 Found ${jobs.length} jobs`);
    
    // Add company field for frontend compatibility
    const jobsWithCompany = jobs.map(job => ({
      ...job.toJSON(),
      company: job.employerName
    }));
    
    res.status(200).json(jobsWithCompany);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// --- Get jobs by employer ---
app.get('/api/jobs/employer', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: 'Email query parameter required' });
    }
    console.log(`🔍 Fetching jobs for employer: ${email}`);
    
    // Case-insensitive email search
    const jobs = await Job.findAll({ 
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('employerEmail')),
        Op.eq,
        email.toLowerCase()
      )
    });
    console.log(`💼 Found ${jobs.length} jobs for employer: ${email}`);
    console.log('Jobs found:', jobs.map(j => ({ id: j.id, title: j.title, email: j.employerEmail })));
    
    // Add company field for frontend compatibility
    const jobsWithCompany = jobs.map(job => ({
      ...job.toJSON(),
      company: job.employerName
    }));
    
    res.status(200).json(jobsWithCompany);
  } catch (error) {
    console.error('❌ Error fetching employer jobs:', error.message);
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// --- Get single job by ID ---
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job', error: error.message });
  }
});

// --- Delete job by ID (Admin only) ---
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Admin deleting job ID: ${id}`);
    
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Delete all applications for this job
    const deletedApps = await Application.destroy({ where: { jobId: parseInt(id) } });
    console.log(`🗑️ Deleted ${deletedApps} applications for job ${id}`);
    
    // Delete the job
    await job.destroy();
    console.log(`✅ Job ${id} deleted successfully`);
    
    res.status(200).json({ message: 'Job and associated applications deleted successfully', deletedApps });
  } catch (error) {
    console.error('❌ Error deleting job:', error.message);
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
});

// ==================== APPLICATIONS ====================

// --- Apply to a job ---
app.post('/api/applications', async (req, res) => {
  try {
    const { jobId, studentEmail, studentName } = req.body;
    console.log('📝 New application:', { jobId, studentEmail, studentName });
    
    // Check if already applied
    const existingApp = await Application.findOne({ 
      where: { jobId: parseInt(jobId), studentEmail } 
    });
    if (existingApp) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    
    const newApplication = await Application.create({
      jobId: parseInt(jobId),
      studentEmail,
      studentName,
      status: 'SUBMITTED'
    });
    
    console.log(`✅ Application created with ID: ${newApplication.id}`);
    res.status(201).json({
      id: newApplication.id,
      jobId: newApplication.jobId,
      studentEmail,
      studentName,
      status: newApplication.status,
      createdAt: newApplication.createdAt,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('❌ Application error:', error.message);
    res.status(500).json({ message: 'Application failed', error: error.message });
  }
});

// --- Get applications by student ---
app.get('/api/applications/student', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: 'Email query parameter required' });
    }
    const applications = await Application.findAll({ where: { studentEmail: email } });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// --- Get applications by job ---
app.get('/api/applications/job/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log(`📋 Fetching applications for job ID: ${jobId}`);
    const applications = await Application.findAll({ 
      where: { jobId: parseInt(jobId) },
      order: [['createdAt', 'DESC']]
    });
    console.log(`✅ Found ${applications.length} applications for job ${jobId}`);
    
    // Fetch job details to include in response
    const job = await Job.findByPk(parseInt(jobId));
    
    // Enhance applications with job details
    const applicationsWithJobDetails = applications.map(app => ({
      ...app.toJSON(),
      jobTitle: job ? job.title : 'Unknown Job',
      company: job ? job.employerName : 'Unknown Company',
      appliedAt: app.createdAt
    }));
    
    res.status(200).json(applicationsWithJobDetails);
  } catch (error) {
    console.error('❌ Error fetching job applications:', error.message);
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// --- Get applications by employer ---
app.get('/api/applications/employer', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: 'Email query parameter required' });
    }
    const jobs = await Job.findAll({ where: { employerEmail: email } });
    const jobIds = jobs.map(j => j.id);
    const applications = await Application.findAll({ where: { jobId: jobIds } });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// --- Get single application ---
app.get('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findByPk(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application', error: error.message });
  }
});

// --- Update application status ---
app.patch('/api/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const application = await Application.findByPk(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    application.status = status;
    await application.save();
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error updating application', error: error.message });
  }
});

// ==================== INTERVIEWS ====================

// --- Create interview ---
app.post('/api/interviews', async (req, res) => {
  try {
    const { applicationId, studentEmail, interviewDate, date, time } = req.body;
    console.log('Interview scheduling request:', { applicationId, studentEmail, date, time });

    if (!applicationId) {
      return res.status(400).json({ message: 'Application id is required' });
    }

    const application = await Application.findByPk(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const resolvedStudentEmail = studentEmail || application.studentEmail;
    const resolvedDate = date || (interviewDate ? interviewDate.slice(0, 10) : null);
    const resolvedTime = time || (interviewDate ? toDisplayTime(interviewDate.slice(11, 16)) : null);

    if (!resolvedStudentEmail || !resolvedDate || !resolvedTime) {
      return res.status(400).json({ message: 'Date and time are required to schedule an interview' });
    }

    const normalizedInterviewDate = interviewDate || `${resolvedDate}T${to24HourTime(resolvedTime)}:00`;

    const newInterview = await Interview.create({
      applicationId,
      studentEmail: resolvedStudentEmail,
      interviewDate: normalizedInterviewDate,
      status: 'SCHEDULED'
    });

    application.status = 'INTERVIEW_SCHEDULED';
    await application.save();

    res.status(201).json({
      id: newInterview.id,
      applicationId,
      studentEmail: resolvedStudentEmail,
      interviewDate: normalizedInterviewDate,
      date: resolvedDate,
      time: toDisplayTime(resolvedTime),
      status: newInterview.status,
      message: 'Interview scheduled successfully'
    });
  } catch (error) {
    console.error('Interview error:', error.message);
    res.status(500).json({ message: 'Interview scheduling failed', error: error.message });
  }
});

// --- Get interviews by student ---
app.get('/api/interviews/student', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: 'Email query parameter required' });
    }
    const interviews = await Interview.findAll({ where: { studentEmail: email }, order: [['interviewDate', 'DESC']] });
    res.status(200).json(interviews.map(normalizeInterviewRecord));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interviews', error: error.message });
  }
});

// --- Get interviews by application ---
app.get('/api/interviews/application/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const interviews = await Interview.findAll({ where: { applicationId }, order: [['interviewDate', 'DESC']] });
    res.status(200).json(interviews.map(normalizeInterviewRecord));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interviews', error: error.message });
  }
});

// ==================== EXTENDED USER ENDPOINTS ====================

// --- Get user by ID ---
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// --- Get user by email ---
app.get('/api/users/by-email', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: 'Email query parameter required' });
    }
    const user = await User.findOne({ where: { email }, attributes: { exclude: ['password'] } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// --- Get all students ---
app.get('/api/users/students', async (req, res) => {
  try {
    const students = await User.findAll({ 
      where: { role: 'student' },
      attributes: { exclude: ['password'] }
    });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// --- Delete user ---
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// --- Update student profile ---
app.patch('/api/users/:id/profile', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    Object.assign(user, req.body);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// ==================== DASHBOARD ENDPOINTS ====================

// --- Admin Dashboard Summary ---
app.get('/api/dashboard/admin', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStudents = await User.count({ where: { role: 'student' } });
    const totalEmployers = await User.count({ where: { role: 'employer' } });
    const totalJobs = await Job.count();
    const totalApplications = await Application.count();
    const totalInterviews = await Interview.count();
    
    // Application status breakdown
    const appsByStatus = await sequelize.query(
      `SELECT status, COUNT(*) as count FROM applications GROUP BY status`
    );
    
    // Recent 5 jobs
    const recentJobs = await Job.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'employerName', 'createdAt']
    });
    
    console.log(`📊 Admin Dashboard: ${totalUsers} users, ${totalJobs} jobs, ${totalApplications} applications`);
    
    res.status(200).json({
      totalUsers,
      totalStudents,
      totalEmployers,
      totalJobs,
      totalApplications,
      totalInterviews,
      applicationsByStatus: appsByStatus[0] || [],
      recentJobs,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin summary', error: error.message });
  }
});

// --- Employer Dashboard Summary ---
app.get('/api/dashboard/employer', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: 'Email query parameter required' });
    }
    
    console.log(`📊 Employer Dashboard for: ${email}`);
    
    // Get jobs with case-insensitive search
    const jobs = await Job.findAll({ 
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('employerEmail')),
        Op.eq,
        email.toLowerCase()
      )
    });
    
    const jobIds = jobs.map(j => j.id);
    const applications = await Application.findAll({ 
      where: { jobId: jobIds },
      order: [['createdAt', 'DESC']]
    });
    
    // Status breakdown
    const appsByStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log(`💼 Found ${jobs.length} jobs and ${applications.length} applications`);
    
    res.status(200).json({
      totalJobs: jobs.length,
      totalApplications: applications.length,
      jobs: jobs.map(j => ({
        id: j.id,
        title: j.title,
        location: j.location,
        createdAt: j.createdAt,
        applicationCount: applications.filter(a => a.jobId === j.id).length
      })),
      applicationsByStatus: appsByStatus,
      recentApplications: applications.slice(0, 5),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employer summary', error: error.message });
  }
});

// --- Student Dashboard Summary ---
app.get('/api/dashboard/student', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: 'Email query parameter required' });
    }
    
    console.log(`📊 Student Dashboard for: ${email}`);
    
    const applications = await Application.findAll({ 
      where: { studentEmail: email },
      order: [['createdAt', 'DESC']]
    });
    const interviews = await Interview.findAll({ 
      where: { studentEmail: email },
      order: [['interviewDate', 'DESC']]
    });
    
    // Status breakdown
    const appsByStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
    
    const interviewsByStatus = interviews.reduce((acc, intv) => {
      acc[intv.status] = (acc[intv.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log(`✅ Found ${applications.length} applications and ${interviews.length} interviews`);
    
    res.status(200).json({
      totalApplications: applications.length,
      interviewCount: interviews.length,
      applications,
      interviews,
      applicationsByStatus: appsByStatus,
      interviewsByStatus: interviewsByStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student summary', error: error.message });
  }
});

// --- Reports ---
app.get('/api/dashboard/reports', async (req, res) => {
  try {
    const totalApplications = await Application.count();
    const totalInterviews = await Interview.count();
    const applicationsByStatus = await sequelize.query(
      'SELECT status, COUNT(*) as count FROM applications GROUP BY status'
    );
    
    res.status(200).json({
      totalApplications,
      totalInterviews,
      applicationsByStatus: applicationsByStatus[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
});

// --- Anomalies ---
app.get('/api/dashboard/anomalies', async (req, res) => {
  try {
    res.status(200).json({
      message: 'No anomalies detected',
      anomalies: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching anomalies', error: error.message });
  }
});

// ==================== OFFICER ENDPOINTS ====================

// --- Officer Summary ---
app.get('/api/officer/summary', async (req, res) => {
  try {
    const totalStudents = await User.count({ where: { role: 'student' } });
    const totalJobs = await Job.count();
    const totalApplications = await Application.count();
    const totalInterviews = await Interview.count();
    
    // Application status counts
    const appStats = await sequelize.query(
      `SELECT status, COUNT(*) as count FROM applications GROUP BY status`
    );
    
    console.log(`🎓 Officer Summary: ${totalStudents} students, ${totalJobs} jobs, ${totalApplications} applications`);
    
    res.status(200).json({
      totalStudents,
      totalJobs,
      totalApplications,
      totalInterviews,
      applicationStats: appStats[0] || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching officer summary', error: error.message });
  }
});

// --- Officer Student Status ---
app.get('/api/officer/student-status', async (req, res) => {
  try {
    const students = await User.findAll({ 
      where: { role: 'student' },
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student status', error: error.message });
  }
});

// --- Update student placement ---
app.patch('/api/officer/students/:id/placement', async (req, res) => {
  try {
    const { id } = req.params;
    const { placement } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    user.placement = placement;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating placement', error: error.message });
  }
});

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
  console.log(`👥 Students: http://localhost:${PORT}/api/students`);
  console.log(`👤 All Users: http://localhost:${PORT}/api/users`);
});

