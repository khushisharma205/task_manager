import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      toast.success('Registered!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input type="text" placeholder="Name" className="w-full p-2 border rounded mb-4"
          value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
        <input type="email" placeholder="Email" className="w-full p-2 border rounded mb-4"
          value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded mb-4"
          value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required />
        <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Register</button>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-green-500">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;