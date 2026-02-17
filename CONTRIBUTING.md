# Contributing to ntfy MCP Notification

Thank you for your interest in contributing! 🎉

## Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📖 Improve documentation
- 🔧 Submit pull requests

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/ntfy-mcp-notification.git
   cd ntfy-mcp-notification
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Test your changes**
   ```bash
   # Set test environment variables
   export NTFY_TOPIC="test-topic-12345"

   # Run MCP Inspector
   npm run inspector
   ```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

3. **Test thoroughly**
   - Build succeeds: `npm run build`
   - MCP Inspector works
   - Real notifications send successfully

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a Pull Request on GitHub

## Code Style

- Use TypeScript strict mode
- Follow existing naming conventions
- Use `console.error()` for logging (never `console.log()` in STDIO servers!)
- Add JSDoc comments for public functions

## Testing Checklist

Before submitting a PR, ensure:

- ✅ `npm run build` completes without errors
- ✅ MCP Inspector shows both tools correctly
- ✅ Test notifications send successfully
- ✅ Error handling works (test with invalid inputs)
- ✅ Documentation is updated (README, comments)

## Feature Ideas

Looking for something to work on? Here are some ideas:

### High Priority
- [ ] Support for ntfy.sh authentication (username/password, access tokens)
- [ ] Retry logic for failed notifications
- [ ] Unit tests with Jest or Vitest

### Medium Priority
- [ ] Notification templates (predefined message formats)
- [ ] Rate limiting / deduplication
- [ ] Notification history logging

### Low Priority
- [ ] Custom notification icons/images
- [ ] Support for ntfy.sh attachments
- [ ] Multiple topic support

## Reporting Issues

When reporting bugs, please include:

- **Environment**: OS, Node.js version, npm version
- **Steps to reproduce**: Detailed steps to trigger the bug
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Error messages**: Full error text or screenshots
- **Configuration**: Your MCP config (sanitize topic names!)

## Questions?

- Open an [issue](https://github.com/mahmoud-bebars/ntfy-mcp-notification/issues)
- Check existing [discussions](https://github.com/mahmoud-bebars/ntfy-mcp-notification/discussions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making ntfy MCP notification better!** 🚀
