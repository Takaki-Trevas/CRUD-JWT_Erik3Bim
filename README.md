# 📦 CRUD JWT JSON

Desenvolver uma API BackEnd com **Node.js**, **Express**, **JWT** e persistência em **arquivo JSON**.  
Implementar o  **CRUD de usuários** e autenticação baseada em token.
Os teste deve ser feito utilizando **Thunder Client** nas respectivas rotas

# 📌 Rotas da API

## POST /register → cadastrar novo usuário.
Dados: { nome, email, senha }
## POST /login → autenticação do usuário.
Gera um JWT válido por 1h.
## GET /users → listar todos os usuários (rota protegida).
## GET /users/:id → buscar um usuário específico por id (rota protegida).
## PUT /users/:id → atualizar dados de um usuário (rota protegida).
## DELETE /users/:id → remover usuário (rota protegida).

---

## 🚀 Tecnologias Sugeridas
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [JWT](https://jwt.io/)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [uuid](https://www.npmjs.com/package/uuid)

---

## 📂 Estrutura do Projeto
     ├─ db.json
     ├─ server.js
     ├─ utils/
     │     └─ db.js
     ├─ middleware/
     │     └─ auth.js
     ├─ controllers/
     │    ├─ authController.js
     │    └─ usersController.js
     └─ routes/
          ├─ auth.js
          └─ users.js


# Comentários:
-  npm install -g json-server -> instala o necessário para usar o db.json como database
-  json-server --watch db.json -> inicia e verificação

análise I.A.(ChatGPT):
✅ O que está bem implementado

Controllers (authController, usersController):

CRUD completo de usuários (sem expor senha).

Registro com hash da senha (bcryptjs).

Login que gera JWT válido por 1h.

Atualização com re-hash de senha ✔️.

Uso do uuid para IDs (melhor que Date.now()).

Rotas:

/register, /login, /users, /users/:id, etc. → todas criadas.

Middleware de autenticação presente.

Persistência:

Uso de fs + JSON simples, conforme pedido.

Server:

Express configurado.

Tratamento básico de rotas inexistentes.

package.json:

Dependências corretas (express, bcryptjs, jsonwebtoken, uuid).

Scripts de start e dev ✔️.

⚠️ Problemas encontrados

Inconsistência entre CommonJS e ES Modules

Você está misturando require com import.

Exemplo:

server.js → import express from 'express';

routes/auth.js → const express = require('express');

O Node não aceita os dois ao mesmo tempo, a não ser que configure "type": "module" no package.json (e ajuste tudo para import).

Solução: escolha um padrão só. Como já está majoritariamente em CommonJS, sugiro trocar import por require.

Erros no authMiddleware

Está assim:

const authHeader = req.headersd["authorization"];


→ headersd é erro de digitação, deve ser req.headers.

Token está sendo extraído errado:

const token = authHeader.split("")[1];


→ Isso divide cada caractere. O correto é:

const token = authHeader.split(" ")[1];


jwt.verify precisa da SECRET:

const decoded = jwt.verify(token, SECRET);


db.js mal implementado

Você escreveu:

function lerDb() {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}


dbPath não existe, deveria usar caminhoDados.

Você exporta readDb, mas a função se chama lerDb.

Correção:

const fs = require('fs');
const path = require('path');
const caminhoDados = path.join(__dirname, '../db.json');

function readDb() {
  const data = fs.readFileSync(caminhoDados, 'utf-8');
  return JSON.parse(data);
}

function writeDb(data) {
  fs.writeFileSync(caminhoDados, JSON.stringify(data, null, 2));
}

module.exports = { readDb, writeDb };


Inconsistência nos exports/imports do middleware

Em routes/users.js você chama verifyToken, mas no authMiddleware exportou como export default authMiddleware.

Se usar CommonJS, deveria ser:

function verifyToken(req, res, next) { ... }
module.exports = { verifyToken, SECRET };


Assim fica compatível com o require nas rotas.

🚀 O que eu sugiro ajustar

Padronizar CommonJS (usar sempre require / module.exports).

Corrigir authMiddleware (erro no headers, no split e no jwt.verify).

Arrumar db.js (nome das funções e caminho).

Exportar corretamente verifyToken no middleware para combinar com as rotas.

(Extra) Melhorar mensagens de erro → padronizar em português e status HTTP corretos (409 para email já existente foi bom 👍).

