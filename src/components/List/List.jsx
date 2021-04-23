import React from 'react';
import classNames from "classnames";
import axios from "axios";

import Badge from "../Badge";

import removeSvg from "../../assets/img/remove.svg";

import './List.scss';

const List = ({items, isRemovable, onClick, onRemove, onClickItem, activeItem, active}) => {
    const removeList = (item) => {
        if(window.confirm("Действительно ли вы хотите удалить список?")){
            axios.delete("http://localhost:3001/lists/" + item.id)
                 .then(() => onRemove(item));
        }
    }

    return (
        <ul onClick={onClick} className="list">
            {items && items.map(item => (
                <li key={item.id}
                    className={classNames(item.className,
                        {'active': active || activeItem && activeItem.id === item.id})}
                    onClick={() => onClickItem && onClickItem(item)}>
                    <i>
                        {item.icon
                            ? (item.icon)
                            : (<Badge color={item.color.name}/>)}
                    </i>
                    <span>{item.name} {item.tasks && `(${item.tasks.length})`}</span>
                    {isRemovable && <img className="list__remove-btn"
                                         src={removeSvg}
                                         alt="Удалить список"
                                         onClick={() => removeList(item)}/>}
                </li>
            ))}
        </ul>
    );
}

export default List;