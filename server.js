const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const session = require('express-session');
const QRCode = require('qrcode');

app.get('/', (req, res) => {
  res.send('🚀 DevSecOps Pipeline is LIVE! Deployed via Jenkins & Minikube.');
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});