import next from "next";
import { createServer } from "http";
import { initSocket } from "./lib/socket";

const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handler(req, res);
  });

  initSocket(server);

  server.listen(3000, () => {
    console.log("Server running");
  });
});