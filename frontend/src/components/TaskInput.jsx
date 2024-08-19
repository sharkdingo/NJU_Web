import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import CommentModel from './CommentModel.jsx';
import AttachmentModel from "./AttachmentModel.jsx";
import '../styles/TaskInput.scss';

const TaskInput = ({
                       task,
                       onTaskChange,
                       onTaskBlur,
                       onTaskDelete,
                       onCommentsUpdate,
                       onAttachmentAdd,
                       onAttachmentDelete,
                       onAttachmentClick,
                   }) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [taskContent, setTaskContent] = useState(task.name);
    const [comments, setComments] = useState(task.comments);
    const [isHovered, setIsHovered] = useState(false);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [isAttachmentModelOpen, setIsAttachmentModelOpen] = useState(false);
    const [attachments, setAttachments] = useState(task.attachments);

    useEffect(() => {
        setTaskContent(task.name);
        setComments(task.comments);
        setAttachments(task.attachments);
    }, [task]);

    useEffect(() => {
        setIsHovered(false);
    }, [isModelOpen, isAttachmentModelOpen]);

    const handleInputChange = (event) => {
        setIsEditingName(true);
        setTaskContent(event.target.value);
        onTaskChange(event.target.value);
    };

    const handleInputBlur = () => {
        if (isEditingName || task.name === '') {
            onTaskBlur();
            setIsEditingName(false);
        }
    };

    const handleButtonClick = () => {
        setIsModelOpen(true);
    };

    const closeModal = () => {
        setIsModelOpen(false);
    };

    const handleCommentsUpdate = (comments) => {
        console.log('TaskInput received', comments);
        setComments(comments);
        onCommentsUpdate(comments);
    }

    const handleAttachmentAdd = (attachment) => {
        console.log('TaskInput received', attachment);
        const newAttachments = [...attachments];
        setAttachments(newAttachments);
        onAttachmentAdd(attachment);
    }

    const handleAttachmentClick = (filename, originalName) => {
        onAttachmentClick(filename, originalName);
    }

    const handleAttachmentDelete = (filename) => {
        onAttachmentDelete(filename);
    }

    const closeAttachmentModel = () => {
        setIsAttachmentModelOpen(false);
    };

    return (
        <div
            className="task-input-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <input
                type="text"
                value={taskContent}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="请输入任务名称"
                className="task-input"
                autoFocus
            />
            {isHovered && (
                <div className="button-group">
                    <button className="attachment-button" onClick={() => setIsAttachmentModelOpen(true)}>
                        附
                    </button>
                    <button onClick={handleButtonClick} className="comment-button" disabled={!taskContent.trim()}>
                        评
                    </button>
                    <button className="delete-button" onClick={onTaskDelete}>
                        删
                    </button>
                </div>
            )}
            {isModelOpen && (
                <CommentModel
                    comments={comments}
                    onCommentsUpdate={(comments) => handleCommentsUpdate(comments)}
                    closeModal={closeModal}
                />
            )
            }
            {isAttachmentModelOpen && (
                <AttachmentModel
                    attachments={attachments}
                    onAttachmentAdd={(toAddAttachments) => handleAttachmentAdd(toAddAttachments)}
                    onAttachmentDelete={(filename) => handleAttachmentDelete(filename)}
                    closeAttachmentModal={closeAttachmentModel}
                    onAttachmentClick={(filename, originalName) => handleAttachmentClick(filename, originalName)}
                />
            )
            }
        </div>
    )
        ;
};

TaskInput.propTypes = {
    task: PropTypes.shape({
        name: PropTypes.string.isRequired,
        comments: PropTypes.array.isRequired,
        attachments: PropTypes.array.isRequired,
    }).isRequired,
    onTaskDelete: PropTypes.func.isRequired,
    onTaskChange: PropTypes.func.isRequired,
    onTaskBlur: PropTypes.func.isRequired,
    onCommentsUpdate: PropTypes.func.isRequired,
    onAttachmentAdd: PropTypes.func.isRequired,
    onAttachmentDelete: PropTypes.func.isRequired,
    onAttachmentClick: PropTypes.func.isRequired
};

export default TaskInput;
