const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const datamodel = require('./datamodel');

const path = require('path');
const app = express();

const root = './';






//initialize a simple http server
const server = http.createServer(app);

var authenticationFile = require('./authentication_file');

app.use(authenticationFile.checkToken);

//app.set('view engine', 'html');

app.use(express.static(path.join(root, 'MyMessager')));


//Setup parser file from POST request\
var busboy = require('connect-busboy')
//app.use(busboy());
app.use(busboy({ immediate: true }));
//app.use(busboy({ immediate: true }));
// 


//Cross-Origin Resource Sharing 
var cors = require('cors')
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
//Cross-Origin Resource Sharing 



//start our server
server.listen(process.env.PORT || 5432, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});


// app.get('*', (req, res) => {
//     res.sendFile('dist/MyMessager/index.html', {root});
// });


/* Server-side rendering */
function angularRouter(req, res) {
    /* Server-side rendering */
    res.render('index', { req, res });

   // res.redirect('/login');
}

/* Direct all routes to index.html, where Angular will take care of routing */
app.get('*', angularRouter);
// app.get('/', angularRouter);
// app.get('/register', angularRouter);
// app.get('/login', angularRouter);

app.post('/api/login', authenticationFile.login);
app.post('/api/register', authenticationFile.register);


app.post('/api/getusers', authenticationFile.getUsers);






//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });


var clients = [];




wss.on('connection', (ws) => {

    const extWs = ws ;

    extWs.isAlive = true;

    ws.authorize = false;
    ws.token = '';


    ws.send(createMessage(""+Date(), 3, 'OK'));
    

    //connection is up, let's add a simple simple event
    ws.on('message', (msg) => {

        const message = JSON.parse(msg);

        console.log(message);

        if (ws.authorize) {
            

            wss.clients.forEach(client => {
                if (client.user != ws.user) {
                    client.send(createMessage(message.content, 0, message.sender));
                }
            });

        }  else {
            try { 
                ws.token =  message.sender;

                if  (ws.token && (message.typeMessage == 3)) {
                    //TODO aut for token

                    datamodel.findUserByToken(ws.token, (user)=>{
                        if (user) {
                            ws.authorize = true;
                            ws.user = user;

                            ws.send(createMessage(JSON.stringify({email: user.email, name: user.name,password: "", phone: user.phone }), 5, ''));
                        }
                    })

                }  else {
                    const extWs = ws ;

                    extWs.isAlive = false;
                    ws.terminate();
                } 
                

            } catch (e) {
                ws.terminate();
            }
        } 

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
        console.log('Timer '+ Date() + ' ws.isAlive = ' + ws.isAlive + ' ws.authorize '+ ws.authorize);

        if (ws.isAlive &&  ws.authorize) ws.send(createMessage(""+Date(), 1, ''));
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