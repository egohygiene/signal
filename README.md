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
