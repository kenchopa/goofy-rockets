import Koa from 'koa';
import http, { Server } from 'http';

let server: Server;

const createServer = (app: Koa) => {
  // Create a single HTTP server
  server = http.createServer(app.callback());
  return server;
};

export {
  server,
  createServer,
};
