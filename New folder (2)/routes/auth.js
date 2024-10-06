// backend/routes/auth.js
const express = require('express');
const fs = require('fs');
const router = express.Router();

// Load user data
const loadUserData = () => {
  const data = fs.readFileSync('./backend/data.json', 'utf8');
  return JSON.parse(data || '[]');
};

// Save user data
const saveUserData = (data) => {
  fs.writeFileSync('./backend/data.json', JSON.stringify(data, null, 2));
};

// Registration
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const users = loadUserData();

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  // Check for existing user
  const userExists = users.some(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists!' });
  }

  // Add new user
  users.push({ username, email, password });
  saveUserData(users);
  res.status(201).json({ message: 'User registered successfully!' });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = loadUserData();

  const user = users.find(user => user.email === email && user.password === password);
  if (user) {
    return res.json({ message: 'Login successful!', user });
  }

  res.status(401).json({ message: 'Invalid credentials!' });
});

module.exports = router;
