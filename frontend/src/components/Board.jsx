import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import TaskList from './TaskList';
import '../styles/Board.scss';
import axios from "axios";
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver'

const Board = ({username}) => {
    Board.propTypes = {
        username: PropTypes.string.isRequired
    };
    const [isEditingName, setIsEditingName] = useState(false);
    const [isAddingTaskList, setIsAddingTaskList] = useState(false);
    const [newTaskListName, setNewTaskListName] = useState('');
    const [board, setBoard] = useState(null);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAddingTaskList) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isAddingTaskList]);

    useEffect(() => {
        if (!username) {
            navigate('/');
            return;
        }

        axios.get(`http://127.0.0.1:7001/board/${username}`, {})
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    setBoard(response.data.board);
                } else {
                    console.error('用户验证失败:', response.data.message);
                }
            }).catch(error => {
            console.error(error);
        })
    }, [username, navigate])

    if (board === null) {
        return <div>Loading...</div>; // 或者显示加载中状态
    }

    const handleNameClick = () => {
        setIsEditingName(true);
    };

    const handleNameChange = (event) => {
        const newBoard = {...board};
        newBoard.name = event.target.value;
        setBoard(newBoard);
    };

    const handleNameBlur = () => {
        const newBoard = {...board};
        if (newBoard.name.trim() === '') {
            newBoard.name = 'Board';
            setBoard(newBoard);
        }
        axios.put(`http://127.0.0.1:7001/board/${username}/boardName`, {boardName: board.name})
            .then(response => {
                console.log('Response received:', response.data);
                if (response.data.success) {
                    console.log(response.data.message);
                    console.log(response.data.name);
                } else {
                    console.log(response.data.message);
                }
            }).catch(error => {
            console.error(error);
        })
        setIsEditingName(false);
    };

    const handleAddTaskListClick = () => {
        setIsAddingTaskList(true);
        setNewTaskListName(''); // Reset name field
    };

    const handleNewTaskListNameChange = (event) => {
        setNewTaskListName(event.target.value);
    };

    const handleConfirmNewTaskList = () => {
        if (newTaskListName.trim() !== '') {
            setBoard(prevBoard => {
                return {
                    name: prevBoard.name,
                    taskLists: [
                        ...prevBoard.taskLists,
                        {
                            id: prevBoard.taskLists.length ? prevBoard.taskLists[prevBoard.taskLists.length - 1].id + 1 : 0,
                            name: newTaskListName,
                            tasks: [],
                            lastModifiedDate: JSON.stringify(new Date()),
                        }
                    ]
                }
            });
            setIsAddingTaskList(false);
            setNewTaskListName('');

            axios.post(`http://127.0.0.1:7001/board/${username}/board`, {taskListName: newTaskListName})
                .then(response => {
                    console.log('Response received:', response.data);
                }).catch(error => {
                console.error(error);
            });
        }
    };

    const handleCancelNewTaskList = () => {
        setIsAddingTaskList(false);
        setNewTaskListName('');
    };

    const handleListNameChange = (taskListId, name) => {
        const newBoard = {...board};
        const taskList = newBoard.taskLists.find(taskList => taskList.id === taskListId);
        taskList.lastModifiedDate = JSON.stringify(new Date());
        taskList.name = name;
        setBoard(newBoard);

        axios.put(`http://127.0.0.1:7001/board/${username}/board/taskLists`, {
            taskListId: taskListId,
            taskListName: name
        }).then(response => {
            console.log('Response received:', response.data);
        }).catch(error => {
            console.error(error);
        });
    };

    const handleTaskListDelete = (taskListId) => {
        const newBoard = {...board};
        newBoard.taskLists = newBoard.taskLists.filter(taskList => taskList.id !== taskListId);
        setBoard(newBoard);

        axios.delete(`http://127.0.0.1:7001/board/${username}/board/taskLists/deleteTaskList`, {data: {taskListId: taskListId}})
            .then(response => {
                console.log('Response received:', response.data);
            }).catch(error => {
            console.error(error);
        });
    }
    const handleAddTask = (taskListId, taskName) => {
        const newBoard = {...board};
        const taskList = newBoard.taskLists.find(taskList => taskList.id === taskListId);
        taskList.lastModifiedDate = JSON.stringify(new Date());
        taskList.tasks.push({
            id: taskList.tasks.length ? taskList.tasks[taskList.tasks.length - 1].id + 1 : 0,
            name: taskName,
            comments: [],
            attachments: []
        })
        setBoard(newBoard);

        axios.post(`http://127.0.0.1:7001/board/${username}/board/taskLists/tasks/addTask`, {
            taskListId: taskListId,
            taskName: taskName
        })
            .then(response => {
                console.log('Response received:', response.data);
            }).catch(error => {
            console.error(error);
        })
    }

    const handleUpdateTask = (taskListId, taskId, taskName) => {
        const newBoard = {...board};
        const taskList = newBoard.taskLists.find(taskList => taskList.id === taskListId);
        const task = taskList.tasks.find(task => task.id === taskId);
        taskList.lastModifiedDate = JSON.stringify(new Date());
        task.name = taskName;
        setBoard(newBoard);

        axios.put(`http://127.0.0.1:7001/board/${username}/board/taskLists/tasks/updateTask`, {
            taskListId: taskListId,
            taskId: taskId,
            taskName: taskName
        })
            .then(response => {
                console.log('Response received:', response.data);
            }).catch(error => {
            console.error(error);
        });
    };

    const handleDeleteTask = (taskListId, taskId) => {
        const newBoard = {...board};
        const taskList = newBoard.taskLists.find(taskList => taskList.id === taskListId);
        if (taskList) {
            taskList.tasks = taskList.tasks.filter(task => task.id !== taskId);
            taskList.lastModifiedDate = JSON.stringify(new Date());
            setBoard(newBoard);
        } else {
            console.error('TaskList not found!');
        }
        console.log(taskListId, taskId);

        axios.delete(`http://127.0.0.1:7001/board/${username}/board/taskLists/tasks/deleteTask`, {
            data: {
                taskListId: taskListId,
                taskId: taskId
            }
        })
            .then(response => {
                console.log('Response received:', response.data);
            }).catch(error => {
            console.error(error);
        });
    };

    const handleCommentsUpdate = (taskListId, taskId, comments) => {
        console.log('Board received', comments);
        const newBoard = {...board};
        const taskList = newBoard.taskLists.find(taskList => taskList.id === taskListId);
        const task = taskList.tasks.find(task => task.id === taskId);
        taskList.lastModifiedDate = JSON.stringify(new Date());
        task.comments = comments;
        setBoard(newBoard);

        axios.put(`http://127.0.0.1:7001/board/${username}/board/taskLists/tasks/comments/updateComments`, {
            taskListId: taskListId,
            taskId: taskId,
            comments: comments
        })
            .then(response => {
                console.log('Response received:', response.data);
            }).catch(error => {
            console.error(error);
        })
    }

    const handleAttachmentAdd = (taskListId, taskId, attachment) => {
        console.log('Board received', attachment);
        const newBoard = {...board};
        const taskList = newBoard.taskLists.find(taskList => taskList.id === taskListId);
        const task = taskList.tasks.find(task => task.id === taskId);
        taskList.lastModifiedDate = JSON.stringify(new Date());
        task.attachments.push({
            originalName: attachment.originalName,
            filename: attachment.filename,
        });
        setBoard(newBoard);

        const formData = new FormData();
        formData.append('taskListId', taskListId);
        formData.append('taskId', taskId);
        formData.append('originalName', attachment.originalName);
        formData.append('filename', attachment.filename);
        formData.append('file', attachment.file);
        for (let [key, value] of formData.entries()) {
            console.log(`Field: ${key}, Type: ${typeof value}`);
            if (value instanceof File) {
                console.log(`File - Name: ${value.name}, Type: ${value.type}, Size: ${value.size}`);
            }
        }

        axios.post(`http://127.0.0.1:7001/board/${username}/board/taskLists/tasks/attachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log('Response received:', response.data);
            }).catch(error => {
            console.error(error);
        })
    }

    const handleAttachmentClick = async (taskListId, taskId, filename, originalName) => {
        try {
            const response = await axios({
                method: 'GET',
                url: `http://127.0.0.1:7001/board/${username}/board/taskLists/tasks/attachments`,
                responseType: 'blob',
                params: {
                    taskListId,
                    taskId,
                    filename,
                    originalName
                }
            });
            saveAs(response.data, originalName);
        } catch (error) {
            console.error(error);
        }

    }

    const handleAttachmentDelete = (taskListId, taskId, filename) => {
        const newBoard = {...board};
        const taskList = newBoard.taskLists.find(taskList => taskList.id === taskListId);
        const task = taskList.tasks.find(task => task.id === taskId);
        taskList.lastModifiedDate = JSON.stringify(new Date());
        task.attachments = task.attachments.filter(attachment => attachment.filename !== filename);
        setBoard(newBoard);

        axios.delete(`http://127.0.0.1:7001/board/${username}/board/taskLists/tasks/attachments`, {
            data: {
                taskListId: taskListId,
                taskId: taskId,
                filename: filename
            }
        }).then(response => {
            console.log('Response received:', response.data);
        }).catch(error => {
            console.error(error);
        })
    }

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setIsAddingTaskList(false);
        }
    };

    return (
        <div className="board-container">
            <div className="board-header">
                {isEditingName ? (
                    <input className="edit-board-name"
                           type="text"
                           value={board.name}
                           onChange={handleNameChange}
                           onBlur={handleNameBlur}
                           autoFocus
                    />
                ) : (
                    <h1 onClick={handleNameClick} className="board-name">
                        {board.name}
                    </h1>
                )}
            </div>
            <div className="task-lists-container">
                {board.taskLists.map((taskList) => (
                    <div className="task=list" key={taskList.id}>
                        <TaskList
                            key={taskList.id}
                            taskListName={taskList.name}
                            tasks={taskList.tasks}
                            lastModifiedDate={taskList.lastModifiedDate}
                            onListNameChange={(name) => handleListNameChange(taskList.id, name)}
                            onTaskListDelete={() => handleTaskListDelete(taskList.id)}
                            onAddTask={(taskName) => handleAddTask(taskList.id, taskName)}
                            onUpdateTask={(taskId, task) => handleUpdateTask(taskList.id, taskId, task)}
                            onDeleteTask={(taskId) => handleDeleteTask(taskList.id, taskId)}
                            onCommentsUpdate={(taskId, comments) => handleCommentsUpdate(taskList.id, taskId, comments)}
                            onAttachmentAdd={(taskId, attachments) => handleAttachmentAdd(taskList.id, taskId, attachments)}
                            onAttachmentDelete={(taskId, filename) => handleAttachmentDelete(taskList.id, taskId, filename)}
                            onAttachmentClick={(taskId, filename, originalName) => handleAttachmentClick(taskList.id, taskId, filename, originalName)}
                        />
                    </div>
                ))}
                {isAddingTaskList ? (
                    <div className="task-list-creation-container" ref={containerRef}>
                        <input
                            type="text"
                            value={newTaskListName}
                            onChange={handleNewTaskListNameChange}
                            placeholder="请输入任务列表名称"
                        />
                        <div className="task-list-creation-buttons">
                            <button onClick={handleConfirmNewTaskList} className="confirm-button">确认</button>
                            <button onClick={handleCancelNewTaskList} className="cancel-button">取消</button>
                        </div>
                    </div>
                ) : (
                    <div className="add-task-list-container" onClick={handleAddTaskListClick}>
                        <button className="add-task-list-button">+</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Board;
