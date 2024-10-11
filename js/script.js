let serverOn = false;

function toggleServer() {
    const serverButton = document.getElementById("start-server");
    const simulationBanner = document.getElementById("simulation-banner");
    serverOn = !serverOn;

    if (serverOn) {
        serverButton.textContent = "Servidor Ligado";
        serverButton.classList.add("active");
        simulationBanner.style.display = "none"; // Esconde o banner
        document.querySelector(".container").classList.remove("simulation-active");
    } else {
        serverButton.textContent = "Servidor Desligado";
        serverButton.classList.remove("active");
        simulationBanner.style.display = "block"; // Mostra o banner
        document.querySelector(".container").classList.add("simulation-active");
    }
}

function simulateRequest() {
    if (!serverOn) {
        const resultsDiv = document.getElementById("results");
        resultsDiv.textContent = "Resposta simulada de um método HTTP.";
    }
}
