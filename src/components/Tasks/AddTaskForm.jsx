import React, {useState} from 'react';
import axios from "axios";

import addSvg from "../../assets/img/addNewTask.svg";

import './Tasks.scss';

const AddTaskForm = ({onAddTask, listId}) => {
    const [formVisible, setFormVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleFormVisible = () => {
        setFormVisible(!formVisible);
        setInputValue('');
    }

    const addTask = () => {
        if(!inputValue){
            alert('Введите текст задачи');
            return
        }
        setIsLoading(true);
        axios.post('http://localhost:3001/tasks',
            {
                listId: listId,
                text: inputValue,
                completed: false
            })
            .then(({data}) => onAddTask(listId, data))
            .catch((err) =>
            {
                alert('Не удалось добавить задачу');
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false);
                toggleFormVisible();
            });
    }

    return (
        <div className="tasks__form">
            {
                formVisible ?
                    <div className="tasks__form-expanded">
                        <input value={inputValue}
                               onChange={(e) => setInputValue(e.target.value)}
                               type="text"
                               className="field"
                               placeholder="Текст задачи"/>
                        <button onClick={addTask} className="button">
                            {isLoading ? 'Добавление...' : 'Добавить задачу'}
                        </button>
                        <button onClick={toggleFormVisible} className="button-grey button">
                            Отмена
                        </button>
                    </div> :
                    <div onClick={toggleFormVisible} className="tasks__form-new">
                        <img src={addSvg} alt="Добавить новую задачу"/>
                        <span>Новая задача</span>
                    </div>
            }

        </div>
    );
}

export default AddTaskForm;