const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8083 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    // Broadcast the message to all clients except the sender
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error(`WebSocket error: ${error.message}`);
  });
});

console.log("WebSocket server is running on ws://0.0.0.0:8083");
// dont forget to run node server.js also http server

// require('dotenv').config();
// const express = require('express');
// const app = express();
// const port = 8081;

// app.use(express.static('public'));

// app.get('/api/crime-data', (req, res) => {
//     const crimeData = [
//         { type: 'Assault', count: 15, latitude: 40.73061, longitude: -73.935242 },
//         { type: 'Burglary', count: 8, latitude: 40.73261, longitude: -73.937242 },
//         // Add more sample data as needed
//     ];
//     res.json(crimeData);
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors package
const twilio = require('twilio');

const app = express();
const port = 8084;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

app.use(cors()); // Enable all CORS requests
app.use(bodyParser.json());

app.post('/send-message', (req, res) => {
    const message = req.body.message;
    const to = process.env.CONTACT_NUMBER; // Your contact number
    const from = process.env.TWILIO_PHONE_NUMBER; // Your Twilio phone number

    client.messages.create({
        body: message,
        to: to,
        from: from
    })
    .then(message => res.json({ success: true, messageSid: message.sid }))
    .catch(error => res.json({ success: false, error: error.message }));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
