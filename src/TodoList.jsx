import { useState, useEffect } from "react";
import "./index.css"; 

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTask, setEditingTask] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    const storedCompletedTasks = JSON.parse(localStorage.getItem("completedTasks"));
    if (storedTasks) setTasks(storedTasks);
    if (storedCompletedTasks) setCompletedTasks(storedCompletedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }, [tasks, completedTasks]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    setCompletedTasks(completedTasks.filter((taskId) => taskId !== id));
  };

  const addTask = () => {
    if (task.trim() === "") return;
    const newTask = { id: Date.now(), text: task };
    setTasks([...tasks, newTask]);
    setTask("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const startEditing = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    setEditingIndex(id);
    setEditingTask(taskToEdit.text);
  };

  const saveTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: editingTask } : task
    );
    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditingTask("");
  };

  const toggleCompletion = (id) => {
    if (completedTasks.includes(id)) {
      setCompletedTasks(completedTasks.filter((taskId) => taskId !== id));
    } else {
      setCompletedTasks([...completedTasks, id]);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Completed") {
      return completedTasks.includes(task.id);
    } else if (filter === "Pending") {
      return !completedTasks.includes(task.id);
    }
    return true;
  });

  return (
    <div className="todo-container">
      <h2>Task List</h2>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === "light" ? "🌙" : "☀️"}
      </button>
      <div className="input-container">
        <input
          type="text"
          placeholder="Add list..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="filter-buttons">
        <button onClick={() => setFilter("All")}>
          <i className="fas fa-tasks"></i> All
        </button>
        <button onClick={() => setFilter("Completed")}>
          <i className="fas fa-check"></i> Completed
        </button>
        <button onClick={() => setFilter("Pending")}>
          <i className="fas fa-hourglass-half"></i> Pending
        </button>
      </div>
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} className={completedTasks.includes(task.id) ? "completed" : ""}>
            {editingIndex === task.id ? (
              <input
                type="text"
                value={editingTask}
                onChange={(e) => setEditingTask(e.target.value)}
                onBlur={() => saveTask(task.id)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    saveTask(task.id);
                  }
                }}
              />
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={completedTasks.includes(task.id)}
                  onChange={() => toggleCompletion(task.id)}
                />
                <span>{task.text}</span>
                <div className="task-actions">
                   <button onClick={() => startEditing(task.id)}>
                    <i className="fas fa-edit"></i> Edit
                </button>
                   <button onClick={() => removeTask(task.id)}>
                    <i className="fas fa-trash"></i> Delete
                </button>
              </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}