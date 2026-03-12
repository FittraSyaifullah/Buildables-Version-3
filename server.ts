import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Resend } from "resend";

const resend = new Resend("re_79dWQ4wn_4acXnT5A1zpyrKACTsvG1tyA");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/send-activation", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      const data = await resend.emails.send({
        from: "Buildables <onboarding@resend.dev>",
        to: [email],
        subject: "Activate your Buildables Account",
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
            <h2>Welcome to Buildables Workspace</h2>
            <p>Click the button below to activate your account and start building.</p>
            <a href="https://buildables.app" style="display: inline-block; padding: 12px 24px; background-color: #FF6B00; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 16px;">
              Activate Account
            </a>
          </div>
        `,
      });
      res.json({ success: true, data });
    } catch (error) {
      console.error("Resend error:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
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
