const { readDb, writeDb } = require('../utils/db');
const bcrypt = require('bcryptjs');

function getAllUsers(req, res) {
  const db = readDb();
  const users = db.users.map(u => ({ id: u.id, nome: u.nome, email: u.email }));
  res.json(users);
}

function getUserById(req, res) {
  const db = readDb();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  const { id, nome, email } = user;
  res.json({ id, nome, email });
}

function updateUser(req, res) {
  const { nome, email, senha } = req.body;
  const db = readDb();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  if (nome) user.nome = nome;
  if (email) user.email = email;
  if (senha) user.senha = bcrypt.hashSync(senha, 10);

  writeDb(db);
  res.json({ message: 'Usuário atualizado', user: { id: user.id, nome: user.nome, email: user.email } });
}

function deleteUser(req, res) {
  const db = readDb();
  const idx = db.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Usuário não encontrado' });
  db.users.splice(idx, 1);
  writeDb(db);
  res.json({ message: 'Usuário removido com sucesso' });
}

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };