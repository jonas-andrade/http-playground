let serverOn = null;
let selectedMethod = null;
const serverButton = document.getElementById("start-server");
const simulationBanner = document.getElementById("simulation-banner");
const simulateButton = document.getElementById("simulate-btn");
const resultsDiv = document.getElementById("results");
const form = document.querySelector('.json-object');
const textarea = document.querySelector('textarea[name="body-params"]');
const input = document.querySelector('.base-url input[type="button"]');

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
    setTimeout(()=>{textarea.innerHTML = '{}'},1000);
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
function isTextareaVisible() {
    return window.getComputedStyle(textarea).display === 'block';
}

function selectMethod(method) {
    let data = {};
    selectedMethod = method;
    resetMethodButtons();

    if (method === 'POST') {
        data = isTextareaVisible() ? JSON.parse(getFormData()) : getFormData();
        serverOn ? realRequest(method, data, null) : highlightSelectedMethod(method);
    } else if (method === 'DELETE' || method === 'GET') {
        const id = Number(document.getElementById('query-router-params').value.split('/').pop());
        serverOn ? realRequest(method, null, id) : highlightSelectedMethod(method);
    } else if (method === 'HEAD') {
        const id = Number(document.getElementById('query-router-params').value.split('/').pop());
        serverOn ? realRequest(method,null,id) : highlightSelectedMethod('HEAD');
    } else if (method === 'PATCH' || method === 'PUT') {
        const id = Number(document.getElementById('query-router-params').value.split('/').pop());
        data = isTextareaVisible() ? JSON.parse(getFormData()) : getFormData();
        serverOn ? realRequest(method, data, id) : highlightSelectedMethod(method);
    } else if (method === 'TRACE' || method === 'CONNECT') {
        serverOn ? realRequest(method) : highlightSelectedMethod(method);

    } else if (method === 'OPTIONS') {
        serverOn ? realRequest(method) : highlightSelectedMethod(method);

    }

}

function resetMethodButtons() {
    document.querySelectorAll('.http-method').forEach(button => button.classList.remove('selected'));
}

function highlightSelectedMethod(method) {
    const methodButton = Array.from(document.querySelectorAll('.http-method')).find(btn => btn.textContent === method);
    if (methodButton) methodButton.classList.add('selected');
    const Requests = {
        "GET": `
            <pre>
                <p class="request">${method} Request</p>
                GET /api/distributions/1 HTTP/1.1
                Host: localhost:3000
            </pre>`,
        "POST": `
            <pre>
                <p class="request">${method} Request</p>
                POST /api/distributions HTTP/1.1
                Host: localhost:3000
                Content-Type: application/json
    
                ${JSON.stringify(isTextareaVisible() ? JSON.parse(getFormData()) : getFormData(), null, 4)}
            </pre>`,
        "PUT": `
            <pre>
                <p class="request">${method} Request</p>
                PUT /api/distributions/1 HTTP/1.1
                Host: localhost:3000
                Content-Type: application/json
    
                ${JSON.stringify(isTextareaVisible() ? JSON.parse(getFormData()) : getFormData(), null, 4)}
            </pre>`,
        "DELETE": `
            <pre>
                <p class="request">${method} Request</p>
                DELETE /api/distributions/1 HTTP/1.1
                Host: localhost:3000
            </pre>`,
        "PATCH": `
            <pre>
                <p class="request">${method} Request</p>
                PATCH /api/distributions/1 HTTP/1.1
                Host: localhost:3000
                Content-Type: application/json
    
                ${JSON.stringify(isTextareaVisible() ? JSON.parse(getFormData()) : getFormData(), null, 4)}
            </pre>`,
        "OPTIONS": `
            <pre>
                <p class="request">${method} Request</p>
                OPTIONS /api/distributions HTTP/1.1
                Host: localhost:3000
            </pre>`,
        "HEAD": `
            <pre>
                <p class="request">${method} Request</p>
                HEAD /api/distributions/1 HTTP/1.1
                Host: localhost:3000
            </pre>`,
        "TRACE": `
            <pre>
                <p class="request">${method} Request</p>
                TRACE /api/distributions/1 HTTP/1.1
                Host: localhost:3000
            </pre>`,
        "CONNECT": `
            <pre>
                <p class="request">${method} Request</p>
                CONNECT www.example.com:443 HTTP/1.1
                Host: www.example.com
            </pre>`
    };
    

    if (Requests[method]) {
        resultsDiv.innerHTML = Requests[method];
    }
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
        responseFn ? responseFn(selectedMethod) : defaultResponse();
    }
}
function getFormData() {

    const data = {
        name: form.querySelector("#name").value,
        version: form.querySelector("#version").value,
        type: form.querySelector('#type').value,
        description: form.querySelector('#description').value,
        official_website: form.querySelector('#official_website').value,
        notable_packages: form.querySelector('#notable_packages').value

    };
    if (isTextareaVisible()) {
        return textarea.value;
    } else {
        return data;
    }

}
function getDistributions(method) {
    const id = Number(document.getElementById('query-router-params').value.split('/').pop());
    const distributions = [
        { 
            id: 1, 
            name: 'Ubuntu', 
            version: '22.04 LTS', 
            type: 'Debian-based', 
            description: 'Fácil de usar com muitos softwares.', 
            official_website: 'https://ubuntu.com/', 
            notable_packages: ['GIMP', 'LibreOffice', 'VLC'] 
        },
        { 
            id: 2, 
            name: 'Fedora', 
            version: '36', 
            type: 'RPM-based', 
            description: 'Atualizações rápidas e suporte empresarial.', 
            official_website: 'https://getfedora.org/', 
            notable_packages: ['Docker', 'KDE Plasma', 'GNOME'] 
        },
    ];

    if (id) {
        displayResults(`
            <p class="response">${method} Response</p>
            
            ${JSON.stringify(distributions.filter(d => d.id === id), null, 4)}
            `);
    } else {
        displayResults(`
            <p class="response">${method} Response</p>
            HTTP/1.1 200 OK
            Content-Type: application/json
            Content-Length: ${JSON.stringify(distributions, null, 4).length}
            Last-Modified: Wed, 20 Oct 2024 10:30:00 GMT
            ETag: "abc123"
            X-Powered-By: Express
            Access-Control-Allow-Origin: *
            
            ${JSON.stringify(distributions, null, 4)}
        `);
    }

    if (id > distributions.length) { 
        displayResults('ERROR: status 404 NOT FOUND!'); 
    }
}

function addDistribution(method) {
    displayResults(`
        <p class="response">${method} Response</p>
        HTTP/1.1 201 Created
        Content-Type: application/json
        Location: /api/distributions/3
        X-Powered-By: Express
        Access-Control-Allow-Origin: *
        
        ${JSON.stringify(isTextareaVisible() ? JSON.parse(getFormData()) : getFormData(), null, 4)}
    `);
}

function updateDistribution(method) {
    displayResults(`
        <p class="response">${method} Response</p>
        HTTP/1.1 200 OK
        Content-Type: application/json
        X-Powered-By: Express
        Access-Control-Allow-Origin: *
        
        ${JSON.stringify(isTextareaVisible() ? JSON.parse(getFormData()) : getFormData(), null, 4)}
    `);
}

function deleteDistribution(method) {
    displayResults(`
        <p class="response">${method} Response</p>
        HTTP/1.1 204 No Content
        X-Powered-By: Express
        Access-Control-Allow-Origin: *
    `);
}

function patchDistribution(method) {
    displayResults(`
        <p class="response">${method} Response</p>
        HTTP/1.1 200 OK
        Content-Type: application/json
        X-Powered-By: Express
        Access-Control-Allow-Origin: *
        
        ${JSON.stringify(isTextareaVisible() ? JSON.parse(getFormData()) : getFormData(), null, 4)}
    `);
}

function optionsSupported(method) {
    displayResults(`
        <p class="response">${method} Response</p>
        HTTP/1.1 204 No Content
        Allow: GET, POST, OPTIONS
        X-Powered-By: Express
        Access-Control-Allow-Origin: *
        Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
    `);
}

function headResponse(method) {
    displayResults(`
        <p class="response">${method} Response</p>
        HTTP/1.1 200 OK
        X-Powered-By: Express
        Access-Control-Allow-Origin: *
        Content-Type: application/json; charset=utf-8
        Content-Length: 310
        Last-Modified: Fri, 18 Oct 2024 00:54:54 GMT
        ETag: ca202199ac8878d4b700c9a2683de230
        Cache-Control: no-cache
        Date: Fri, 18 Oct 2024 00:54:54 GMT
        Connection: keep-alive
        Keep-Alive: timeout=5
    `);
}

function traceResponse(method) {
    displayResults(`
        <p class="response">${method} Response</p>
        HTTP/1.1 200 OK
        Content-Type: message/http
        X-Powered-By: Express
        Access-Control-Allow-Origin: *
        
        TRACE /api/distributions/1 HTTP/1.1
        Host: localhost:3000
    `);
}

function connectResponse(method) {
    displayResults(`
        <p class="response">${method} Response</p>
        HTTP/1.1 200 Connection Established
    `);
}

function defaultResponse(method) {
    displayResults(`Resposta simulada do método ${selectedMethod}.`);
}

async function realRequest(method, data = null, id = null) {
    const url = id ? `http://localhost:3000/api/distributions/${id}` : `http://localhost:3000/api/distributions`;

    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        // body: data ? JSON.stringify(data) : null,
        body: data && method !== 'HEAD' && method !== 'OPTIONS' ? JSON.stringify(data) : null,
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Status ${response.status}: ${response.statusText}`);

        const responseData = (method === 'HEAD' || method === 'OPTIONS')
            ? Object.fromEntries(response.headers.entries())
            : await response.json();

        displayResults(responseData);
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
function toggleJSON() {
    input.addEventListener('click', () => {
        const isTextareaVisible = textarea.style.display !== 'none';
        textarea.style.display = isTextareaVisible ? 'none' : 'block';
        form.style.display = isTextareaVisible ? 'block' : 'none';
    });
};

toggleJSON();
