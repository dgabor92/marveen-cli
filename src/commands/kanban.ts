import chalk from 'chalk';
import Table from 'cli-table3';
import { Command } from 'commander';
import { MarveenClient } from '../client/index.js';
import type { KanbanStatus } from '../types.js';

const client = new MarveenClient();

const statusColor = (s: KanbanStatus): string => {
  switch (s) {
    case 'planned':
      return chalk.gray(s);
    case 'in_progress':
      return chalk.blue(s);
    case 'waiting':
      return chalk.yellow(s);
    case 'done':
      return chalk.green(s);
  }
};

export const kanbanCommand = new Command('kanban').description('Manage kanban cards');

kanbanCommand
  .command('list')
  .description('List kanban cards')
  .option('--status <status>', 'filter by status (planned|in_progress|waiting|done)')
  .action(async (opts: { status?: KanbanStatus }) => {
    const cards = await client.listCards();
    const filtered = opts.status ? cards.filter((c) => c.status === opts.status) : cards;

    if (filtered.length === 0) {
      console.log(chalk.yellow('No cards found.'));
      return;
    }

    const table = new Table({
      head: [
        chalk.bold('ID'),
        chalk.bold('Title'),
        chalk.bold('Status'),
        chalk.bold('Priority'),
        chalk.bold('Assignee'),
      ],
    });

    for (const c of filtered) {
      table.push([c.id, c.title, statusColor(c.status), c.priority, c.assignee ?? '']);
    }

    console.log(table.toString());
  });

kanbanCommand
  .command('add')
  .description('Add a new kanban card')
  .argument('<title>', 'card title')
  .option('--assignee <assignee>', 'assign to agent')
  .action(async (title: string, opts: { assignee?: string }) => {
    const card = await client.createCard({
      title,
      ...(opts.assignee !== undefined && { assignee: opts.assignee }),
    });
    console.log(chalk.green(`✓ Card #${card.id} created: ${card.title}`));
  });

kanbanCommand
  .command('done')
  .description('Mark a card as done')
  .argument('<id>', 'card id')
  .action(async (id: string) => {
    const card = await client.updateCard(id, { status: 'done' });
    console.log(chalk.green(`✓ Card #${card.id} marked as done.`));
  });
