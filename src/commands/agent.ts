import chalk from 'chalk';
import { Command } from 'commander';
import { MarveenClient } from '../client/index.js';

const client = new MarveenClient();

export const agentCommand = new Command('agent').description('Manage fleet agents');

agentCommand
  .command('start')
  .description('Start an agent')
  .argument('<name>', 'agent name')
  .action(async (name: string) => {
    const result = await client.startAgent(name);
    if (result.ok) {
      console.log(chalk.green(`✓ Agent ${name} started.`));
    } else {
      console.error(chalk.red(`✗ Failed to start agent ${name}.`));
      process.exit(1);
    }
  });

agentCommand
  .command('stop')
  .description('Stop an agent')
  .argument('<name>', 'agent name')
  .action(async (name: string) => {
    const result = await client.stopAgent(name);
    if (result.ok) {
      console.log(chalk.green(`✓ Agent ${name} stopped.`));
    } else {
      console.error(chalk.red(`✗ Failed to stop agent ${name}.`));
      process.exit(1);
    }
  });
