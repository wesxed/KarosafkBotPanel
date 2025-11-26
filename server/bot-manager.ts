import mineflayer, { Bot as MineflayerBot } from "mineflayer";
import { storage } from "./storage";
import type { Bot } from "@shared/schema";

interface BotInstance {
  bot: MineflayerBot;
  config: Bot;
  reconnectTimeout?: NodeJS.Timeout;
  antiAfkInterval?: NodeJS.Timeout;
  manuallyStopped?: boolean;
}

class BotManager {
  private bots: Map<string, BotInstance> = new Map();

  startBot(config: Bot) {
    if (this.bots.has(config.id)) {
      console.log(`Bot ${config.id} is already running`);
      return;
    }

    this.createBot(config);
  }

  private createBot(config: Bot) {
    try {
      const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.botName,
        version: config.version,
        auth: "offline", // Cracked only mode
      });

      const instance: BotInstance = {
        bot,
        config,
      };

      this.bots.set(config.id, instance);

      bot.on("login", () => {
        console.log(`Bot ${config.botName} logged in`);
        storage.updateBotStatus(config.id, "online");

        instance.antiAfkInterval = setInterval(() => {
          if (bot.entity && bot.entity.position) {
            const pos = bot.entity.position;
            bot.setControlState("forward", true);
            setTimeout(() => {
              bot.setControlState("forward", false);
              bot.setControlState("back", true);
              setTimeout(() => {
                bot.setControlState("back", false);
              }, 100);
            }, 100);
          }
        }, 3000);
      });

      bot.on("kicked", (reason) => {
        console.log(`Bot ${config.botName} was kicked: ${reason}`);
        this.handleDisconnect(config);
      });

      bot.on("end", () => {
        console.log(`Bot ${config.botName} disconnected`);
        this.handleDisconnect(config);
      });

      bot.on("error", (err) => {
        console.error(`Bot ${config.botName} error:`, err.message);
        this.handleDisconnect(config);
      });
    } catch (error: any) {
      console.error(`Failed to create bot ${config.botName}:`, error.message);
      storage.updateBotStatus(config.id, "offline");
    }
  }

  private handleDisconnect(config: Bot) {
    const instance = this.bots.get(config.id);
    
    if (!instance) {
      return;
    }

    if (instance.antiAfkInterval) {
      clearInterval(instance.antiAfkInterval);
      instance.antiAfkInterval = undefined;
    }
    
    if (instance.reconnectTimeout) {
      clearTimeout(instance.reconnectTimeout);
      instance.reconnectTimeout = undefined;
    }

    if (instance.manuallyStopped) {
      this.bots.delete(config.id);
      storage.updateBotStatus(config.id, "offline");
      return;
    }

    storage.updateBotStatus(config.id, "connecting");

    instance.reconnectTimeout = setTimeout(() => {
      console.log(`Reconnecting bot ${config.botName}...`);
      this.bots.delete(config.id);
      this.createBot(config);
    }, 5000);
  }

  stopBot(botId: string) {
    const instance = this.bots.get(botId);
    
    if (!instance) {
      return;
    }

    if (instance.reconnectTimeout) {
      clearTimeout(instance.reconnectTimeout);
      instance.reconnectTimeout = undefined;
      this.bots.delete(botId);
      storage.updateBotStatus(botId, "offline");
      console.log(`Bot ${instance.config.botName} reconnect cancelled and stopped`);
      return;
    }

    instance.manuallyStopped = true;
    
    if (instance.antiAfkInterval) {
      clearInterval(instance.antiAfkInterval);
      instance.antiAfkInterval = undefined;
    }

    if (instance.bot) {
      instance.bot.quit();
    }
    
    console.log(`Bot ${instance.config.botName} stopping...`);
  }
}

export const botManager = new BotManager();
