import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../styles/AvatarUploader.scss'; // 引入SCSS文件

const AvatarUploader = ({username}) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:7001/board/${username}/avatar`, {})
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    const imageUrl = `http://127.0.0.1:7001${response.data.avatar}`;
                    setPreview(imageUrl);
                } else {
                    console.error('用户头像拉取失败:', response.data.message);
                }
            }).catch(error => {
            console.error(error);
        })
    }, [username]);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            // 生成文件预览
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);

            const formData = new FormData();
            formData.append('file', selectedFile);
            try {
                const response = await axios.post(`http://127.0.0.1:7001/board/${username}/avatar`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('File uploaded successfully:', response.data);
                // 可以在这里处理上传成功后的逻辑
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="avatar-uploader">
                <input
                    type="file"
                    accept="image/*"
                    className="file-input"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <img
                    src={preview || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#ADD8E6"/></svg>'}
                    className="avatar-image"
                    onClick={handleFileClick}
                    alt={''}
                />
        </div>
    );
};

AvatarUploader.propTypes = {
    username: PropTypes.string.isRequired,
};

export default AvatarUploader;
