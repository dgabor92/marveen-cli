import chalk from 'chalk';
import Table from 'cli-table3';
import { Command, Option } from 'commander';
import { MarveenClient } from '../client/index.js';
import type { MemoryCategory } from '../types.js';

const client = new MarveenClient();

export const memoryCommand = new Command('memory').description('Search agent memory');

memoryCommand
  .command('search')
  .description('Search memories by keyword')
  .argument('<query>', 'search query')
  .option('--agent <agent>', 'filter by agent name')
  .addOption(
    new Option('--category <category>', 'filter by category').choices([
      'hot',
      'warm',
      'cold',
      'shared',
    ]),
  )
  .action(async (query: string, opts: { agent?: string; category?: MemoryCategory }) => {
    const memories = await client.listMemories({
      q: query,
      ...(opts.agent !== undefined && { agent: opts.agent }),
      ...(opts.category !== undefined && { category: opts.category }),
    });

    if (memories.length === 0) {
      console.log(chalk.yellow('No memories found.'));
      return;
    }

    const table = new Table({
      head: [chalk.bold('ID'), chalk.bold('Agent'), chalk.bold('Category'), chalk.bold('Content')],
      colWidths: [6, 12, 10, 60],
      wordWrap: true,
    });

    for (const m of memories) {
      table.push([m.id, m.agent_id, m.category, m.content]);
    }

    console.log(table.toString());
  });
