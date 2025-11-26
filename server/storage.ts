import { type User, type InsertUser, type Bot, type InsertBot } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Bot methods
  getBot(id: string): Promise<Bot | undefined>;
  getBotsByUserId(userId: string): Promise<Bot[]>;
  createBot(userId: string, bot: InsertBot): Promise<Bot>;
  updateBotStatus(id: string, status: string): Promise<Bot | undefined>;
  deleteBot(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bots: Map<string, Bot>;

  constructor() {
    this.users = new Map();
    this.bots = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBot(id: string): Promise<Bot | undefined> {
    return this.bots.get(id);
  }

  async getBotsByUserId(userId: string): Promise<Bot[]> {
    return Array.from(this.bots.values()).filter(
      (bot) => bot.userId === userId,
    );
  }

  async createBot(userId: string, insertBot: InsertBot): Promise<Bot> {
    const id = randomUUID();
    const bot: Bot = { 
      ...insertBot, 
      id, 
      userId,
      status: "offline"
    };
    this.bots.set(id, bot);
    return bot;
  }

  async updateBotStatus(id: string, status: string): Promise<Bot | undefined> {
    const bot = this.bots.get(id);
    if (bot) {
      const updatedBot = { ...bot, status };
      this.bots.set(id, updatedBot);
      return updatedBot;
    }
    return undefined;
  }

  async deleteBot(id: string): Promise<boolean> {
    return this.bots.delete(id);
  }
}

export const storage = new MemStorage();
