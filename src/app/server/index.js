const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//start our server
server.listen(process.env.PORT || 54321, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });


var clients = [];




wss.on('connection', (ws) => {
    console.log(wss.clients)

    const extWs = ws ;

    extWs.isAlive = true;

    console.log(extWs)

    

    //connection is up, let's add a simple simple event
    ws.on('message', (msg) => {

        const message = JSON.parse(msg);

        wss.clients.forEach(client => {
            if (client != ws) {
                client.send(createMessage(message.content, 0, message.sender));
            }
        });

    });


    //send immediatly a feedback to the incoming connection    
    //ws.send(createMessage('Hi there, I am a WebSocket server'));



    ws.on('error', (err) => {
        console.warn(`Client disconnected - reason: ${err}`);
    })

    // PING PONG 
    ws.on('pong', () => {
        extWs.isAlive = true;
    //console.log('PONG ' + Date())
    });
});

setInterval(() => {
    wss.clients.forEach((ws) => {

        const extWs = ws;

        if (!extWs.isAlive) return ws.terminate();

        extWs.isAlive = false;
        ws.ping(null, undefined);
    //    console.log('PING ' + Date())
    });
}, 10000);


setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive) ws.send(createMessage(""+Date(), 1, ''));
    });
}, 1000);


function createMessage(content, typeMessage = 0, sender = '') {
    return JSON.stringify(
        {
            content: content,
            sender: sender,
            typeMessage: typeMessage
        }
    )
}