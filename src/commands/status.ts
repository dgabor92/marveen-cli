import chalk from 'chalk';
import Table from 'cli-table3';
import { Command } from 'commander';
import { MarveenClient } from '../client/index.js';

const client = new MarveenClient();

export const statusCommand = new Command('status')
  .description('Show running agents and open tickets')
  .action(async () => {
    const [agents, cards] = await Promise.all([client.listAgents(), client.listCards()]);

    console.log(chalk.bold('\nAgents:'));
    const agentTable = new Table({
      head: [chalk.bold('Name'), chalk.bold('Status')],
    });
    for (const a of agents) {
      // The API returns `runState` and `running` boolean; types.ts uses `status` — handle both
      const raw = a as typeof a & { running?: boolean; runState?: string };
      const isRunning = raw.running === true || raw.runState === 'running' || a.status === 'running';
      const label = raw.runState ?? a.status;
      const s = isRunning ? chalk.green(label) : chalk.gray(label);
      agentTable.push([a.name, s]);
    }
    console.log(agentTable.toString());

    const open = cards.filter((c) => c.status !== 'done');
    console.log(chalk.bold(`\nOpen tickets (${open.length}):`));

    if (open.length === 0) {
      console.log(chalk.gray('  No open tickets.'));
      return;
    }

    const ticketTable = new Table({
      head: [
        chalk.bold('ID'),
        chalk.bold('Title'),
        chalk.bold('Status'),
        chalk.bold('Priority'),
        chalk.bold('Assignee'),
      ],
    });
    for (const c of open) {
      ticketTable.push([c.id, c.title, c.status, c.priority, c.assignee ?? '']);
    }
    console.log(ticketTable.toString());
  });
