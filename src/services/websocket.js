class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = {
      data: [],
      error: [],
      close: [],
      open: []
    };
  }

  connect(connectionId, token) {
    return new Promise((resolve, reject) => {
      const wsUrl = `ws://localhost:8080/api/ws/terminal/${connectionId}`;
      
      // WebSocket bağlantısı oluştur
      this.ws = new WebSocket(wsUrl);

      // Bağlantı açıldığında
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.emit('open');
        resolve();
      };

      // Mesaj geldiğinde
      this.ws.onmessage = (event) => {
        try {
          // JSON mesaj mı?
          const data = JSON.parse(event.data);
          if (data.type === 'error') {
            this.emit('error', data.error);
          } else {
            this.emit('data', event.data);
          }
        } catch (e) {
          // Raw data
          this.emit('data', event.data);
        }
      };

      // Hata olduğunda
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', 'WebSocket connection error');
        reject(error);
      };

      // Bağlantı kapandığında
      this.ws.onclose = () => {
        console.log('WebSocket closed');
        this.emit('close');
      };
    });
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      if (typeof data === 'object') {
        this.ws.send(JSON.stringify(data));
      } else {
        this.ws.send(data);
      }
    }
  }

  sendInput(input) {
    this.send({
      type: 'input',
      data: input
    });
  }

  sendResize(rows, cols) {
    this.send({
      type: 'resize',
      rows: rows,
      cols: cols
    });
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

export default new WebSocketService();
