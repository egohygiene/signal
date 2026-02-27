# Signal

A modern monorepo application for financial data analysis and visualization.

## Project Structure

```
signal/
├── core/         # Core business logic and shared utilities
├── server/       # FastAPI backend
├── ui/           # React + Vite + TypeScript frontend
├── schema/       # Data schemas and type definitions
├── docs/         # Project documentation
├── config/       # Configuration files
└── scripts/      # Utility scripts
```

### Directory Purposes

- **core/**: Contains shared business logic, utilities, and domain models that can be used across the application
- **server/**: FastAPI backend providing REST API endpoints
- **ui/**: React frontend built with Vite and TypeScript for the user interface
- **schema/**: Centralized location for data schemas, API contracts, and type definitions
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

### Prerequisites

- Python 3.12+
- Node.js 24+
- npm or pnpm

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
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
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:5173

### Build Frontend

To build the frontend for production:

```bash
cd ui
npm run build
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
- **ui**: Presentation layer, communicates with server via REST API
- **schema**: Type definitions shared across modules

## License

See LICENSE file for details.

## Contributing

Contributions are welcome! Please ensure:
1. Code follows existing style conventions
2. Tests are included for new features
3. Documentation is updated as needed
