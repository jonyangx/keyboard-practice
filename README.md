# keyboard-practice

Keyboard practice game - a fun way to improve your typing skills.

## Quick Start

```bash
cd scripts
./start.sh
```

This will:
1. Start a local HTTP server on port 8080
2. Open the game in your default browser
3. Press any key to stop the server when done

## Manual Start

Open `index.html` directly in your browser, or serve with any HTTP server:

```bash
python3 -m http.server 8080
# Then open http://localhost:8080/index.html
```

## Scripts

| Script | Description |
|--------|-------------|
| `scripts/start.sh` | Start server and open game in browser |
| `scripts/stop.sh` | Stop the HTTP server |

## Controls

- Type the characters shown on screen
- Press `Escape` to pause/resume
- Press `Enter` to restart after game over