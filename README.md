# ntfy MCP Notification Server

[![npm version](https://badge.fury.io/js/ntfy-mcp-notification.svg)](https://www.npmjs.com/package/ntfy-mcp-notification)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

An MCP (Model Context Protocol) server that sends push notifications via [ntfy.sh](https://ntfy.sh) when Claude needs user input or confirmation during long-running tasks.

## Overview

When Claude Code runs lengthy operations or encounters decisions requiring your input, you may not be actively watching. This MCP server sends push notifications to your phone, tablet, or desktop via ntfy.sh, allowing you to respond promptly.

## Features

- 🔔 **Push Notifications**: Send notifications to any device via ntfy.sh
- 🎯 **Two Tools**:
  - `send_notification`: Send basic notifications
  - `request_user_confirmation`: Send confirmation requests with urgency levels
- 🔧 **Configurable**: Priority levels, custom tags, and server URLs
- 🆓 **Free & Open**: Uses ntfy.sh (no account required)
- 🔒 **Privacy-Focused**: No data collection, notifications only contain what you specify

## Prerequisites

- **Node.js 18+** (for native `fetch` API support)
- **ntfy.sh topic** (create one for free at [ntfy.sh](https://ntfy.sh))

## Installation

### Via npx (Recommended)

No installation needed! Use directly with Claude Code:

```json
{
  "mcpServers": {
    "ntfy-notification": {
      "command": "npx",
      "args": ["-y", "ntfy-mcp-notification"],
      "env": {
        "NTFY_TOPIC": "your-unique-topic-name"
      }
    }
  }
}
```

### Via npm (Global Install)

```bash
npm install -g ntfy-mcp-notification
```

## Configuration

Add to your Claude Code MCP configuration file:

**Location:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

**Configuration:**

```json
{
  "mcpServers": {
    "ntfy-notification": {
      "command": "npx",
      "args": ["-y", "ntfy-mcp-notification"],
      "env": {
        "NTFY_TOPIC": "claude-notif-a8f3c2d1",
        "NTFY_SERVER": "https://ntfy.sh",
        "NTFY_PRIORITY": "3"
      }
    }
  }
}
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NTFY_TOPIC` | ✅ Yes | - | Your unique ntfy.sh topic name |
| `NTFY_SERVER` | No | `https://ntfy.sh` | ntfy.sh server URL (for self-hosted) |
| `NTFY_PRIORITY` | No | `3` | Default priority (1=low, 5=urgent) |

## Setting Up ntfy.sh

### 1. Choose a Topic Name

Pick a unique, hard-to-guess topic name:

```bash
# Good examples:
claude-notif-a8f3c2d1
my-claude-$(uuidgen | head -c 8)

# Bad examples (too easy to guess):
claude
notifications
myname-claude
```

**⚠️ Security Note**: Topic names are public by default. Anyone who knows your topic can subscribe or send messages. Use a unique, random topic name.

### 2. Subscribe to Your Topic

**On Mobile:**
1. Install ntfy app ([iOS](https://apps.apple.com/app/ntfy/id1625396347) / [Android](https://play.google.com/store/apps/details?id=io.heckel.ntfy))
2. Tap "+" to add subscription
3. Enter your topic name (e.g., `claude-notif-a8f3c2d1`)
4. Save

**On Web:**
1. Visit [ntfy.sh](https://ntfy.sh)
2. Enter your topic name in the input field
3. Click "Subscribe"
4. Bookmark the page for future access

**On Desktop:**
- [Progressive Web App](https://ntfy.sh) (Chrome, Edge, Safari)
- [Electron App](https://github.com/binwiederhier/ntfy-desktop/releases)

### 3. Test Your Setup

Send a test notification:

```bash
curl -d "Test from ntfy.sh" ntfy.sh/your-topic-name
```

You should receive the notification on all subscribed devices.

## Usage

Once configured in Claude Code, the tools are available automatically. Claude can call them as needed.

### Tool: send_notification

Send a basic notification to alert the user.

**Parameters:**
- `message` (required): The notification message
- `title` (optional): Notification title (default: "Claude Needs Input")
- `priority` (optional): Priority level 1-5 (default: from config)
- `tags` (optional): Array of tags (default: `["warning", "claude"]`)

**Example:**
```json
{
  "message": "Found a potential security issue that needs your review",
  "title": "Security Review Required",
  "priority": 4,
  "tags": ["warning", "security", "claude"]
}
```

### Tool: request_user_confirmation

Send a notification requesting user confirmation for an action.

**Parameters:**
- `action` (required): Description of the action needing confirmation
- `details` (optional): Additional context or details
- `urgency` (optional): `"low"`, `"normal"`, or `"high"` (default: `"normal"`)

**Example:**
```json
{
  "action": "Delete 15 old log files from /tmp",
  "details": "Total size: 2.3 GB. Files older than 30 days.",
  "urgency": "normal"
}
```

## Example Workflow

**User:** "Please analyze this large codebase and let me know when you need my input on any decisions"

**Claude:**
1. Starts analysis of codebase
2. Encounters a decision point (e.g., API design choice)
3. Calls `request_user_confirmation`:
   ```json
   {
     "action": "Choose API authentication method",
     "details": "Options: JWT tokens or OAuth 2.0",
     "urgency": "normal"
   }
   ```
4. **You receive push notification on your phone** 📱
5. You open Claude and provide your decision
6. Claude continues with your chosen approach

## Troubleshooting

### "NTFY_TOPIC environment variable is required"

**Cause**: `NTFY_TOPIC` not set in MCP configuration.

**Solution**: Add `NTFY_TOPIC` to the `env` section of your Claude Code MCP config.

### Notifications Not Received

**Possible causes:**

1. **Topic name mismatch**: Ensure the topic in your MCP config matches your subscription
2. **ntfy.sh server down**: Check [ntfy.sh status](https://ntfy.sh)
3. **Network issues**: Test manually:
   ```bash
   curl -d "Test" https://ntfy.sh/your-topic-name
   ```

### "Failed to send: 404"

**Cause**: Invalid ntfy.sh server URL or topic contains invalid characters.

**Solution:**
- Verify `NTFY_SERVER` is correct (default: `https://ntfy.sh`)
- Check topic name contains only alphanumeric characters, dashes, and underscores

### Server Won't Start in Claude Code

**Possible causes:**

1. **Node.js version**: Ensure Node.js 18+ is installed:
   ```bash
   node --version
   ```
2. **MCP config syntax**: Validate JSON syntax in your config file
3. **Check logs**: Look for errors in Claude Code's MCP server panel

## Security & Privacy

### Topic Privacy

**⚠️ Important**: ntfy.sh topics are **public by default**. Anyone who knows your topic name can subscribe to your notifications or send to your topic.

**Best Practices:**
1. ✅ Use unique, hard-to-guess topic names
2. ✅ Avoid including personal information in topic names
3. ✅ Consider self-hosting ntfy.sh for sensitive environments

### What Gets Sent to ntfy.sh

**Sent:** Notification title, message, priority, tags, and timestamp.

**NOT Sent:** Claude conversation history, credentials, file contents, or any data not explicitly passed to the notification tools.

## Development

### Local Setup

```bash
git clone https://github.com/mahmoud-bebars/ntfy-mcp-notification.git
cd ntfy-mcp-notification
npm install
npm run build
```

### Testing with MCP Inspector

```bash
export NTFY_TOPIC="test-topic-12345"
npm run inspector
```

### Building

```bash
npm run build    # Compile TypeScript
npm run watch    # Watch mode for development
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Future Enhancements

- [ ] ntfy.sh authentication support (private topics)
- [ ] Notification history and logging
- [ ] Retry logic for failed notifications
- [ ] Rate limiting and deduplication
- [ ] Webhook server for clickable action buttons

## License

MIT License - see [LICENSE](LICENSE) file for details

## Links

- [ntfy.sh Documentation](https://docs.ntfy.sh/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Code](https://claude.ai/download)
- [GitHub Repository](https://github.com/mahmoud-bebars/ntfy-mcp-notification)
- [npm Package](https://www.npmjs.com/package/ntfy-mcp-notification)

## Acknowledgments

- [ntfy.sh](https://ntfy.sh) by Philipp C. Heckel
- [Anthropic](https://anthropic.com) for Claude and MCP SDK

---

**Made with ❤️ for the Claude Code community**
