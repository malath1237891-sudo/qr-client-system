const express = require('express');
const app = express();
app.get('/', (req,res)=>res.send('QR Client System Running'));
app.listen(3000, ()=>console.log('Running'));