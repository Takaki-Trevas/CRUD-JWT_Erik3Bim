//const fs = require('fs');
import fs from 'fs';
const caminho = require('path');
const caminhoDados = caminho.join(__dirname, '../db.json');

function lerDb() {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}

function writeDb(data) {
  fs.writeFileSync(caminhoDados, JSON.stringify(data, null, 2));
}

module.exports = { readDb, writeDb };