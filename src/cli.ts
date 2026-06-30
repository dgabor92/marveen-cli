#!/usr/bin/env node
import { Command } from 'commander';
import { agentCommand } from './commands/agent.js';
import { kanbanCommand } from './commands/kanban.js';
import { memoryCommand } from './commands/memory.js';
import { statusCommand } from './commands/status.js';

const program = new Command('marveen')
  .description('Marveen dashboard CLI')
  .version('0.1.0');

program.addCommand(kanbanCommand);
program.addCommand(memoryCommand);
program.addCommand(agentCommand);
program.addCommand(statusCommand);

program.parseAsync(process.argv).catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Error: ${msg}\n`);
  process.exit(1);
});
