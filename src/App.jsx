import { useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState("");

  function addTask(event) {
    event.preventDefault();
    const title = taskInput.trim();

    if (!title) return;

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: crypto.randomUUID(), title, completed: false },
    ]);
    setTaskInput("");
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
    setSelectedIds((currentIds) => currentIds.filter((id) => id !== taskId));
  }

  function toggleSelected(taskId) {
    setSelectedIds((currentIds) =>
      currentIds.includes(taskId)
        ? currentIds.filter((id) => id !== taskId)
        : [...currentIds, taskId],
    );
  }

  function toggleSelectAll() {
    setSelectedIds((currentIds) =>
      tasks.every((task) => currentIds.includes(task.id))
        ? []
        : tasks.map((task) => task.id),
    );
  }

  function deleteSelectedTasks() {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => !selectedIds.includes(task.id)),
    );
    setSelectedIds([]);
    if (editingId && selectedIds.includes(editingId)) {
      setEditingId(null);
      setEditInput("");
    }
  }

  function deleteAllTasks() {
    setTasks([]);
    setSelectedIds([]);
    setEditingId(null);
  }

  function startEditing(task) {
    setEditingId(task.id);
    setEditInput(task.title);
  }

  function saveTaskName(taskId) {
    const title = editInput.trim();
    if (!title) return;

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, title } : task,
      ),
    );
    setEditingId(null);
    setEditInput("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditInput("");
  }

  const completedCount = tasks.filter((task) => task.completed).length;
  const allSelected =
    tasks.length > 0 && tasks.every((task) => selectedIds.includes(task.id));

  return (
    <main className="page">
      <section className="task-card" aria-labelledby="page-title">
        <header className="card-header">
          <div>
            <div className="eyebrow">PERSONAL WORKSPACE</div>
            <h1 id="page-title">My tasks</h1>
            <p className="subtitle">Stay focused. Finish beautifully.</p>
          </div>
          {tasks.length > 0 && (
            <div className="header-progress" aria-label={`${completedCount} of ${tasks.length} tasks completed`}>
              <strong>{completedCount}</strong>
              <span>/ {tasks.length}</span>
            </div>
          )}
        </header>

        <form className="task-form" onSubmit={addTask}>
          <label className="sr-only" htmlFor="new-task">
            Add a task
          </label>
          <input
            id="new-task"
            type="text"
            value={taskInput}
            onChange={(event) => setTaskInput(event.target.value)}
            placeholder="What needs to get done?"
            maxLength={120}
          />
          <button className="add-button" type="submit" disabled={!taskInput.trim()}>
            <span aria-hidden="true">+</span>
            Add task
          </button>
        </form>

        <div className="list-heading">
          <h2>Tasks</h2>
          <div className="list-actions">
            {tasks.length > 0 && (
              <>
                <label className="select-all">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                  <span>Select all</span>
                </label>
                {selectedIds.length > 0 && (
                  <button
                    className="delete-selected-button"
                    type="button"
                    onClick={deleteSelectedTasks}
                  >
                    Delete {selectedIds.length} {selectedIds.length === 1 ? "task" : "tasks"}
                  </button>
                )}
                <button
                  className="delete-all-button"
                  type="button"
                  onClick={deleteAllTasks}
                >
                  Delete all
                </button>
              </>
            )}
            <span className="task-count">
              {tasks.length === 0
                ? "Nothing here yet"
                : `${completedCount} of ${tasks.length} done`}
            </span>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">
              <span>✓</span>
            </div>
            <p>Your list is a blank canvas.</p>
            <span>Add a task above to get started.</span>
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li className={`task-item${task.completed ? " is-completed" : ""}`} key={task.id}>
                <div className="task-main">
                  <input
                    className="task-checkbox"
                    type="checkbox"
                    checked={selectedIds.includes(task.id)}
                    onChange={() => toggleSelected(task.id)}
                    aria-label={`Select ${task.title}`}
                  />
                  {editingId === task.id ? (
                    <form
                      className="edit-task-form"
                      onSubmit={(event) => {
                        event.preventDefault();
                        saveTaskName(task.id);
                      }}
                    >
                      <input
                        className="edit-task-input"
                        value={editInput}
                        onChange={(event) => setEditInput(event.target.value)}
                        maxLength={120}
                        autoFocus
                        aria-label={`Edit ${task.title}`}
                      />
                      <button type="submit" disabled={!editInput.trim()}>
                        Save
                      </button>
                      <button type="button" onClick={cancelEditing}>
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <span className="task-title">{task.title}</span>
                  )}
                </div>
                {editingId !== task.id && (
                  <div className="task-actions">
                    <button
                      className={`complete-button${task.completed ? " is-completed" : ""}`}
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      aria-pressed={task.completed}
                    >
                      {task.completed ? "Completed" : "Mark done"}
                    </button>
                    <button
                      className="edit-button"
                      type="button"
                      onClick={() => startEditing(task)}
                      aria-label={`Edit ${task.title}`}
                      title={`Edit ${task.title}`}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      aria-label={`Delete ${task.title}`}
                      title={`Delete ${task.title}`}
                    >
                      <svg viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M4.5 6h11M8 6V4.5h4V6m2.5 0-.6 9.5H6.1L5.5 6m2.7 2.2v5m3.6-5v5" />
                      </svg>
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {tasks.length > 0 && (
          <footer className="card-footer">
            {tasks.length - completedCount} {tasks.length - completedCount === 1 ? "task" : "tasks"} left to do
          </footer>
        )}
      </section>
      <p className="page-note">One thing at a time.</p>
    </main>
  );
}

export default App;
