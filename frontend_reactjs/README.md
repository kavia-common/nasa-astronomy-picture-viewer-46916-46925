# RetroSpace APOD Viewer (React)

Environment:
- Create a `.env` file in this folder with:
  REACT_APP_BACKEND_URL=http://localhost:3001/api
  # IMPORTANT:
  # - REACT_APP_BACKEND_URL MUST include the /api suffix (e.g., https://your-host:3001/api).
  # - The client force-normalizes the base to include a single /api and strips trailing slashes.
  #   Final requests will always target: ${REACT_APP_BACKEND_URL.replace(/\/$/, "")}/apod
  #   with optional query ?apod_date=YYYY-MM-DD.
  # Ensure CORS is enabled on the backend for http://localhost:3000

API usage:
- Today: GET ${REACT_APP_BACKEND_URL}/apod (no query). The backend defaults to today's APOD.
- Archive: GET ${REACT_APP_BACKEND_URL}/apod?apod_date=YYYY-MM-DD (e.g., 2024-01-10).

Scripts:
- npm start — starts dev server
- npm test — runs Jest/RTL tests (non-watch)
- npm run build — production build
- npm run e2e:install — installs Playwright browsers
- npm run e2e — runs Playwright tests headless
- npm run e2e:headed — runs Playwright tests in headed mode

Docker:
- Build: docker build --build-arg REACT_APP_BACKEND_URL=http://localhost:3001/api -t retrospace-frontend .
- Run: docker run -p 3000:80 retrospace-frontend

Notes:
- The frontend calls:
  GET ${REACT_APP_BACKEND_URL}/apod
  GET ${REACT_APP_BACKEND_URL}/apod?apod_date=YYYY-MM-DD
- Theme: Retro CRT (green-on-black, scanlines, glow, pixel borders)

Below is the original template README for reference.

---

# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
