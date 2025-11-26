import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { BotCard } from "@/components/bot-card";
import { AddBotDialog } from "@/components/add-bot-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, AlertTriangle, LogOut } from "lucide-react";
import type { Bot } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [addBotOpen, setAddBotOpen] = useState(false);
  const [actioningBots, setActioningBots] = useState<Set<string>>(new Set());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data: bots = [], isLoading } = useQuery<Bot[]>({
    queryKey: ["/api/bots"],
    refetchInterval: 3000,
  });

  const addBotMutation = useMutation({
    mutationFn: async (bot: { botName: string; host: string; port: number; version: string }) => {
      return apiRequest("POST", "/api/bots", bot);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      setAddBotOpen(false);
      toast({
        title: "Bot added",
        description: "Your bot has been added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add bot",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const startBotMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("PUT", `/api/bots/${id}/start`, {});
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      setActioningBots(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast({
        title: "Bot started",
        description: "Bot is now connecting to the server",
      });
    },
    onError: (error: any, id) => {
      setActioningBots(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast({
        title: "Failed to start bot",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const stopBotMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("PUT", `/api/bots/${id}/stop`, {});
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      setActioningBots(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast({
        title: "Bot stopped",
        description: "Bot has been disconnected",
      });
    },
    onError: (error: any, id) => {
      setActioningBots(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast({
        title: "Failed to stop bot",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteBotMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/bots/${id}`, {});
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      setActioningBots(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast({
        title: "Bot deleted",
        description: "Bot has been removed",
      });
    },
    onError: (error: any, id) => {
      setActioningBots(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast({
        title: "Failed to delete bot",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStartBot = (id: string) => {
    setActioningBots(prev => new Set(prev).add(id));
    startBotMutation.mutate(id);
  };

  const handleStopBot = (id: string) => {
    setActioningBots(prev => new Set(prev).add(id));
    stopBotMutation.mutate(id);
  };

  const handleDeleteBot = (id: string) => {
    setActioningBots(prev => new Set(prev).add(id));
    deleteBotMutation.mutate(id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLocation("/login");
  };

  const stats = {
    total: bots.length,
    online: bots.filter(b => b.status === "online").length,
    offline: bots.filter(b => b.status === "offline").length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Minecraft Bot Manager</h1>
          <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">My Bots</h2>
            <p className="text-muted-foreground">Manage and monitor your Minecraft bots</p>
          </div>
          <Button onClick={() => setAddBotOpen(true)} data-testid="button-add-bot">
            <Plus className="w-4 h-4 mr-2" />
            Add Bot
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Bots</p>
            <p className="text-3xl font-bold" data-testid="text-total-bots">{stats.total}</p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">Online</p>
            <p className="text-3xl font-bold text-status-online" data-testid="text-online-bots">{stats.online}</p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">Offline</p>
            <p className="text-3xl font-bold text-status-offline" data-testid="text-offline-bots">{stats.offline}</p>
          </div>
        </div>

        <div className="bg-status-away/10 border border-status-away/20 rounded-lg p-6 mb-8 flex gap-4">
          <AlertTriangle className="w-6 h-6 text-status-away shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Cracked Servers Only</h3>
            <p className="text-sm text-muted-foreground">
              This bot manager only works with cracked (offline-mode) Minecraft servers. Premium/online-mode servers are not supported.
            </p>
          </div>
        </div>

        {bots.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No bots yet</h3>
            <p className="text-muted-foreground mb-6">Get started by adding your first bot</p>
            <Button onClick={() => setAddBotOpen(true)} data-testid="button-add-first-bot">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Bot
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map((bot) => (
              <BotCard
                key={bot.id}
                bot={bot}
                onStart={handleStartBot}
                onStop={handleStopBot}
                onDelete={handleDeleteBot}
                isStarting={actioningBots.has(bot.id) && startBotMutation.isPending}
                isStopping={actioningBots.has(bot.id) && stopBotMutation.isPending}
                isDeleting={actioningBots.has(bot.id) && deleteBotMutation.isPending}
              />
            ))}
          </div>
        )}
      </main>

      <AddBotDialog
        open={addBotOpen}
        onOpenChange={setAddBotOpen}
        onSubmit={(bot) => addBotMutation.mutateAsync(bot)}
        isLoading={addBotMutation.isPending}
      />
    </div>
  );
}
