# Transparent Checklist App

A transparent desktop checklist application that stays always on top, positioned on the left side of your screen. Perfect for keeping track of tasks while working in other applications.

## Features

- **Always on top**: Stays visible even when using browsers or other applications
- **Transparent design**: 20-80% transparency with customizable opacity
- **Minimize to side**: Slides to the left edge when minimized
- **Customizable colors**: Change background and text colors to match your setup
- **Persistent storage**: Tasks and settings are saved locally
- **Clean interface**: Minimal, distraction-free design
- **Task management**: Add, complete, and delete tasks with ease

## Screenshots

*Screenshots will be added soon*

## Installation

### Option 1: Download Pre-built Binary (Coming Soon)

Download the latest release from the [Releases](https://github.com/ston1ee/transparent-checklist-app/releases) page.

### Option 2: Build from Source

1. **Prerequisites**:
   - Node.js (v16 or higher)
   - npm or yarn

2. **Clone the repository**:
   ```bash
   git clone https://github.com/ston1ee/transparent-checklist-app.git
   cd transparent-checklist-app
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run in development**:
   ```bash
   npm start
   ```

5. **Build executable**:
   ```bash
   npm run build
   ```
   
   This will create a `dist` folder with the executable file:
   - Windows: `dist/Transparent Checklist Setup.exe`
   - macOS: `dist/Transparent Checklist.dmg`
   - Linux: `dist/Transparent Checklist.AppImage`

## Usage

1. **Adding tasks**: Type in the input field and press Enter or click the + button
2. **Completing tasks**: Click the checkbox next to any task
3. **Deleting tasks**: Hover over a task and click the red × button
4. **Settings**: Click the gear icon to customize:
   - Transparency level (20-100%)
   - Background color
   - Text color
5. **Minimize**: Click the - button to slide the app to the left edge
6. **Close**: Click the × button to exit the application

## Customization

The app includes several customization options:

- **Transparency**: Adjust from 20% to 100% opacity
- **Colors**: Choose any background and text color combination
- **Position**: The app starts on the left side but can be dragged anywhere
- **Size**: The window is resizable to fit your needs

## Technical Details

- **Framework**: Electron.js
- **Frontend**: HTML, CSS, JavaScript
- **Storage**: localStorage for persistence
- **Build Tool**: electron-builder

## Development

### Project Structure
```
transparent-checklist-app/
├── main.js          # Electron main process
├── index.html       # UI structure
├── styles.css       # Styling and transparency
├── script.js        # App logic and interactions
├── package.json     # Dependencies and build config
└── README.md        # This file
```

### Key Features Implementation

- **Always on top**: `alwaysOnTop: true` in BrowserWindow options
- **Transparency**: `transparent: true` + CSS rgba backgrounds
- **Minimize to side**: Custom logic that changes window bounds
- **Frameless window**: `frame: false` for custom title bar

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - see LICENSE file for details.

## Author

ston1ee - [GitHub Profile](https://github.com/ston1ee)

---

**Note**: This app is designed to be lightweight and non-intrusive. It uses minimal system resources and can be easily closed or minimized when not needed.