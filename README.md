# Datathon Project

This repository contains the backend and frontend code for the Datathon project. 

## Project Structure

- `frontend/`: Contains the React web application built with Vite and Tailwind CSS.
- `backend/`: Contains the Python backend built with Flask.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [Python](https://www.python.org/) (3.9 or newer)

---

### 1. Running the Frontend

The frontend uses standard Node package managers (`npm`, `pnpm`, or `yarn`).

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   # or `pnpm install` / `yarn install`
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or `pnpm dev` / `yarn dev`
   ```

The application will be available at `http://localhost:5173`.

---

### 2. Running the Backend

The backend provides the API for the application using Flask.

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. (Optional but highly recommended) Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies from `requirements.txt`:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask application:
   ```bash
   python app.py
   # or you can use: flask run
   ```

The backend server should now be running on `http://127.0.0.1:5000`.

## Contributing
- Make sure not to commit sensitive environment files (`.env`) or dependency directories (`node_modules/`, `venv/`). The configured `.gitignore` should handle this for you automatically.
