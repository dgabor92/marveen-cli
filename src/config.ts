import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

interface MarveenConfig {
  token: string;
  baseUrl?: string;
}

let _config: MarveenConfig | null = null;

export async function loadConfig(): Promise<MarveenConfig> {
  if (_config) return _config;

  const configPath = join(homedir(), '.marveen', 'config.json');

  let raw: string;
  try {
    raw = await readFile(configPath, 'utf-8');
  } catch {
    throw new Error(
      `Config not found at ${configPath}. Create ~/.marveen/config.json with {"token": "<your-token>"}.`,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Invalid JSON in ${configPath}.`);
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('token' in parsed) ||
    typeof (parsed as Record<string, unknown>)['token'] !== 'string'
  ) {
    throw new Error(`${configPath} must have a "token" string field.`);
  }

  _config = parsed as MarveenConfig;
  return _config;
}

export async function getToken(): Promise<string> {
  const config = await loadConfig();
  return config.token;
}

export async function getBaseUrl(): Promise<string> {
  const config = await loadConfig();
  // Use 127.0.0.1 — Node 18 resolves "localhost" to ::1 (IPv6) but the dashboard binds only IPv4
  return config.baseUrl ?? 'http://127.0.0.1:3420';
}
