import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTerminal } from '../hooks/useTerminal';
import TerminalComponent from '../components/Terminal';
import Loading from '../components/Loading';
import { getSSHConnection } from '../services/api';

const Terminal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [connection, setConnection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const { containerRef, connected, error } = useTerminal(id);

  // Bağlantı bilgilerini yükle
  useEffect(() => {
    const loadConnection = async () => {
      try {
        const response = await getSSHConnection(id);
        setConnection(response.data.data);
        setLoadError(null);
      } catch (err) {
        console.error('Failed to load connection:', err);
        setLoadError('Failed to load connection details');
      } finally {
        setLoading(false);
      }
    };

    loadConnection();
  }, [id]);

  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to disconnect?')) {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return <Loading message="Loading connection..." />;
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-gray-300 mb-6">{loadError}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <TerminalComponent
      containerRef={containerRef}
      connected={connected}
      error={error}
      onDisconnect={handleDisconnect}
      connectionName={connection?.name}
    />
  );
};

export default Terminal;
