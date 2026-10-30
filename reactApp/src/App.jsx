
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('To Do');
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (task.trim() === '') return;

    if (editId !== null) {
      setTasks(tasks.map(item => item.id === editId
        ? { ...item, text: task, date: date, status: status }
        : item
      ));
      setEditId(null);
    } else {
      const newTask = { id: Date.now(), text: task, date: date, status: status };
      setTasks([...tasks, newTask]);
    }

    setTask('');
    setDate('');
    setStatus('To Do');
  }

  function editTask(item) {
    setTask(item.text);
    setDate(item.date);
    setStatus(item.status);
    setEditId(item.id);
  }

  function deleteTask(id) {
    setTasks(tasks.filter(item => item.id !== id));

    if (editId === id) {
      setTask('');
      setDate('');
      setStatus('To Do');
      setEditId(null);
    }
  }

  function changeStatus(id, newStatus) {
    setTasks(tasks.map(item => item.id === id
      ? { ...item, status: newStatus }
      : item
    ));
  }

  const filteredTasks = tasks.filter(item => {
    const nameMatch = item.text.toLowerCase().includes(search.toLowerCase());
    const statusMatch = filter === 'All' || item.status === filter;
    return nameMatch && statusMatch;
  });

  return (
    <div className="container">
      <h1>Task Organizer</h1>
      <p>Organize your tasks here.</p>

      <div className="task-form">
        <input type="text" placeholder="Enter a task" value={task}
          onChange={e => setTask(e.target.value)} />

        <input type="date" value={date}
          onChange={e => setDate(e.target.value)} />

        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <button onClick={addTask}>{editId !== null ? 'Save Changes' : 'Add Task'}</button>
      </div>

      <h2>My Tasks ({tasks.length})</h2>

      <div className="search-filter">
        <input type="text" placeholder="Search for a task..." value={search}
          onChange={e => setSearch(e.target.value)} />

        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {filteredTasks.map(item => (
            <li key={item.id}>
              <div className="task-info">
                <strong>{item.text}</strong>
                <p>{item.date ? 'Due: ' + item.date : 'No due date'}</p>

                <select value={item.status}
                  onChange={e => changeStatus(item.id, e.target.value)}>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div className="buttons">
                <button onClick={() => editTask(item)}>Edit</button>
                <button onClick={() => deleteTask(item.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
