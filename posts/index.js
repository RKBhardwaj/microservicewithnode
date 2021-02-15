const express = require('express');
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts/create', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = { id, title };

    //'http://localhost:4005/events' For local microservice pattern
    //http://event-bus-srv:4005/events For kubernetes - localhost will be replaced by the service name 
    const url = 'http://event-bus-srv:4005/events';

    await axios.post(url, {
        type: 'PostCreated',
        data: {
            id, title
        }
    });

    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('Recieved events', req.body.type);

    res.send({});
});

app.listen(4000, () => {
    console.log('Listening on port 4000');
});