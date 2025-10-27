require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false,
        ca: process.env.DB_SSL_CA,
    },
    max: 20, // número máximo de clientes no pool
    idleTimeoutMillis: 30000, // tempo que um cliente pode ficar ocioso
    connectionTimeoutMillis: 2000, // tempo máximo para obter conexão
});

// Event listeners para monitoramento
pool.on('connect', () => {
    console.log('Nova conexão estabelecida com o pool PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Erro inesperado no pool de conexões:', err);
    process.exit(-1);
});

// Função auxiliar para testar conexão
const testConnection = async () => {
    try {
        const result = await pool.query('SELECT VERSION()');
        console.log('Conectado ao PostgreSQL:', result.rows[0].version);
    } catch (err) {
        console.error('Erro ao testar conexão:', err);
        throw err;
    }
};

module.exports = { pool, testConnection };
