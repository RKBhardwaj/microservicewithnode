const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
const port = 4003;

//'http://localhost:4005/events' For local microservice pattern
//http://event-bus-srv:4005/events For kubernetes - localhost will be replaced by the service name 
const eventBusUrl = 'http://event-bus-srv:4005/events';

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'REJECTED' : 'APPROVED';

        await axios.post(eventBusUrl, {
            type: 'CommentModerated',
            data: {
                id: data.id,
                content: data.content,
                status,
                postId: data.postId
            }
        });
    }

    res.send({});
});

app.listen(port, () => {
    console.log('Listening on port', port);
});