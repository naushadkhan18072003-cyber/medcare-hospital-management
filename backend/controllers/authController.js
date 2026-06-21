const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields!' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, hashedPassword, role || 'receptionist'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User registered successfully!' });
  });
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill all fields!' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password!' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password!' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful!', token, user: { name: user.name, role: user.role } });
  });
};

module.exports = { register, login };