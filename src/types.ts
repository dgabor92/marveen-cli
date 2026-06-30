// Kanban

export type KanbanStatus = 'planned' | 'in_progress' | 'waiting' | 'done';
export type KanbanPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface KanbanCard {
  id: string;
  seq: number;
  title: string;
  description?: string;
  status: KanbanStatus;
  priority: KanbanPriority;
  assignee?: string;
  project?: string;
  due_date?: string | null;
  labels: string[];
  created_at: number;
  updated_at: number;
}

export interface KanbanComment {
  id: number;
  card_id: string;
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

export type AgentRunState = 'running' | 'stopped';
export type AgentConfigStatus = 'configured';

export interface Agent {
  name: string;
  displayName: string;
  description: string;
  model: string;
  running: boolean;
  runState: AgentRunState;
  status: AgentConfigStatus;
  runningSince?: number | null;
  session?: string;
  contextTokens?: number | null;
  hasTelegram: boolean;
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
