import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://my-json-server.typicode.com/EnkiGroup/DesafioReactFrontendJunior2024/todos');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    try {
      const response = await axios.post('https://my-json-server.typicode.com/EnkiGroup/DesafioReactFrontendJunior2024/todos', {
        title: newTaskTitle,
        completed: false
      });
      setTasks([response.data, ...tasks]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const removeTask = async (taskId) => {
    try {
      await axios.delete(`https://my-json-server.typicode.com/EnkiGroup/DesafioReactFrontendJunior2024/todos/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error removing task:', error);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        task.completed = !task.completed;
      }
      return task;
    });

    try {
      await axios.put(`https://my-json-server.typicode.com/EnkiGroup/DesafioReactFrontendJunior2024/todos/${taskId}`, {
        ...tasks.find(task => task.id === taskId)
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="todoapp">
      <header className="header">
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              addTask();
            }
          }}
        />
      </header>
      <section className="main">
        <ul className="todo-list">
          {tasks.map(task => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <div className="view">
                <input
                  className="toggle"
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                />
                <label>{task.title}</label>
                <button className="destroy" onClick={() => removeTask(task.id)}></button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <footer className="footer">
        <span className="todo-count">{tasks.filter(task => !task.completed).length} items left</span>
        <button className="clear-completed">Clear completed</button>
      </footer>
    </div>
  );
};

export default App;
