const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.static('public'));
// Dados fictícios
const distributions = [
    {
        id: 1,
        name: 'Ubuntu',
        version: '22.04 LTS',
        type: 'Debian-based',
        description: 'Uma das distribuições Linux mais populares, focada em facilidade de uso e uma ampla gama de software.',
        official_website: 'https://ubuntu.com/',
        notable_packages: ['GIMP', 'LibreOffice', 'VLC']
    },
    {
        id: 2,
        name: 'Fedora',
        version: '36',
        type: 'RPM-based',
        description: 'Distribuição patrocinada pela Red Hat, conhecida por sua natureza de ponta e lançamento rápido de atualizações.',
        official_website: 'https://getfedora.org/',
        notable_packages: ['Docker', 'KDE Plasma', 'GNOME']
    },
    {
        id: 3,
        name: 'Arch Linux',
        version: 'latest',
        type: 'Rolling release',
        description: 'Uma distribuição leve e flexível que permite aos usuários personalizar sua instalação desde o início.',
        official_website: 'https://archlinux.org/',
        notable_packages: ['Pacman', 'Systemd', 'Arch User Repository (AUR)']
    },
    {
        id: 4,
        name: 'Debian',
        version: '11 (Bullseye)',
        type: 'Debian-based',
        description: 'Uma das distribuições mais estáveis e com uma vasta biblioteca de pacotes, ideal para servidores e desktops.',
        official_website: 'https://www.debian.org/',
        notable_packages: ['Apache', 'Nginx', 'MySQL']
    },
    {
        id: 5,
        name: 'CentOS',
        version: 'Stream 9',
        type: 'RPM-based',
        description: 'Distribuição popular entre servidores, baseada no código-fonte do Red Hat Enterprise Linux (RHEL).',
        official_website: 'https://www.centos.org/',
        notable_packages: ['MariaDB', 'SELinux', 'Kubernetes']
    },
    {
        id: 6,
        name: 'openSUSE',
        version: 'Leap 15.4',
        type: 'RPM-based',
        description: 'Uma distribuição estável, conhecida por sua versatilidade e opções de instalação.',
        official_website: 'https://www.opensuse.org/',
        notable_packages: ['YaST', 'KDE Plasma', 'GNOME']
    },
    {
        id: 7,
        name: 'Linux Mint',
        version: '21',
        type: 'Debian-based',
        description: 'Focada em facilidade de uso, é uma das distribuições favoritas de novos usuários devido à sua interface amigável.',
        official_website: 'https://linuxmint.com/',
        notable_packages: ['Cinnamon', 'Firefox', 'LibreOffice']
    },
    {
        id: 8,
        name: 'Manjaro',
        version: '21.3',
        type: 'Arch-based',
        description: 'Uma distribuição acessível baseada em Arch Linux, que oferece uma instalação fácil e um ambiente desktop amigável.',
        official_website: 'https://manjaro.org/',
        notable_packages: ['Pamac', 'KDE Plasma', 'XFCE']
    },
    {
        id: 9,
        name: 'Zorin OS',
        version: '16',
        type: 'Ubuntu-based',
        description: 'Distribuição focada em fornecer uma experiência similar ao Windows, ideal para novos usuários vindos do Windows.',
        official_website: 'https://zorinos.com/',
        notable_packages: ['Wine', 'GIMP', 'LibreOffice']
    },
    {
        id: 10,
        name: 'Kali Linux',
        version: '2023.1',
        type: 'Debian-based',
        description: 'Distribuição voltada para testes de penetração e auditoria de segurança, com uma ampla gama de ferramentas de segurança.',
        official_website: 'https://www.kali.org/',
        notable_packages: ['Metasploit', 'Nmap', 'Burp Suite']
    }
];

app.get('/distributions', (req, res) => {
    res.json(distributions);
});

app.head('/distributions', (req, res) => {
    res.set({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Expires': new Date(Date.now() + 3600000).toUTCString(), // 1 hora
        'Custom-Header': 'My custom header value',
        'Server': 'MyServer/1.0',
        'Accept-Ranges': 'bytes',
        'Location': 'http://localhost:3000/distributions',
        'Last-Modified': new Date().toUTCString(),
        'ETag': '12345' 
    });
    res.status(200).send(); // Não retorna corpo, apenas os cabeçalhos
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