import React, { useState, useEffect } from 'react';

const SSHConnectionForm = ({ isOpen, onClose, onSubmit, connection }) => {
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: 22,
    username: '',
    auth_type: 'password',
    password: '',
    private_key: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (connection) {
      setFormData({
        name: connection.name || '',
        host: connection.host || '',
        port: connection.port || 22,
        username: connection.username || '',
        auth_type: connection.auth_type || 'password',
        password: '',
        private_key: ''
      });
    } else {
      setFormData({
        name: '',
        host: '',
        port: 22,
        username: '',
        auth_type: 'password',
        password: '',
        private_key: ''
      });
    }
    setError('');
  }, [connection, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validasyon
    if (!formData.name || !formData.host || !formData.username) {
      setError('Name, host, and username are required');
      setLoading(false);
      return;
    }

    if (formData.auth_type === 'password' && !formData.password && !connection) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    if (formData.auth_type === 'key' && !formData.private_key && !connection) {
      setError('Private key is required');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save connection');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {connection ? 'Edit SSH Connection' : 'New SSH Connection'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Connection Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="My Server"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Host *
                </label>
                <input
                  type="text"
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="192.168.1.100 or example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Port *
                </label>
                <input
                  type="number"
                  name="port"
                  value={formData.port}
                  onChange={handleChange}
                  className="input-field"
                  min="1"
                  max="65535"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="root"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Authentication Type *
              </label>
              <select
                name="auth_type"
                value={formData.auth_type}
                onChange={handleChange}
                className="input-field"
              >
                <option value="password">Password</option>
                <option value="key">SSH Key</option>
              </select>
            </div>

            {formData.auth_type === 'password' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {connection ? '(leave empty to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                  required={!connection}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Private Key {connection ? '(leave empty to keep current)' : '*'}
                </label>
                <textarea
                  name="private_key"
                  value={formData.private_key}
                  onChange={handleChange}
                  className="input-field font-mono text-sm"
                  rows="6"
                  placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
                  required={!connection}
                />
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : connection ? 'Update Connection' : 'Create Connection'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SSHConnectionForm;
