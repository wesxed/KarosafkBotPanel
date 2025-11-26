import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface BotStatusBadgeProps {
  status: "online" | "offline" | "connecting";
}

export function BotStatusBadge({ status }: BotStatusBadgeProps) {
  const variants = {
    online: {
      icon: CheckCircle2,
      label: "Online",
      className: "bg-status-online/10 text-status-online border-status-online/20",
    },
    offline: {
      icon: XCircle,
      label: "Offline",
      className: "bg-status-offline/10 text-status-offline border-status-offline/20",
    },
    connecting: {
      icon: Loader2,
      label: "Connecting",
      className: "bg-status-away/10 text-status-away border-status-away/20",
    },
  };

  const { icon: Icon, label, className } = variants[status];

  return (
    <Badge variant="outline" className={className} data-testid={`badge-status-${status}`}>
      <Icon className={`w-3 h-3 mr-1 ${status === "connecting" ? "animate-spin" : ""}`} />
      {label}
    </Badge>
  );
}
