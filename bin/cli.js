#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { startMCPServer } from '../src/server/mcp-server.js';
import { DatabaseManager } from '../src/core/database-manager.js';

program
  .name('universal-db-mcp')
  .description('Universal Database MCP Server and CLI Tool')
  .version('1.0.0');

// MCP Server commands
program
  .command('server')
  .description('Start the MCP server')
  .option('-p, --port <port>', 'port to run the server on', '3000')
  .action(async (options) => {
    console.log(chalk.blue('🚀 Starting Universal Database MCP Server...'));
    await startMCPServer(parseInt(options.port));
  });

// Database connection commands
program
  .command('connect')
  .description('Test database connection')
  .requiredOption('-t, --type <type>', 'database type (postgres, mysql, mongodb, redis)')
  .requiredOption('-c, --connection <connection>', 'connection string')
  .action(async (options) => {
    console.log(chalk.yellow(`🔌 Testing connection to ${options.type}...`));
    try {
      const dbManager = new DatabaseManager();
      const result = await dbManager.testConnection(options.type, options.connection);
      console.log(chalk.green('✅ Connection successful!'), result);
    } catch (error) {
      console.error(chalk.red('❌ Connection failed:'), error.message);
      process.exit(1);
    }
  });

// Query execution commands
program
  .command('query')
  .description('Execute a query')
  .requiredOption('-t, --type <type>', 'database type')
  .requiredOption('-c, --connection <connection>', 'connection string')
  .requiredOption('-q, --query <query>', 'query to execute')
  .action(async (options) => {
    console.log(chalk.yellow('🔍 Executing query...'));
    try {
      const dbManager = new DatabaseManager();
      const result = await dbManager.executeQuery(options.type, options.connection, options.query);
      console.log(chalk.green('✅ Query executed successfully:'));
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(chalk.red('❌ Query failed:'), error.message);
      process.exit(1);
    }
  });

// Health check command
program
  .command('health')
  .description('Check server health')
  .action(() => {
    console.log(chalk.green('✅ Universal Database MCP Server is healthy'));
  });

program.parse();
