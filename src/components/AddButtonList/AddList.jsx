import React, {useState, useEffect} from 'react';
import axios from "axios";

import Badge from "../Badge";
import List from "../List";

import closeSvg from '../../assets/img/close.svg';
import "./AddList.scss";


const AddList = ({colors, onAdd}) => {
    const [visiblePopup, setVisiblePopup] = useState(false);
    const [selectedColorId, selectColorId] = useState(1);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (Array.isArray(colors)) {
            selectColorId(colors[0].id);
        }
    }, [colors])

    const addList = () => {
        if (!inputValue) {
            alert("Введите название списка!");
            return;
        }
        setIsLoading(true);
        console.log(inputValue, selectedColorId);
        axios.post("http://localhost:3001/lists",
            {
                name: inputValue,
                colorId: selectedColorId,
                tasks: []
            })
            .finally(() => setIsLoading(false))
            .then(({data}) => {
                console.log(data);
                onAdd({...data});
                closePopUp();
            });
    }

    const closePopUp = () => {
        setVisiblePopup(false);
        setInputValue('');
        selectColorId(colors[0].id);
    }

    return (
        <div className="add-list">
            <List
                onClick={() => setVisiblePopup(!visiblePopup)}
                items={[{
                    id: 0,
                    className: "list__add-button",
                    icon: (
                        <svg width="12" height="12"
                             viewBox="0 0 12 12"
                             fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 1V11" stroke="#868686" strokeWidth="1.5" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                            <path d="M1 6H11" stroke="#868686" strokeWidth="1.5" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </svg>),
                    name: 'Добавить список'
                }]}/>
            {visiblePopup &&
            <div className="add-list__popup">
                <img src={closeSvg}
                     alt="Закрыть"
                     className="add-list__popup-close-btn"
                     onClick={closePopUp}/>
                <input value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       type="text"
                       className="field"
                       placeholder="Название списка"/>
                <div className="add-list__popup__colors">
                    {
                        colors.map(color => (
                            <Badge
                                onClick={() => selectColorId(color.id)}
                                key={color.id}
                                color={color.name}
                                className={selectedColorId === color.id ? 'active' : ''}
                            />
                        ))
                    }
                </div>
                <button onClick={addList} className="button" disabled={isLoading}>
                    {isLoading ? "Добавление..." : "Добавить"}
                </button>
            </div>}
        </div>
    );
}

export default AddList;