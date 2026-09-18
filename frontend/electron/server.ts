import http from "http";
import fs from "fs";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

// Starts a minimal static file server serving the built dist/ folder,
// and resolves with the actual URL once it's ready. Using port 0 lets
// the OS pick any free port automatically, avoiding conflicts.
export function startStaticServer(distPath: string): Promise<string> {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(distPath, req.url === "/" ? "index.html" : req.url ?? "");

      // Any unknown path (e.g. a client-side route) falls back to
      // index.html — standard behavior for single-page apps.
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(distPath, "index.html");
      }

      const ext = path.extname(filePath);
      const contentType = MIME_TYPES[ext] ?? "application/octet-stream";

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      });
    });

    server.listen(0, "localhost", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      resolve(`http://localhost:${port}`);
    });
  });
}