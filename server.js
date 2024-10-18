const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.static('public'));


// abordagem com filesync
const loadData = () => { const data = fs.readFileSync('distributions.json', 'utf-8'); return JSON.parse(data);};
const saveData = (data) => { fs.writeFileSync('distributions.json', JSON.stringify(data, null, 4));};





// Rota para obter todas as distribuições
app.get('/api/distributions', (req, res) => {
    const distributions = loadData();
    res.json(distributions);
});
const generateETag = (data) => {
    return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
};
// Rota para obter uma distribuição pelo ID
app.get('/api/distributions/:id', (req, res) => {
    const distributions = loadData();
    const id = parseInt(req.params.id);

    if (isNaN(id)) return res.status(400).send('ID inválido.');

    const distribution = distributions.find(d => d.id === id);
    if (!distribution) return res.status(404).send('Distribuição não encontrada.');

    // Gerar ETag dinâmico
    const eTag = generateETag(distribution);

    // Configurar os cabeçalhos
    res.set({
        'Content-Type': 'application/json',
        'Content-Length': JSON.stringify(distribution).length,
        'Last-Modified': new Date().toUTCString(),
        'ETag': eTag,
        'Cache-Control': 'no-cache', // Cache control
        'X-Powered-By': 'Express', // Cabeçalho personalizado
        'Access-Control-Allow-Origin': '*' // CORS
    });

    // Enviar a resposta
    res.status(200).send(distribution);
});

// Rota para adicionar uma nova distribuição
app.post('/api/distributions', (req, res) => {
    const distributions = loadData();
    const newDistribution = {
        id: distributions.length + 1,
        ...req.body
    };
    distributions.push(newDistribution);
    saveData(distributions);
    res.status(201).json(newDistribution);
});

// Rota para atualizar uma distribuição
app.put('/api/distributions/:id', (req, res) => {
    const distributions = loadData();
    const index = distributions.findIndex(d => d.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('Distribuição não encontrada.');

    const { name, version, type, description, official_website, notable_packages } = req.body;

    // Verifica se todos os campos estão presentes
    if (!name || !version || !type || !description || !official_website || !notable_packages) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const updatedDistribution = {
        id: distributions[index].id, // mantém o mesmo ID
        name,
        version,
        type,
        description,
        official_website,
        notable_packages
    };

    distributions[index] = updatedDistribution;
    saveData(distributions);
    res.json(updatedDistribution);
});


// Rota para excluir uma distribuição
app.delete('/api/distributions/:id', (req, res) => {
    const distributions = loadData();
    const index = distributions.findIndex(d => d.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('Distribuição não encontrada.');

    distributions.splice(index, 1);
    saveData(distributions);
    res.status(204).send();
});

// Rota para fazer uma requisição HEAD
app.head('/api/distributions/:id', (req, res) => {
    const distributions = loadData();
    const distribution = distributions.find(d => d.id === parseInt(req.params.id));

    if (!distribution) {
        return res.status(404).send('Distribuição não encontrada.');
    }

    // Gerar um ETag dinâmico baseado nos dados da distribuição && Calcular o tamanho correto do conteúdo em bytes
    const eTag = crypto.createHash('sha1').update(JSON.stringify(distribution)).digest('hex');
    const contentLength = Buffer.byteLength(JSON.stringify(distribution), 'utf-8');

    // Verifique se o cliente já possui a versão mais recente (usando ETag)
    if (req.headers['if-none-match'] === eTag) {
        return res.status(304).end(); // Sem modificações
    }

  
    res.set({
        'Content-Type': 'application/json',
        'Content-Length': contentLength,
        'Last-Modified': new Date().toUTCString(),
        'ETag': eTag,
        'Cache-Control': 'no-cache, no-store, must-revalidate', // Controle de cache padrão
        'Expires': '0', // Impedir cache
        'Pragma': 'no-cache', // Cabeçalho de compatibilidade de cache antigo
        'X-Powered-By': 'Express', // Informação adicional opcional sobre o servidor
        'Access-Control-Allow-Origin': '*' // Para permitir acessos CORS de qualquer origem
    }).status(200).end(); // Não envie o corpo na resposta `HEAD`
});


// Rota para atualizar parcialmente uma distribuição
app.patch('/api/distributions/:id', (req, res) => {
    const distributions = loadData();
    const index = distributions.findIndex(d => d.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('Distribuição não encontrada.');

    // Validações simples
    if (req.body.name && req.body.name.trim() === '') {
        return res.status(400).send('O campo "name" não pode ser vazio.');
    }
    if (req.body.version && typeof req.body.version !== 'string') {
        return res.status(400).send('O campo "version" deve ser uma string.');
    }

    const updatedDistribution = {
        ...distributions[index],
        ...req.body // Atualiza apenas os campos fornecidos
    };

    distributions[index] = updatedDistribution;
    saveData(distributions);
    res.json(updatedDistribution);
});


// Rota para suportar o método OPTIONS
app.options('/api/distributions', (req, res) => {
    res.set({
        'Allow': 'GET, POST, OPTIONS',
        'Content-Type': 'text/plain'
    }).status(204).send();
});

// Rota para TRACE
app.trace('/api/distributions/:id', (req, res) => {
    const traceResponse = `
TRACE /api/distributions/${req.params.id} HTTP/1.1
Host: localhost:${PORT}
    `;
    res.set({
        'Content-Type': 'message/http',
        'Content-Length': traceResponse.length
    }).status(200).send(traceResponse);
});




let serverRunning = false;
app.get('/status', (req, res) => {
    if (serverRunning) { return res.json({isRunning: true }); }
    res.status(404).json({isRunning: false });
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    serverRunning = true;
});
