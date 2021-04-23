import React from 'react';
import axios from "axios";

import pencilSvg from '../../assets/img/pencil.svg'
import AddTaskForm from "./AddTaskForm";

import './Tasks.scss';
import Task from "./Task";

const Tasks = ({list, onEditName, onAddTask, onRemoveTask, onEditTaskText, withoutEmpty, withoutNewTaskButton}) => {
    const editTaskText = (taskId, text) => {
        const newText = window.prompt("Введите новое название списка", text);
        if (newText) {
            axios.patch(`http://localhost:3001/tasks/${taskId}`,
                {
                    text: newText
                })
                .then(() => onEditTaskText(list.id, taskId, newText))
                .catch((err) => {
                    alert('Не удалось изменить название списка!');
                    console.log(err);
                });
        }
    }

    const removeTask = (deletedTaskId) => {
        if(window.confirm('Вы действительно хотите удалить задачу?')) {
            axios.delete(`http://localhost:3001/tasks/${deletedTaskId}`)
                .then(() => onRemoveTask(list.id, deletedTaskId))
                .catch(() => alert('Произошла ошибка при удалении задачи'));
        }
    }
    
    const editName = () => {
        const newName = window.prompt("Введите новое название списка", list.name);
        if (newName) {
            axios.patch(`http://localhost:3001/lists/${list.id}`,
                {
                    name: newName
                })
                .then(() => {
                    onEditName(list.id, newName);
                })
                .catch(() => {
                    alert('Не удалось изменить название списка!');
                });
        }
    }

    return (
        <div className="tasks">
            <h2 style={{ color: list.color.hex }}
                className="tasks__title">
                {list.name}
                <img onClick={editName} src={pencilSvg} alt="123"/>
            </h2>
            <div className="tasks__items">
                {!withoutEmpty && list.tasks.length === 0 && <h2>Задачи отсутствуют</h2>}
                {list.tasks.map((task) => (
                    <Task
                        key={task.id}
                        {...task}
                        onRemoveTask={removeTask}
                        onEditText={editTaskText}/>
                ))}
                <AddTaskForm key={list.id} onAddTask={onAddTask} listId={list.id}/>
            </div>
        </div>
    );
}

export default Tasks;