const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const port = 4005;

const events = [];

app.post('/events', (req, res) => {
    const event = req.body;
    events.push(event);

    //For local micro service pattern 'http://localhost:4000/events'
    //For kubernetes localhost will be replaced by service name
    axios.post('http://posts-clusterip-srv:4000/events', event);
    axios.post('http://comments-srv:4001/events', event);
    axios.post('http://query-srv:4002/events', event);
    axios.post('http://moderation-srv:4003/events', event);

    res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
    res.send(events);
});

app.listen(port, () => {
    console.log('Listening on the port:', port);
});
