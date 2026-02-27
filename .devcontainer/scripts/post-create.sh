#!/usr/bin/env bash
# Post-create setup script for the Signal dev container.
# Installs: pnpm, act, task, uv, Python dependencies, and Node dependencies.
set -euo pipefail

echo "==> Enabling pnpm via corepack..."
corepack enable pnpm

echo "==> Installing act (GitHub Actions local runner)..."
curl --proto '=https' --tlsv1.2 -sSf \
  https://raw.githubusercontent.com/nektos/act/master/install.sh \
  | sudo bash -s -- -b /usr/local/bin

echo "==> Installing task (Taskfile runner)..."
sh -c "$(curl --proto '=https' --tlsv1.2 -sSf https://taskfile.dev/install.sh)" -- -d -b /usr/local/bin

echo "==> Installing uv (Python package manager)..."
curl -LsSf https://astral.sh/uv/install.sh | sh
# Make uv available in PATH for this session and future shells
export PATH="$HOME/.local/bin:$PATH"
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc

echo "==> Installing Node dependencies with pnpm..."
pnpm install

echo "==> Installing Python dependencies for the server..."
uv pip install --system -r server/requirements.txt

echo ""
echo "✅ Dev container setup complete."
echo "   Frontend : cd ui && pnpm dev     → http://localhost:5173"
echo "   Backend  : cd server && uvicorn main:app --reload --host 0.0.0.0 --port 8000"
