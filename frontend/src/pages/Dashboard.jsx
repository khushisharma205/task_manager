import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data.data);
    } catch (err) {
      toast.error('Failed to load tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return toast.error('Title is required');
    try {
      if (editId) {
        await API.put(`/tasks/${editId}`, { title, description });
        toast.success('Task updated');
        setEditId(null);
      } else {
        await API.post('/tasks', { title, description });
        toast.success('Task created');
      }
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving task');
    }
  };

  const toggleComplete = async (task) => {
    try {
      await API.put(`/tasks/${task._id}`, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      toast.error('Error updating task');
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
      toast.success('Task deleted');
    }
  };

  const startEdit = (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description || '');
  };

  const cancelEdit = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      {/* Task Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl mb-2">{editId ? 'Edit Task' : 'Add New Task'}</h2>
        <input type="text" placeholder="Task title" className="w-full p-2 border rounded mb-2"
          value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description (optional)" className="w-full p-2 border rounded mb-2"
          value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {editId ? 'Update' : 'Add'}
          </button>
          {editId && (
            <button type="button" onClick={cancelEdit} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          )}
        </div>
      </form>

      {/* Task List */}
      <h2 className="text-xl mb-4">My Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet. Add one above.</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className={`p-4 mb-2 rounded shadow flex items-center justify-between ${task.completed ? 'bg-green-100' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task)} />
              <div>
                <h3 className={`font-bold ${task.completed ? 'line-through' : ''}`}>{task.title}</h3>
                {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(task)} className="text-blue-500 hover:underline">Edit</button>
              <button onClick={() => deleteTask(task._id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;