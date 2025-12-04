
const express = require('express');
const router = express.Router();
const db = require('../db');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');

// public: get client by barcode token (only confirm existence & id)
router.get('/by-barcode/:token', async (req, res) => {
  try{
    const r = await db.query('SELECT id, name, barcode_token FROM clients WHERE barcode_token=$1', [req.params.token]);
    if(r.rowCount===0) return res.status(404).json({ error: 'Not found' });
    res.json({ id: r.rows[0].id, name: r.rows[0].name });
  }catch(e){
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected: get client full data + visits
router.get('/:id', authMiddleware, async (req, res) => {
  try{
    const clientId = req.params.id;
    const client = (await db.query('SELECT id,name,phone,created_at FROM clients WHERE id=$1',[clientId])).rows[0];
    if(!client) return res.status(404).json({ error: 'client not found' });
    const visits = (await db.query('SELECT v.*, e.name as employee_name FROM visits v LEFT JOIN employees e ON v.employee_id=e.id WHERE client_id=$1 ORDER BY visit_date DESC', [clientId])).rows;
    res.json({ client, visits });
  }catch(e){
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// create client (generate barcode token + qrcode)
router.post('/', authMiddleware, async (req, res) => {
  try{
    const { name, phone } = req.body;
    const token = require('crypto').randomBytes(12).toString('hex');
    const r = await db.query('INSERT INTO clients (name,phone,barcode_token) VALUES($1,$2,$3) RETURNING id,barcode_token', [name,phone,token]);
    const barcodeUrl = `${process.env.SITE_URL}/scan/${r.rows[0].barcode_token}`;
    const qrDataUrl = await qrcode.toDataURL(barcodeUrl);
    res.json({ id: r.rows[0].id, barcode_token: r.rows[0].barcode_token, qrDataUrl });
  }catch(e){
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// add visit
router.post('/:id/visits', authMiddleware, async (req, res) => {
  try{
    const clientId = req.params.id;
    const { notes, result } = req.body;
    const employeeId = req.user.id;
    const r = await db.query('INSERT INTO visits (client_id, employee_id, notes, result) VALUES($1,$2,$3,$4) RETURNING *', [clientId, employeeId, notes, result]);
    res.json(r.rows[0]);
  }catch(e){
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// middleware for auth:
function authMiddleware(req, res, next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ error: 'No token' });
  const token = header.replace('Bearer ', '');
  try{
    const parsed = jwt.verify(token, process.env.JWT_SECRET);
    req.user = parsed;
    next();
  }catch(e){ return res.status(401).json({ error: 'Invalid token' }); }
}

module.exports = router;
