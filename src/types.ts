// Kanban

export type KanbanStatus = 'planned' | 'in_progress' | 'waiting' | 'done';
export type KanbanPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface KanbanCard {
  id: number;
  title: string;
  description?: string;
  status: KanbanStatus;
  priority: KanbanPriority;
  assignee?: string;
  created_at: string;
  updated_at: string;
}

export interface KanbanComment {
  id: number;
  card_id: number;
  author: string;
  content: string;
  created_at: string;
}

export interface CreateKanbanCardInput {
  title: string;
  description?: string;
  status?: KanbanStatus;
  priority?: KanbanPriority;
  assignee?: string;
}

export interface UpdateKanbanCardInput {
  title?: string;
  description?: string;
  status?: KanbanStatus;
  priority?: KanbanPriority;
  assignee?: string;
}

// Memory

export type MemoryCategory = 'hot' | 'warm' | 'cold' | 'shared';

export interface Memory {
  id: number;
  agent_id: string;
  content: string;
  category: MemoryCategory;
  keywords?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMemoryInput {
  agent_id: string;
  content: string;
  category: MemoryCategory;
  keywords?: string;
}

export interface MemoryQueryParams {
  agent?: string;
  q?: string;
  category?: MemoryCategory;
}

// Agents

export type AgentStatus = 'running' | 'stopped' | 'unknown';

export interface Agent {
  name: string;
  status: AgentStatus;
  tmux_session?: string;
  last_seen?: string;
}

// Schedules

export type ScheduleType = 'task' | 'heartbeat';

export interface Schedule {
  id: number;
  name: string;
  description?: string;
  prompt: string;
  schedule: string;
  agent: string;
  type: ScheduleType;
  enabled: boolean;
  last_run?: string;
  next_run?: string;
  created_at: string;
}

export interface CreateScheduleInput {
  name: string;
  description?: string;
  prompt: string;
  schedule: string;
  agent: string;
  type: ScheduleType;
}

// Generic API response

export interface ApiError {
  error: string;
  message?: string;
}
