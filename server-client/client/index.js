console.log('Client is running');
const serverUrl = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', () => {
    // setupStatusAndDataButtons();
    setupWebSocket();
});

function setupWebSocket() {
    const wsUrl = 'ws://localhost:3002';
    const ws = new WebSocket(wsUrl);

    const messagesElement = document.getElementById('messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('message-button');

    sendButton.addEventListener('click', () => {
        const message = messageInput.value;
        ws.send(message);
        messageInput.value = '';
    });

    ws.onopen = () => {
        console.log('WebSocket connection established');
    };

    ws.onmessage = async (event) => {
        const data = await event.data;
        const parsedData = JSON.parse(data);
        const messageElement = document.createElement('li');
        messageElement.innerHTML = parsedData.message;
        messagesElement.appendChild(messageElement);
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };
}

function showElement(element) {
    element.style.display = 'block';
}

function hideElement(element) {
    element.style.display = 'none';
}

function setupStatusAndDataButtons() {
    const statusButton = document.getElementById('status-button');
    const dataButton = document.getElementById('data-button');
    const statusResult = document.getElementById('status-result');
    const dataResult = document.getElementById('data-result');
    const dataInput = document.getElementById('data-input');
    const loadingElement = document.querySelector('.loading');

    statusButton.addEventListener('click', async () => {
        hideElement(statusResult);
        showElement(loadingElement);
        const response = await fetch(`${serverUrl}/status`);
        const data = await response.json();
        statusResult.innerHTML = JSON.stringify(data, null, 2);
        hideElement(loadingElement);
        showElement(statusResult);
    });

    dataButton.addEventListener('click', async () => {
        hideElement(dataResult);
        showElement(loadingElement);
        const data = { message: dataInput.value };
        const response = await fetch(`${serverUrl}/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        dataResult.innerHTML = JSON.stringify(responseData, null, 2);
        hideElement(loadingElement);
        showElement(dataResult);
    });
}