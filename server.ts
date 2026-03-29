import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Placeholder for Claude API
  app.post("/api/ai/claude", async (req, res) => {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return res.status(401).json({ error: "CLAUDE_API_KEY not configured" });
    }
    // Implement Claude API call here
    res.json({ message: "Claude integration ready. (Server-side)" });
  });

  // Placeholder for Evergent API
  app.post("/api/billing/evergent", async (req, res) => {
    const apiKey = process.env.EVERGENT_API_KEY;
    if (!apiKey) {
      return res.status(401).json({ error: "EVERGENT_API_KEY not configured" });
    }
    // Implement Evergent API call here
    res.json({ message: "Evergent integration ready. (Server-side)" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
