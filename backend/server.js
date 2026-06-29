const express = require('express');
const cors    = require('cors');
const path    = require('path');

const produtosRouter   = require('./routes/produtos');
const categoriasRouter = require('./routes/categorias');

const app  = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/produtos',   produtosRouter);
app.use('/api/categorias', categoriasRouter);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
