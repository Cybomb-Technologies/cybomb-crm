import {
  Phone,
  Video,
  Mail,
  FileText,
  StickyNote,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const TYPE_CONFIG = {
  call: { icon: Phone, color: "bg-green-100 text-green-600", label: "Call" },
  meeting: {
    icon: Video,
    color: "bg-purple-100 text-purple-600",
    label: "Meeting",
  },
  email: { icon: Mail, color: "bg-blue-100 text-blue-600", label: "Email" },
  task: {
    icon: FileText,
    color: "bg-orange-100 text-orange-600",
    label: "Task",
  },
  note: {
    icon: StickyNote,
    color: "bg-yellow-100 text-yellow-600",
    label: "Note",
  },
};

export const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    color: "bg-amber-100 text-amber-700",
    label: "Pending",
  },
  completed: {
    icon: CheckCircle2,
    color: "bg-green-100 text-green-700",
    label: "Completed",
  },
  cancelled: {
    icon: XCircle,
    color: "bg-red-100 text-red-700",
    label: "Cancelled",
  },
};

export const ACTIVITY_TABS = [
  "all",
  "call",
  "meeting",
  "email",
  "task",
  "note",
];
