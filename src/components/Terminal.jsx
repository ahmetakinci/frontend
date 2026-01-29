import React from 'react';

const TerminalComponent = ({ containerRef, connected, error, onDisconnect, connectionName }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-white font-medium">{connectionName || 'Terminal'}</span>
          <span className="text-gray-400 text-sm">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {error && (
            <span className="text-red-400 text-sm mr-4">
              {error}
            </span>
          )}
          <button
            onClick={onDisconnect}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Terminal Container */}
      <div className="flex-1 overflow-hidden p-4">
        <div 
          ref={containerRef} 
          className="w-full h-full rounded-lg"
          style={{ backgroundColor: '#1e1e1e' }}
        />
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Press Ctrl+C to interrupt</span>
            <span>•</span>
            <span>Press Ctrl+D to exit</span>
          </div>
          <div>
            SSH Terminal v1.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalComponent;
