#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// CRITICAL: Never use console.log() in STDIO servers - it breaks JSON-RPC!
// Use console.error() for logging instead
const log = (...args: any[]) => {
  console.error('[ntfy-mcp]', ...args);
};

interface NotificationConfig {
  ntfyTopic: string;
  ntfyServer: string;
  priority: number;
}

// Get configuration from environment variables
const getConfig = (): NotificationConfig => {
  const ntfyTopic = process.env.NTFY_TOPIC;

  if (!ntfyTopic) {
    throw new Error('NTFY_TOPIC environment variable is required');
  }

  return {
    ntfyTopic,
    ntfyServer: process.env.NTFY_SERVER || 'https://ntfy.sh',
    priority: parseInt(process.env.NTFY_PRIORITY || '3', 10)
  };
};

// Send notification to ntfy.sh
async function sendNtfyNotification(
  config: NotificationConfig,
  message: string,
  title: string = 'Claude Needs Input',
  tags: string[] = ['warning', 'claude'],
  priority?: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${config.ntfyServer}/${config.ntfyTopic}`;

    const headers: Record<string, string> = {
      'Title': title,
      'Priority': (priority !== undefined ? priority : config.priority).toString(),
      'Tags': tags.join(','),
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: message
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `ntfy.sh error: ${response.status} - ${errorText}`
      };
    }

    log('Notification sent successfully');
    return { success: true };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log('Failed to send notification:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

// Create MCP server
const server = new McpServer({
  name: "ntfy-notification-server",
  version: "1.0.0",
});

// Tool: Send a basic notification
server.registerTool(
  "send_notification",
  {
    title: "Send Notification",
    description: "Send a notification via ntfy.sh to alert the user that input or action is needed",
    inputSchema: z.object({
      message: z.string().describe("The notification message to send"),
      title: z.string().optional().describe("Optional notification title"),
      priority: z.number().min(1).max(5).optional().describe("Priority level (1=low, 5=urgent)"),
      tags: z.array(z.string()).optional().describe("Optional tags for the notification (e.g., ['warning', 'claude'])")
    })
  },
  async ({ message, title, priority, tags }) => {
    const config = getConfig();

    const result = await sendNtfyNotification(
      config,
      message,
      title || 'Claude Needs Input',
      tags || ['warning', 'claude'],
      priority
    );

    return {
      content: [
        {
          type: "text",
          text: result.success
            ? `Notification sent successfully to topic: ${config.ntfyTopic}`
            : `Failed to send notification: ${result.error}`
        }
      ]
    };
  }
);

// Tool: Send notification with confirmation request
server.registerTool(
  "request_user_confirmation",
  {
    title: "Request User Confirmation",
    description: "Send a notification requesting user confirmation for an action. Note: This only sends the notification; actual confirmation handling must be done separately.",
    inputSchema: z.object({
      action: z.string().describe("Description of the action that needs confirmation"),
      details: z.string().optional().describe("Additional details about the action"),
      urgency: z.enum(['low', 'normal', 'high']).optional().describe("Urgency level")
    })
  },
  async ({ action, details, urgency }) => {
    const config = getConfig();

    const priorityMap = { low: 2, normal: 3, high: 4 };
    const priority = urgency ? priorityMap[urgency] : 3;

    const message = details
      ? `${action}\n\nDetails: ${details}\n\nPlease review and respond in Claude.`
      : `${action}\n\nPlease review and respond in Claude.`;

    const result = await sendNtfyNotification(
      config,
      message,
      'Action Required in Claude',
      ['loudspeaker', 'claude', 'question'],
      priority
    );

    return {
      content: [
        {
          type: "text",
          text: result.success
            ? `Confirmation request sent. User has been notified to check Claude.`
            : `Failed to send confirmation request: ${result.error}`
        }
      ]
    };
  }
);

// Start the server
async function main() {
  try {
    const config = getConfig();
    log(`Starting ntfy MCP server for topic: ${config.ntfyTopic}`);

    const transport = new StdioServerTransport();
    await server.connect(transport);

    log('Server started successfully');
  } catch (error) {
    log('Failed to start server:', error);
    process.exit(1);
  }
}

main();
