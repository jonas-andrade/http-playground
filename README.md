# HTTP Playground

🌐 **English** | 🇧🇷 **Português**

**HTTP Playground:** ambiente interativo, análise de protocolos HTTP e tráfego, exploração de métodos e códigos de status, manipulação de requisições, configuração de proxies, autenticação e roteamento.

## 🌐 HTTP Playground (English)

**HTTP Playground** is an interactive environment designed for exploring and analyzing the HTTP protocol. It allows you to manipulate requests, configure proxies, authentication, and routing, as well as investigate HTTP methods and status codes in real time.

### Key Features

- Full interaction with various HTTP methods (GET, POST, PUT, DELETE, etc.)
- Detailed analysis of status codes (1xx, 2xx, 3xx, 4xx, 5xx)
- Request header and body manipulation
- Proxy and authentication configuration
- Simulation of server responses and routing

### Usage

For security reasons, **HTTP Playground** does not use a real database. Instead, it relies on a JSON file-based approach to simulate data persistence. This allows the exploration of HTTP interactions without the complexities of a full backend infrastructure.

To enable real HTTP requests, you'll need to run a local server. Start the server by executing the following command in the project's root directory:

    ```bash
    node server.js
> **Note:** Due to security constraints, it is not possible to run a real server directly from the client interface.

### Demo

Watch the demo video to see the **HTTP Playground** in action:  
[Demo](./public/assets/output.gif)

This video showcases the main features and how to interact with the environment.

### Developer Notes

This project was built without the use of a real database. Instead, a JSON file-based approach was implemented to simulate backend functionality. This enables efficient and straightforward testing of HTTP interactions while avoiding the complexity of managing a full database in local testing environments.

If you're looking to make actual HTTP requests, be sure to execute the local server using `node server.js`. The client interface alone is designed to simulate interactions but requires the server to handle actual network requests.
