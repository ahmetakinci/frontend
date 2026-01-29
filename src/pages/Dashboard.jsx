import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getSSHConnections, createSSHConnection, updateSSHConnection, deleteSSHConnection } from '../services/api';
import SSHConnectionCard from '../components/SSHConnectionCard';
import SSHConnectionForm from '../components/SSHConnectionForm';
import Loading from '../components/Loading';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState(null);
  const [error, setError] = useState('');

  // Bağlantıları yükle
  const loadConnections = async () => {
    try {
      setLoading(true);
      const response = await getSSHConnections();
      setConnections(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load connections');
      console.error('Load connections error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  // Yeni bağlantı oluştur
  const handleCreateConnection = async (formData) => {
    await createSSHConnection(formData);
    await loadConnections();
    setIsFormOpen(false);
  };

  // Bağlantı güncelle
  const handleUpdateConnection = async (formData) => {
    await updateSSHConnection(editingConnection.id, formData);
    await loadConnections();
    setIsFormOpen(false);
    setEditingConnection(null);
  };

  // Bağlantı sil
  const handleDeleteConnection = async (id) => {
    if (window.confirm('Are you sure you want to delete this connection?')) {
      try {
        await deleteSSHConnection(id);
        await loadConnections();
      } catch (err) {
        alert('Failed to delete connection');
      }
    }
  };

  // Form aç
  const handleOpenForm = (connection = null) => {
    setEditingConnection(connection);
    setIsFormOpen(true);
  };

  // Form kapat
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingConnection(null);
  };

  if (loading) {
    return <Loading message="Loading your connections..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">Manage your SSH connections</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* New Connection Button */}
        <div className="mb-6">
          <button
            onClick={() => handleOpenForm()}
            className="btn-primary inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New SSH Connection
          </button>
        </div>

        {/* Connections Grid */}
        {connections.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No SSH connections yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first connection</p>
            <button
              onClick={() => handleOpenForm()}
              className="btn-primary"
            >
              Create Connection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((connection) => (
              <SSHConnectionCard
                key={connection.id}
                connection={connection}
                onEdit={handleOpenForm}
                onDelete={handleDeleteConnection}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Total Connections</div>
            <div className="text-3xl font-bold text-gray-900">{connections.length}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Password Auth</div>
            <div className="text-3xl font-bold text-gray-900">
              {connections.filter(c => c.auth_type === 'password').length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">SSH Key Auth</div>
            <div className="text-3xl font-bold text-gray-900">
              {connections.filter(c => c.auth_type === 'key').length}
            </div>
          </div>
        </div>
      </div>

      {/* Connection Form Modal */}
      <SSHConnectionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingConnection ? handleUpdateConnection : handleCreateConnection}
        connection={editingConnection}
      />
    </div>
  );
};

export default Dashboard;
