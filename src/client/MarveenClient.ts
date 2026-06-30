import { getBaseUrl, getToken } from '../config.js';
import type {
  Agent,
  ApiError,
  CreateKanbanCardInput,
  CreateMemoryInput,
  CreateScheduleInput,
  KanbanCard,
  Memory,
  MemoryQueryParams,
  Schedule,
  UpdateKanbanCardInput,
} from '../types.js';

export class MarveenClient {
  private baseUrl: string | null = null;
  private token: string | null = null;

  private async init(): Promise<void> {
    if (this.baseUrl && this.token) return;
    [this.baseUrl, this.token] = await Promise.all([getBaseUrl(), getToken()]);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    await this.init();

    const url = `${this.baseUrl}${path}`;
    const init: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    };
    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }
    const res = await fetch(url, init);

    const data = (await res.json()) as T | ApiError;

    if (!res.ok) {
      const err = data as ApiError;
      throw new Error(
        `API error ${res.status}: ${err.message ?? err.error ?? 'Unknown error'}`,
      );
    }

    return data as T;
  }

  // Kanban

  async listCards(): Promise<KanbanCard[]> {
    return this.request<KanbanCard[]>('GET', '/api/kanban');
  }

  async getCard(id: number): Promise<KanbanCard> {
    return this.request<KanbanCard>('GET', `/api/kanban/${id}`);
  }

  async createCard(input: CreateKanbanCardInput): Promise<KanbanCard> {
    return this.request<KanbanCard>('POST', '/api/kanban', input);
  }

  async updateCard(id: number, input: UpdateKanbanCardInput): Promise<KanbanCard> {
    return this.request<KanbanCard>('PUT', `/api/kanban/${id}`, input);
  }

  // Memory

  async listMemories(params?: MemoryQueryParams): Promise<Memory[]> {
    const qs = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    return this.request<Memory[]>('GET', `/api/memories${qs}`);
  }

  async createMemory(input: CreateMemoryInput): Promise<Memory> {
    return this.request<Memory>('POST', '/api/memories', input);
  }

  // Agents

  async listAgents(): Promise<Agent[]> {
    return this.request<Agent[]>('GET', '/api/agents');
  }

  async startAgent(name: string): Promise<{ ok: boolean }> {
    return this.request<{ ok: boolean }>('POST', `/api/agents/${name}/start`);
  }

  async stopAgent(name: string): Promise<{ ok: boolean }> {
    return this.request<{ ok: boolean }>('POST', `/api/agents/${name}/stop`);
  }

  // Schedules

  async listSchedules(): Promise<Schedule[]> {
    return this.request<Schedule[]>('GET', '/api/schedules');
  }

  async createSchedule(input: CreateScheduleInput): Promise<Schedule> {
    return this.request<Schedule>('POST', '/api/schedules', input);
  }
}
