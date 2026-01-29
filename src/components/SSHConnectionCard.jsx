import React from 'react';
import { useNavigate } from 'react-router-dom';

const SSHConnectionCard = ({ connection, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleConnect = () => {
    // Faz 4'te terminal sayfasına yönlendirecek
    navigate(`/terminal/${connection.id}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{connection.name}</h3>
          <p className="text-sm text-gray-500">{connection.username}@{connection.host}</p>
        </div>
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
          {connection.auth_type === 'password' ? '🔑 Password' : '🔐 SSH Key'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <span className="text-gray-500 w-20">Host:</span>
          <span className="text-gray-900">{connection.host}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-gray-500 w-20">Port:</span>
          <span className="text-gray-900">{connection.port}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-gray-500 w-20">Username:</span>
          <span className="text-gray-900">{connection.username}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleConnect}
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
        >
          Connect
        </button>
        <button
          onClick={() => onEdit(connection)}
          className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(connection.id)}
          className="px-4 py-2 border border-red-300 hover:bg-red-50 text-red-600 rounded-md text-sm font-medium transition-colors"
        >
          Delete
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-400">
        Created: {new Date(connection.created_at).toLocaleDateString()}
      </div>
    </div>
  );
};

export default SSHConnectionCard;
