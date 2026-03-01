# Signal

A modern monorepo application for financial data analysis and visualization.

## Quick Start

The fastest path from a fresh clone to a running application.

### Prerequisites

| Tool | Version | Install |
| ---- | ------- | ------- |
| Node.js | 24+ | [nodejs.org](https://nodejs.org) |
| pnpm | 10+ | `npm install -g pnpm` or [pnpm.io](https://pnpm.io/installation) |
| Python | 3.12+ | [python.org](https://www.python.org/downloads/) |

> **Tip:** The included [Dev Container](#dev-container) provides all of the above pre-installed.

### 1. Install frontend dependencies

```bash
cd ui
pnpm install
```

### 2. Start the frontend

```bash
pnpm dev
```

The UI is available at **http://localhost:5173**.

> By default the app runs in **fake data mode** — no backend or Plaid account is required. See [Fake Data Mode](#fake-data-mode) for details.

### 3. Set up backend environment variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and fill in your Plaid credentials (or leave the defaults to run without Plaid — see [Fake Data Mode](#fake-data-mode)).

### 4. Install backend dependencies

```bash
# Using uv (recommended)
pip install uv
uv pip install -r requirements.txt

# Or using pip directly
pip install -r requirements.txt
```

### 5. Start the backend

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API is available at **http://localhost:8000** · Docs at **http://localhost:8000/docs**.

---

## Fake Data Mode

The frontend ships with a built-in fake data provider that generates realistic
but synthetic financial data (transactions, categories, pools, budgets). This
mode is **active by default** — you can browse the full UI without a backend or
Plaid account.

The fake data is generated deterministically using a fixed seed, so the data
looks the same on every run.

To connect real data, configure Plaid credentials in `server/.env` and point
the frontend at the running backend. See [Plaid Sandbox Setup](#plaid-sandbox-setup)
for credential setup.

---

## Plaid Sandbox Setup

For a full walkthrough of creating a Plaid developer account, generating API
keys, and testing the sandbox connection, see
[docs/plaid-setup.md](docs/plaid-setup.md).

**Required environment variables** (add to `server/.env`):

```dotenv
PLAID_CLIENT_ID=your_client_id_here
PLAID_SECRET=your_sandbox_secret_here
PLAID_ENV=sandbox
```

Sandbox credentials are free and do not require production access. See
[docs/plaid-setup.md](docs/plaid-setup.md) for cost and tier details.

---

## Project Structure

```
signal/
├── core/         # Core business logic and shared utilities
├── server/       # FastAPI backend
├── ui/           # React + Vite + TypeScript frontend
├── docs/         # Project documentation
├── config/       # Configuration files
└── scripts/      # Utility scripts
```

### Directory Purposes

- **core/**: Contains shared business logic, utilities, and domain models that can be used across the application
- **server/**: FastAPI backend providing REST API endpoints
- **ui/**: React frontend built with Vite and TypeScript for the user interface
  - Schema types are versioned under `ui/src/schema/v1/`
- **docs/**: Project documentation and guides
- **config/**: Configuration files for various tools and environments
- **scripts/**: Utility scripts for development, deployment, and maintenance

## Task Runner

This project uses [Task](https://taskfile.dev) as its task runner. Tasks are defined in `Taskfile.yml` and the `tasks/` directory.

### Install Task

```bash
# macOS
brew install go-task

# Windows
choco install go-task

# Linux / manual
curl --location https://taskfile.dev/install.sh | sh
```

### Common Tasks

```bash
task --list              # List all available tasks
task misc:hello          # Print a hello message
task misc:version-check  # Verify Task is installed and in PATH
task lint:placeholder-lint  # Run the placeholder lint task
task ci:run              # Run the generate_repository_tree workflow locally via act
```

---

## Local GitHub Actions with act

[act](https://github.com/nektos/act) lets you run GitHub Actions workflows locally.

### Install act

```bash
# macOS
brew install act

# Windows
choco install act

# Linux / manual
curl --location https://raw.githubusercontent.com/nektos/act/master/install.sh | bash
```

### Run a workflow locally

```bash
task ci:run
```

This runs the `generate_repository_tree` workflow using `workflow_dispatch` locally. Verify `act` is installed and in PATH before running:

```bash
act --version
```

---

## Dev Container

The fastest way to get a fully configured development environment is to use the
included [Dev Container](https://containers.dev) configuration.

### VS Code Dev Containers

1. Install the
   [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
   extension.
2. Open the repository in VS Code.
3. When prompted, click **Reopen in Container** (or run the command
   **Dev Containers: Reopen in Container**).

VS Code will build the image, install all tools, and run `pnpm install`
automatically. Ports **5173** (Vite) and **8000** (FastAPI) are forwarded to
your host.

### GitHub Codespaces

Click the **Code → Codespaces → Create codespace** button on the repository
page. The environment is configured identically to the local Dev Container.

### What's included

| Tool | Version |
| ---- | ------- |
| Node.js | 24 (LTS) |
| pnpm | latest (via corepack) |
| Python | 3.12 |
| uv | latest |
| act | latest |
| task | latest |
| git, curl | pre-installed |

---

## Getting Started

See the [Quick Start](#quick-start) section at the top for the fastest path to a running application.

### Prerequisites

- Python 3.12+
- Node.js 24+
- pnpm 10+ (`npm install -g pnpm`)

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Copy and configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env to set PLAID_CLIENT_ID and PLAID_SECRET if using Plaid
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at:
- API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### Frontend Setup

1. Navigate to the ui directory:
   ```bash
   cd ui
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

The application will be available at http://localhost:5173

### Build Frontend

To build the frontend for production:

```bash
cd ui
pnpm build
```

The built files will be in the `ui/dist` directory.

## Development

### Backend Development

The backend uses:
- **FastAPI**: Modern, fast web framework for building APIs
- **Uvicorn**: Lightning-fast ASGI server
- **Pydantic**: Data validation using Python type annotations

### Frontend Development

The frontend uses:
- **React**: UI component library
- **Vite**: Next-generation frontend build tool
- **TypeScript**: Type-safe JavaScript
- **ESLint**: Code linting

## Module Boundaries

This project maintains clean separation between modules:

- **core**: Pure business logic, no dependencies on server or ui
- **server**: API layer, depends on core for business logic
- **ui**: Presentation layer, communicates with server via REST API; schema types versioned under `ui/src/schema/v1/`

## License

See LICENSE file for details.

## Contributing

Contributions are welcome! Please ensure:
1. Code follows existing style conventions
2. Tests are included for new features
3. Documentation is updated as needed
