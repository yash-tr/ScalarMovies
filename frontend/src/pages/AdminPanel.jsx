import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('cinemas');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [cinemas, setCinemas] = useState([]);
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);

  if (!isAdmin) {
    return <div className="p-8 text-center">Access Denied. Admin privileges required.</div>;
  }

  const tabs = [
    { id: 'cinemas', label: 'Cinemas', fields: ['name', 'city', 'address'] },
    { id: 'screens', label: 'Screens', fields: ['name', 'cinemaId'] },
    { id: 'movies', label: 'Movies', fields: ['title', 'duration', 'genre'] },
    { id: 'shows', label: 'Shows', fields: ['movieId', 'screenId', 'date', 'time', 'price'] },
    { id: 'users', label: 'Users', fields: ['email', 'name', 'role'] },
  ];

  // Fetch reference data for dropdowns
  const fetchReferenceData = async () => {
    try {
      const [cinemasRes, moviesRes, screensRes] = await Promise.all([
        api.get('/admin/cinemas'),
        api.get('/admin/movies'),
        api.get('/admin/screens')
      ]);
      setCinemas(cinemasRes.data);
      setMovies(moviesRes.data);
      setScreens(screensRes.data);
    } catch (error) {
      console.error('Error fetching reference data:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/admin/${activeTab}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        setError('Please login as admin to access this page');
      } else if (error.response?.status === 403) {
        setError('Admin access required');
      } else {
        setError('Error fetching data');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchReferenceData();
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Prepare data based on active tab
      let submitData = { ...formData };
      
      // Handle special cases for different entities
      if (activeTab === 'shows') {
        // Convert date/time strings to proper format
        if (submitData.date) {
          submitData.date = new Date(submitData.date).toISOString().split('T')[0];
        }
        if (submitData.time) {
          const timeDate = new Date(submitData.time);
          submitData.time = timeDate.toISOString();
        }
        // Convert price to float
        if (submitData.price) {
          submitData.price = parseFloat(submitData.price);
        }
      }
      
      if (activeTab === 'movies') {
        // Convert duration to integer
        if (submitData.duration) {
          submitData.duration = parseInt(submitData.duration);
        }
      }

      if (editing) {
        await api.put(`/admin/${activeTab}/${editing.id}`, submitData);
        setSuccess(`${tabs.find(t => t.id === activeTab)?.label} updated successfully!`);
      } else {
        await api.post(`/admin/${activeTab}`, submitData);
        setSuccess(`${tabs.find(t => t.id === activeTab)?.label} created successfully!`);
      }
      
      setFormData({});
      setEditing(null);
      setShowForm(false);
      fetchData();
      fetchReferenceData(); // Refresh reference data
    } catch (error) {
      console.error('Error saving data:', error);
      setError(error.response?.data?.message || 'Error saving data');
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/admin/${activeTab}/${id}`);
        setSuccess(`${tabs.find(t => t.id === activeTab)?.label} deleted successfully!`);
        fetchData();
        fetchReferenceData(); // Refresh reference data
      } catch (error) {
        console.error('Error deleting data:', error);
        setError(error.response?.data?.message || 'Error deleting data');
      }
    }
  };

  const handleAddNew = () => {
    setEditing(null);
    setFormData({});
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({});
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  const renderField = (field) => {
    const fieldType = field === 'date' ? 'date' : 
                     field === 'time' ? 'datetime-local' :
                     field === 'duration' || field === 'price' ? 'number' : 'text';

    // Handle dropdown fields
    if (field === 'cinemaId') {
      return (
        <select
          value={formData[field] || ''}
          onChange={(e) => setFormData({...formData, [field]: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        >
          <option value="">Select Cinema</option>
          {cinemas.map(cinema => (
            <option key={cinema.id} value={cinema.id}>
              {cinema.name} - {cinema.city}
            </option>
          ))}
        </select>
      );
    }

    if (field === 'movieId') {
      return (
        <select
          value={formData[field] || ''}
          onChange={(e) => setFormData({...formData, [field]: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        >
          <option value="">Select Movie</option>
          {movies.map(movie => (
            <option key={movie.id} value={movie.id}>
              {movie.title} ({movie.genre})
            </option>
          ))}
        </select>
      );
    }

    if (field === 'screenId') {
      return (
        <select
          value={formData[field] || ''}
          onChange={(e) => setFormData({...formData, [field]: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        >
          <option value="">Select Screen</option>
          {screens.map(screen => (
            <option key={screen.id} value={screen.id}>
              {screen.name} - {screen.cinema?.name}
            </option>
          ))}
        </select>
      );
    }

    if (field === 'role') {
      return (
        <select
          value={formData[field] || ''}
          onChange={(e) => setFormData({...formData, [field]: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        >
          <option value="">Select Role</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      );
    }

    return (
      <input
        type={fieldType}
        value={formData[field] || ''}
        onChange={(e) => setFormData({...formData, [field]: e.target.value})}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        required
        min={field === 'duration' ? 1 : field === 'price' ? 0 : undefined}
        step={field === 'price' ? 0.01 : undefined}
      />
    );
  };

  const formatValue = (value, key) => {
    if (typeof value === 'object' && value !== null) {
      if (value.name) return value.name;
      if (value.title) return value.title;
      return JSON.stringify(value);
    }
    if (key === 'createdAt' || key === 'bookedAt') {
      return new Date(value).toLocaleDateString();
    }
    if (key === 'price') {
      return `₹${value}`;
    }
    if (key === 'duration') {
      return `${value} min`;
    }
    return String(value);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      
      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setShowForm(false);
              setEditing(null);
              setFormData({});
              setError('');
              setSuccess('');
            }}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === tab.id 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Add New Button */}
      <div className="mb-6">
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          + Add New {tabs.find(t => t.id === activeTab)?.label}
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editing ? 'Edit' : 'Add'} {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tabs.find(t => t.id === activeTab)?.fields.map(field => (
                <div key={field} className={field === 'address' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {field === 'cinemaId' && ' (for Screens)'}
                    {field === 'movieId' && ' (for Shows)'}
                    {field === 'screenId' && ' (for Shows)'}
                  </label>
                  {renderField(field)}
                </div>
              ))}
              <div className="col-span-2 flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(data[0] || {}).map(key => (
                    <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {key}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50">
                    {Object.entries(item).map(([key, value]) => (
                      <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatValue(value, key)}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;