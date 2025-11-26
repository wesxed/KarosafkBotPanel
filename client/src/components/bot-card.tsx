import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BotStatusBadge } from "@/components/bot-status-badge";
import { Play, Square, Trash2 } from "lucide-react";
import type { Bot } from "@shared/schema";

interface BotCardProps {
  bot: Bot;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onDelete: (id: string) => void;
  isStarting?: boolean;
  isStopping?: boolean;
  isDeleting?: boolean;
}

export function BotCard({ bot, onStart, onStop, onDelete, isStarting, isStopping, isDeleting }: BotCardProps) {
  const isLoading = isStarting || isStopping || isDeleting;

  return (
    <Card className="hover-elevate" data-testid={`card-bot-${bot.id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
        <h3 className="text-lg font-semibold truncate" data-testid={`text-bot-name-${bot.id}`}>
          {bot.botName}
        </h3>
        <BotStatusBadge status={bot.status as "online" | "offline" | "connecting"} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Host</p>
            <p className="font-mono text-foreground truncate" data-testid={`text-host-${bot.id}`}>
              {bot.host}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Port</p>
            <p className="font-mono text-foreground" data-testid={`text-port-${bot.id}`}>
              {bot.port}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Version</p>
            <p className="font-mono text-foreground" data-testid={`text-version-${bot.id}`}>
              {bot.version}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Mode</p>
            <p className="text-foreground text-xs font-medium" data-testid={`text-mode-${bot.id}`}>
              Cracked Only
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {bot.status === "offline" ? (
            <Button
              onClick={() => onStart(bot.id)}
              disabled={isLoading}
              className="flex-1"
              size="sm"
              data-testid={`button-start-${bot.id}`}
            >
              <Play className="w-4 h-4 mr-2" />
              {isStarting ? "Starting..." : "Start"}
            </Button>
          ) : (
            <Button
              onClick={() => onStop(bot.id)}
              disabled={isLoading}
              variant="secondary"
              className="flex-1"
              size="sm"
              data-testid={`button-stop-${bot.id}`}
            >
              <Square className="w-4 h-4 mr-2" />
              {isStopping ? "Stopping..." : "Stop"}
            </Button>
          )}
          <Button
            onClick={() => onDelete(bot.id)}
            disabled={isLoading}
            variant="destructive"
            size="icon"
            className="shrink-0"
            data-testid={`button-delete-${bot.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
