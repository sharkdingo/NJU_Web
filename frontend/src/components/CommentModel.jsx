import React, {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import PropTypes from 'prop-types';
import '../styles/CommentModel.scss';

const CommentModel = ({comments, onCommentsUpdate, closeModal}) => {
    const [newCommentText, setNewCommentText] = useState('');
    const [commentList, setCommentList] = useState(comments);
    const [hasCommentUpdate, setHasCommentUpdate] = useState(false);

    useEffect(() => {
        setCommentList(comments);
    }, [comments]);

    const handleCommentChange = (event) => {
        setNewCommentText(event.target.value);
    };

    const handleAddComment = () => {
        if (newCommentText.trim() !== '') {
            const newComment = {
                id: uuidv4(),
                text: newCommentText.trim()
            };
            setCommentList(prevComments => [...prevComments, newComment]);
            setNewCommentText('');
            if (!hasCommentUpdate) { setHasCommentUpdate(true);}
        }
    };

    const handleSave = () => {
        try {
            const newComments = [...commentList ];
            setHasCommentUpdate(false);
            onCommentsUpdate(newComments);
            // After saving, fetch the updated comments from the server (or update the state as needed)
            closeModal();
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = (commentId) => {
        setCommentList(prevList => prevList.filter(comment => comment.id !== commentId));
        setHasCommentUpdate(true);
    };


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleAddComment();
            event.preventDefault(); // Prevent new line
        }
    };

    return (
        <div className="comment-modal" onClick={closeModal}>
            <div className="comment-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={closeModal}>×</button>
                <h2>评论</h2>
                <textarea
                    value={newCommentText}
                    onChange={handleCommentChange}
                    onKeyDown={handleKeyDown}
                    placeholder="输入新的评论"
                />
                <button onClick={handleAddComment} className="add-comment-button">添加评论</button>
                <ul>
                    {commentList.map((comment) => (
                        <li key={comment.id}>
                            <div className="comment-text">{comment.text} </ div>
                            <button onClick={() => handleCancel(comment.id)}>删除</button>
                        </li>
                    ))}
                </ul>
                <button onClick={handleSave} disabled={!hasCommentUpdate}>保存</button>
            </div>
        </div>

    );
};

CommentModel.propTypes = {
    comments: PropTypes.array.isRequired,
    onCommentsUpdate: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
};

export default CommentModel;
