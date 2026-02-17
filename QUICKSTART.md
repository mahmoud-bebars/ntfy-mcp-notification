# Quick Start Guide

Get up and running with ntfy MCP notifications in 5 minutes!

## Step 1: Subscribe to a Topic (2 minutes)

### On Your Phone

1. Install ntfy app:
   - **iOS**: [App Store](https://apps.apple.com/app/ntfy/id1625396347)
   - **Android**: [Play Store](https://play.google.com/store/apps/details?id=io.heckel.ntfy)

2. Open the app and tap **"+"** (Subscribe)

3. Enter a unique topic name:
   ```
   claude-notif-a8f3c2d1
   ```
   *(Use your own random suffix!)*

4. Tap **"Subscribe"**

### Or on Desktop/Web

1. Visit [ntfy.sh](https://ntfy.sh)
2. Enter your topic name: `claude-notif-a8f3c2d1`
3. Click **"Subscribe"**

## Step 2: Test Your Topic (30 seconds)

Send a test notification:

```bash
curl -d "Hello from ntfy!" https://ntfy.sh/claude-notif-a8f3c2d1
```

You should receive: **"Hello from ntfy!"** on your device 📱

## Step 3: Configure Claude Code (2 minutes)

1. Open your Claude Code MCP configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. Add this configuration (replace with your topic name):

```json
{
  "mcpServers": {
    "ntfy-notification": {
      "command": "npx",
      "args": ["-y", "ntfy-mcp-notification"],
      "env": {
        "NTFY_TOPIC": "claude-notif-a8f3c2d1"
      }
    }
  }
}
```

3. **Save** and **restart Claude Code**

## Step 4: Test with Claude (1 minute)

Ask Claude in a new conversation:

> **You**: "Can you send me a test notification to verify the ntfy MCP server is working?"

You should receive a notification on your device! 🎉

## Usage Example

Try this:

> **You**: "Please analyze the files in this directory and send me a notification when you find any TODO comments that need attention."

Claude will:
1. Search through your files
2. Find TODO comments
3. **Send you a notification** 📱
4. You review the results when convenient

## Troubleshooting

### No notification received?

1. **Check topic name matches** in both ntfy subscription and Claude config
2. **Test manually**: `curl -d "Test" https://ntfy.sh/your-topic`
3. **Restart Claude Code** after config changes
4. **Check Node.js version**: Must be 18+ (`node --version`)

### Server won't start?

1. **Check config syntax**: Ensure JSON is valid
2. **View logs**: Check Claude Code's MCP server panel for errors
3. **Verify NTFY_TOPIC**: Must be set in `env` section

## Advanced: Custom Priority

Send urgent notifications with higher priority:

```json
{
  "env": {
    "NTFY_TOPIC": "claude-notif-a8f3c2d1",
    "NTFY_PRIORITY": "4"
  }
}
```

Priority levels:
- `1` - Low (no sound)
- `2` - Default (no sound)
- `3` - Default (sound)
- `4` - High (sound)
- `5` - Urgent (sound + vibration)

## Security Reminder

⚠️ **Use unique topic names!** Topics like `claude` or `myname` are easy to guess.

**Good**: `claude-notif-a8f3c2d1`, `my-notif-$(uuidgen)`
**Bad**: `claude`, `notifications`, `john-claude`

## Next Steps

- Read the [full README](README.md) for detailed documentation
- Learn about the two tools: `send_notification` and `request_user_confirmation`
- Explore advanced configuration options
- Star the project on GitHub if you find it useful!

---

**Questions?** Open an issue on [GitHub](https://github.com/mahmoud-bebars/ntfy-mcp-notification/issues)
