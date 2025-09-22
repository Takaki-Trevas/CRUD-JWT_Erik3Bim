const bcrypt = require('bcryptjs'); //verificador das senhas
const jwt = require('jsonwebtoken'); // 
const { v4: uuidv4 } = require('uuid'); //geração de ids
const { readDb, writeDb } = require('../utils/db');
const { SECRET } = require('../middleware/auth');

function register(req, res) {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }
  const db = readDb();
  if (db.users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email já cadastrado' });
  }
  const hashedPassword = bcrypt.hashSync(senha, 10);
  const newUser = { id: uuidv4(), nome, email, senha: hashedPassword };
  db.users.push(newUser);
  writeDb(db);
  res.status(201).json({ message: 'Usuário cadastrado com sucesso', user: { id: newUser.id, nome, email } });
}

function login(req, res) {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }
  const db = readDb();
  const user = db.users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(senha, user.senha)) {
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
  res.json({ token });
}

module.exports = { register, login };