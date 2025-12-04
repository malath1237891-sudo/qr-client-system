
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  try{
    const { employee_number, password } = req.body;
    const r = await db.query('SELECT * FROM employees WHERE employee_number=$1', [employee_number]);
    const user = r.rows[0];
    if(!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if(!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, name: user.name, role: user.role });
  }catch(e){
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
