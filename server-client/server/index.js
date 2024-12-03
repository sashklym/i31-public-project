const http = require('http');

const allowedRequestMap = {
    '/': ['GET'],
    '/status': ['GET', 'POST'],
    '/data': ['POST']
}

const requestCounterMap = new Map();
const server = http.createServer(async (req, res) => {
    setHeaders(res);

    const requestUrl = req.url;
    const requestMethod = req.method;
    console.log(`Request received, URL: ${requestUrl}, METHOD: ${requestMethod}`);

    if (requestMethod === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    }

    // Simulate slow network
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!allowedRequestMap[requestUrl] || !allowedRequestMap[requestUrl].includes(requestMethod)) {
        res.writeHead(404, { 'Content-Type': 'text/json' });
        res.write(JSON.stringify({ error: 'Not found, method or request url are not allowed' }));
        requestCounterMap.set('badRequests', (requestCounterMap.get('badRequests') || 0) + 1);
        return res.end();
    }

    requestCounterMap.set('success', (requestCounterMap.get('success') || 0) + 1);

    switch (requestUrl) {
        case '/':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<h1>Hello World</h1>');
            break;
        case '/status':
            res.writeHead(200, { 'Content-Type': 'text/json' });
            res.write(JSON.stringify({ status: 'Server is running', requestsCounter: Object.fromEntries(requestCounterMap) }));
            break;
        case '/data':
            let data = '';
            req.on('data', (chunk) => {
                data += chunk;
            });
            req.on('end', () => {
                const parsedData = JSON.parse(data)
                res.writeHead(200, { 'Content-Type': 'text/json' });
                res.write(JSON.stringify({ message: 'Data received and parsed', data: parsedData }));
                res.end();
            });
            return;
        default:
            res.writeHead(404, { 'Content-Type': 'text/json' });
            res.write(JSON.stringify({ error: 'Not found' }));
    }
    res.end();
});

function setHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});