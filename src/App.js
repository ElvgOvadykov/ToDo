import React, {useState, useEffect} from 'react';
import axios from "axios";
import {Route, useHistory, useLocation} from "react-router-dom";

import List from "./components/List";
import AddList from "./components/AddButtonList";
import Tasks from "./components/Tasks";

function App() {
    const [colors, setColors] = useState(null);
    const [lists, setLists] = useState(null);
    const [selectedList, setSelectedList] = useState(null);

    let history = useHistory();
    let location = useLocation();

    useEffect(() => {
        axios.get("http://localhost:3001/lists?_expand=color&_embed=tasks").then(({data}) => {
            setLists(data);
        });
        axios.get("http://localhost:3001/colors").then(({data}) => {
            setColors(data);
        });
    }, []);

    useEffect(() => {
        const listId = location.pathname.split('/lists/')[1];
        if(lists && listId){
            const currentList = lists.find(list => list.id === Number(listId));
            setSelectedList(currentList);
        }
    },[location, lists])

    const addList = (list) => {
        list.color = colors.find(color => color.id === list.colorId);
        setLists([...lists, list]);
        history.push(`/lists/${list.id}`);
    }

    const addTask = (listId, task) => {
        const newList = lists.map((item) => {
            if (item.id === listId) {
                item.tasks = item.tasks.concat(task);
            }
            return item;
        });
        setLists(newList);
    }

    /**
    * Удаляет список
    *
    * @param {object} list список который необходимо удалить.
    */
    const removeList = (list) => {
        const index = lists.indexOf(list);
        if (index) {
            setLists(lists.filter((item) => !(item.id === list.id)));
            history.push('/');
        }
    }

    const removeTask = (listId, deletedTaskId) => {
        console.log(listId, deletedTaskId);
        const newList = lists.map((list) => {
            if (list.id === listId) {
                list.tasks = list.tasks.filter((task) => task.id !== deletedTaskId);
            }
            return list;
        });
        console.log(newList);
        setLists(newList);
    }

    const editTaskText = (listId, taskId, newText) => {
        const newList = lists.map((list) => {
            if (list.id === listId) {
                list.tasks = list.tasks.map((task) => {
                    if(task.id === taskId){
                        task.text = newText;
                    }
                    return task;
                });
            }
            return list;
        });
        console.log(newList);
        setLists(newList);
    }

    const editListName = (listId, newName) => {
        const newList = lists.map((item) => {
            if (item.id === listId) {
                item.name = newName;
            }
            return item;
        });
        setLists(newList);
    }

    return (
        <div className="todo">
            <div className="todo__sidebar">
                <List
                    onClickItem={list => history.push('/')}
                    items={[{
                        id: 0,
                        icon: (
                            <svg
                                width="14"
                                height="12"
                                viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M10.96 5.10001H5.74001C5.24321 5.10001 5.20001 5.50231 5.20001 6.00001C5.20001 6.49771 5.24321 6.90001 5.74001 6.90001H10.96C11.4568 6.90001 11.5 6.49771 11.5 6.00001C11.5 5.50231 11.4568 5.10001 10.96 5.10001ZM12.76 9.60001H5.74001C5.24321 9.60001 5.20001 10.0023 5.20001 10.5C5.20001 10.9977 5.24321 11.4 5.74001 11.4H12.76C13.2568 11.4 13.3 10.9977 13.3 10.5C13.3 10.0023 13.2568 9.60001 12.76 9.60001ZM5.74001 2.40001H12.76C13.2568 2.40001 13.3 1.99771 13.3 1.50001C13.3 1.00231 13.2568 0.600006 12.76 0.600006H5.74001C5.24321 0.600006 5.20001 1.00231 5.20001 1.50001C5.20001 1.99771 5.24321 2.40001 5.74001 2.40001ZM2.86001 5.10001H1.24001C0.743212 5.10001 0.700012 5.50231 0.700012 6.00001C0.700012 6.49771 0.743212 6.90001 1.24001 6.90001H2.86001C3.35681 6.90001 3.40001 6.49771 3.40001 6.00001C3.40001 5.50231 3.35681 5.10001 2.86001 5.10001ZM2.86001 9.60001H1.24001C0.743212 9.60001 0.700012 10.0023 0.700012 10.5C0.700012 10.9977 0.743212 11.4 1.24001 11.4H2.86001C3.35681 11.4 3.40001 10.9977 3.40001 10.5C3.40001 10.0023 3.35681 9.60001 2.86001 9.60001ZM2.86001 0.600006H1.24001C0.743212 0.600006 0.700012 1.00231 0.700012 1.50001C0.700012 1.99771 0.743212 2.40001 1.24001 2.40001H2.86001C3.35681 2.40001 3.40001 1.99771 3.40001 1.50001C3.40001 1.00231 3.35681 0.600006 2.86001 0.600006Z"
                                    fill="#7C7C7C"/>
                            </svg>),
                        name: 'Все задачи',
                        active: location.pathname === '/'
                    }]}/>
                <List items={lists}
                      onRemove={removeList}
                      isRemovable={true}
                      onClickItem={(list) => history.push(`/lists/${list.id}`)}
                      activeItem={selectedList}/>
                <AddList onAdd={addList} colors={colors}/>
            </div>
            <div className="todo__tasks">
                <Route exact path="/">
                    {
                        lists && lists.map((list) => (
                            <Tasks
                                key={list.id}
                                list={list}
                                onEditName={editListName}
                                onAddTask={addTask}
                                onRemoveTask={removeTask}
                                onEditTaskText={editTaskText}
                                withoutEmpty/>
                        ))
                    }
                </Route>
                <Route path="/lists/:id">
                    {selectedList &&
                    <Tasks
                        list={selectedList}
                        onEditName={editListName}
                        onAddTask={addTask}
                        onRemoveTask={removeTask}
                        onEditTaskText={editTaskText}/>}
                </Route>
            </div>
        </div>
    );
}

export default App;
