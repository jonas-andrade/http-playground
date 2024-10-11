// Pegando os inputs
const inputs = document.getElementsByTagName('input');
let contador = 0;
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


Array.from(inputs).forEach((i) => {
    i.addEventListener('click', (e) => {

        if (e.target.classList.contains('get')) {
            showCaseGet();
        } else if (e.target.classList.contains('head')) {
            showCaseHead();
        } else if (e.target.classList.contains('patch')) {
            showCasePatch();
        } else if (e.target.classList.contains('put')) {
            showCasePut();
        } else if (e.target.classList.contains('post')) {
            showCasePost();
        } else if (e.target.classList.contains('delete')) {
            showCaseDelete();
        } else if (e.target.classList.contains('options')) {
            showCaseOptions();
        } else if (e.target.classList.contains('trace')) {
            showCaseTrace();
        } else if (e.target.classList.contains('connect')) {
            showCaseConnect();
        }
    });
});


const showCaseGet = async () => {
    document.getElementById('url').innerText = `http://example.com/distributions/${distributions[contador].id}`;
    contador++;
    
    
    const response = await fetch('http://localhost:3000/distributions',{ method: 'GET' });
    const data = await response.json();
    document.getElementById('results').innerHTML =

        `Distro:<span><p>${data[contador - 1].name}</p></span>
        version:<span><p>${data[contador - 1].version}</p></span>
        official_website:<span><a href='${data[contador - 1].official_website}'/>${data[contador - 1].official_website}</span></a>
        notable_packages:<span><p>${data[contador - 1].notable_packages}</p></span>
        description:<span><p>${data[contador - 1].description}</p></span>
        `
        if (contador >= distributions.length) { contador = 0; }
};
const showCaseHead = async () => {
    try {
        // Fazendo a requisição HEAD
        const response = await fetch('http://localhost:3000/distributions', { method: 'HEAD' });

        if (!response.ok) {  throw new Error(`Erro na requisição: ${response.status}`);  }
        const results = document.getElementById('results'); results.innerHTML = '';

        const statusInfo = document.createElement('div');
        statusInfo.textContent = `HTTP/${response.httpVersion} ${response.status} ${response.statusText}`;
        results.appendChild(statusInfo);

      
        response.headers.forEach((value, key) => {
            const headerInfo = document.createElement('div');
            headerInfo.textContent = `${key}: ${value}`;
            results.appendChild(headerInfo);
        });
    } catch (error) {
        console.error('Erro ao obter cabeçalhos:', error);
    }
};              
const showCasePatch = () => {
    
};
const showCasePut = () => {
   
};
const showCasePost = () => {
    const output = document.getElementById('results');
    const newDistro = {
        id: distributions.length + 1,
        name: "Nova Distro",
        version: "1.0",
        type: "Personalizada",
        description: "Uma nova distribuição adicionada via POST.",
        official_website: "https://example.com",
        notable_packages: ["Package1", "Package2"]
    };

    distributions.push(newDistro);
    output.innerHTML = `<p>Distro "${newDistro.name}" adicionada com sucesso!</p>`;
};
const showCaseDelete = () => {
   
};
const showCaseOptions = () => {
    
};
const showCaseTrace = () => {
    
};
const showCaseConnect = () => {
   
};

const showCaseHead_simule = () => {
    
    const results = document.getElementById('results');
    
   
    results.innerHTML = `
        <div><strong>HTTP/1.1</strong> <span style="color: green;">200 OK</span></div>
        <div><strong>X-Powered-By:</strong> Express</div>
        <div><strong>Access-Control-Allow-Origin:</strong> *</div>
        <div><strong>Content-Type:</strong> application/json; charset=utf-8</div>
        <div><strong>Content-Length:</strong> 2914</div>
        <div><strong>ETag:</strong> W/"b62-03BQFRF35xDF2o6H2DMh3ESxRqE"</div>
        <div><strong>Date:</strong> Fri, 11 Oct 2024 19:56:15 GMT</div>
        <div><strong>Connection:</strong> keep-alive</div>
        <div><strong>Keep-Alive:</strong> timeout=5</div>
    `;
};
