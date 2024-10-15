let serverOn = null;
let selectedMethod = null;

const serverButton = document.getElementById("start-server");
const simulationBanner = document.getElementById("simulation-banner");
const simulateButton = document.getElementById("simulate-btn");
const resultsDiv = document.getElementById("results");

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3000/status');
        if (!response.ok) throw new Error(await response.text());
        const { isRunning } = await response.json();
        serverOn = isRunning;
    } catch (error) {
        serverOn = false;
        console.error('Erro:', error);
        displayError(`Erro ao verificar o servidor: ${error.message}`);
    }
    updateServerButton();
});

function updateServerButton() {
    serverButton.textContent = serverOn ? "Servidor Ligado" : "Servidor Desligado";
    serverButton.classList.toggle("active", !serverOn);
    simulationBanner.style.display = serverOn ? "none" : "block";
    simulateButton.style.cursor = serverOn ? "not-allowed" : "pointer";
    if (!serverOn) showBtnESC();
}

function toggleServer() {
    serverOn = !serverOn;
    updateServerButton();
    if (serverOn) resetSimulation();
}

function selectMethod(method) {
    selectedMethod = method;
    resetMethodButtons();
    serverOn ? realRequest(method) : highlightSelectedMethod(method);
}

function resetMethodButtons() {
    document.querySelectorAll('.http-method').forEach(button => button.classList.remove('selected'));
}

function highlightSelectedMethod(method) {
    const methodButton = Array.from(document.querySelectorAll('.http-method')).find(btn => btn.textContent === method);
    if (methodButton) methodButton.classList.add('selected');
    resultsDiv.innerHTML = `<pre>O Método ${method} foi Selecionado!<pre/>`;
}

function showMSG(serverOn) {
    if (!serverOn) {
        countdownExit(() => toggleServer());
    } else {
        clearResults();
        toggleServer();
    }
}

function countdownExit(callback) {
    let segCount = 5;
    resultsDiv.innerHTML = `<pre class="warning"><strong>Warning:</strong> ... saindo do modo de simulação em <strong>${segCount}</strong> segundos.</pre>`;
    const intervalId = setInterval(() => {
        segCount--;
        resultsDiv.innerHTML = `<pre class="warning"><strong>Warning:</strong> ... saindo do modo de simulação em <strong>${segCount}</strong> segundos.</pre>`;
        if (segCount <= 0) {
            clearInterval(intervalId);
            clearResults();
            callback();
        }
    }, 1000);
}

function showBtnESC() {
    const btn = document.createElement('button');
    btn.className = 'esc';
    btn.textContent = 'ESC';
    simulationBanner.appendChild(btn);
    btn.addEventListener('click', () => showMSG(serverOn));
}

function simulateRequest() {
    if (!serverOn && selectedMethod) {
        const simulatedResponses = {
            "GET": getDistributions,
            "POST": addDistribution,
            "PUT": updateDistribution,
            "DELETE": deleteDistribution,
            "PATCH": patchDistribution,
            "OPTIONS": optionsSupported,
            "HEAD": headResponse,
            "TRACE": traceResponse,
            "CONNECT": connectResponse
        };
        const responseFn = simulatedResponses[selectedMethod];
        responseFn ? responseFn() : defaultResponse();
    }
}

function getDistributions() {
    const distributions = [
        { id: 1, name: 'Ubuntu', version: '22.04 LTS', type: 'Debian-based', description: 'Fácil de usar com muitos softwares.', official_website: 'https://ubuntu.com/', notable_packages: ['GIMP', 'LibreOffice', 'VLC'] },
        { id: 2, name: 'Fedora', version: '36', type: 'RPM-based', description: 'Atualizações rápidas e suporte empresarial.', official_website: 'https://getfedora.org/', notable_packages: ['Docker', 'KDE Plasma', 'GNOME'] },
        // Add other distributions here...
    ];
    displayResults(distributions);
}

function addDistribution() {
    displayResults({ id: 11, name: 'Example Linux', version: '1.0', type: 'Custom', description: 'Distribuição de exemplo.', official_website: 'https://example.com/', notable_packages: ['ExampleApp'] });
}

function updateDistribution() {
    displayResults({ id: 2, name: 'Fedora Updated', version: '37' });
}

function deleteDistribution() {
    displayResults(`Distribuição com ID 2 deletada.`);
}

function patchDistribution() {
    displayResults({ id: 1, version: '22.04.1 LTS' });
}

function optionsSupported() {
    displayResults("Métodos suportados: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD, TRACE, CONNECT.");
}

function headResponse() {
    displayResults("Apenas cabeçalhos para o recurso solicitado.");
}

function traceResponse() {
    displayResults("TRACE: A requisição foi recebida.");
}

function connectResponse() {
    displayResults("Conexão estabelecida com sucesso.");
}

function defaultResponse() {
    displayResults(`Resposta simulada do método ${selectedMethod}.`);
}

async function realRequest(method) {
    try {
        const response = await fetch(`http://localhost:3000/api/distributions`, { method });
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        displayError(`Erro na requisição: ${error.message}`);
    }
}

function displayResults(content) {
    resultsDiv.innerHTML = `<pre>${typeof content === 'string' ? content : JSON.stringify(content, null, 4)}</pre>`;
}

function displayError(message) {
    resultsDiv.innerHTML = `<p>${message}</p>`;
}

function clearResults() {
    resultsDiv.innerHTML = "...";
}

function resetSimulation() {
    selectedMethod = null;
    resetMethodButtons();
    clearResults();
}
