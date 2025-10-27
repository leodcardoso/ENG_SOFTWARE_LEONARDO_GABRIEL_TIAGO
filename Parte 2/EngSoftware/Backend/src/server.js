const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { testConnection } = require('./config/database');
const requestLogger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use(requestLogger);

// Routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ ERRO:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, async () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log('='.repeat(80));
    
    // Testar conexão com banco de dados
    try {
        await testConnection();
        console.log('✅ Banco de dados conectado com sucesso!');
    } catch (err) {
        console.error('❌ Falha ao conectar ao banco de dados:', err.message);
    }
    
    console.log('='.repeat(80) + '\n');
});

module.exports = app;