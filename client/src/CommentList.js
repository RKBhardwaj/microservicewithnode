import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default ({ comments }) => {
    //const [comments, setComments] = useState([]);

    // const fetchComment = async () => {
    //     const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`);
    //     if (res) {
    //         setComments(res.data);
    //     }
    // };

    // useEffect(() => {
    //     fetchComment()
    // }, []);

    const renderComments = Object.values(comments).map(comment => {
        let content;
        switch (comment.status) {
            case 'APPROVED': content = comment.content; break;
            case 'REJECTED': content = 'This comment has been rejected'; break;
            case 'PENDING': content = 'This comment is awaiting moderation'; break;
            default: content = '';
        }
        return (
            <li key={comment.id}>
                {content}
            </li>
        );
    });

    return (
        <div>
            {Object.keys(comments).length} comments
            <ul>
                {renderComments}
            </ul>
        </div>
    );
};