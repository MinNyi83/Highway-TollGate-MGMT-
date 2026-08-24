import app from './app';
import { createServer } from 'http';
import { initializeWebSocket } from './websocket/gateway';

const PORT = process.env.PORT || 3000;

const server = createServer(app);
initializeWebSocket(server);

server.listen(PORT, () => {
  console.log(`TollGate backend server running on port ${PORT}`);
});
