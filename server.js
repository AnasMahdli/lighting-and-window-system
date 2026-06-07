const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let esp32Client = null;
let webClients = new Set();

wss.on('connection', (ws, req) => {
    console.log('New connection established.');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'register') {
                if (data.device === 'esp32') {
                    esp32Client = ws;
                    console.log('ESP32 Registered.');
                } else if (data.device === 'web') {
                    webClients.add(ws);
                    console.log('Web Dashboard Registered.');
                }
            }

            if (data.type === 'command' && esp32Client) {
                console.log(`Sending command to ESP32: ${data.action}`);
                esp32Client.send(JSON.stringify(data));
            }

            if (data.type === 'telemetry') {
                webClients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(data));
                    }
                });
            }

        } catch (error) {
            console.error('Invalid format:', message.toString());
        }
    });

    ws.on('close', () => {
        if (ws === esp32Client) {
            console.log('ESP32 Disconnected.');
            esp32Client = null;
        } else {
            webClients.delete(ws);
            console.log('Web Dashboard Disconnected.');
        }
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});