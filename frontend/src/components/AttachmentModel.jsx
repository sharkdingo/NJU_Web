import React, {useEffect, useState} from 'react';
import '../styles/AttachmentModel.scss'
import {v4 as uuidv4} from 'uuid';
import PropTypes from 'prop-types';

const AttachmentModel = ({attachments, onAttachmentAdd, onAttachmentDelete, closeAttachmentModal, onAttachmentClick}) => {
    const [attachmentList, setAttachmentList] = useState(attachments);

    useEffect(() => {
        setAttachmentList(attachments);
    }, [attachments]);

    const handleAttachmentListAdd = async (e) => {
        const newAttachmentList = [...attachments];
        const files = Array.from(e.target.files);
        for (const f of files) {
            const attachment = {
                originalName: f.name,
                filename: uuidv4() + f.name,
            }
            await onAttachmentAdd({
                originalName: f.name,
                filename: attachment.filename,
                file: f,
            });
            window.location.reload();
        }
        e.target.value = '';
        setAttachmentList(newAttachmentList);
    }

    const handleAttachmentClick = (filename, originalName) => {
        onAttachmentClick(filename, originalName);
    }

    const handleAttachmentDelete = (filename) => {
        try {
            onAttachmentDelete(filename);
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete attachment:", error);
        }
    }


    return (
        <div className="attachment-model" onClick={closeAttachmentModal}>
            <div className="attachment-model-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={closeAttachmentModal}>×</button>
                <h2>附件</h2>
                <div className="add-attachment">
                    <label htmlFor="file-upload" className="custom-file-upload">
                        选择文件
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        style={{display: 'none'}}
                        multiple
                        onChange={handleAttachmentListAdd}
                    />
                </div>
                <ul>
                    {attachmentList.map((attachment) => (
                        <li key={attachment.filename}>
                            <div
                                className="attachment-model-content"
                                onClick={() => handleAttachmentClick(attachment.filename, attachment.originalName)}
                            >{attachment.originalName}</div>
                            <div className="space"></div>
                            <button className="delete-attachment-button"
                                    onClick={() => handleAttachmentDelete(attachment.filename)}>删除
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

AttachmentModel.propTypes = {
    attachments: PropTypes.array.isRequired,
    onAttachmentAdd: PropTypes.func.isRequired,
    onAttachmentDelete: PropTypes.func.isRequired,
    closeAttachmentModal: PropTypes.func.isRequired,
    onAttachmentClick: PropTypes.func.isRequired
};

export default AttachmentModel;
