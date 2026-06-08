# Promptly

A desktop app that lets you interact with ChatGPT, Claude, Gemini, and Perplexity side-by-side in a beautiful 2x2 grid.

![Promptly](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows-blue)

## Features

- **4 AI assistants in one window** - ChatGPT, Claude, Gemini, Perplexity
- **Resizable panels** - Drag dividers to resize, expand any panel to fullscreen
- **Image drag & drop** - Drop images into the tray, then drag to any AI
- **System theme support** - Automatically matches your OS dark/light mode
- **Persistent sessions** - Stay logged in across restarts
- **Refresh buttons** - Quick reload for any stuck panel

## Installation

### macOS
Download the latest `.dmg` from [Releases](https://github.com/Narenkumar1234/promptly/releases), open it, and drag Promptly to Applications.

### Windows
Download the latest `.exe` from [Releases](https://github.com/Narenkumar1234/promptly/releases) and run the installer.

### Build from source
```bash
# Clone the repo
git clone https://github.com/Narenkumar1234/promptly.git
cd promptly

# Install dependencies
npm install

# Run in development
npm start

# Build distributable
npm run dist
```

## Usage

1. Launch Promptly
2. Sign in to each AI service (one-time)
3. Type your prompt and interact with all 4 AIs simultaneously
4. Drag images from your desktop into the image tray, then drag to any panel

## Keyboard Shortcuts

- `Escape` - Exit expanded panel view
- `🌙/☀️` button - Toggle dark/light theme

## License

MIT
