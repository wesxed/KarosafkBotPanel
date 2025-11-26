import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { insertUserSchema, loginSchema, insertBotSchema } from "@shared/schema";
import { authenticateToken, generateToken, type AuthRequest } from "./middleware/auth";
import { botManager } from "./bot-manager";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password } = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ email, password: hashedPassword });

      res.status(201).json({ 
        message: "User created successfully",
        user: { id: user.id, email: user.email }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken(user.id);

      res.json({ 
        token,
        user: { id: user.id, email: user.email }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  // Bot routes (protected)
  app.get("/api/bots", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const bots = await storage.getBotsByUserId(req.userId!);
      res.json(bots);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch bots" });
    }
  });

  app.post("/api/bots", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const botData = insertBotSchema.parse(req.body);
      const bot = await storage.createBot(req.userId!, botData);
      res.status(201).json(bot);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create bot" });
    }
  });

  app.put("/api/bots/:id/start", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const bot = await storage.getBot(req.params.id);
      
      if (!bot) {
        return res.status(404).json({ message: "Bot not found" });
      }

      if (bot.userId !== req.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      if (bot.status === "online" || bot.status === "connecting") {
        return res.status(400).json({ message: "Bot is already running" });
      }

      await storage.updateBotStatus(bot.id, "connecting");
      botManager.startBot(bot);

      res.json({ message: "Bot starting" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to start bot" });
    }
  });

  app.put("/api/bots/:id/stop", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const bot = await storage.getBot(req.params.id);
      
      if (!bot) {
        return res.status(404).json({ message: "Bot not found" });
      }

      if (bot.userId !== req.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      botManager.stopBot(bot.id);
      await storage.updateBotStatus(bot.id, "offline");

      res.json({ message: "Bot stopped" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to stop bot" });
    }
  });

  app.delete("/api/bots/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const bot = await storage.getBot(req.params.id);
      
      if (!bot) {
        return res.status(404).json({ message: "Bot not found" });
      }

      if (bot.userId !== req.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      botManager.stopBot(bot.id);
      await storage.deleteBot(bot.id);

      res.json({ message: "Bot deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete bot" });
    }
  });

  return httpServer;
}
