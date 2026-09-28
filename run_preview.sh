#!/usr/bin/env bash
PORT=${1:-8080}
echo "[*] Launching Parth Solanki Cyber Security Portfolio on http://localhost:${PORT}"
echo "[*] Press Ctrl+C to terminate."
cd "$(dirname "$0")"
python3 -m http.server "$PORT"
