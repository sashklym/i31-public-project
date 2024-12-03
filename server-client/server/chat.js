const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 3002 });
const clients = new Set();

server.on('connection', (ws) => {
    clients.add(ws);
    
    ws.on('message', (message) => {
        console.log(`Received message => ${message}`);

        for (const client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ message: message.toString(), timestamp: Date.now() }));
            }
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
    });
});

console.log('Server with chat is running on ws://localhost:3002');