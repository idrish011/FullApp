# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## API Base URL Configuration

This project now supports configuring the API base URL via environment variables.

1. Create a `.env` file in the project root (if it doesn't exist).
2. Add the following line, replacing the URL with your backend endpoint:

VITE_API_BASE_URL=https://your-backend-domain.com/api

3. Restart the dev server or rebuild the project after changing this value.

If `VITE_API_BASE_URL` is not set, the app will default to `https://app-in84.onrender.com/api`.
