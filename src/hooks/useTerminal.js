import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';
import websocketService from '../services/websocket';

export const useTerminal = (connectionId) => {
  const terminalRef = useRef(null);
  const containerRef = useRef(null);
  const [terminal, setTerminal] = useState(null);
  const [fitAddon, setFitAddon] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!containerRef.current || !connectionId) return;

    // Terminal instance oluştur
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff',
        cursor: '#ffffff',
        selection: 'rgba(255, 255, 255, 0.3)',
      },
      scrollback: 1000,
    });

    // Fit addon (terminal boyutlandırma)
    const fit = new FitAddon();
    term.loadAddon(fit);

    // Web links addon (URL'leri tıklanabilir yap)
    const webLinksAddon = new WebLinksAddon();
    term.loadAddon(webLinksAddon);

    // Terminal'i DOM'a bağla
    term.open(containerRef.current);
    fit.fit();

    setTerminal(term);
    setFitAddon(fit);
    terminalRef.current = term;

    // WebSocket bağlantısı kur
    const connectWebSocket = async () => {
      try {
        term.writeln('Connecting to server...');
        
        await websocketService.connect(connectionId);
        
        term.writeln('\x1b[32mConnected!\x1b[0m');
        setConnected(true);
        setError(null);

        // WebSocket'ten gelen veriyi terminal'e yaz
        websocketService.on('data', (data) => {
          term.write(data);
        });

        // WebSocket hataları
        websocketService.on('error', (errorMsg) => {
          term.writeln(`\x1b[31mError: ${errorMsg}\x1b[0m`);
          setError(errorMsg);
        });

        // WebSocket kapandı
        websocketService.on('close', () => {
          term.writeln('\x1b[33m\r\nConnection closed.\x1b[0m');
          setConnected(false);
        });

        // Terminal'den input alındığında WebSocket'e gönder
        term.onData((data) => {
          websocketService.sendInput(data);
        });

        // Terminal resize olduğunda
        term.onResize(({ rows, cols }) => {
          websocketService.sendResize(rows, cols);
        });

      } catch (err) {
        console.error('WebSocket connection error:', err);
        term.writeln('\x1b[31mFailed to connect to server.\x1b[0m');
        setError('Failed to connect');
      }
    };

    connectWebSocket();

    // Window resize handler
    const handleResize = () => {
      if (fit) {
        fit.fit();
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      websocketService.close();
      term.dispose();
    };
  }, [connectionId]);

  const fitTerminal = () => {
    if (fitAddon) {
      fitAddon.fit();
    }
  };

  return {
    containerRef,
    terminal,
    connected,
    error,
    fitTerminal,
  };
};
