const requestLogger = (req, res, next) => {
    const timestamp = new Date().toLocaleString('pt-BR');
    const method = req.method;
    const url = req.url;
    
    console.log(`\n[${timestamp}] ${method} ${url}`);
    
    // Mostrar body apenas se existir e não for vazio
    if (req.body && Object.keys(req.body).length > 0) {
        const sanitizedBody = { ...req.body };
        ['password', 'senha', 'token', 'secret'].forEach(field => {
            if (sanitizedBody[field]) sanitizedBody[field] = '***';
        });
        console.log('Body:', JSON.stringify(sanitizedBody));
    }
    
    // Mostrar query params se existirem
    if (Object.keys(req.query).length > 0) {
        console.log('Query:', JSON.stringify(req.query));
    }
    
    // Capturar tempo de resposta
    const startTime = Date.now();
    
    const originalSend = res.send;
    res.send = function(data) {
        const duration = Date.now() - startTime;
        console.log(`Status: ${res.statusCode} | Duração: ${duration}ms\n`);
        originalSend.call(this, data);
    };
    
    next();
};

module.exports = requestLogger;
