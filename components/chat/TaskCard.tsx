"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface Task {
  id: string;
  action: string;
  params?: Record<string, unknown>;
  status: "running" | "completed" | "error";
  result?: unknown;
}

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const getStatusIcon = () => {
    switch (task.status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "running":
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case "completed":
        return "bg-green-50 border-green-200 text-green-800";
      case "running":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`p-3 rounded-lg border ${getStatusColor()}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="font-medium text-sm">{task.action}</span>
        </div>
        <span className="text-xs font-medium capitalize">{task.status}</span>
      </div>
      
      {task.params && Object.keys(task.params).length > 0 && (
        <div className="mt-1 text-xs opacity-75">
          {Object.entries(task.params).map(([key, value]) => (
            <span key={key} className="mr-2">
              {key}: {String(value)}
            </span>
          ))}
        </div>
      )}

      {task.result && task.status === "completed" && (
        <div className="mt-2 text-xs bg-white/50 rounded p-2">
          <strong>Result:</strong> {String(typeof task.result === 'string' ? task.result : JSON.stringify(task.result))}
        </div>
      )}
    </motion.div>
  );
}