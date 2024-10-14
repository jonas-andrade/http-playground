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
            const json = [
                { /* ... conteúdo do JSON ... */ }
            ];
            resultsDiv.innerHTML = `<pre>${JSON.stringify(json, null, 4)}</pre>`;
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
