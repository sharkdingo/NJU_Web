import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TaskInput from './TaskInput';
import '../styles/TaskList.scss';

const TaskList = ({ taskListName, tasks, lastModifiedDate, onListNameChange, onTaskListDelete, onAddTask, onUpdateTask, onDeleteTask, onCommentsUpdate, onAttachmentAdd, onAttachmentDelete, onAttachmentClick }) => {
    const [name, setName] = useState(taskListName);
    const [isEditingName, setIsEditingName] = useState(false);
    const [taskList, setTaskList] = useState(tasks);
    const [lastModifiedTime, setLastModifiedTime] = useState(new Date(JSON.parse(lastModifiedDate)));

    useEffect(() => {
        setName(taskListName);
        setTaskList(tasks);
    }, [setName, taskListName, tasks]);

    const updateLastModifiedTime = () => {
        setLastModifiedTime(new Date());
    };

    const handleNameClick = () => {
        setIsEditingName(true);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleNameBlur = () => {
        const trimmedName = name.trim();
        if (trimmedName === '') {
            setName('TaskList');
            onListNameChange('TaskList');
        } else {
            onListNameChange(trimmedName);
        }
        updateLastModifiedTime();
        setIsEditingName(false);
    };

    const handleAddTask = () => {
        const newTaskId = taskList.length ? taskList[taskList.length - 1].id + 1 : 0;
        const newTask = {
            id: newTaskId,
            name: '',
            comments: [],
            attachments: [],
        };
        const newTaskList = [...taskList, newTask];
        setTaskList(newTaskList);
    };

    const handleTaskChange = (taskId, value) => {
        const newTaskList = taskList.map(task =>
            task.id === taskId ? { ...task, name: value } : task
        );
        setTaskList(newTaskList);
    };

    const handleTaskBlur = (taskId) => {
        const task = taskList.find(task => task.id === taskId);
        const isLastTask = taskId === taskList[taskList.length - 1].id;
        const isTaskNameEmpty = task.name.trim() === '';
        if (isLastTask && isTaskNameEmpty) {
            setTaskList(taskList.filter(task => task.id !== taskId));
        } else {
            if (isLastTask && !isTaskNameEmpty) {
                onAddTask(task.name);
            } else {
                onUpdateTask(taskId, task.name);
            }
            updateLastModifiedTime();
        }
    };

    const handleDeleteTask = (taskId) => {
        const newTaskList = taskList.filter(task => task.id !== taskId);
        setTaskList(newTaskList);
        onDeleteTask(taskId);
        updateLastModifiedTime();
    }

    const handleCommentsUpdate = (taskId, comments) => {
        console.log('TaskList received', comments);
        const newTaskList = [ ...taskList ];
        const task = newTaskList.find(task => task.id === taskId);
        task.comments = comments;
        setTaskList(newTaskList);
        onCommentsUpdate(taskId, comments);
        updateLastModifiedTime();
    }

    const handleAttachmentAdd = (taskId, attachment) => {
        onAttachmentAdd(taskId, attachment)
        updateLastModifiedTime();
    }

    const handleAttachmentClick = (taskId, filename, originalName) => {
        onAttachmentClick(taskId, filename, originalName);
    }

    const handleAttachmentDelete = (taskId, filename) => {
        onAttachmentDelete(taskId, filename);
        updateLastModifiedTime();
    }

    return (
        <div className="task-list-container">
            <button className="close-button" onClick={onTaskListDelete}>X</button>
            <div className="list-name-container">
                {isEditingName ? (
                    <input className="change-list-name"
                           type="text"
                           value={name}
                           onChange={handleNameChange}
                           onBlur={handleNameBlur}
                           autoFocus
                    />
                ) : (
                    <h2 onClick={handleNameClick} className="list-name">
                        {name}
                    </h2>
                )}
            </div>
            <div className="tasks-container">
                {taskList.map((task) => (
                    <TaskInput
                        key={task.id}
                        task={task}
                        onTaskChange={(value) => handleTaskChange(task.id, value)}
                        onTaskBlur={() => handleTaskBlur(task.id)}
                        onTaskDelete={() => handleDeleteTask(task.id)}
                        onCommentsUpdate={(comments) => handleCommentsUpdate(task.id, comments)}
                        onAttachmentAdd={(attachments) => handleAttachmentAdd(task.id, attachments)}
                        onAttachmentDelete={(filename) => handleAttachmentDelete(task.id, filename)}
                        onAttachmentClick={(filename, originalName) => handleAttachmentClick(task.id, filename, originalName)}
                    />
                ))}
            </div>
            <button onClick={handleAddTask} className="add-task-button">+</button>
            <div className="last-modified-time">
                Last Modified: {lastModifiedTime.toLocaleString()}
            </div>
        </div>
    );
};

TaskList.propTypes = {
    taskListName: PropTypes.string.isRequired,
    tasks: PropTypes.array.isRequired,
    lastModifiedDate: PropTypes.string.isRequired,
    onListNameChange: PropTypes.func.isRequired,
    onTaskListDelete: PropTypes.func.isRequired,
    onAddTask: PropTypes.func.isRequired,
    onUpdateTask: PropTypes.func.isRequired,
    onDeleteTask: PropTypes.func.isRequired, // 添加对 onDeleteTask 的类型验证
    onCommentsUpdate: PropTypes.func.isRequired,
    onAttachmentAdd: PropTypes.func.isRequired,
    onAttachmentDelete: PropTypes.func.isRequired,
    onAttachmentClick: PropTypes.func.isRequired
};

export default TaskList;
