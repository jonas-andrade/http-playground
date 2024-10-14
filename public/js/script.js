let serverOn = null;

let selectedMethod = null;
const serverButton = document.getElementById("start-server");
const simulationBanner = document.getElementById("simulation-banner");
const simulateButton = document.getElementById("simulate-btn");
const resultsDiv = document.getElementById("results");

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3000/status');
        if (!response.ok) { throw new Error(await response.text()); }
        const json = await response.json();
        serverOn = json.isRunning; // Define se o servidor está ligado ou desligado
    } catch (error) {
        serverOn = false; // Se houver erro, consideramos que o servidor está desligado
        console.error('Erro:', error);
        resultsDiv.innerHTML = `<p>Erro ao verificar o servidor:</p> <pre>${error.message}<pre/>`;
    }
    updateServerButton(); // Atualiza o botão do servidor
});

function updateServerButton() {
    if (!serverOn) {
        serverButton.textContent = "Servidor Desligado";
        serverButton.classList.add("active");
        simulationBanner.style.display = "block"; // Mostra o banner quando o servidor está desligado
        simulateButton.style.cursor = "pointer";
        showBtnESC(); // Mostra o botão ESC ao desligar
    } else {
        serverButton.textContent = "Servidor Ligado";
        serverButton.classList.remove("active");
        simulationBanner.style.display = "none"; // Esconde o banner quando o servidor está ligado
        simulateButton.style.cursor = "not-allowed";
        resultsDiv.innerHTML = "Aguardando resposta...";
    }
}

// Alterna o estado do servidor
function toggleServer() {
    serverOn = !serverOn; // Alterna o estado do servidor
    updateServerButton();
    if (serverOn) {
        selectedMethod = null;
        resetMethodButtons();
        resultsDiv.innerHTML = "Aguardando resposta..."; 
    }
}

// Função para selecionar o método
function selectMethod(method) {
    if (!serverOn) {
        selectedMethod = method;
        resetMethodButtons();
        highlightSelectedMethod(method);
    } else {
        realRequest(method); // Faz a requisição real se o servidor estiver ligado
    }
}

function resetMethodButtons() {
    const methods = document.querySelectorAll('.http-method');
    methods.forEach(button => {
        button.classList.remove('selected'); // Remove a seleção
    });
}

function highlightSelectedMethod(method) {
    const methodButton = Array.from(document.querySelectorAll('.http-method'))
        .find(button => button.textContent === method);
    if (methodButton) {
        methodButton.classList.add('selected');
        resultsDiv.innerHTML = `<pre>O Método ${method} foi Selecionado!<pre/>`;
    }
}
function showMSG(serverOn){
    let segCount = 5;
    if(!serverOn==true){
        
        resultsDiv.innerHTML = `<pre class="warning"><strong>Warning:</strong> ... saindo do modo de simulação em <strong>${segCount}</strong> segundos.</pre>`;
        
        const intervalId = setInterval(() => {
            segCount--;
            resultsDiv.innerHTML = `<pre class="warning"><strong>Warning:</strong> ... saindo do modo de simulação em <strong>${segCount}</strong> segundos.</pre>`;
            
            if (segCount <= 0) {
                clearInterval(intervalId);
                resultsDiv.innerHTML = "...";toggleServer();
            }
        }, 1000);
    }else{
        resultsDiv.innerHTML = "...";toggleServer(); 
    }
}
function showBtnESC() {
    const banner = document.getElementById('simulation-banner');
    const btn = document.createElement('button');
    btn.className = 'esc';
    btn.textContent = 'ESC';
    banner.appendChild(btn);

    btn.addEventListener('click', () => {
        if (!serverOn) {
            showMSG(serverOn);
        } else {
            toggleServer();
        }
    });
}

// Request simulado
function simulateRequest() {
    if (!serverOn && selectedMethod) {
        if (selectedMethod === "GET") {
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
            
            resultsDiv.innerHTML = `<pre>${JSON.stringify(distributions, null, 4)}</pre>`;
        } else {
            resultsDiv.innerHTML = `Resposta simulada do método ${selectedMethod}.`;
        }
    }
}

// Request real
const realRequest = async (method) => {
    const response = await fetch(`http://localhost:3000/distributions`, { method: method });

    if (!response.ok) {
        alert('Erro na requisição: ' + response.statusText);
        return;
    }

    const data = await response.json();
    if (method === 'GET') {
        resultsDiv.innerHTML = `<pre>${JSON.stringify(data, null, 4)}</pre>`;
    } else {
        alert(`Método: ${method}`);
    }
}
function cleanner(div) {
    div.innerHTML = `...`;
}