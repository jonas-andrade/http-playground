const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const fs = require('fs');


// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.static('public'));

// Carregar dados do arquivo JSON
const loadData = () => {
    const data = fs.readFileSync('distributions.json', 'utf-8');
    return JSON.parse(data);
};

// Salvar dados no arquivo JSON
const saveData = (data) => {
    fs.writeFileSync('distributions.json', JSON.stringify(data, null, 2));
};








// Rota para obter todas as distribuições
app.get('/api/distributions', (req, res) => {
    const distributions = loadData();
    res.json(distributions);
});

// Rota para obter uma distribuição pelo ID
app.get('/api/distributions/:id', (req, res) => {
    const distributions = loadData();
    const distribution = distributions.find(d => d.id === parseInt(req.params.id));
    if (!distribution) return res.status(404).send('Distribuição não encontrada.');
    res.json(distribution);
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

    const updatedDistribution = {
        ...distributions[index],
        ...req.body
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








let serverRunning = false; // Indica se o servidor está rodando

// Rota para verificar o status do servidor
app.get('/status', (req, res) => {
    if (serverRunning) {
        return res.json({ status: 'running', isRunning: true });
    }
    res.status(404).json({ status: 'stopped', isRunning: false });
});

// Inicia o servidor Express
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    serverRunning = true; // Marca que o servidor está em execução
});