import { useState, useEffect } from "react";

import Typography from "@mui/material/Typography";
import "./index.css";

const API_BASE = "http://localhost:3001";

function App() {
    const [todos, setTodos] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [newTodo, setNewTodo] = useState("");

    useEffect(() => {
        GetTodos();
        console.log(todos);
    }, []);

    const GetTodos = () => {
        fetch(API_BASE + "/todos")
            .then((res) => res.json())
            .then((data) => setTodos(data))
            .catch((err) => console.log(err));
    };

    const completeTodo = async (id) => {
        const data = await fetch(API_BASE + "/todo/complete/" + id).then((res) => res.json());

        setTodos((todos) =>
            todos.map((todo) => {
                if (todo._id === data?._id) {
                    todo.complete = data?.complete;
                }
                return todo;
            })
        );
    };

    const deleteTodo = async (id) => {
        const data = await fetch(API_BASE + "/todo/delete/" + id, { method: "DELETE" }).then((res) => res.json());

        setTodos((todos) => todos.filter((todo) => todo._id !== data?._id));
    };

    const addTodo = async () => {
        const data = await fetch(API_BASE + "/todo/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: newTodo,
            }),
        }).then((res) => res.json());

        setTodos([...todos, data]);

        setPopupActive(false);
        setNewTodo("");
    };

    return (
        <div className="App">
            <h1 className="heading">Welcome, User</h1>
            <h4 className="tasks">Your Tasks</h4>
            <div className="todos">
                {todos.length > 0 ? (
                    todos.map((todo) => (
                        <div className={"todo" + (todo.complete ? " is-complete" : "")} key={todo._id}>
                            <div className="checkbox" onClick={() => completeTodo(todo._id)}></div>

                            <div className="todo-text">{todo.text}</div>

                            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
                                x
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='no-tasks'>You currently have no tasks</p>
                )}
            </div>

            <div className="addPopup" onClick={() => setPopupActive(true)}>
                +
            </div>

            {popupActive ? (
                <div className="popup">
                    <div className="closePopup" onClick={() => setPopupActive(false)}>
                        X
                    </div>
                    <div className="content">
                        <h3>Add Task</h3>
                        <input type="text" className="add-todo-input" onChange={(e) => setNewTodo(e.target.value)} value={newTodo} />
                        <div className="button" onClick={addTodo}>
                            Create Task
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}

export default App;
