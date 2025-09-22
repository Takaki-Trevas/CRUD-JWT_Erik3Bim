import express from 'express';
const app = express();
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', usersRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));