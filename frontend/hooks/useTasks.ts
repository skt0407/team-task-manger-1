"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Priority, Task, TaskStatus } from "@/types/task";

export function useTasks(filters?: { projectId?: string; status?: TaskStatus; priority?: Priority }) {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: async () => {
      const res = await api.get<{ tasks: Task[] }>("/tasks", { params: filters });
      return res.data.tasks;
    }
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      title: string;
      description?: string;
      dueDate?: string;
      priority: Priority;
      status: TaskStatus;
      projectId: string;
      assignedToId?: string | null;
    }) => {
      const res = await api.post<{ task: Task }>("/tasks", input);
      return res.data.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Task created");
    }
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: TaskStatus }) => {
      const res = await api.patch<{ task: Task }>(`/tasks/${taskId}/status`, { status });
      return res.data.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Task status updated");
    }
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      await api.delete(`/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Task deleted");
    }
  });
}
