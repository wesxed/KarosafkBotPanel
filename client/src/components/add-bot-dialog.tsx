import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddBotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (bot: { botName: string; host: string; port: number; version: string }) => Promise<void>;
  isLoading?: boolean;
}

const MINECRAFT_VERSIONS = [
  "1.8.9",
  "1.12.2",
  "1.16.5",
  "1.17.1",
  "1.18.2",
  "1.19.2",
  "1.19.4",
  "1.20.1",
  "1.20.4",
];

export function AddBotDialog({ open, onOpenChange, onSubmit, isLoading }: AddBotDialogProps) {
  const [botName, setBotName] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("25565");
  const [version, setVersion] = useState("1.20.1");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      botName,
      host,
      port: parseInt(port),
      version,
    });
    setBotName("");
    setHost("");
    setPort("25565");
    setVersion("1.20.1");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Bot</DialogTitle>
          <DialogDescription>
            Configure your Minecraft bot settings. Bots only work on cracked servers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="botName">Bot Name</Label>
            <Input
              id="botName"
              placeholder="MyBot123"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              required
              data-testid="input-bot-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="host">Server Host</Label>
            <Input
              id="host"
              placeholder="play.example.com"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              required
              className="font-mono"
              data-testid="input-host"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              type="number"
              placeholder="25565"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              required
              min="1"
              max="65535"
              className="font-mono"
              data-testid="input-port"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="version">Minecraft Version</Label>
            <Select value={version} onValueChange={setVersion}>
              <SelectTrigger id="version" data-testid="select-version">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MINECRAFT_VERSIONS.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="bg-muted p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Cracked Only Mode:</span> This bot automatically connects in offline mode and only works on cracked (non-premium) Minecraft servers.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} data-testid="button-add-bot">
              {isLoading ? "Adding..." : "Add Bot"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
