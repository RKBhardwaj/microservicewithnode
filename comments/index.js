const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json())
app.use(cors());

const port = 4001;

const commentsByPostId = {}

//'http://localhost:4005/events' For local microservice pattern
//http://event-bus-srv:4005/events For kubernetes - localhost will be replaced by the service name 
const eventBusUrl = 'http://event-bus-srv:4005/events';

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    if (comments) {
        comments.push({
            id: commentId,
            content,
            status: 'PENDING'
        });
    }
    commentsByPostId[req.params.id] = comments;
    await axios.post(eventBusUrl, {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'PENDING'
        }
    });

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log('Event Received:', req.body.type);
    const { type, data } = req.body;
    if (type == 'CommentModerated') {
        const { id, postId, status, content } = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => comment.id === id);
        comment.status = status;


        await axios.post(eventBusUrl, {
            type: 'CommentUpdated',
            data: {
                id,
                postId,
                status,
                content
            }
        });
    }

    res.send({});
});

app.listen(port, () => {
    console.log('Listening on the port:', port);
})